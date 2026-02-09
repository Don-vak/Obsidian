import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

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

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const supabase = createServiceRoleClient()
    const metadata = paymentIntent.metadata

    // Check if booking already exists (idempotency)
    const { data: existingBooking } = await supabase
        .from('bookings')
        .select('id')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single()

    if (existingBooking) {
        console.log('Booking already exists for payment intent:', paymentIntent.id)
        return
    }

    // Generate booking number
    const bookingNumber = `OBS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

    // Create booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            booking_number: bookingNumber,
            check_in_date: metadata.checkIn,
            check_out_date: metadata.checkOut,
            number_of_guests: parseInt(metadata.guests),
            guest_name: metadata.guestName,
            guest_email: metadata.guestEmail,
            guest_phone: metadata.guestPhone || null,
            total_amount: paymentIntent.amount / 100, // Convert from cents
            stripe_payment_intent_id: paymentIntent.id,
            stripe_payment_status: 'paid',
            paid_at: new Date().toISOString(),
            status: 'confirmed',
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
