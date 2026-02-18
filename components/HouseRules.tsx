'use client';

import React from 'react';
import { Clock, Users, Calendar, Ban, Cigarette, Dog } from 'lucide-react';

export const HouseRules: React.FC = () => {
    const rules = [
        { icon: Clock, label: "Check-in after 4:00 PM", sub: "Checkout before 11:00 AM" },
        { icon: Users, label: "Minimum age: 21", sub: "Children allowed (0-17)" },
        { icon: Ban, label: "No events allowed", sub: "Strict no-party policy" },
        { icon: Cigarette, label: "No smoking", sub: "Smoking is not permitted" },
        { icon: Dog, label: "Pets allowed", sub: "Pet fee applies" },
        { icon: Calendar, label: "Cancellation Policy", sub: "Non-refundable" } // Simplified based on listing
    ];

    return (
        <section className="bg-white pt-24 pb-24 border-t border-stone-100" id="rules">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block">Policy</span>
                    <h2 className="text-3xl md:text-4xl serif text-stone-900 font-light">House Rules</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {rules.map((rule, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FAFAF9] border border-stone-100 hover:border-[#A18058]/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#A18058] mb-4">
                                <rule.icon size={20} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-sm font-semibold text-stone-900 mb-1">{rule.label}</h3>
                            <p className="text-xs text-stone-500 font-light">{rule.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-stone-400 max-w-2xl mx-auto border-t border-stone-100 pt-8">
                        By booking, you agree to comply with all house rules. Security deposit may be retained for violations (e.g. smoking, parties, damage).
                    </p>
                </div>
            </div>
        </section>
    );
};
