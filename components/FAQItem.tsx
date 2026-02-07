'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 hover:border-[#A18058]/30"
        >
            <button
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
            >
                <h3 className="text-lg serif font-medium text-stone-900 pr-4 group-hover:text-[#A18058] transition-colors">
                    {question}
                </h3>
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#A18058]">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-6 pb-5 pt-2">
                            <p className="text-sm text-stone-600 leading-relaxed">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
