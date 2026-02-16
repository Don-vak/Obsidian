import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
    title: 'Admin | The Obsidian',
    description: 'Manage your property, bookings, and guests.',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#FAFAF9]">
            <AdminSidebar />
            <main className="ml-[240px] px-10 py-8">
                {children}
            </main>
        </div>
    );
}
