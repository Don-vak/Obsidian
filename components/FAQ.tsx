'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { FAQItem } from '@/components/FAQItem';
import { faqData } from '@/lib/data/faq';

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-[#FAFAF9] pt-24 pb-24 border-t border-stone-200" id="faq">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block"
                    >
                        Common Questions
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl serif font-light text-stone-900 mb-3"
                    >
                        Everything You Need to Know
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-600 font-light max-w-2xl mx-auto"
                    >
                        Your questions about staying at the Chic Music Row Condo, answered.
                    </motion.p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4 mb-16">
                    {faqData.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center bg-white border border-stone-200 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto"
                >
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#A18058]/10 flex items-center justify-center">
                            <MessageCircle size={24} className="text-[#A18058]" />
                        </div>
                    </div>
                    <h3 className="text-xl serif font-light text-stone-900 mb-2">
                        Still have questions?
                    </h3>
                    <p className="text-sm text-stone-600 mb-6">
                        Amy is here to help make your stay perfect.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg"
                    >
                        Contact Host
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
