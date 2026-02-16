import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { GuestCard } from '@/components/admin/GuestCard';
import { Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GuestsPage() {
    const supabase = await createServerSupabaseClient();

    // Fetch bookings to display guests
    // Using bookings as proxy for guests since we don't have a users table for guests yet
    const { data: guests } = await supabase
        .from('bookings')
        .select('*')
        .order('check_in', { ascending: false });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif text-2xl text-[#1C1917]">Guests & Verification</h2>
                    <p className="text-sm text-stone-400 mt-1">Screening and identity verification status</p>
                </div>
                {/* Placeholder filter */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:border-[#A18058] transition-colors">
                    <Filter size={14} />
                    Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {guests?.map(guest => (
                    <GuestCard key={guest.id} guest={guest as any} />
                ))}
            </div>

            {guests?.length === 0 && (
                <div className="p-12 text-center text-stone-400">
                    No guests found.
                </div>
            )}
        </div>
    );
}
