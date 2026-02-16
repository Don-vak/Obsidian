'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
// import { useDebounce } from 'use-debounce'; // access debounced value
// wait, I don't have use-debounce installed probably. I'll implement simple debounce or just on keydown Enter. 
// Enter is safer without extra deps.

export function BookingsFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [status, setStatus] = useState(searchParams.get('status') || 'all');

    // Update URL on search/status change
    const updateFilters = (newSearch: string, newStatus: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newSearch) params.set('q', newSearch);
        else params.delete('q');

        if (newStatus && newStatus !== 'all') params.set('status', newStatus);
        else params.delete('status');

        params.set('page', '1'); // Reset pagination

        router.push(`/admin/bookings?${params.toString()}`);
    };

    const handleSearchCheck = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            updateFilters(search, status);
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        updateFilters(search, newStatus);
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.push('/admin/bookings');
    };

    return (
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearchCheck}
                    placeholder="Search by guest name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-[#A18058] focus:ring-1 focus:ring-[#A18058]/20 transition-all"
                />
            </div>

            {/* Status Filter */}
            <div className="relative w-full md:w-48">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                    <Filter size={16} />
                </div>
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-[#A18058] focus:ring-1 focus:ring-[#A18058]/20 transition-all appearance-none cursor-pointer"
                >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none text-xs">
                    ▼
                </div>
            </div>

            {/* Clear Button */}
            {(searchParams.get('q') || searchParams.get('status')) && (
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-stone-400 hover:text-red-500 text-sm transition-colors px-2"
                >
                    <X size={16} />
                    Clear
                </button>
            )}
        </div>
    );
}
