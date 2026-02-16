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
    const avgRevenue = data.filter(d => d.revenue > 0).length > 0
        ? totalRevenue / data.filter(d => d.revenue > 0).length
        : 0;

    // Chart height in pixels for precise control
    const CHART_HEIGHT = 220;

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
            <div className="flex gap-3">
                {/* Y-axis labels */}
                <div className="flex flex-col justify-between text-[10px] text-stone-400 pr-1 py-1" style={{ height: CHART_HEIGHT }}>
                    <span>${maxRevenue >= 1000 ? `${(maxRevenue / 1000).toFixed(1)}k` : maxRevenue.toLocaleString()}</span>
                    <span>${maxRevenue >= 1000 ? `${(maxRevenue / 2000).toFixed(1)}k` : Math.round(maxRevenue / 2).toLocaleString()}</span>
                    <span>$0</span>
                </div>

                {/* Bars */}
                <div className="flex-1 flex items-end gap-2 border-b border-l border-stone-100 pl-2 pb-0" style={{ height: CHART_HEIGHT }}>
                    {data.map((item, index) => {
                        const isHovered = hoveredIndex === index;
                        const hasRevenue = item.revenue > 0;

                        // Calculate bar height in pixels — $0 gets 0px, non-zero scales proportionally
                        const barHeight = hasRevenue
                            ? Math.max((item.revenue / maxRevenue) * (CHART_HEIGHT - 30), 20)
                            : 0;

                        return (
                            <div
                                key={item.month}
                                className="flex-1 flex flex-col items-center justify-end relative group cursor-pointer"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Tooltip */}
                                {isHovered && (
                                    <div className="absolute -top-10 bg-[#1C1917] text-white text-[10px] px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10 pointer-events-none">
                                        <span className="font-semibold">${item.revenue.toLocaleString()}</span>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1C1917]" />
                                    </div>
                                )}

                                {/* Bar */}
                                {hasRevenue ? (
                                    <div
                                        className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${isHovered
                                                ? 'bg-[#A18058] shadow-md shadow-[#A18058]/20'
                                                : 'bg-gradient-to-t from-[#A18058]/70 to-[#A18058]/40'
                                            }`}
                                        style={{ height: barHeight }}
                                    />
                                ) : (
                                    <div className={`w-full max-w-[48px] h-[2px] rounded ${isHovered ? 'bg-stone-300' : 'bg-stone-200'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Month Labels */}
            <div className="flex gap-2 ml-12">
                {data.map((item, index) => (
                    <div key={item.month} className="flex-1 text-center">
                        <span className={`text-[10px] font-medium transition-colors ${hoveredIndex === index
                                ? 'text-[#A18058]'
                                : item.revenue > 0
                                    ? 'text-[#1C1917]'
                                    : 'text-stone-400'
                            }`}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
