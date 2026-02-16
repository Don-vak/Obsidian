import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const monthCount = Number(request.nextUrl.searchParams.get('months') || '6');

        // Clamp to reasonable range
        const count = Math.min(Math.max(monthCount, 3), 24);
        const months = Array.from({ length: count }, (_, i) => getMonthRange(count - 1 - i));

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('total, check_in, status')
            .in('status', ['confirmed', 'completed'])
            .gte('check_in', months[0].start)
            .lt('check_in', months[months.length - 1].end);

        if (error) throw error;

        const chartData = months.map(m => {
            const revenue = (bookings || [])
                .filter(b => (b.check_in as string) >= m.start && (b.check_in as string) < m.end)
                .reduce((sum, b) => sum + (Number(b.total) || 0), 0);

            return { month: m.key, label: m.label, revenue };
        });

        return NextResponse.json(chartData);
    } catch (error: any) {
        console.error('Error fetching revenue chart:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
