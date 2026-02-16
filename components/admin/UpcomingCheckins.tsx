import React from 'react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

interface Booking {
    id: string;
    guest_name: string;
    check_in: string;
    check_out: string;
    status: string;
    total_amount: number;
}

export function UpcomingCheckins({ bookings }: { bookings: Booking[] }) {
    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                    <h3 className="font-serif text-lg text-[#1C1917]">Upcoming Check-ins</h3>
                    <p className="text-xs text-stone-400 mt-1">Next 5 arrivals</p>
                </div>
                <button className="text-[#A18058] hover:text-[#8a6a4b] transition-colors p-2 rounded-full hover:bg-[#A18058]/5">
                    <ArrowRight size={18} />
                </button>
            </div>

            <div className="flex-1 p-0">
                {bookings.length === 0 ? (
                    <div className="p-8 text-center text-stone-400 text-sm">
                        No upcoming check-ins scheduled.
                    </div>
                ) : (
                    <div className="divide-y divide-stone-50">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="p-4 hover:bg-stone-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-[#A18058]/10 group-hover:text-[#A18058] transition-colors">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#1C1917] text-sm">{booking.guest_name}</p>
                                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                                            <Calendar size={12} />
                                            <span>
                                                {new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                {' — '}
                                                {new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
