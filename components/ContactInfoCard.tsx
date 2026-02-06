import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ContactInfoCardProps {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon: Icon, title, children }) => {
    return (
        <div className="bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#A18058]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#A18058]" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[#A18058]">
                    {title}
                </h3>
            </div>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );
};
