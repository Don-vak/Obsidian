'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Filter, Search, X, ChevronDown, ShieldCheck, ShieldAlert, FileCheck, Clock } from 'lucide-react';
import { GuestCard } from './GuestCard';

interface Guest {
    id: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    trip_purpose: string;
    check_in: string;
    check_out: string;
    status: string;
    identity_verified: boolean;
    agreed_to_rental_agreement: boolean;
}

interface GuestListProps {
    guests: Guest[];
}

type VerificationFilter = 'all' | 'verified' | 'pending';
type AgreementFilter = 'all' | 'signed' | 'pending';
type StatusFilter = 'all' | 'confirmed' | 'pending' | 'cancelled';

export function GuestList({ guests }: GuestListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>('all');
    const [agreementFilter, setAgreementFilter] = useState<AgreementFilter>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const filterRef = useRef<HTMLDivElement>(null);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        if (isFilterOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterOpen]);

    const activeFilterCount = [
        verificationFilter !== 'all',
        agreementFilter !== 'all',
        statusFilter !== 'all',
    ].filter(Boolean).length;

    const clearAllFilters = () => {
        setVerificationFilter('all');
        setAgreementFilter('all');
        setStatusFilter('all');
        setSearchQuery('');
    };

    const filteredGuests = useMemo(() => {
        return guests.filter(guest => {
            // Skip blocked entries
            if (guest.status === 'blocked') return false;

            // Search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesSearch =
                    guest.guest_name?.toLowerCase().includes(q) ||
                    guest.guest_email?.toLowerCase().includes(q) ||
                    guest.guest_phone?.toLowerCase().includes(q);
                if (!matchesSearch) return false;
            }

            // Verification filter
            if (verificationFilter === 'verified' && !guest.identity_verified) return false;
            if (verificationFilter === 'pending' && guest.identity_verified) return false;

            // Agreement filter
            if (agreementFilter === 'signed' && !guest.agreed_to_rental_agreement) return false;
            if (agreementFilter === 'pending' && guest.agreed_to_rental_agreement) return false;

            // Status filter
            if (statusFilter !== 'all' && guest.status !== statusFilter) return false;

            return true;
        });
    }, [guests, searchQuery, verificationFilter, agreementFilter, statusFilter]);

    // Stats
    const stats = useMemo(() => {
        const valid = guests.filter(g => g.status !== 'blocked');
        return {
            total: valid.length,
            verified: valid.filter(g => g.identity_verified).length,
            pendingVerification: valid.filter(g => !g.identity_verified).length,
            agreementSigned: valid.filter(g => g.agreed_to_rental_agreement).length,
            agreementPending: valid.filter(g => !g.agreed_to_rental_agreement).length,
        };
    }, [guests]);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-serif text-2xl text-[#1C1917]">Guests & Verification</h2>
                    <p className="text-sm text-stone-400 mt-1">Screening and identity verification status</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search guests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-600 w-48 focus:outline-none focus:border-[#A18058] focus:w-64 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>

                    {/* Filter button + dropdown */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-xs font-medium transition-colors ${activeFilterCount > 0
                                    ? 'border-[#A18058] text-[#A18058] bg-[#A18058]/5'
                                    : 'border-stone-200 text-stone-600 hover:border-[#A18058]'
                                }`}
                        >
                            <Filter size={14} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-[#A18058] text-white flex items-center justify-center text-[10px] font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                            <ChevronDown size={12} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500">Filter Guests</h4>
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-[10px] text-[#A18058] font-medium hover:underline"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                {/* Verification Status */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">
                                        Identity Verification
                                    </label>
                                    <div className="grid grid-cols-3 gap-1">
                                        {(['all', 'verified', 'pending'] as const).map(val => (
                                            <button
                                                key={val}
                                                onClick={() => setVerificationFilter(val)}
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${verificationFilter === val
                                                        ? 'bg-[#1C1917] text-white'
                                                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                                                    }`}
                                            >
                                                {val === 'all' ? 'All' : val === 'verified' ? '✓ Verified' : '⏳ Pending'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Agreement Status */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">
                                        Rental Agreement
                                    </label>
                                    <div className="grid grid-cols-3 gap-1">
                                        {(['all', 'signed', 'pending'] as const).map(val => (
                                            <button
                                                key={val}
                                                onClick={() => setAgreementFilter(val)}
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${agreementFilter === val
                                                        ? 'bg-[#1C1917] text-white'
                                                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                                                    }`}
                                            >
                                                {val === 'all' ? 'All' : val === 'signed' ? '✓ Signed' : '⏳ Pending'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Booking Status */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">
                                        Booking Status
                                    </label>
                                    <div className="grid grid-cols-3 gap-1">
                                        {(['all', 'confirmed', 'pending'] as const).map(val => (
                                            <button
                                                key={val}
                                                onClick={() => setStatusFilter(val)}
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${statusFilter === val
                                                        ? 'bg-[#1C1917] text-white'
                                                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                                                    }`}
                                            >
                                                {val === 'all' ? 'All' : val.charAt(0).toUpperCase() + val.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-stone-100">
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="w-full py-2 bg-[#1C1917] text-white rounded-xl text-xs font-medium hover:bg-[#2C2926] transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-6 mb-6 px-1">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-medium text-stone-700">{stats.total}</span> Total Guests
                </div>
                <div className="w-px h-4 bg-stone-200" />
                <div className="flex items-center gap-1.5 text-xs">
                    <ShieldCheck size={13} className="text-green-500" />
                    <span className="text-green-700 font-medium">{stats.verified}</span>
                    <span className="text-stone-400">Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                    <ShieldAlert size={13} className="text-amber-500" />
                    <span className="text-amber-700 font-medium">{stats.pendingVerification}</span>
                    <span className="text-stone-400">Pending</span>
                </div>
                <div className="w-px h-4 bg-stone-200" />
                <div className="flex items-center gap-1.5 text-xs">
                    <FileCheck size={13} className="text-green-500" />
                    <span className="text-green-700 font-medium">{stats.agreementSigned}</span>
                    <span className="text-stone-400">Agreements</span>
                </div>
            </div>

            {/* Active filter pills */}
            {(activeFilterCount > 0 || searchQuery) && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400">Active:</span>
                    {searchQuery && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-stone-100 text-xs text-stone-600">
                            Search: &quot;{searchQuery}&quot;
                            <button onClick={() => setSearchQuery('')} className="hover:text-stone-900"><X size={10} /></button>
                        </span>
                    )}
                    {verificationFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-stone-100 text-xs text-stone-600">
                            Identity: {verificationFilter}
                            <button onClick={() => setVerificationFilter('all')} className="hover:text-stone-900"><X size={10} /></button>
                        </span>
                    )}
                    {agreementFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-stone-100 text-xs text-stone-600">
                            Agreement: {agreementFilter}
                            <button onClick={() => setAgreementFilter('all')} className="hover:text-stone-900"><X size={10} /></button>
                        </span>
                    )}
                    {statusFilter !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-stone-100 text-xs text-stone-600">
                            Status: {statusFilter}
                            <button onClick={() => setStatusFilter('all')} className="hover:text-stone-900"><X size={10} /></button>
                        </span>
                    )}
                </div>
            )}

            {/* Guest grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGuests.map(guest => (
                    <GuestCard key={guest.id} guest={guest as any} />
                ))}
            </div>

            {/* Empty states */}
            {filteredGuests.length === 0 && guests.length > 0 && (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-stone-400" />
                    </div>
                    <p className="text-stone-500 font-medium mb-1">No guests match your filters</p>
                    <p className="text-xs text-stone-400 mb-4">Try adjusting your search or filter criteria</p>
                    <button
                        onClick={clearAllFilters}
                        className="text-xs text-[#A18058] font-medium hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {guests.length === 0 && (
                <div className="p-12 text-center text-stone-400">
                    No guests found.
                </div>
            )}

            {/* Results count */}
            {filteredGuests.length > 0 && (
                <div className="mt-6 text-center text-xs text-stone-400">
                    Showing {filteredGuests.length} of {stats.total} guests
                </div>
            )}
        </div>
    );
}
