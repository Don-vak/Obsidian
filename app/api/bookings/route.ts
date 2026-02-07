import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const supabase = await createServerSupabaseClient()

        // Calculate nights
        const checkInDate = new Date(body.checkIn)
        const checkOutDate = new Date(body.checkOut)
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

        if (nights < 1) {
            return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
        }

        // Check availability first
        const { data: blockedDates } = await supabase
            .from('blocked_dates')
            .select('*')
            .or(`and(start_date.lte.${body.checkOut},end_date.gte.${body.checkIn})`)

        if (blockedDates && blockedDates.length > 0) {
            return NextResponse.json({ error: 'Dates are not available' }, { status: 400 })
        }

        // Get current pricing config
        const { data: config, error: configError } = await supabase
            .from('pricing_config')
            .select('*')
            .lte('effective_from', new Date().toISOString().split('T')[0])
            .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
            .order('effective_from', { ascending: false })
            .limit(1)
            .single()

        if (configError || !config) {
            return NextResponse.json({ error: 'Pricing config not found' }, { status: 500 })
        }

        // Calculate pricing (server-side for security)
        const subtotal = Number(config.base_nightly_rate) * nights
        let discount = 0
        if (nights >= 28) {
            discount = subtotal * (Number(config.monthly_discount_percentage) / 100)
        } else if (nights >= 7) {
            discount = subtotal * (Number(config.weekly_discount_percentage) / 100)
        }

        const discountedSubtotal = subtotal - discount
        const serviceFee = discountedSubtotal * (Number(config.service_fee_percentage) / 100)
        const taxAmount = (discountedSubtotal + serviceFee + Number(config.cleaning_fee)) * (Number(config.tax_percentage) / 100)
        const total = discountedSubtotal + Number(config.cleaning_fee) + serviceFee + taxAmount

        // Create booking
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                check_in: body.checkIn,
                check_out: body.checkOut,
                nights,
                guest_count: body.guestCount,
                guest_name: body.guestName,
                guest_email: body.guestEmail,
                guest_phone: body.guestPhone,
                special_requests: body.specialRequests || null,
                nightly_rate: Number(config.base_nightly_rate),
                subtotal: Number(subtotal.toFixed(2)),
                discount: Number(discount.toFixed(2)),
                cleaning_fee: Number(config.cleaning_fee),
                service_fee: Number(serviceFee.toFixed(2)),
                tax_amount: Number(taxAmount.toFixed(2)),
                total: Number(total.toFixed(2)),
                agreed_to_house_rules: body.agreeToHouseRules,
                agreed_to_cancellation_policy: body.agreeToCancellationPolicy,
                status: 'pending',
                payment_status: 'pending'
            })
            .select()
            .single()

        if (bookingError) {
            console.error('Error creating booking:', bookingError)
            return NextResponse.json({ error: bookingError.message }, { status: 500 })
        }

        // Create blocked date entry
        const { error: blockedError } = await supabase
            .from('blocked_dates')
            .insert({
                start_date: body.checkIn,
                end_date: body.checkOut,
                reason: 'booked',
                booking_id: booking.id
            })

        if (blockedError) {
            console.error('Error creating blocked date:', blockedError)
            // Don't fail the booking, just log the error
        }

        // TODO: Create Stripe payment intent
        // TODO: Send confirmation email

        return NextResponse.json({
            success: true,
            booking,
            message: 'Booking created successfully'
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// GET /api/bookings/:id - Get booking by ID (will be implemented as dynamic route)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const id = searchParams.get('id')
        const bookingNumber = searchParams.get('bookingNumber')

        if (!id && !bookingNumber) {
            return NextResponse.json({ error: 'Missing id or bookingNumber parameter' }, { status: 400 })
        }

        const supabase = await createServerSupabaseClient()

        let query = supabase.from('bookings').select('*')

        if (id) {
            query = query.eq('id', id)
        } else if (bookingNumber) {
            query = query.eq('booking_number', bookingNumber)
        }

        const { data, error } = await query.single()

        if (error) {
            console.error('Error fetching booking:', error)
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
