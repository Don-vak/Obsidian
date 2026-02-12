import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
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
        } = body

        // Validate required fields
        if (!checkIn || !checkOut || !totalAmount || !guestEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

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

        // Create Stripe PaymentIntent with 3D Secure enforcement
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert to cents
            currency: 'usd',
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
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        )
    }
}
