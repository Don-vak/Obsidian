'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock, Loader2, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

interface CalendarProps {
    bookings: any[];
}

export function AdminCalendar({ bookings }: CalendarProps) {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

    // Block form state
    const [blockStart, setBlockStart] = useState('');
    const [blockEnd, setBlockEnd] = useState('');
    const [blockReason, setBlockReason] = useState('Maintenance');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Fill start padding
    const startDay = monthStart.getDay();
    const paddingDays = Array(startDay).fill(null);

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const getBookingForDay = (day: Date) => {
        return bookings.find(b =>
            isWithinInterval(day, {
                start: parseISO(b.check_in),
                end: parseISO(b.check_out)
            }) || isSameDay(day, parseISO(b.check_in))
        );
    };

    const handleBlockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/admin/blocked-dates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate: blockStart,
                    endDate: blockEnd,
                    reason: blockReason
                })
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || 'Failed to block dates');
                return;
            }

            setIsBlockModalOpen(false);
            setBlockStart('');
            setBlockEnd('');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Calendar Grid */}
            <div className="flex-1 bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl text-[#1C1917]">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-stone-50 rounded-full text-stone-500 hover:text-[#1C1917] transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-stone-50 rounded-full text-stone-500 hover:text-[#1C1917] transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-stone-400 uppercase tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {paddingDays.map((_, i) => (
                        <div key={`padding-${i}`} className="aspect-square" />
                    ))}

                    {daysInMonth.map(day => {
                        const booking = getBookingForDay(day);
                        const isBlocked = booking?.status === 'blocked';
                        const isConfirmed = booking?.status === 'confirmed';

                        return (
                            <div
                                key={day.toISOString()}
                                className={`
                                    aspect-square rounded-xl p-2 relative text-sm font-medium transition-all group cursor-pointer
                                    ${isBlocked ? 'bg-stone-100 text-stone-400' :
                                        isConfirmed ? 'bg-[#A18058] text-white' :
                                            'hover:bg-stone-50 text-stone-700'}
                                `}
                                onClick={() => {
                                    if (booking) {
                                        // Show booking details (maybe in a side panel in future, just alert/log for now or select)
                                        console.log(booking);
                                    } else {
                                        setBlockStart(format(day, 'yyyy-MM-dd'));
                                        setBlockEnd(format(day, 'yyyy-MM-dd'));
                                        setIsBlockModalOpen(true);
                                    }
                                }}
                            >
                                <span>{format(day, 'd')}</span>
                                {isBlocked && <Lock size={12} className="absolute bottom-2 right-2 opacity-50" />}
                                {isConfirmed && booking.check_in === format(day, 'yyyy-MM-dd') && (
                                    <div className="absolute bottom-1 left-2 right-2 text-[8px] truncate opacity-90 font-normal">
                                        {booking.guest_name.split(' ')[0]}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Side Panel / Legend / Quick Actions */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <h3 className="font-serif text-lg text-[#1C1917] mb-4">Quick Actions</h3>
                    <button
                        onClick={() => setIsBlockModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-stone-100 text-[#1C1917] rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors mb-2"
                    >
                        <Lock size={16} />
                        Block Dates
                    </button>
                    <p className="text-xs text-stone-400 text-center mt-2">
                        Click on any date to manage availability
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <h3 className="font-serif text-lg text-[#1C1917] mb-4">Legend</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-[#A18058]"></div>
                            <span className="text-sm text-stone-600">Confirmed Booking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-stone-100 border border-stone-200"></div>
                            <span className="text-sm text-stone-600">Blocked / Maintenance</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded border border-stone-200 border-dashed"></div>
                            <span className="text-sm text-stone-600">Available</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Block Modal */}
            {isBlockModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-xl text-[#1C1917]">Block Dates</h3>
                            <button onClick={() => setIsBlockModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleBlockSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={blockStart}
                                        onChange={(e) => setBlockStart(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={blockEnd}
                                        onChange={(e) => setBlockEnd(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Reason</label>
                                <select
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058]"
                                >
                                    <option>Maintenance</option>
                                    <option>Personal Use</option>
                                    <option>Platform Sync</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-[#1C1917] text-white rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#2C2926] disabled:opacity-50 mt-4"
                            >
                                {isSubmitting ? 'Blocking...' : 'Block Dates'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
