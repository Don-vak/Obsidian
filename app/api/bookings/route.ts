import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resilientQuery, CACHE_TTL } from '@/lib/supabase/resilient'

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

        // Check availability first (with resilience)
        const { data: blockedDates } = await resilientQuery(
            `availability:${body.checkIn}:${body.checkOut}`,
            () => supabase
                .from('blocked_dates')
                .select('*')
                .lt('start_date', body.checkOut)
                .gt('end_date', body.checkIn),
            'check-booking-availability',
            { cacheTTL: CACHE_TTL.SHORT }
        )

        if (Array.isArray(blockedDates) && blockedDates.length > 0) {
            return NextResponse.json({ error: 'Dates are not available' }, { status: 400 })
        }

        // Get current pricing config (with resilience + longer cache)
        const { data: config, error: configError } = await resilientQuery(
            'pricing-config',
            () => supabase
                .from('pricing_config')
                .select('*')
                .lte('effective_from', new Date().toISOString().split('T')[0])
                .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
                .order('effective_from', { ascending: false })
                .limit(1)
                .single(),
            'fetch-booking-pricing',
            { cacheTTL: CACHE_TTL.LONG }
        )

        if (configError || !config) {
            return NextResponse.json(
                { error: 'Service temporarily unavailable. Please try again.', retryable: true },
                { status: 503 }
            )
        }

        // Calculate pricing (server-side for security)
        const cfg = config as Record<string, number>
        const subtotal = Number(cfg.base_nightly_rate) * nights
        let discount = 0
        if (nights >= 28) {
            discount = subtotal * (Number(cfg.monthly_discount_percentage) / 100)
        } else if (nights >= 7) {
            discount = subtotal * (Number(cfg.weekly_discount_percentage) / 100)
        }

        const discountedSubtotal = subtotal - discount
        const serviceFee = discountedSubtotal * (Number(cfg.service_fee_percentage) / 100)
        const taxAmount = (discountedSubtotal + serviceFee + Number(cfg.cleaning_fee)) * (Number(cfg.tax_percentage) / 100)
        const total = discountedSubtotal + Number(cfg.cleaning_fee) + serviceFee + taxAmount

        // Create booking (no caching for writes)
        const { data: booking, error: bookingError } = await resilientQuery(
            `booking:${Date.now()}`,
            () => supabase
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
                    nightly_rate: Number(cfg.base_nightly_rate),
                    subtotal: Number(subtotal.toFixed(2)),
                    discount: Number(discount.toFixed(2)),
                    cleaning_fee: Number(cfg.cleaning_fee),
                    service_fee: Number(serviceFee.toFixed(2)),
                    tax_amount: Number(taxAmount.toFixed(2)),
                    total: Number(total.toFixed(2)),
                    agreed_to_house_rules: body.agreeToHouseRules,
                    agreed_to_cancellation_policy: body.agreeToCancellationPolicy,
                    status: 'pending',
                    payment_status: 'pending'
                })
                .select()
                .single(),
            'create-booking',
            { cacheTTL: 0 }
        )

        if (bookingError) {
            console.error('Error creating booking:', bookingError)
            return NextResponse.json(
                { error: 'Service temporarily unavailable. Please try again.', retryable: true },
                { status: 503 }
            )
        }

        // Create blocked date entry
        const bookingData = booking as Record<string, string>
        const { error: blockedError } = await resilientQuery(
            `blocked:${Date.now()}`,
            () => supabase
                .from('blocked_dates')
                .insert({
                    start_date: body.checkIn,
                    end_date: body.checkOut,
                    reason: 'booked',
                    booking_id: bookingData.id
                }),
            'create-blocked-date',
            { cacheTTL: 0 }
        )

        if (blockedError) {
            console.error('Error creating blocked date:', blockedError)
            // Don't fail the booking, just log the error
        }

        return NextResponse.json({
            success: true,
            booking,
            message: 'Booking created successfully'
        })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}

// GET /api/bookings - Get booking by ID or booking number
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

        const cacheKey = `booking:${id || bookingNumber}`
        const { data, error } = await resilientQuery(
            cacheKey,
            () => query.single(),
            'fetch-booking',
            { cacheTTL: CACHE_TTL.SHORT }
        )

        if (error) {
            console.error('Error fetching booking:', error)
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching booking:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
