import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminCalendar } from '@/components/admin/AdminCalendar';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch confirmed bookings
    const { data: bookings } = await supabase
        .from('bookings')
        .select('id, guest_name, guest_email, check_in, check_out, status, total, trip_purpose')
        .eq('status', 'confirmed')
        .order('check_in', { ascending: true });

    // Fetch blocked dates from the separate blocked_dates table
    const { data: blockedDates } = await supabase
        .from('blocked_dates')
        .select('id, start_date, end_date, reason')
        .order('start_date', { ascending: true });

    // Merge both into a unified format for the calendar component
    const calendarItems = [
        ...(bookings || []).map(b => ({
            id: b.id,
            guest_name: b.guest_name,
            guest_email: b.guest_email,
            check_in: b.check_in,
            check_out: b.check_out,
            status: b.status,
            total: b.total,
            trip_purpose: b.trip_purpose,
        })),
        ...(blockedDates || []).map(bd => ({
            id: bd.id,
            guest_name: 'Blocked',
            guest_email: '',
            check_in: bd.start_date,
            check_out: bd.end_date,
            status: 'blocked',
            total: 0,
            trip_purpose: bd.reason || 'Blocked',
        })),
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="font-serif text-2xl text-[#1C1917]">Availability Calendar</h2>
                <p className="text-sm text-stone-400 mt-1">Manage bookings and blocked dates</p>
            </div>

            <AdminCalendar bookings={calendarItems} />
        </div>
    );
}
