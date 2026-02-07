'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { FAQItem } from '@/components/FAQItem';
import { faqData } from '@/lib/data/faq';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-20">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block"
                    >
                        Frequently Asked Questions
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3"
                    >
                        Everything You Need to Know
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-600 font-light max-w-2xl mx-auto"
                    >
                        Your questions about staying at The Obsidian, answered with care.
                    </motion.p>
                </div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4 mb-16"
                >
                    {faqData.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-8 shadow-sm"
                >
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#A18058]/10 flex items-center justify-center">
                            <MessageCircle size={24} className="text-[#A18058]" />
                        </div>
                    </div>
                    <h2 className="text-2xl serif font-light text-stone-900 mb-2">
                        Still have questions?
                    </h2>
                    <p className="text-sm text-stone-600 mb-6">
                        Our concierge team is here to help
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg"
                    >
                        Contact Us
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
