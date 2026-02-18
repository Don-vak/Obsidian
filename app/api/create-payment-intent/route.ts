import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import * as Sentry from '@sentry/nextjs'
import { CreatePaymentIntentSchema } from '@/lib/schemas/api'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = CreatePaymentIntentSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: result.error.flatten() },
                { status: 400 }
            )
        }

        const {
            checkIn,
            checkOut,
            guests,
            totalAmount,
            guestName,
            guestEmail,
            guestPhone,
            specialRequests,
            tripPurpose,
            arrivalTime,
            verificationSessionId
        } = result.data

        // Verify availability one more time before creating payment intent
        const supabase = await createServerSupabaseClient()

        const { data: blockedDates } = await supabase
            .from('blocked_dates')
            .select('*')
            .lt('start_date', checkOut)
            .gt('end_date', checkIn)

        if (blockedDates && blockedDates.length > 0) {
            return NextResponse.json(
                { error: 'Dates are no longer available. Please select different dates.' },
                { status: 400 }
            )
        }

        // Create a Stripe Customer so the PaymentMethod can be reused for the security deposit hold
        const customer = await stripe.customers.create({
            email: guestEmail,
            name: guestName,
            phone: guestPhone || undefined,
            metadata: {
                source: 'obsidian_booking',
                checkIn,
                checkOut,
            },
        })

        // Create Stripe PaymentIntent with 3D Secure enforcement
        // setup_future_usage: 'off_session' tells Stripe to save the PM for later reuse (deposit hold)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert to cents
            currency: 'usd',
            customer: customer.id, // Attach to customer for PM reuse
            setup_future_usage: 'off_session', // Save PM for security deposit hold
            automatic_payment_methods: {
                enabled: true,
            },
            payment_method_options: {
                card: {
                    request_three_d_secure: 'any',
                },
            },
            metadata: {
                checkIn,
                checkOut,
                guests: guests.toString(),
                guestName,
                guestEmail,
                guestPhone: guestPhone || '',
                specialRequests: specialRequests || '',
                tripPurpose: tripPurpose || '',
                arrivalTime: arrivalTime || '',
                verificationSessionId: verificationSessionId || '',
                identityVerified: verificationSessionId ? 'true' : 'false',
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        })
    } catch (error) {
        console.error('Error creating payment intent:', error)
        Sentry.captureException(error, { tags: { context: 'create_payment_intent' } })
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        )
    }
}
