'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Save, Calculator, RefreshCw } from 'lucide-react';

export function PricingForm() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [config, setConfig] = useState({
        baseRate: 450,
        cleaningFee: 150,
        serviceFeePercent: 12,
        taxPercent: 10
    });

    const [calculator, setCalculator] = useState({
        nights: 3,
        guests: 2
    });

    useEffect(() => {
        fetch('/api/admin/pricing')
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch('/api/admin/pricing', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            // Show success toast?
        } finally {
            setSaving(false);
        }
    };

    const calculateTotal = () => {
        const nightsCost = config.baseRate * calculator.nights;
        const cleaning = config.cleaningFee;
        const service = (nightsCost + cleaning) * (config.serviceFeePercent / 100);
        const taxes = (nightsCost + cleaning + service) * (config.taxPercent / 100);
        return {
            subtotal: nightsCost,
            cleaning,
            service,
            taxes,
            total: nightsCost + cleaning + service + taxes
        };
    };

    const totals = calculateTotal();

    if (loading) return <div className="p-8 text-center text-stone-400">Loading settings...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 h-fit">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-lg text-[#1C1917]">Base Configuration</h3>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1C1917] text-white rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#2C2926] disabled:opacity-50 transition-all"
                    >
                        {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">Base Nightly Rate</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                            <input
                                name="baseRate"
                                type="number"
                                value={config.baseRate}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058]"
                            />
                        </div>
                        <p className="text-xs text-stone-400 mt-1">Default rate per night before seasonal adjustments.</p>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">Cleaning Fee</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                            <input
                                name="cleaningFee"
                                type="number"
                                value={config.cleaningFee}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058]"
                            />
                        </div>
                        <p className="text-xs text-stone-400 mt-1">One-time fee per booking.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">Service Fee</label>
                            <div className="relative">
                                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                                <input
                                    name="serviceFeePercent"
                                    type="number"
                                    value={config.serviceFeePercent}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-8 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">Tax Rate</label>
                            <div className="relative">
                                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                                <input
                                    name="taxPercent"
                                    type="number"
                                    value={config.taxPercent}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-8 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#A18058]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Price Preview Calculator */}
            <div className="space-y-6">
                <div className="bg-[#A18058] rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                        <Calculator size={20} className="text-white/80" />
                        <h3 className="font-serif text-lg">Price Preview</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/60 block mb-2">Nights</label>
                            <input
                                type="number"
                                value={calculator.nights}
                                onChange={(e) => setCalculator(prev => ({ ...prev, nights: Number(e.target.value) }))}
                                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:bg-white/20"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/60 block mb-2">Guests</label>
                            <input
                                type="number"
                                value={calculator.guests}
                                onChange={(e) => setCalculator(prev => ({ ...prev, guests: Number(e.target.value) }))}
                                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:bg-white/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/20">
                        <div className="flex justify-between text-sm text-white/80">
                            <span>{calculator.nights} nights x ${config.baseRate}</span>
                            <span>${totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white/80">
                            <span>Cleaning Fee</span>
                            <span>${totals.cleaning.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white/80">
                            <span>Service Fee ({config.serviceFeePercent}%)</span>
                            <span>${totals.service.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-white/80">
                            <span>Taxes ({config.taxPercent}%)</span>
                            <span>${totals.taxes.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-serif font-medium pt-3 border-t border-white/20">
                            <span>Total</span>
                            <span>${totals.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 opacity-60">
                    <h3 className="font-serif text-lg text-[#1C1917] mb-2">Seasonal Adjustments</h3>
                    <p className="text-sm text-stone-400">Seasonal pricing features coming in Phase 2.</p>
                </div>
            </div>
        </div>
    );
}
