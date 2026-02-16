'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Volume2, Cigarette, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HouseRulesPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const rules = [
        { icon: Clock, title: "Check-in & Check-out", desc: "Check-in is from 4:00 PM. Check-out is by 11:00 AM. Early check-in or late check-out may be available upon request." },
        { icon: Volume2, title: "Quiet Hours", desc: "To respect our neighbors and the serenity of the canyon, quiet hours are strictly enforced between 10:00 PM and 8:00 AM." },
        { icon: Cigarette, title: "No Smoking", desc: "The Obsidian is a non-smoking property. This includes outdoor decks and pool areas due to high fire risk in the hills." },
        { icon: Shield, title: "Occupancy", desc: "Maximum occupancy is 4 guests. No unregistered guests or parties are permitted without prior written approval." },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#A18058] text-xs font-medium uppercase tracking-widest mb-12 transition-colors">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-6xl serif text-stone-900 mb-6">House Rules</h1>
                    <p className="text-lg text-stone-500 font-light mb-16 max-w-2xl leading-relaxed">
                        We have crafted these guidelines to ensure every guest enjoys a flawless experience while maintaining the integrity of our home and the surrounding nature.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {rules.map((rule, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-[#A18058] mb-6">
                                <rule.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl serif text-stone-900 mb-3">{rule.title}</h3>
                            <p className="text-stone-500 text-sm font-light leading-relaxed">{rule.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-[#1C1917] rounded-3xl text-stone-400 font-light text-sm leading-relaxed flex flex-col md:flex-row gap-8 items-center justify-between">
                    <p className="max-w-xl">
                        By confirming a reservation at The Obsidian, you agree to abide by these rules. Failure to comply may result in immediate cancellation of your stay without refund.
                    </p>
                    <span className="text-[#A18058] font-serif italic text-lg whitespace-nowrap">The Obsidian Mgmt.</span>
                </div>
            </div>
        </div>
    );
}
