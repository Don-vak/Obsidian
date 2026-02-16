import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-[#A18058]/10 rounded-xl">
                    <Icon className="text-[#A18058]" size={22} />
                </div>
                {trend && (
                    <span className="text-[10px] uppercase tracking-wider font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="font-serif text-3xl text-[#1C1917] mb-1">{value}</h3>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#A18058] font-medium">
                {label}
            </p>
        </div>
    );
}
