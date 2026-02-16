import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminCalendar } from '@/components/admin/AdminCalendar';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch all bookings (status = confirmed or blocked)
    // Optimization: In real app, filter by date range based on default view?
    // For now, fetching broader range is fine.
    const { data: bookings } = await supabase
        .from('bookings')
        .select('id, guest_name, check_in, check_out, status, total_amount')
        .in('status', ['confirmed', 'blocked']);

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-serif text-2xl text-[#1C1917]">Availability Calendar</h2>
                <p className="text-sm text-stone-400 mt-1">Manage bookings and blocked dates</p>
            </div>

            <AdminCalendar bookings={bookings || []} />
        </div>
    );
}
