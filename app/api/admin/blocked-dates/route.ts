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

        // Check for conflicts
        const { data: conflicts, error: conflictError } = await supabase
            .from('bookings')
            .select('id')
            .or(`and(check_in.lte.${endDate},check_out.gte.${startDate})`)
            .in('status', ['confirmed', 'blocked']);

        if (conflictError) throw conflictError;

        if (conflicts && conflicts.length > 0) {
            return NextResponse.json({ error: 'Dates are already booked or blocked' }, { status: 409 });
        }

        // Create blocked "booking"
        const { data, error } = await supabase
            .from('bookings')
            .insert({
                check_in: startDate,
                check_out: endDate,
                status: 'blocked',
                guest_name: 'Blocked',
                guest_email: 'admin@obsidian.com', // Placeholder
                total_amount: 0,
                trip_purpose: reason || 'Maintenance/Unavailable',
                identity_verified: true, // Auto-verify admin blocks
                agreed_to_rental_agreement: true
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
    // Basic implementation to unblock
    // Expecting ID in query param or body? Standard is specialized route [id].
    // But for simplicity I might handle it here if passed in body, OR assume the plan meant [id].
    // Plan said: DELETE /api/admin/blocked-dates/[id]
    // So this file handles POST (collection).
    // I need route.ts in blocked-dates/[id] for DELETE.
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
