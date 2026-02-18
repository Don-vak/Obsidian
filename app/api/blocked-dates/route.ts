import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resilientQuery, CACHE_TTL } from '@/lib/supabase/resilient'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const month = searchParams.get('month') // Format: YYYY-MM

        const supabase = await createServerSupabaseClient()

        // Build cache key based on month filter
        const cacheKey = month ? `blocked-dates:${month}` : 'blocked-dates:all'

        // Fetch from blocked_dates table
        const { data: blockedData, error: blockedError } = await resilientQuery(
            `${cacheKey}:blocked`,
            () => {
                let query = supabase
                    .from('blocked_dates')
                    .select('start_date, end_date, reason')
                    .order('start_date', { ascending: true })

                if (month) {
                    const startOfMonth = `${month}-01`
                    const endOfMonth = new Date(new Date(startOfMonth).getFullYear(), new Date(startOfMonth).getMonth() + 1, 0)
                        .toISOString()
                        .split('T')[0]

                    query = query
                        .or(`and(start_date.lte.${endOfMonth},end_date.gte.${startOfMonth})`)
                }

                return query
            },
            'fetch-blocked-dates',
            { cacheTTL: CACHE_TTL.MEDIUM }
        )

        if (blockedError) {
            console.error('Error fetching blocked dates:', blockedError)
            return NextResponse.json(
                { error: blockedError.message || 'Service temporarily unavailable.', retryable: true },
                { status: 503 }
            )
        }

        // Also fetch confirmed bookings to ensure consistency
        // (in case a booking exists without a corresponding blocked_dates entry)
        const { data: bookingsData } = await resilientQuery(
            `${cacheKey}:bookings`,
            () => {
                let query = supabase
                    .from('bookings')
                    .select('id, check_in, check_out, status')
                    .eq('status', 'confirmed')
                    .order('check_in', { ascending: true })

                if (month) {
                    const startOfMonth = `${month}-01`
                    const endOfMonth = new Date(new Date(startOfMonth).getFullYear(), new Date(startOfMonth).getMonth() + 1, 0)
                        .toISOString()
                        .split('T')[0]

                    query = query
                        .lte('check_in', endOfMonth)
                        .gte('check_out', startOfMonth)
                }

                return query
            },
            'fetch-booked-dates',
            { cacheTTL: CACHE_TTL.MEDIUM }
        )

        // Map blocked_dates entries
        const blockedDates = (Array.isArray(blockedData) ? blockedData : []).map((item: Record<string, string>) => ({
            start: item.start_date,
            end: item.end_date,
            reason: item.reason
        }))

        // Add confirmed bookings that don't already have a blocked_dates entry
        // (The Stripe webhook creates these, but manual/edge cases might miss them)
        const bookingDates = (Array.isArray(bookingsData) ? bookingsData : [])
            .filter((booking: any) => {
                // Skip if already covered by a blocked_dates entry
                return !blockedDates.some(bd =>
                    bd.start === booking.check_in && bd.end === booking.check_out
                )
            })
            .map((booking: any) => ({
                start: booking.check_in,
                end: booking.check_out,
                reason: 'booked'
            }))

        const allUnavailable = [...blockedDates, ...bookingDates]
            .sort((a, b) => a.start.localeCompare(b.start))

        return NextResponse.json(allUnavailable, {
            headers: { 'X-Cache': 'MISS' },
        })
    } catch (error) {
        console.error('Error fetching blocked dates:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
