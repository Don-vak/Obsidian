import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        // 1. Total Revenue (confirmed + paid bookings)
        const { data: revenueData, error: revenueError } = await supabase
            .from('bookings')
            .select('total')
            .in('status', ['confirmed', 'completed']);

        if (revenueError) throw revenueError;

        const totalRevenue = revenueData.reduce((sum, booking) => sum + (Number(booking.total) || 0), 0);

        // 2. Active Bookings Count (future check-outs)
        const today = new Date().toISOString().split('T')[0];
        const { count: activeBookingsCount, error: activeError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .in('status', ['confirmed'])
            .gte('check_out', today);

        if (activeError) throw activeError;

        // 3. Occupancy Rate (simplified: based on active count vs 30 days... mock for now as precise calcs are heavy)
        // We'll return 0 for now or a placeholder
        const occupancyRate = 0;

        // 4. Upcoming Check-ins
        const { data: upcomingCheckins, error: checkinsError } = await supabase
            .from('bookings')
            .select('id, guest_name, check_in, check_out, status, total, email')
            .eq('status', 'confirmed')
            .gte('check_in', today)
            .order('check_in', { ascending: true })
            .limit(5);

        if (checkinsError) throw checkinsError;

        // 5. Recent Activity (Latest bookings created)
        const { data: recentActivity, error: activityError } = await supabase
            .from('bookings')
            .select('id, guest_name, created_at, status, total')
            .order('created_at', { ascending: false })
            .limit(5);

        if (activityError) throw activityError;

        return NextResponse.json({
            totalRevenue,
            activeBookingsCount: activeBookingsCount || 0,
            occupancyRate,
            upcomingCheckins: upcomingCheckins || [],
            recentActivity: recentActivity || []
        });

    } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
