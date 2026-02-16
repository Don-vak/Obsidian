import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BookingsFilter } from '@/components/admin/BookingsFilter';
import { BookingTable } from '@/components/admin/BookingTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await searchParams;

    // Parse filters
    const page = Number(resolvedParams.page) || 1;
    const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
    const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all';

    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let dbQuery = supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .neq('status', 'blocked')
        .order('created_at', { ascending: false })
        .range(from, to);

    if (status !== 'all') {
        dbQuery = dbQuery.eq('status', status);
    }

    if (query) {
        dbQuery = dbQuery.or(`guest_name.ilike.%${query}%,guest_email.ilike.%${query}%`);
    }

    const { data: bookings, count, error } = await dbQuery;

    if (error) {
        console.error('Error fetching bookings:', error);
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif text-2xl text-[#1C1917]">Bookings</h2>
                    <p className="text-sm text-stone-400 mt-1">Manage guest reservations</p>
                </div>
                <button className="bg-[#1C1917] text-white px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#2C2926] transition-colors flex items-center gap-2">
                    <Plus size={16} />
                    New Booking
                </button>
            </div>

            <BookingsFilter />

            <BookingTable bookings={bookings || []} />

            {/* Pagination details */}
            {count && count > 0 && (
                <div className="mt-8 flex items-center justify-between text-xs text-stone-400">
                    <p>
                        Showing <span className="text-[#1C1917] font-medium">{from + 1}</span> to{' '}
                        <span className="text-[#1C1917] font-medium">{Math.min(to + 1, count)}</span> of{' '}
                        <span className="text-[#1C1917] font-medium">{count}</span> results
                    </p>

                    <div className="flex items-center gap-2">
                        {page > 1 && (
                            <Link
                                href={`/admin/bookings?page=${page - 1}&q=${query}&status=${status}`}
                                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-white hover:border-[#A18058] transition-colors"
                            >
                                Previous
                            </Link>
                        )}
                        {page < totalPages && (
                            <Link
                                href={`/admin/bookings?page=${page + 1}&q=${query}&status=${status}`}
                                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-white hover:border-[#A18058] transition-colors"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
