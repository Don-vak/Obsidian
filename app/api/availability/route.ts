import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resilientQuery, CACHE_TTL } from '@/lib/supabase/resilient'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const checkIn = searchParams.get('checkIn')
        const checkOut = searchParams.get('checkOut')

        if (!checkIn || !checkOut) {
            return NextResponse.json({ error: 'Missing checkIn or checkOut parameters' }, { status: 400 })
        }

        const supabase = await createServerSupabaseClient()

        // Check blocked_dates table
        const cacheKey = `availability:${checkIn}:${checkOut}`

        const { data: blockedDates, error } = await resilientQuery(
            `${cacheKey}:blocked`,
            () => supabase
                .from('blocked_dates')
                .select('*')
                .lt('start_date', checkOut)
                .gt('end_date', checkIn),
            'check-availability-blocked',
            { cacheTTL: CACHE_TTL.SHORT }
        )

        if (error) {
            console.error('Error checking availability:', error)
            return NextResponse.json(
                { error: error.message || 'Service temporarily unavailable.', retryable: true },
                { status: 503 }
            )
        }

        if (Array.isArray(blockedDates) && blockedDates.length > 0) {
            const reason = blockedDates[0].reason
            return NextResponse.json({
                available: false,
                message: `These dates are not available. The property is ${reason === 'booked' ? 'already booked' : reason} during this period.`
            })
        }

        // Also check confirmed bookings directly for full consistency
        const { data: existingBookings } = await resilientQuery(
            `${cacheKey}:bookings`,
            () => supabase
                .from('bookings')
                .select('id')
                .eq('status', 'confirmed')
                .lt('check_in', checkOut)
                .gt('check_out', checkIn),
            'check-availability-bookings',
            { cacheTTL: CACHE_TTL.SHORT }
        )

        if (Array.isArray(existingBookings) && existingBookings.length > 0) {
            return NextResponse.json({
                available: false,
                message: 'These dates are not available. The property is already booked during this period.'
            })
        }

        return NextResponse.json({
            available: true,
            message: 'These dates are available!'
        })
    } catch (error) {
        console.error('Error checking availability:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
