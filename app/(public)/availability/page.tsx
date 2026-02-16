'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { addMonths, subMonths, differenceInDays, format } from 'date-fns';
import Link from 'next/link';
import { CalendarMonth } from '@/components/CalendarMonth';
import { CalendarLegend } from '@/components/CalendarLegend';
import { PricingSummary } from '@/components/PricingSummary';
import { calculateBookingPrice, type PricingBreakdown } from '@/lib/mock-data/pricing';
import type { BlockedDate } from '@/lib/mock-data/availability';

export default function AvailabilityPage() {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedStart, setSelectedStart] = useState<Date | null>(null);
    const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [isLoadingDates, setIsLoadingDates] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Fetch blocked dates from API with auto-retry
    const fetchBlockedDates = async (retryCount = 0) => {
        const MAX_RETRIES = 3;
        setIsLoadingDates(true);
        setFetchError(null);

        try {
            const response = await fetch('/api/blocked-dates');
            const data = await response.json();

            if (response.ok) {
                setBlockedDates(data);
                setFetchError(null);
            } else if (data.retryable && retryCount < MAX_RETRIES) {
                // Auto-retry with exponential backoff
                const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
                console.warn(`[Retry] Blocked dates fetch failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchBlockedDates(retryCount + 1);
            } else {
                setFetchError('Unable to load calendar data. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching blocked dates:', error);
            if (retryCount < MAX_RETRIES) {
                const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
                console.warn(`[Retry] Network error, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchBlockedDates(retryCount + 1);
            }
            setFetchError('Connection issue. Please check your internet and try again.');
        } finally {
            setIsLoadingDates(false);
        }
    };

    useEffect(() => {
        fetchBlockedDates();
    }, []);

    // Calculate pricing when dates are selected
    useEffect(() => {
        if (selectedStart && selectedEnd) {
            const nights = differenceInDays(selectedEnd, selectedStart);
            if (nights > 0) {
                const calculatedPricing = calculateBookingPrice(nights);
                setPricing(calculatedPricing);
            }
        } else {
            setPricing(null);
        }
    }, [selectedStart, selectedEnd]);

    const handleDateClick = (date: Date) => {
        if (!selectedStart || (selectedStart && selectedEnd)) {
            // Start new selection
            setSelectedStart(date);
            setSelectedEnd(null);
        } else {
            // Complete selection
            if (date > selectedStart) {
                setSelectedEnd(date);
            } else {
                setSelectedEnd(selectedStart);
                setSelectedStart(date);
            }
        }
    };

    const handleContinueBooking = () => {
        if (selectedStart && selectedEnd) {
            const params = new URLSearchParams({
                checkIn: format(selectedStart, 'yyyy-MM-dd'),
                checkOut: format(selectedEnd, 'yyyy-MM-dd'),
                guests: '2',
            });
            router.push(`/book?${params.toString()}`);
        }
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const months = [
        currentMonth,
        addMonths(currentMonth, 1),
        addMonths(currentMonth, 2),
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-20">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block"
                    >
                        Availability
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3"
                    >
                        Plan Your Stay
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-600 font-light max-w-2xl mx-auto"
                    >
                        View our real-time availability and select your perfect dates
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Calendar Section */}
                    <div className="lg:w-3/4">
                        {/* Month Navigation */}
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={prevMonth}
                                className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={20} className="text-stone-600" />
                            </button>

                            <span className="text-sm font-medium text-stone-600">
                                {format(currentMonth, 'MMMM yyyy')} - {format(addMonths(currentMonth, 2), 'MMMM yyyy')}
                            </span>

                            <button
                                onClick={nextMonth}
                                className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                                aria-label="Next month"
                            >
                                <ChevronRight size={20} className="text-stone-600" />
                            </button>
                        </div>

                        {/* Three-Month Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                        >
                            {isLoadingDates ? (
                                // Show skeleton loaders while loading
                                <>
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                                            <div className="animate-pulse space-y-4">
                                                <div className="h-6 bg-stone-200 rounded w-1/2 mx-auto" />
                                                <div className="grid grid-cols-7 gap-2">
                                                    {Array.from({ length: 35 }).map((_, j) => (
                                                        <div key={j} className="h-10 bg-stone-200 rounded" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : fetchError ? (
                                // Show error state with retry button
                                <div className="col-span-full flex flex-col items-center justify-center py-16 px-8">
                                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8 text-[#A18058]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                    </div>
                                    <p className="text-stone-700 text-lg font-light mb-2 text-center">{fetchError}</p>
                                    <p className="text-stone-500 text-sm font-light mb-6 text-center">
                                        Our servers are experiencing a temporary delay.
                                    </p>
                                    <button
                                        onClick={() => fetchBlockedDates()}
                                        className="px-6 py-3 bg-[#A18058] text-white rounded-xl hover:bg-[#8B6A47] transition-all duration-300 text-sm font-medium tracking-wide shadow-md hover:shadow-lg"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                // Show actual calendars when loaded
                                months.map((month, index) => (
                                    <CalendarMonth
                                        key={index}
                                        month={month}
                                        selectedStart={selectedStart}
                                        selectedEnd={selectedEnd}
                                        blockedDates={blockedDates}
                                        onDateClick={handleDateClick}
                                        onHoverDate={setHoveredDate}
                                        hoveredDate={hoveredDate}
                                    />
                                ))
                            )}
                        </motion.div>

                        {/* Legend */}
                        <CalendarLegend />
                    </div>

                    {/* Pricing Summary Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="sticky top-6">
                            {selectedStart && selectedEnd ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-4"
                                >
                                    <PricingSummary
                                        pricing={pricing}
                                        checkIn={format(selectedStart, 'yyyy-MM-dd')}
                                        checkOut={format(selectedEnd, 'yyyy-MM-dd')}
                                    />

                                    <button
                                        onClick={handleContinueBooking}
                                        className="w-full bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
                                    >
                                        Continue to Booking
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <p className="text-center text-xs text-stone-600 font-light">
                                        You won't be charged yet
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-sm font-semibold uppercase tracking-widest text-[#A18058] mb-4">
                                        Select Dates
                                    </h3>
                                    <p className="text-sm text-stone-600 font-light">
                                        Click on a start date, then click on an end date to see pricing and availability.
                                    </p>
                                    <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-200">
                                        <p className="text-xs text-stone-600 font-medium">
                                            💡 Minimum stay: 2 nights
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
