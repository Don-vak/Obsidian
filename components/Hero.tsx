'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Calendar, Users, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  isWithinInterval,
  addMonths,
  subMonths,
  addDays,
} from 'date-fns';

interface BlockedDate {
  start: string;
  end: string;
  reason: string;
}

export const Hero: React.FC = () => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(new Date()));
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Fetch blocked dates
  useEffect(() => {
    const fetchBlockedDates = async () => {
      setIsLoadingDates(true);
      try {
        const response = await fetch('/api/blocked-dates');
        if (response.ok) {
          const data = await response.json();
          setBlockedDates(data);
        }
      } catch (err) {
        console.error('Error fetching blocked dates:', err);
      } finally {
        setIsLoadingDates(false);
      }
    };
    fetchBlockedDates();
  }, []);

  // Close calendar on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    if (calendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [calendarOpen]);

  const isDateBlocked = useCallback((date: Date): boolean => {
    return blockedDates.some(blocked => {
      const blockStart = new Date(blocked.start);
      const blockEnd = new Date(blocked.end);
      return isWithinInterval(date, { start: blockStart, end: blockEnd });
    });
  }, [blockedDates]);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, startOfDay(new Date())) || isDateBlocked(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // First click or resetting
      setCheckIn(date);
      setCheckOut(null);
      setError('');
    } else {
      // Second click - set checkout
      if (isBefore(date, checkIn)) {
        setCheckIn(date);
        setCheckOut(null);
      } else {
        // Check if any blocked date is within the range
        const hasBlockedInRange = blockedDates.some(blocked => {
          const blockStart = new Date(blocked.start);
          const blockEnd = new Date(blocked.end);
          return (
            (isBefore(blockStart, date) && isBefore(checkIn, blockEnd)) ||
            isWithinInterval(blockStart, { start: checkIn, end: date }) ||
            isWithinInterval(blockEnd, { start: checkIn, end: date })
          );
        });

        if (hasBlockedInRange) {
          setError('Selected range includes blocked dates');
          return;
        }

        setCheckOut(date);
        setError('');
        // Close calendar after both dates selected
        setTimeout(() => setCalendarOpen(false), 300);
      }
    }
  };

  const isDateSelected = (date: Date): boolean => {
    if (!checkIn) return false;
    if (!checkOut) return isSameDay(date, checkIn);
    return isSameDay(date, checkIn) || isSameDay(date, checkOut);
  };

  const isDateInRange = (date: Date): boolean => {
    if (!checkIn || !checkOut) {
      if (checkIn && hoveredDate && !checkOut) {
        const start = isBefore(hoveredDate, checkIn) ? hoveredDate : checkIn;
        const end = isBefore(hoveredDate, checkIn) ? checkIn : hoveredDate;
        return isWithinInterval(date, { start, end }) && !isSameDay(date, start) && !isSameDay(date, end);
      }
      return false;
    }
    return isWithinInterval(date, { start: checkIn, end: checkOut }) && !isSameDay(date, checkIn) && !isSameDay(date, checkOut);
  };

  const getDateClassName = (date: Date): string => {
    const isPast = isBefore(date, startOfDay(new Date()));
    const blocked = isDateBlocked(date);
    const selected = isDateSelected(date);
    const inRange = isDateInRange(date);
    const isCurrentDay = isToday(date);

    let cls = 'relative w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-150 ';

    if (isPast) {
      cls += 'text-stone-300 cursor-default';
    } else if (blocked) {
      cls += 'bg-stone-100 text-stone-300 cursor-not-allowed line-through';
    } else if (selected) {
      cls += 'bg-[#A18058] text-white shadow-md font-semibold';
    } else if (inRange) {
      cls += 'bg-[#A18058]/15 text-stone-800';
    } else {
      cls += 'text-stone-700 hover:bg-[#A18058]/10 cursor-pointer';
    }

    if (isCurrentDay && !selected) {
      cls += ' ring-1 ring-[#A18058] ring-offset-1';
    }

    return cls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (nights < 2) {
      setError('Minimum stay is 2 nights');
      return;
    }

    setIsChecking(true);

    try {
      const checkInStr = format(checkIn, 'yyyy-MM-dd');
      const checkOutStr = format(checkOut, 'yyyy-MM-dd');

      const response = await fetch(`/api/availability?checkIn=${checkInStr}&checkOut=${checkOutStr}`);
      const data = await response.json();

      if (!response.ok || !data.available) {
        setError(data.message || 'These dates are not available');
        setIsChecking(false);
        return;
      }

      const params = new URLSearchParams({
        checkIn: checkInStr,
        checkOut: checkOutStr,
        guests: guestCount.toString(),
      });

      router.push(`/book?${params.toString()}`);
    } catch {
      setError('Unable to check availability. Please try again.');
      setIsChecking(false);
    }
  };

  // Render one mini calendar month
  const renderMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = monthStart.getDay();
    const paddingDays = Array(startDay).fill(null);
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-stone-800 text-center mb-3 tracking-wide">
          {format(month, 'MMMM yyyy')}
        </h4>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-[9px] font-bold text-[#A18058] uppercase tracking-wider py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="w-9 h-9" />
          ))}
          {days.map((date, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              className={getDateClassName(date)}
              disabled={isBefore(date, startOfDay(new Date())) || isDateBlocked(date)}
            >
              {format(date, 'd')}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const formatDisplayDate = (date: Date | null, placeholder: string): string => {
    if (!date) return placeholder;
    return format(date, 'MMM d, yyyy');
  };

  const nights = checkIn && checkOut
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <header className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop"
          alt="The Obsidian Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3f3b35]/20 mix-blend-multiply"></div>
        <div className="bg-gradient-to-b via-transparent from-stone-900/40 to-stone-900/20 absolute top-0 right-0 bottom-0 left-0"></div>
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto pt-20 px-6 relative">
        <div className="flex flex-col lg:flex-row lg:gap-20 gap-x-12 gap-y-12 items-end">

          {/* Hero Content */}
          <div className="lg:w-7/12 lg:mb-0 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFAF9]/10 backdrop-blur-md border border-[#FAFAF9]/20 text-[#FAFAF9] text-[10px] font-medium tracking-[0.2em] uppercase mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A18058] animate-pulse-slow"></span>
              Direct Booking Exclusive
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="md:text-7xl lg:text-8xl leading-[0.95] text-5xl font-light text-gray-50 tracking-tight font-serif mb-6 drop-shadow-lg"
            >
              Sanctuary in <br />
              <span className="font-light text-stone-200 opacity-90 italic">the hills.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="leading-relaxed text-lg font-light text-gray-50 opacity-90 max-w-md mb-10 drop-shadow-md"
            >
              A masterfully designed architectural gem offering absolute privacy and panoramic views.
            </motion.p>
          </div>

          {/* Direct Booking Widget */}
          <motion.div
            id="book"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="lg:w-5/12 w-full"
            ref={calendarRef}
          >
            <div className="glass-panel p-6 rounded-[2rem] shadow-2xl border shadow-stone-900/20 border-white/60 backdrop-blur-3xl bg-white/10">
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-stone-200/60">
                <div>
                  <span className="block text-xl font-medium serif text-stone-900">$850 <span className="text-sm font-normal text-stone-600 font-sans">/ night</span></span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="text-[#A18058] fill-[#A18058]" />
                    <span className="text-[10px] font-medium text-stone-700">4.98 (124 reviews)</span>
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#A18058] font-semibold border border-[#A18058]/30 px-3 py-1 rounded-full bg-[#FAFAF9]/50">
                  Instant Book
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Date Selector Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className={`group relative px-4 py-3 rounded-2xl border transition-all text-left ${calendarOpen && !checkIn
                        ? 'border-[#A18058] bg-white shadow-sm'
                        : 'bg-white/90 border-stone-200 hover:border-[#A18058]/50'
                      }`}
                  >
                    <span className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">Check In</span>
                    <span className={`block text-sm font-medium ${checkIn ? 'text-stone-900' : 'text-stone-400'}`}>
                      {formatDisplayDate(checkIn, 'Add date')}
                    </span>
                    <div className="absolute right-3 bottom-3 text-stone-400">
                      <Calendar size={14} />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className={`group relative px-4 py-3 rounded-2xl border transition-all text-left ${calendarOpen && checkIn && !checkOut
                        ? 'border-[#A18058] bg-white shadow-sm'
                        : 'bg-white/90 border-stone-200 hover:border-[#A18058]/50'
                      }`}
                  >
                    <span className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">Check Out</span>
                    <span className={`block text-sm font-medium ${checkOut ? 'text-stone-900' : 'text-stone-400'}`}>
                      {formatDisplayDate(checkOut, 'Add date')}
                    </span>
                  </button>
                </div>

                {/* Calendar Dropdown */}
                <AnimatePresence>
                  {calendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-4">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={() => setCalendarMonth(m => subMonths(m, 1))}
                            className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                          >
                            <ChevronLeft size={16} className="text-stone-500" />
                          </button>

                          <div className="flex items-center gap-2">
                            {checkIn && !checkOut && (
                              <span className="text-xs text-[#A18058] font-medium">
                                Select check-out date
                              </span>
                            )}
                            {!checkIn && (
                              <span className="text-xs text-[#A18058] font-medium">
                                Select check-in date
                              </span>
                            )}
                            {checkIn && checkOut && (
                              <span className="text-xs text-stone-500 font-medium">
                                {nights} night{nights !== 1 ? 's' : ''} selected
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setCalendarMonth(m => addMonths(m, 1))}
                            className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                          >
                            <ChevronRight size={16} className="text-stone-500" />
                          </button>
                        </div>

                        {/* Two-Month View */}
                        <div className="flex gap-4">
                          {renderMonth(calendarMonth)}
                          {renderMonth(addMonths(calendarMonth, 1))}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-stone-100">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-[#A18058]"></div>
                            <span className="text-[10px] text-stone-500">Selected</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-stone-100 border border-stone-200"></div>
                            <span className="text-[10px] text-stone-500">Unavailable</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded ring-1 ring-[#A18058]"></div>
                            <span className="text-[10px] text-stone-500">Today</span>
                          </div>
                          {checkIn && (
                            <button
                              type="button"
                              onClick={() => { setCheckIn(null); setCheckOut(null); }}
                              className="text-[10px] text-[#A18058] font-medium hover:underline ml-2"
                            >
                              Clear dates
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white/90 border-stone-200 hover:border-[#A18058]/50">
                  <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">Guests</label>
                  <div className="flex justify-between items-center">
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900 cursor-pointer"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                    </select>
                    <Users size={16} className="text-stone-400" />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50/90 border border-red-200">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isChecking || !checkIn || !checkOut}
                  className="w-full bg-[#1C1917] hover:bg-[#292524] disabled:bg-stone-400 disabled:cursor-not-allowed text-[#FAFAF9] py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                  {isChecking ? 'Checking...' : nights > 0 ? `Book ${nights} Night${nights !== 1 ? 's' : ''}` : 'Check Availability'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[10px] text-stone-600 font-light">
                  You won't be charged yet
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </header>
  );
};