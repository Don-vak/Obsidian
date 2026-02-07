'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
        >
            <div className="w-12 h-12 rounded-full bg-[#A18058]/10 flex items-center justify-center mb-4">
                <Icon size={24} className="text-[#A18058]" />
            </div>
            <h3 className="text-xl serif font-medium text-stone-900 mb-2">
                {title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
};
