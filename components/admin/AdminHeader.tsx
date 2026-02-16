'use client';

import React from 'react';

export function AdminHeader() {
    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h2 className="font-serif text-2xl text-[#1C1917]">
                    {greeting}
                </h2>
                <p className="text-sm text-stone-400 mt-1">{dateStr}</p>
            </div>
        </header>
    );
}
