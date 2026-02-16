import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = await request.json();
        const { startDate, endDate, reason } = body;

        if (!startDate || !endDate) {
            return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
        }

        // Check for booking conflicts
        const { data: bookingConflicts } = await supabase
            .from('bookings')
            .select('id')
            .or(`and(check_in.lte.${endDate},check_out.gte.${startDate})`)
            .in('status', ['confirmed', 'pending']);

        if (bookingConflicts && bookingConflicts.length > 0) {
            return NextResponse.json({ error: 'These dates overlap with existing bookings' }, { status: 409 });
        }

        // Check for existing blocked date conflicts
        const { data: blockConflicts } = await supabase
            .from('blocked_dates')
            .select('id')
            .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

        if (blockConflicts && blockConflicts.length > 0) {
            return NextResponse.json({ error: 'These dates are already blocked' }, { status: 409 });
        }

        // Insert into the blocked_dates table (the correct table)
        const { data, error } = await supabase
            .from('blocked_dates')
            .insert({
                start_date: startDate,
                end_date: endDate,
                reason: reason || 'maintenance'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Error blocking dates:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('blocked_dates')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error unblocking dates:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
