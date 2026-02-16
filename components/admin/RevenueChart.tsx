'use client';

import React, { useState } from 'react';

interface MonthlyRevenue {
    month: string;
    label: string;
    revenue: number;
}

interface RevenueChartProps {
    data: MonthlyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (!data || data.length === 0) {
        return (
            <div className="h-56 flex items-center justify-center bg-stone-50 rounded-xl border border-stone-100 border-dashed">
                <p className="text-stone-400 text-sm">No revenue data yet</p>
            </div>
        );
    }

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
    const avgRevenue = totalRevenue / data.length;

    // Generate Y-axis labels
    const yLabels = [0, Math.round(maxRevenue * 0.25), Math.round(maxRevenue * 0.5), Math.round(maxRevenue * 0.75), Math.round(maxRevenue)];

    return (
        <div className="space-y-4">
            {/* Summary Row */}
            <div className="flex items-center gap-6 text-xs">
                <div>
                    <span className="text-stone-400">Total</span>
                    <span className="ml-2 font-semibold text-[#1C1917]">${totalRevenue.toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-stone-400">Avg/Month</span>
                    <span className="ml-2 font-semibold text-[#1C1917]">${Math.round(avgRevenue).toLocaleString()}</span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative flex items-end gap-1.5 h-56 pt-6 pb-8">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-6 bottom-8 w-12 flex flex-col justify-between text-[10px] text-stone-400 pointer-events-none">
                    {[...yLabels].reverse().map((val, i) => (
                        <span key={i} className="text-right pr-2">${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}</span>
                    ))}
                </div>

                {/* Average line */}
                <div
                    className="absolute left-12 right-0 border-t border-dashed border-[#A18058]/30 pointer-events-none"
                    style={{ bottom: `${(avgRevenue / maxRevenue) * 100 * 0.85 + 15}%` }}
                >
                    <span className="absolute -top-3 right-0 text-[9px] text-[#A18058] bg-white px-1">avg</span>
                </div>

                {/* Bars */}
                <div className="flex items-end gap-2 flex-1 ml-12 h-full">
                    {data.map((item, index) => {
                        const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 85 : 0;
                        const isHovered = hoveredIndex === index;

                        return (
                            <div
                                key={item.month}
                                className="flex-1 flex flex-col items-center relative group"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Tooltip */}
                                {isHovered && (
                                    <div className="absolute -top-8 bg-[#1C1917] text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10 pointer-events-none">
                                        ${item.revenue.toLocaleString()}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1C1917]" />
                                    </div>
                                )}

                                {/* Bar */}
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer min-h-[4px] ${isHovered
                                            ? 'bg-[#A18058]'
                                            : 'bg-gradient-to-t from-[#A18058]/60 to-[#A18058]/30'
                                        }`}
                                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                                />

                                {/* Month Label */}
                                <span className={`text-[10px] mt-2 transition-colors ${isHovered ? 'text-[#A18058] font-semibold' : 'text-stone-400'
                                    }`}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
