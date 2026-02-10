import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const checkIn = searchParams.get('checkIn')
        const checkOut = searchParams.get('checkOut')

        if (!checkIn || !checkOut) {
            return NextResponse.json({ error: 'Missing checkIn or checkOut parameters' }, { status: 400 })
        }

        const supabase = await createServerSupabaseClient()

        // Check for overlapping blocked dates
        // A true overlap exists when: start_date < checkOut AND end_date > checkIn
        // This allows checkout on the same day as next checkin
        const { data: blockedDates, error } = await supabase
            .from('blocked_dates')
            .select('*')
            .lt('start_date', checkOut)
            .gt('end_date', checkIn)

        if (error) {
            console.error('Error checking availability:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (blockedDates && blockedDates.length > 0) {
            const reason = blockedDates[0].reason
            return NextResponse.json({
                available: false,
                message: `These dates are not available. The property is ${reason === 'booked' ? 'already booked' : reason} during this period.`
            })
        }

        return NextResponse.json({
            available: true,
            message: 'These dates are available!'
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
