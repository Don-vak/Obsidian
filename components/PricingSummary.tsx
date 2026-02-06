'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PricingBreakdown } from '@/lib/mock-data/pricing';

interface PricingSummaryProps {
    pricing: PricingBreakdown | null;
    checkIn: string;
    checkOut: string;
}

export const PricingSummary: React.FC<PricingSummaryProps> = ({ pricing, checkIn, checkOut }) => {
    return (
        <div className="glass-panel p-6 rounded-[2rem] shadow-2xl border border-white/60">
            {/* Property Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
                <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2606&auto=format&fit=crop"
                    alt="The Obsidian"
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Pricing Header */}
            <div className="mb-6 pb-6 border-b border-stone-200/60">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-medium serif text-stone-900">$850</span>
                    <span className="text-sm text-stone-600">/ night</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-stone-500">Minimum 2 nights</span>
                </div>
            </div>

            {/* Pricing Breakdown */}
            {pricing ? (
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-600">
                            ${pricing.nightlyRate} × {pricing.nights} {pricing.nights === 1 ? 'night' : 'nights'}
                        </span>
                        <span className="font-medium text-stone-900">
                            ${pricing.subtotal.toFixed(2)}
                        </span>
                    </div>

                    {pricing.discount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-[#A18058]">
                                {pricing.nights >= 28 ? 'Monthly' : 'Weekly'} discount
                            </span>
                            <span className="font-medium text-[#A18058]">
                                -${pricing.discount.toFixed(2)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm">
                        <span className="text-stone-600">Cleaning fee</span>
                        <span className="font-medium text-stone-900">
                            ${pricing.cleaningFee.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-stone-600">Service fee (10%)</span>
                        <span className="font-medium text-stone-900">
                            ${pricing.serviceFee.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-stone-600">Taxes (8%)</span>
                        <span className="font-medium text-stone-900">
                            ${pricing.taxAmount.toFixed(2)}
                        </span>
                    </div>

                    <div className="pt-3 border-t border-stone-200">
                        <div className="flex justify-between">
                            <span className="font-semibold text-stone-900">Total</span>
                            <span className="text-xl font-semibold serif text-stone-900">
                                ${pricing.total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-8 text-center">
                    <p className="text-sm text-stone-500">
                        Select dates to see pricing
                    </p>
                </div>
            )}
        </div>
    );
};
