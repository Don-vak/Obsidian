import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import * as Sentry from '@sentry/nextjs'
import { CreateDepositHoldSchema } from '@/lib/schemas/api'

const DEPOSIT_AMOUNT = 1000 // $1,000 security deposit
const MAX_RETRIES = 10
const RETRY_DELAY_MS = 2000 // 2 seconds between retries

// Helper to wait
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = CreateDepositHoldSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: result.error.flatten() },
                { status: 400 }
            )
        }

        const { paymentMethodId, paymentIntentId } = result.data

        const supabase = createServiceRoleClient()

        // Retrieve the original PaymentIntent to get the Customer ID
        const originalPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        const customerId = originalPaymentIntent.customer as string

        if (!customerId) {
            console.error('No customer found on original PaymentIntent')
            return NextResponse.json(
                { error: 'No customer associated with the original payment.' },
                { status: 400 }
            )
        }

        // Create the deposit hold PaymentIntent FIRST (before waiting for booking)
        const depositIntent = await stripe.paymentIntents.create({
            amount: DEPOSIT_AMOUNT * 100,
            currency: 'usd',
            customer: customerId,
            capture_method: 'manual',
            payment_method: paymentMethodId,
            confirm: true,
            off_session: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
            metadata: {
                type: 'security_deposit',
                booking_payment_intent: paymentIntentId,
            },
            description: `Security deposit hold - The Obsidian`,
        })

        console.log(`Deposit hold created: ${depositIntent.id} (status: ${depositIntent.status})`)

        const depositStatus = depositIntent.status === 'requires_capture' ? 'held' : 'failed'

        // Now poll for the booking to exist (webhook may not have created it yet)
        // The webhook creates the booking row asynchronously, so we retry
        let bookingUpdated = false
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            const { data: booking } = await supabase
                .from('bookings')
                .select('id, deposit_status')
                .eq('stripe_payment_intent_id', paymentIntentId)
                .single()

            if (booking) {
                // Don't overwrite if already set
                if (booking.deposit_status === 'held') {
                    console.log(`Deposit already recorded for booking ${booking.id}`)
                    bookingUpdated = true
                    break
                }

                const { error: updateError } = await supabase
                    .from('bookings')
                    .update({
                        deposit_intent_id: depositIntent.id,
                        deposit_amount: DEPOSIT_AMOUNT,
                        deposit_status: depositStatus,
                        deposit_updated_at: new Date().toISOString(),
                    })
                    .eq('id', booking.id)

                if (updateError) {
                    console.error(`Failed to update booking with deposit (attempt ${attempt}):`, updateError)
                } else {
                    console.log(`Deposit hold linked to booking ${booking.id} on attempt ${attempt}`)
                    bookingUpdated = true
                }
                break
            }

            console.log(`Booking not found yet, retry ${attempt}/${MAX_RETRIES}...`)
            await sleep(RETRY_DELAY_MS)
        }

        if (!bookingUpdated) {
            console.warn(`Could not link deposit ${depositIntent.id} to booking after ${MAX_RETRIES} retries. Deposit hold exists in Stripe but not in DB.`)
        }

        return NextResponse.json({
            success: true,
            depositIntentId: depositIntent.id,
            depositStatus,
            amount: DEPOSIT_AMOUNT,
        })

    } catch (error: any) {
        console.error('Error creating deposit hold:', error)
        Sentry.captureException(error, { tags: { context: 'create_deposit_hold' } })

        if (error?.type === 'StripeCardError') {
            return NextResponse.json({
                success: false,
                error: 'Unable to place security deposit hold on your card. Your booking is still confirmed.',
                depositStatus: 'failed',
            })
        }

        return NextResponse.json(
            { error: 'Failed to create deposit hold' },
            { status: 500 }
        )
    }
}
