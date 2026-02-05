'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BookingSuccessPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-6 py-32">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full text-center"
            >
                <div className="w-24 h-24 rounded-full bg-[#1C1917] text-[#A18058] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <CheckCircle size={48} strokeWidth={1} />
                </div>

                <h1 className="text-4xl md:text-5xl serif text-stone-900 mb-6">Request Received</h1>
                <p className="text-stone-500 font-light text-lg mb-10 leading-relaxed">
                    Thank you for choosing The Obsidian. Your reservation request has been securely transmitted to our concierge team. We will review your dates and contact you within 24 hours to finalize your stay.
                </p>

                <div className="p-6 rounded-2xl bg-white border border-stone-200 mb-10 text-left max-w-sm mx-auto shadow-sm">
                    <div className="text-[10px] uppercase tracking-widest text-[#A18058] font-semibold mb-4">What happens next?</div>
                    <ul className="space-y-3 text-sm text-stone-600 font-light">
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 shrink-0"></span>
                            Host approval of dates
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 shrink-0"></span>
                            Secure payment link sent via email
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 shrink-0"></span>
                            Check-in guide & access code delivery
                        </li>
                    </ul>
                </div>

                <Link href="/" className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg hover:-translate-y-1">
                    Return to Residence
                    <ArrowRight size={14} />
                </Link>
            </motion.div>
        </div>
    );
}
