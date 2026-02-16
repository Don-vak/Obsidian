'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, ShieldCheck, ShieldAlert, Calendar, DollarSign, Clock } from 'lucide-react';

interface Booking {
    id: string;
    guest_name: string;
    email: string;
    check_in: string;
    check_out: string;
    total_amount: number;
    status: string;
    identity_verified: boolean;
    created_at: string;
}

export function BookingTable({ bookings }: { bookings: Booking[] }) {
    const router = useRouter();

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-50 text-green-700 border-green-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-stone-50 text-stone-600 border-stone-100';
        }
    };

    return (
        <div className="grid gap-4">
            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 border-dashed">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                        <Calendar size={32} />
                    </div>
                    <h3 className="font-serif text-lg text-[#1C1917]">No bookings found</h3>
                    <p className="text-stone-400 text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
            ) : (
                bookings.map((booking) => (
                    <div
                        key={booking.id}
                        onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                        className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md hover:border-[#A18058]/30 transition-all cursor-pointer group"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Guest & ID */}
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-serif text-lg">
                                    {booking.guest_name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-[#1C1917] flex items-center gap-2">
                                        {booking.guest_name}
                                        {booking.identity_verified ? (
                                            <ShieldCheck size={14} className="text-green-500" />
                                        ) : (
                                            <ShieldAlert size={14} className="text-stone-300" />
                                        )}
                                    </h4>
                                    <p className="text-xs text-stone-400">{booking.id.slice(0, 8)}...</p>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="flex items-center gap-3 text-sm text-stone-600">
                                <Calendar size={16} className="text-stone-400" />
                                <span>
                                    {new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {' — '}
                                    {new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            {/* Amount */}
                            <div className="flex items-center gap-2 font-serif text-[#1C1917]">
                                <DollarSign size={16} className="text-stone-400" />
                                <span>${Number(booking.total_amount).toLocaleString()}</span>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center justify-between md:justify-end gap-4 min-w-[140px]">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(booking.status)}`}>
                                    {booking.status}
                                </span>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 group-hover:bg-[#A18058] group-hover:text-white transition-colors">
                                    <MoreHorizontal size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
