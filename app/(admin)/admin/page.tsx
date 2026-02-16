import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { UpcomingCheckins } from '@/components/admin/UpcomingCheckins';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { RevenueAnalytics } from '@/components/admin/RevenueAnalytics';
import { DollarSign, BookOpen, Hotel, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

function getMonthRange(monthsAgo: number): { start: string; end: string; label: string; key: string } {
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const nextMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 1);
    const label = targetMonth.toLocaleDateString('en-US', { month: 'short' });
    const key = `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`;

    return {
        start: targetMonth.toISOString().split('T')[0],
        end: nextMonth.toISOString().split('T')[0],
        label,
        key
    };
}

export default async function AdminDashboard() {
    const supabase = await createServerSupabaseClient();
    const today = new Date().toISOString().split('T')[0];

    // Current month boundaries
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const daysInMonth = currentMonthEnd.getDate();

    // Last month boundaries (for trend comparison)
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    // Generate last 6 months for chart
    const months = Array.from({ length: 6 }, (_, i) => getMonthRange(5 - i));

    // Fetch all data in parallel
    const [
        allBookingsResult,
        activeBookingsResult,
        upcomingCheckinsResult,
        recentActivityResult,
        currentMonthBookingsResult,
        lastMonthBookingsResult,
        chartBookingsResult
    ] = await Promise.all([
        // 1. All confirmed/completed bookings for total revenue
        supabase
            .from('bookings')
            .select('total, status')
            .in('status', ['confirmed', 'completed']),

        // 2. Active bookings count
        supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'confirmed')
            .gte('check_out', today),

        // 3. Upcoming check-ins
        supabase
            .from('bookings')
            .select('*')
            .eq('status', 'confirmed')
            .gte('check_in', today)
            .order('check_in', { ascending: true })
            .limit(5),

        // 4. Recent activity
        supabase
            .from('bookings')
            .select('*')
            .neq('status', 'blocked')
            .order('created_at', { ascending: false })
            .limit(5),

        // 5. Current month bookings (for occupancy + current month revenue)
        supabase
            .from('bookings')
            .select('check_in, check_out, total, status')
            .in('status', ['confirmed', 'completed'])
            .lt('check_in', currentMonthEnd.toISOString().split('T')[0])
            .gt('check_out', currentMonthStart.toISOString().split('T')[0]),

        // 6. Last month bookings (for trend comparison)
        supabase
            .from('bookings')
            .select('total, check_in, check_out, status')
            .in('status', ['confirmed', 'completed'])
            .lt('check_in', lastMonthEnd.toISOString().split('T')[0])
            .gt('check_out', lastMonthStart.toISOString().split('T')[0]),

        // 7. Last 6 months bookings (for chart)
        supabase
            .from('bookings')
            .select('total, check_in, status, created_at')
            .in('status', ['confirmed', 'completed'])
            .gte('check_in', months[0].start)
            .lt('check_in', months[months.length - 1].end)
    ]);

    // === 1. TOTAL REVENUE ===
    const totalRevenue = (allBookingsResult.data || [])
        .reduce((sum, b) => sum + (Number(b.total) || 0), 0);

    // === 2. ACTIVE BOOKINGS ===
    const activeBookingsCount = activeBookingsResult.count || 0;

    // === 3. OCCUPANCY RATE ===
    // Count how many nights of the current month are booked
    const currentMonthBookings = currentMonthBookingsResult.data || [];
    let bookedNights = 0;
    for (const b of currentMonthBookings) {
        const checkIn = new Date(b.check_in);
        const checkOut = new Date(b.check_out);
        // Clamp to current month boundaries
        const overlapStart = checkIn < currentMonthStart ? currentMonthStart : checkIn;
        const overlapEnd = checkOut > currentMonthEnd ? currentMonthEnd : checkOut;
        const nights = Math.max(0, Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)));
        bookedNights += nights;
    }
    const occupancyRate = Math.min(100, Math.round((bookedNights / daysInMonth) * 100));

    // === 4. REVENUE TRENDS ===
    const currentMonthRevenue = currentMonthBookings.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
    const lastMonthRevenue = (lastMonthBookingsResult.data || []).reduce((sum, b) => sum + (Number(b.total) || 0), 0);

    let revenueTrend = '';
    if (lastMonthRevenue > 0) {
        const pctChange = Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
        revenueTrend = pctChange >= 0 ? `+${pctChange}% vs last month` : `${pctChange}% vs last month`;
    } else if (currentMonthRevenue > 0) {
        revenueTrend = 'New revenue this month';
    }

    // Occupancy trend (compare booked nights vs last month)
    const lastMonthBookingsForOccupancy = lastMonthBookingsResult.data || [];
    const lastMonthDays = lastMonthEnd.getDate();
    let lastMonthBookedNights = 0;
    for (const b of lastMonthBookingsForOccupancy) {
        const checkIn = new Date(b.check_in);
        const checkOut = new Date(b.check_out);
        const overlapStart = checkIn < lastMonthStart ? lastMonthStart : checkIn;
        const overlapEnd = checkOut > lastMonthEnd ? lastMonthEnd : checkOut;
        const nights = Math.max(0, Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)));
        lastMonthBookedNights += nights;
    }
    const lastOccupancy = Math.round((lastMonthBookedNights / lastMonthDays) * 100);
    let occupancyTrend = '';
    if (lastOccupancy > 0) {
        const diff = occupancyRate - lastOccupancy;
        occupancyTrend = diff >= 0 ? `+${diff}% vs last month` : `${diff}% vs last month`;
    }

    // === 5. REVENUE CHART DATA ===
    const chartBookings = chartBookingsResult.data || [];
    const chartData = months.map(m => {
        const monthRevenue = chartBookings
            .filter(b => {
                const checkIn = b.check_in as string;
                return checkIn >= m.start && checkIn < m.end;
            })
            .reduce((sum, b) => sum + (Number(b.total) || 0), 0);

        return {
            month: m.key,
            label: m.label,
            revenue: monthRevenue
        };
    });

    // === 6. LISTS ===
    const upcomingCheckins = upcomingCheckinsResult.data || [];
    const recentActivity = recentActivityResult.data || [];

    return (
        <div className="space-y-8">
            <AdminHeader />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend={revenueTrend || undefined}
                />
                <StatCard
                    label="Active Bookings"
                    value={activeBookingsCount.toString()}
                    icon={BookOpen}
                />
                <StatCard
                    label="Occupancy Rate"
                    value={`${occupancyRate}%`}
                    icon={Hotel}
                    trend={occupancyTrend || undefined}
                />
                <StatCard
                    label="Average Rating"
                    value="5.0"
                    icon={Star}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
                <UpcomingCheckins bookings={upcomingCheckins} />
                <RecentActivity activities={recentActivity} />
            </div>

            {/* Revenue Analytics Chart */}
            <RevenueAnalytics initialData={chartData} />
        </div>
    );
}
