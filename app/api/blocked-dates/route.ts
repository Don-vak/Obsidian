import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

        const { data, error } = await query

        if (error) {
            console.error('Error fetching blocked dates:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
