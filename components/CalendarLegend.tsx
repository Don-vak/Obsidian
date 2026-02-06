import React from 'react';
import { Check, X, Circle } from 'lucide-react';

export const CalendarLegend: React.FC = () => {
    return (
        <div className="flex items-center justify-center gap-8 py-6">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white border border-stone-200" />
                <span className="text-xs text-stone-600">Available</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-stone-200" />
                <span className="text-xs text-stone-600">Booked</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#A18058]" />
                <span className="text-xs text-stone-600">Selected</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white border-2 border-[#A18058]" />
                <span className="text-xs text-stone-600">Today</span>
            </div>
        </div>
    );
};
