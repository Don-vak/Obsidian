import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { GuestList } from '@/components/admin/GuestList';

export const dynamic = 'force-dynamic';

export default async function GuestsPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch bookings to display guests (excluding blocked dates)
    const { data: guests } = await supabase
        .from('bookings')
        .select('*')
        .neq('status', 'blocked')
        .order('check_in', { ascending: false });

    return <GuestList guests={guests || []} />;
}
