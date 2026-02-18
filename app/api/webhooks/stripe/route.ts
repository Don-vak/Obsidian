import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import * as Sentry from '@sentry/nextjs'

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature provided' },
            { status: 400 }
        )
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        Sentry.captureException(err, { tags: { context: 'stripe_webhook_signature' } })
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        )
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
                break

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
                break

            case 'charge.refunded':
                await handleRefund(event.data.object as Stripe.Charge)
                break

            case 'identity.verification_session.verified':
                await handleIdentityVerified(event.data.object)
                break

            case 'identity.verification_session.requires_input':
                console.log('Identity verification requires additional input:', (event.data.object as any).id)
                break

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Error processing webhook:', error)
        Sentry.captureException(error, {
            tags: { context: 'stripe_webhook_processing', event_type: event.type },
        })
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const supabase = createServiceRoleClient()
    const metadata = paymentIntent.metadata

    // Parallelize: Check if booking already exists AND Get pricing config
    const [existingBookingResult, configResult] = await Promise.all([
        supabase
            .from('bookings')
            .select('id')
            .eq('stripe_payment_intent_id', paymentIntent.id)
            .single(),
        supabase
            .from('pricing_config')
            .select('*')
            .lte('effective_from', new Date().toISOString().split('T')[0])
            .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
            .order('effective_from', { ascending: false })
            .limit(1)
            .single()
    ])

    const existingBooking = existingBookingResult.data
    const config = configResult.data

    if (existingBooking) {
        console.log('Booking already exists for payment intent:', paymentIntent.id)
        return
    }

    if (!config) {
        throw new Error('Pricing config not found')
    }

    // Calculate nights
    const checkInDate = new Date(metadata.checkIn)
    const checkOutDate = new Date(metadata.checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate pricing breakdown
    const nightly_rate = Number(config.base_nightly_rate)
    const subtotal = nightly_rate * nights
    let discount = 0
    if (nights >= 28) {
        discount = subtotal * (Number(config.monthly_discount_percentage) / 100)
    } else if (nights >= 7) {
        discount = subtotal * (Number(config.weekly_discount_percentage) / 100)
    }

    const discountedSubtotal = subtotal - discount
    const cleaning_fee = Number(config.cleaning_fee)
    const service_fee = discountedSubtotal * (Number(config.service_fee_percentage) / 100)
    const tax_amount = (discountedSubtotal + service_fee + cleaning_fee) * (Number(config.tax_percentage) / 100)
    const total = discountedSubtotal + cleaning_fee + service_fee + tax_amount

    // Create booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            check_in: metadata.checkIn,
            check_out: metadata.checkOut,
            nights,
            guest_count: parseInt(metadata.guests),
            guest_name: metadata.guestName,
            guest_email: metadata.guestEmail,
            guest_phone: metadata.guestPhone || '',
            special_requests: metadata.specialRequests || null,
            nightly_rate: Number(nightly_rate.toFixed(2)),
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            cleaning_fee: Number(cleaning_fee.toFixed(2)),
            service_fee: Number(service_fee.toFixed(2)),
            tax_amount: Number(tax_amount.toFixed(2)),
            total: Number(total.toFixed(2)),
            agreed_to_house_rules: true,
            agreed_to_cancellation_policy: true,
            stripe_payment_intent_id: paymentIntent.id,
            stripe_payment_status: 'paid',
            paid_at: new Date().toISOString(),
            status: 'confirmed',
            trip_purpose: metadata.tripPurpose || null,
            arrival_time: metadata.arrivalTime || null,
            identity_verified: metadata.identityVerified === 'true',
            verification_session_id: metadata.verificationSessionId || null,
            agreed_to_rental_agreement: true,
        })
        .select()
        .single()

    if (bookingError) {
        console.error('Error creating booking:', bookingError)
        throw bookingError
    }

    // Create blocked dates
    const { error: blockedDateError } = await supabase
        .from('blocked_dates')
        .insert({
            start_date: metadata.checkIn,
            end_date: metadata.checkOut,
            reason: 'booked',
            booking_id: booking.id,
        })

    if (blockedDateError) {
        console.error('Error creating blocked date:', blockedDateError)
        // Don't throw - booking is more important than blocked date
    }

    console.log('Booking created successfully:', booking.booking_number)

    // Reconcile any deposit hold that was created before the booking existed
    // (The deposit hold API may run before this webhook creates the booking row)
    try {
        const depositHolds = await stripe.paymentIntents.search({
            query: `metadata["type"]:"security_deposit" AND metadata["booking_payment_intent"]:"${paymentIntent.id}"`,
        })

        if (depositHolds.data.length > 0) {
            const depositIntent = depositHolds.data[0]
            const depositStatus = depositIntent.status === 'requires_capture' ? 'held'
                : depositIntent.status === 'canceled' ? 'released'
                    : depositIntent.status === 'succeeded' ? 'captured'
                        : 'failed'

            await supabase
                .from('bookings')
                .update({
                    deposit_intent_id: depositIntent.id,
                    deposit_amount: depositIntent.amount / 100,
                    deposit_status: depositStatus,
                    deposit_updated_at: new Date().toISOString(),
                })
                .eq('id', booking.id)

            console.log(`Deposit hold reconciled for booking ${booking.booking_number}: ${depositStatus}`)
        }
    } catch (depositError) {
        console.error('Error reconciling deposit hold:', depositError)
        // Don't throw - booking is more important
    }

    // Send email notifications (non-blocking, parallel)
    try {
        const { sendBookingConfirmation, sendAdminBookingNotification } = await import('@/lib/email/send')

        await Promise.allSettled([
            sendBookingConfirmation(booking),
            sendAdminBookingNotification(booking)
        ])
    } catch (emailError) {
        console.error('Error sending emails:', emailError)
        // Don't throw - booking succeeded, email is secondary
    }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    console.log('Payment failed for intent:', paymentIntent.id)

    const supabase = createServiceRoleClient()

    // Update booking status if it exists
    await supabase
        .from('bookings')
        .update({
            stripe_payment_status: 'failed',
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)
}

async function handleRefund(charge: Stripe.Charge) {
    console.log('Refund processed for charge:', charge.id)

    const supabase = createServiceRoleClient()

    // Update booking status
    await supabase
        .from('bookings')
        .update({
            stripe_payment_status: 'refunded',
            status: 'cancelled',
        })
        .eq('stripe_payment_intent_id', charge.payment_intent as string)
}

async function handleIdentityVerified(session: any) {
    console.log('Identity verification completed:', session.id)

    // Log verification details for admin review
    const verifiedOutputs = session.verified_outputs || {}
    console.log('Verified outputs:', {
        firstName: verifiedOutputs.first_name || 'N/A',
        lastName: verifiedOutputs.last_name || 'N/A',
        idType: verifiedOutputs.id_number_type || 'N/A',
    })
}
