'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PolicySectionProps {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
    delay?: number;
}

export const PolicySection: React.FC<PolicySectionProps> = ({ icon: Icon, title, children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-6 shadow-sm"
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#A18058]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#A18058]" />
                </div>
                <h2 className="text-xl serif font-medium text-stone-900 pt-1">
                    {title}
                </h2>
            </div>
            <div className="text-sm text-stone-600 leading-relaxed space-y-3">
                {children}
            </div>
        </motion.div>
    );
};
