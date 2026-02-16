'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    BookOpen,
    DollarSign,
    ShieldCheck,
    MessageSquare,
    Settings,
    LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Bookings', href: '/admin/bookings', icon: BookOpen },
    { label: 'Calendar', href: '/admin/calendar', icon: CalendarDays },
    { label: 'Pricing', href: '/admin/pricing', icon: DollarSign },
    { label: 'Guests', href: '/admin/guests', icon: ShieldCheck },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-stone-200 flex flex-col z-40">
            {/* Logo */}
            <div className="px-6 pt-8 pb-6">
                <h1 className="font-serif text-xl tracking-wide text-[#1C1917]">
                    THE OBSIDIAN
                </h1>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#A18058] font-medium mt-1 block">
                    Admin Dashboard
                </span>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-stone-100 mb-4" />

            {/* Navigation */}
            <nav className="flex-1 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${active
                                            ? 'bg-[#A18058]/8 text-[#1C1917] font-medium'
                                            : 'text-stone-500 hover:text-[#1C1917] hover:bg-stone-50'
                                        }`}
                                >
                                    {active && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#A18058] rounded-r-full" />
                                    )}
                                    <Icon
                                        size={18}
                                        className={
                                            active
                                                ? 'text-[#A18058]'
                                                : 'text-stone-400 group-hover:text-stone-600'
                                        }
                                    />
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="px-3 pb-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 w-full"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
