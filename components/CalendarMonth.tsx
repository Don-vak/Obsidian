import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfDay, isWithinInterval, addMonths, subMonths } from 'date-fns';

interface CalendarMonthProps {
    month: Date;
    selectedStart: Date | null;
    selectedEnd: Date | null;
    blockedDates: Array<{ start: string; end: string; reason: string }>;
    onDateClick: (date: Date) => void;
    onHoverDate: (date: Date | null) => void;
    hoveredDate: Date | null;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
    month,
    selectedStart,
    selectedEnd,
    blockedDates,
    onDateClick,
    onHoverDate,
    hoveredDate,
}) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const startDate = monthStart;
    const endDate = monthEnd;

    // Get all days in the month
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Pad the beginning to start on Sunday
    const startDay = monthStart.getDay();
    const paddingDays = Array(startDay).fill(null);

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const isDateBlocked = (date: Date): boolean => {
        return blockedDates.some(blocked => {
            const blockStart = new Date(blocked.start);
            const blockEnd = new Date(blocked.end);
            return isWithinInterval(date, { start: blockStart, end: blockEnd });
        });
    };

    const isDateSelected = (date: Date): boolean => {
        if (!selectedStart) return false;
        if (!selectedEnd) return isSameDay(date, selectedStart);
        return isWithinInterval(date, { start: selectedStart, end: selectedEnd });
    };

    const isDateInHoverRange = (date: Date): boolean => {
        if (!selectedStart || !hoveredDate || selectedEnd) return false;
        const start = selectedStart < hoveredDate ? selectedStart : hoveredDate;
        const end = selectedStart < hoveredDate ? hoveredDate : selectedStart;
        return isWithinInterval(date, { start, end });
    };

    const handleDateClick = (date: Date) => {
        if (isBefore(date, startOfDay(new Date())) || isDateBlocked(date)) return;
        onDateClick(date);
    };

    const getDateClassName = (date: Date): string => {
        const isPast = isBefore(date, startOfDay(new Date()));
        const blocked = isDateBlocked(date);
        const selected = isDateSelected(date);
        const inHoverRange = isDateInHoverRange(date);
        const isCurrentDay = isToday(date);

        let className = 'relative w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 ';

        if (isPast) {
            className += 'bg-stone-100 text-stone-300 cursor-not-allowed';
        } else if (blocked) {
            className += 'bg-stone-200 text-stone-400 cursor-not-allowed line-through';
        } else if (selected) {
            className += 'bg-[#A18058] text-white shadow-md';
        } else if (inHoverRange) {
            className += 'bg-[#A18058]/20 text-stone-900';
        } else {
            className += 'bg-white text-stone-900 hover:border-[#A18058] border border-stone-200 cursor-pointer hover:shadow-sm';
        }

        if (isCurrentDay && !selected) {
            className += ' ring-2 ring-[#A18058] ring-offset-2';
        }

        return className;
    };

    return (
        <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-6 shadow-sm">
            {/* Month Header */}
            <h3 className="text-xl serif font-light text-stone-900 mb-6 text-center">
                {format(month, 'MMMM yyyy')}
            </h3>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-2 mb-3">
                {weekDays.map((day, index) => (
                    <div
                        key={index}
                        className="text-center text-[10px] font-semibold text-[#A18058] uppercase tracking-widest"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Padding days */}
                {paddingDays.map((_, index) => (
                    <div key={`pad-${index}`} className="w-10 h-10" />
                ))}

                {/* Actual days */}
                {days.map((date, index) => (
                    <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        onMouseEnter={() => onHoverDate(date)}
                        onMouseLeave={() => onHoverDate(null)}
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
