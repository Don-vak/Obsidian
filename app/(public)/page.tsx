import { Hero, BlockedDate } from '@/components/Hero';
import { PropertyDetails } from '@/components/PropertyDetails';
import { Amenities } from '@/components/Amenities';
import { Gallery } from '@/components/Gallery';
import { Host } from '@/components/Host';
import { Location } from '@/components/Location';
import { HouseRules } from '@/components/HouseRules';
import { Testimonials } from '@/components/Testimonials';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function getNightlyRate() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: config } = await supabase
            .from('pricing_config')
            .select('base_nightly_rate')
            .lte('effective_from', new Date().toISOString().split('T')[0])
            .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split('T')[0]}`)
            .order('effective_from', { ascending: false })
            .limit(1)
            .single();

        return config ? Number(config.base_nightly_rate) : 450;
    } catch (error) {
        console.error('Error fetching nightly rate:', error);
        return 450;
    }
}

async function getBlockedDates(): Promise<BlockedDate[]> {
    try {
        const supabase = await createServerSupabaseClient();

        // Fetch blocked dates and confirmed bookings in parallel
        const [blockedResult, bookingsResult] = await Promise.all([
            supabase
                .from('blocked_dates')
                .select('*')
                .order('start_date', { ascending: true }),
            supabase
                .from('bookings')
                .select('check_in, check_out')
                .eq('status', 'confirmed')
                .order('check_in', { ascending: true })
        ]);

        const blockedData = blockedResult.data || [];
        const bookingsData = bookingsResult.data || [];

        // Map blocked_dates entries
        const blockedDates = blockedData.map((item) => ({
            start: item.start_date,
            end: item.end_date,
            reason: item.reason
        }));

        // Add confirmed bookings that don't already have a blocked_dates entry
        const bookingDates = bookingsData
            .filter((booking) => {
                return !blockedDates.some(bd =>
                    bd.start === booking.check_in && bd.end === booking.check_out
                );
            })
            .map((booking) => ({
                start: booking.check_in,
                end: booking.check_out,
                reason: 'booked'
            }));

        const allUnavailable = [...blockedDates, ...bookingDates]
            .sort((a, b) => a.start.localeCompare(b.start));

        return allUnavailable;
    } catch (error) {
        console.error('Error fetching blocked dates:', error);
        return [];
    }
}

export default async function Home() {
    const [nightlyRate, blockedDates] = await Promise.all([
        getNightlyRate(),
        getBlockedDates()
    ]);

    return (
        <>
            <Hero initialBlockedDates={blockedDates} nightlyRate={nightlyRate} />
            <PropertyDetails />
            <Amenities />
            <Gallery />
            <Host />
            <Location />
            <HouseRules />
            <Testimonials />
        </>
    );
}
