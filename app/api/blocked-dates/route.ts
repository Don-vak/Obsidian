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

        const { data, error, fromCache } = await resilientQuery(
            cacheKey,
            () => {
                let query = supabase
                    .from('blocked_dates')
                    .select('*')
                    .order('start_date', { ascending: true })

                if (month) {
                    const startOfMonth = `${month}-01`
                    const endOfMonth = new Date(new Date(startOfMonth).getFullYear(), new Date(startOfMonth).getMonth() + 1, 0)
                        .toISOString()
                        .split('T')[0]

                    query = query
                        .gte('start_date', startOfMonth)
                        .lte('end_date', endOfMonth)
                }

                return query
            },
            'fetch-blocked-dates',
            { cacheTTL: CACHE_TTL.MEDIUM }
        )

        if (error) {
            console.error('Error fetching blocked dates:', error)
            return NextResponse.json(
                { error: error.message || 'Service temporarily unavailable.', retryable: true },
                { status: 503 }
            )
        }

        // Map database fields to calendar component format
        const blockedDates = (Array.isArray(data) ? data : []).map((item: Record<string, string>) => ({
            start: item.start_date,
            end: item.end_date,
            reason: item.reason
        }))

        return NextResponse.json(blockedDates, {
            headers: fromCache ? { 'X-Cache': 'HIT' } : { 'X-Cache': 'MISS' },
        })
    } catch (error) {
        console.error('Error fetching blocked dates:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
