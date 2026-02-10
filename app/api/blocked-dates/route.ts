import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { retrySupabaseQuery } from '@/lib/supabase/retry'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const month = searchParams.get('month') // Format: YYYY-MM

        const supabase = await createServerSupabaseClient()

        let query = supabase
            .from('blocked_dates')
            .select('*')
            .order('start_date', { ascending: true })

        // Filter by month if provided
        if (month) {
            const startOfMonth = `${month}-01`
            const endOfMonth = new Date(new Date(startOfMonth).getFullYear(), new Date(startOfMonth).getMonth() + 1, 0)
                .toISOString()
                .split('T')[0]

            query = query
                .gte('start_date', startOfMonth)
                .lte('end_date', endOfMonth)
        }

        const { data, error } = await retrySupabaseQuery(
            () => query,
            'fetch-blocked-dates'
        )

        if (error) {
            console.error('Error fetching blocked dates:', error)
            return NextResponse.json(
                { error: 'Service temporarily unavailable. Please try again.', retryable: true },
                { status: 503 }
            )
        }

        // Map database fields to calendar component format
        const blockedDates = (data || []).map(item => ({
            start: item.start_date,
            end: item.end_date,
            reason: item.reason
        }))

        return NextResponse.json(blockedDates)
    } catch (error) {
        console.error('Error fetching blocked dates:', error)
        return NextResponse.json(
            { error: 'Service temporarily unavailable. Please try again.', retryable: true },
            { status: 503 }
        )
    }
}
