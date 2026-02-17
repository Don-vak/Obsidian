import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createServerSupabaseClient()
        const { id } = await params
        const body = await request.json()
        const { action, amount } = body // action: 'release' | 'capture', amount?: number (for partial capture)

        // Get booking with deposit info
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('id, deposit_intent_id, deposit_amount, deposit_status, guest_name')
            .eq('id', id)
            .single()

        if (bookingError || !booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            )
        }

        if (!booking.deposit_intent_id) {
            return NextResponse.json(
                { error: 'No deposit hold exists for this booking' },
                { status: 400 }
            )
        }

        if (booking.deposit_status !== 'held') {
            return NextResponse.json(
                { error: `Cannot ${action} deposit — current status is "${booking.deposit_status}"` },
                { status: 400 }
            )
        }

        if (action === 'release') {
            // Cancel the PaymentIntent — releases the hold, guest is NOT charged
            await stripe.paymentIntents.cancel(booking.deposit_intent_id)

            await supabase
                .from('bookings')
                .update({
                    deposit_status: 'released',
                    deposit_updated_at: new Date().toISOString(),
                })
                .eq('id', id)

            return NextResponse.json({
                success: true,
                message: `Security deposit released for ${booking.guest_name}`,
                depositStatus: 'released',
            })

        } else if (action === 'capture') {
            // Capture the hold — guest IS charged
            const captureAmount = amount
                ? Math.min(amount, Number(booking.deposit_amount)) // Partial capture
                : Number(booking.deposit_amount) // Full capture

            await stripe.paymentIntents.capture(booking.deposit_intent_id, {
                amount_to_capture: Math.round(captureAmount * 100), // Convert to cents
            })

            await supabase
                .from('bookings')
                .update({
                    deposit_status: 'captured',
                    deposit_captured_amount: captureAmount,
                    deposit_updated_at: new Date().toISOString(),
                })
                .eq('id', id)

            return NextResponse.json({
                success: true,
                message: `$${captureAmount.toLocaleString()} captured from ${booking.guest_name}'s deposit`,
                depositStatus: 'captured',
                capturedAmount: captureAmount,
            })

        } else {
            return NextResponse.json(
                { error: 'Invalid action. Use "release" or "capture".' },
                { status: 400 }
            )
        }

    } catch (error: any) {
        console.error('Error managing deposit:', error)
        return NextResponse.json(
            { error: error?.message || 'Failed to manage deposit' },
            { status: 500 }
        )
    }
}

// GET: Fetch current deposit status
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createServerSupabaseClient()
        const { id } = await params

        const { data: booking, error } = await supabase
            .from('bookings')
            .select('deposit_intent_id, deposit_amount, deposit_status, deposit_captured_amount, deposit_updated_at')
            .eq('id', id)
            .single()

        if (error || !booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        return NextResponse.json(booking)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch deposit status' }, { status: 500 })
    }
}
