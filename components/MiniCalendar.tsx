'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay, isWithinInterval } from 'date-fns';
import Link from 'next/link';
import { mockBlockedDates } from '@/lib/mock-data/availability';

export const MiniCalendar: React.FC = () => {
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    const currentMonth = new Date();
    const nextMonth = addMonths(currentMonth, 1);

    const months = [currentMonth, nextMonth];

    const isDateBlocked = (date: Date): boolean => {
        return mockBlockedDates.some(blocked => {
            const blockStart = new Date(blocked.start);
            const blockEnd = new Date(blocked.end);
            return isWithinInterval(date, { start: blockStart, end: blockEnd });
        });
    };

    const getDateClassName = (date: Date): string => {
        const isPast = isBefore(date, startOfDay(new Date()));
        const blocked = isDateBlocked(date);
        const isCurrentDay = isToday(date);

        let className = 'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ';

        if (isPast) {
            className += 'text-stone-300';
        } else if (blocked) {
            className += 'bg-stone-200/50 text-stone-400';
        } else {
            className += 'text-stone-700 hover:bg-[#A18058]/10 hover:text-[#A18058] cursor-pointer';
        }

        if (isCurrentDay && !blocked) {
            className += ' ring-1 ring-[#A18058]';
        }

        return className;
    };

    const renderMonth = (month: Date) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const startDay = monthStart.getDay();
        const paddingDays = Array(startDay).fill(null);
        const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        return (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl p-5">
                <h4 className="text-base serif font-light text-stone-900 mb-4 text-center">
                    {format(month, 'MMMM yyyy')}
                </h4>

                {/* Weekday Labels */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day, index) => (
                        <div
                            key={index}
                            className="text-center text-[9px] font-semibold text-[#A18058] uppercase tracking-wider"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Date Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {paddingDays.map((_, index) => (
                        <div key={`pad-${index}`} className="w-8 h-8" />
                    ))}
                    {days.map((date, index) => (
                        <div
                            key={index}
                            className={getDateClassName(date)}
                            onMouseEnter={() => setHoveredDate(date)}
                            onMouseLeave={() => setHoveredDate(null)}
                        >
                            {format(date, 'd')}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section className="bg-stone-50 py-24" id="availability">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block"
                    >
                        Availability
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl serif font-light text-stone-900 mb-3"
                    >
                        Check Availability
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-600 font-light max-w-2xl mx-auto"
                    >
                        View our upcoming availability at a glance
                    </motion.p>
                </div>

                {/* Two-Month Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                    {months.map((month, index) => (
                        <div key={index}>
                            {renderMonth(month)}
                        </div>
                    ))}
                </motion.div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-white border border-stone-300" />
                        <span className="text-xs text-stone-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-stone-200" />
                        <span className="text-xs text-stone-600">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-white border border-[#A18058]" />
                        <span className="text-xs text-stone-600">Today</span>
                    </div>
                </div>

                {/* CTA to Full Calendar */}
                <div className="text-center">
                    <Link
                        href="/availability"
                        className="inline-flex items-center gap-2 text-sm text-[#A18058] hover:text-[#8a6a47] font-medium transition-colors group"
                    >
                        View full calendar
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
