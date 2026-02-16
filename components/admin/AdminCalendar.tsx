'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock, Loader2, X, User, Calendar, Clock } from 'lucide-react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    eachDayOfInterval, isSameDay, parseISO, differenceInCalendarDays,
    isBefore, isAfter, startOfDay
} from 'date-fns';
import { useRouter } from 'next/navigation';

interface Booking {
    id: string;
    guest_name: string;
    guest_email?: string;
    check_in: string;
    check_out: string;
    status: string;
    total?: number;
    trip_purpose?: string;
    guests?: number;
}

interface CalendarProps {
    bookings: Booking[];
}

export function AdminCalendar({ bookings }: CalendarProps) {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blockStart, setBlockStart] = useState('');
    const [blockEnd, setBlockEnd] = useState('');
    const [blockReason, setBlockReason] = useState('maintenance');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const totalDays = daysInMonth.length;

    // Fill padding for start day (so grid aligns to weekday)
    const startDayOfWeek = monthStart.getDay();

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // Filter bookings that overlap with this month
    const monthBookings = bookings.filter(b => {
        const checkIn = parseISO(b.check_in);
        const checkOut = parseISO(b.check_out);
        return !isAfter(checkIn, monthEnd) && !isBefore(checkOut, monthStart);
    }).sort((a, b) => a.check_in.localeCompare(b.check_in));

    // Calculate bar position for a booking
    const getBarPosition = (booking: Booking) => {
        const checkIn = parseISO(booking.check_in);
        const checkOut = parseISO(booking.check_out);

        // Clamp to month boundaries
        const barStart = isBefore(checkIn, monthStart) ? monthStart : checkIn;
        const barEnd = isAfter(checkOut, monthEnd) ? monthEnd : checkOut;

        const startCol = differenceInCalendarDays(barStart, monthStart);
        const endCol = differenceInCalendarDays(barEnd, monthStart);
        const span = endCol - startCol + 1;

        const startsBeforeMonth = isBefore(checkIn, monthStart);
        const endsAfterMonth = isAfter(checkOut, monthEnd);

        return { startCol, span, startsBeforeMonth, endsAfterMonth };
    };

    // Assign rows to bookings (avoid overlaps)
    const assignRows = () => {
        const rows: { end: number }[] = [];
        return monthBookings.map(booking => {
            const { startCol, span } = getBarPosition(booking);
            const endCol = startCol + span;

            // Find the first row where this booking fits
            let row = 0;
            for (let r = 0; r < rows.length; r++) {
                if (rows[r].end <= startCol) {
                    row = r;
                    rows[r].end = endCol;
                    return { booking, row };
                }
            }
            // No existing row fits, create new
            row = rows.length;
            rows.push({ end: endCol });
            return { booking, row };
        });
    };

    const bookingRows = assignRows();
    const maxRow = bookingRows.reduce((max, br) => Math.max(max, br.row), -1);

    // Check if a day has a booking (for grid cell styling)
    const getBookingForDay = (day: Date) => {
        return bookings.find(b => {
            const checkIn = parseISO(b.check_in);
            const checkOut = parseISO(b.check_out);
            return (isSameDay(day, checkIn) || isSameDay(day, checkOut) ||
                (isAfter(day, checkIn) && isBefore(day, checkOut)));
        });
    };

    const handleBlockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/blocked-dates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startDate: blockStart, endDate: blockEnd, reason: blockReason })
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
            {/* Main Calendar with Booking Bars */}
            <div className="flex-1 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl text-[#1C1917]">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentMonth(new Date())}
                            className="px-3 py-1.5 text-xs uppercase tracking-wider font-medium text-stone-500 hover:text-[#1C1917] bg-stone-50 hover:bg-stone-100 rounded-full transition-colors"
                        >
                            Today
                        </button>
                        <button onClick={prevMonth} className="p-2 hover:bg-stone-50 rounded-full text-stone-500 hover:text-[#1C1917] transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-stone-50 rounded-full text-stone-500 hover:text-[#1C1917] transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-[10px] font-medium text-stone-400 uppercase tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Date Number Row */}
                <div className="grid grid-cols-7">
                    {/* Padding cells */}
                    {Array(startDayOfWeek).fill(null).map((_, i) => (
                        <div key={`pad-${i}`} className="h-8" />
                    ))}
                    {/* Date numbers */}
                    {daysInMonth.map(day => {
                        const isToday = isSameDay(day, new Date());
                        const booking = getBookingForDay(day);

                        return (
                            <div
                                key={day.toISOString()}
                                className={`h-8 flex items-center justify-center text-xs font-medium relative cursor-pointer
                                    ${isToday ? 'text-white' : booking ? 'text-stone-700' : 'text-stone-500'}
                                `}
                                onClick={() => {
                                    if (!booking) {
                                        setBlockStart(format(day, 'yyyy-MM-dd'));
                                        setBlockEnd(format(day, 'yyyy-MM-dd'));
                                        setIsBlockModalOpen(true);
                                    }
                                }}
                            >
                                {isToday && (
                                    <div className="absolute w-6 h-6 rounded-full bg-[#A18058]" />
                                )}
                                <span className="relative z-10">{format(day, 'd')}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Booking Bars Section */}
                <div
                    className="relative mt-3 border-t border-stone-100 pt-3"
                    style={{ minHeight: `${Math.max((maxRow + 1) * 44, 50)}px` }}
                >
                    {bookingRows.length === 0 && (
                        <div className="flex items-center justify-center h-12 text-xs text-stone-400">
                            No bookings this month
                        </div>
                    )}

                    {bookingRows.map(({ booking, row }) => {
                        const { startCol, span, startsBeforeMonth, endsAfterMonth } = getBarPosition(booking);
                        const isBlocked = booking.status === 'blocked';
                        const isConfirmed = booking.status === 'confirmed';

                        // Calculate position as percentage of 7-column grid
                        // Adjust startCol for the weekday offset
                        const adjustedStart = startCol + startDayOfWeek;
                        const gridRow = Math.floor(adjustedStart / 7);

                        // Position within the bars container using day-of-month
                        const leftPct = (startCol / totalDays) * 100;
                        const widthPct = (span / totalDays) * 100;

                        return (
                            <div
                                key={booking.id}
                                className={`absolute flex items-center gap-2 px-3 py-1 cursor-pointer transition-all duration-200 group
                                    ${isBlocked
                                        ? 'bg-stone-100 border border-stone-200 hover:bg-stone-150 hover:border-stone-300'
                                        : 'bg-[#A18058]/10 border border-[#A18058]/25 hover:bg-[#A18058]/20 hover:border-[#A18058]/40'
                                    }
                                    ${startsBeforeMonth ? 'rounded-l-none' : 'rounded-l-lg'}
                                    ${endsAfterMonth ? 'rounded-r-none' : 'rounded-r-lg'}
                                `}
                                style={{
                                    top: `${row * 44}px`,
                                    left: `${leftPct}%`,
                                    width: `${widthPct}%`,
                                    height: '38px',
                                    minWidth: '60px'
                                }}
                                onClick={() => {
                                    if (isConfirmed) {
                                        router.push(`/admin/bookings/${booking.id}`);
                                    }
                                }}
                            >
                                {/* Icon */}
                                {isBlocked ? (
                                    <Lock size={12} className="text-stone-400 flex-shrink-0" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-[#A18058] text-white flex items-center justify-center text-[9px] font-semibold flex-shrink-0">
                                        {booking.guest_name.charAt(0)}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <p className={`text-[11px] font-medium truncate ${isBlocked ? 'text-stone-500' : 'text-[#1C1917]'}`}>
                                        {isBlocked
                                            ? (booking.trip_purpose || 'Blocked')
                                            : booking.guest_name
                                        }
                                    </p>
                                </div>

                                {/* Duration / Amount (only if wide enough) */}
                                {span >= 3 && (
                                    <div className="hidden sm:flex items-center gap-1 text-[10px] text-stone-400 flex-shrink-0">
                                        {isBlocked ? (
                                            <span>{span} {span === 1 ? 'day' : 'days'}</span>
                                        ) : (
                                            <span>${Number(booking.total || 0).toLocaleString()}</span>
                                        )}
                                    </div>
                                )}

                                {/* Hover tooltip */}
                                <div className="absolute left-0 top-full mt-1 bg-[#1C1917] text-white text-[10px] px-3 py-2 rounded-lg shadow-xl z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                    {isBlocked ? (
                                        <>
                                            <span className="font-semibold">{booking.trip_purpose || 'Blocked'}</span>
                                            <span className="text-stone-400 ml-2">
                                                {format(parseISO(booking.check_in), 'MMM d')} — {format(parseISO(booking.check_out), 'MMM d')}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-semibold">{booking.guest_name}</span>
                                            <span className="text-stone-400 ml-2">
                                                {format(parseISO(booking.check_in), 'MMM d')} — {format(parseISO(booking.check_out), 'MMM d')}
                                            </span>
                                            {booking.total ? (
                                                <span className="text-[#A18058] ml-2">${Number(booking.total).toLocaleString()}</span>
                                            ) : null}
                                        </>
                                    )}
                                    <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#1C1917]" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Side Panel */}
            <div className="w-full lg:w-80 space-y-6">
                {/* Quick Actions */}
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
                        Click on any available date to block it
                    </p>
                </div>

                {/* This Month Summary */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <h3 className="font-serif text-lg text-[#1C1917] mb-4">This Month</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-stone-500">Bookings</span>
                            <span className="text-sm font-semibold text-[#1C1917]">
                                {monthBookings.filter(b => b.status === 'confirmed').length}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-stone-500">Blocked</span>
                            <span className="text-sm font-semibold text-[#1C1917]">
                                {monthBookings.filter(b => b.status === 'blocked').length}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-stone-500">Revenue</span>
                            <span className="text-sm font-semibold text-[#1C1917]">
                                ${monthBookings
                                    .filter(b => b.status === 'confirmed')
                                    .reduce((sum, b) => sum + (Number(b.total) || 0), 0)
                                    .toLocaleString()
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <h3 className="font-serif text-lg text-[#1C1917] mb-4">Legend</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-4 rounded bg-[#A18058]/15 border border-[#A18058]/25"></div>
                            <span className="text-sm text-stone-600">Guest Booking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-4 rounded bg-stone-100 border border-stone-200"></div>
                            <span className="text-sm text-stone-600">Blocked / Maintenance</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#A18058] flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold">⬤</span>
                            </div>
                            <span className="text-sm text-stone-600">Today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Block Modal */}
            {isBlockModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
                    onClick={(e) => { e.stopPropagation(); setIsBlockModalOpen(false); }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-xl text-[#1C1917]">Block Dates</h3>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setIsBlockModalOpen(false); }}
                                className="text-stone-400 hover:text-stone-600 p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleBlockSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">Start Date</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="YYYY-MM-DD"
                                        pattern="\d{4}-\d{2}-\d{2}"
                                        value={blockStart}
                                        onChange={(e) => setBlockStart(e.target.value)}
                                        onFocus={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058] focus:ring-1 focus:ring-[#A18058]/20 bg-stone-50 transition-all"
                                    />
                                    <p className="text-[9px] text-stone-400 mt-1">e.g. 2026-03-15</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">End Date</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="YYYY-MM-DD"
                                        pattern="\d{4}-\d{2}-\d{2}"
                                        value={blockEnd}
                                        onChange={(e) => setBlockEnd(e.target.value)}
                                        onFocus={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058] focus:ring-1 focus:ring-[#A18058]/20 bg-stone-50 transition-all"
                                    />
                                    <p className="text-[9px] text-stone-400 mt-1">e.g. 2026-03-20</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">Reason</label>
                                <select
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058] focus:ring-1 focus:ring-[#A18058]/20 bg-stone-50 transition-all"
                                >
                                    <option value="maintenance">Maintenance</option>
                                    <option value="personal">Personal Use</option>
                                    <option value="holiday">Holiday</option>
                                    <option value="booked">Booked (External)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-[#1C1917] text-white rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#2C2926] disabled:opacity-50 mt-4 transition-colors"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 size={14} className="animate-spin" />
                                        Blocking...
                                    </span>
                                ) : 'Block Dates'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
