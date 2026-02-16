'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RevenueChart } from './RevenueChart';
import { Loader2 } from 'lucide-react';

interface MonthlyRevenue {
    month: string;
    label: string;
    revenue: number;
}

const TIME_RANGES = [
    { label: 'Last 3 Months', value: 3 },
    { label: 'Last 6 Months', value: 6 },
    { label: 'Last 12 Months', value: 12 },
    { label: 'Last 24 Months', value: 24 },
];

interface RevenueAnalyticsProps {
    initialData: MonthlyRevenue[];
}

export function RevenueAnalytics({ initialData }: RevenueAnalyticsProps) {
    const [selectedRange, setSelectedRange] = useState(6);
    const [data, setData] = useState<MonthlyRevenue[]>(initialData);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (months: number) => {
        // Skip fetch for initial 6-month data (already have it)
        if (months === 6 && data === initialData) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/revenue-chart?months=${months}`);
            if (res.ok) {
                const chartData = await res.json();
                setData(chartData);
            }
        } catch (err) {
            console.error('Failed to fetch revenue data:', err);
        } finally {
            setLoading(false);
        }
    }, [initialData, data]);

    useEffect(() => {
        fetchData(selectedRange);
    }, [selectedRange]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg text-[#1C1917]">Revenue Analytics</h3>
                <div className="flex items-center gap-2">
                    {TIME_RANGES.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => setSelectedRange(range.value)}
                            className={`text-[10px] uppercase tracking-wider font-medium px-3 py-1.5 rounded-full transition-all ${selectedRange === range.value
                                    ? 'bg-[#1C1917] text-white'
                                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="h-56 flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-[#A18058]" />
                </div>
            ) : (
                <RevenueChart data={data} />
            )}
        </div>
    );
}
