'use client';

import React, { useState } from 'react';
import { Mail, Clock, CheckCircle, Trash2, Reply } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
    status: string;
}

export function MessageList({ messages }: { messages: Message[] }) {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await fetch(`/api/admin/messages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'read' })
        });
        router.refresh();
    };

    return (
        <div className="flex bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-[600px]">
            {/* List */}
            <div className={`w-full lg:w-1/3 border-r border-stone-100 overflow-y-auto ${selectedId ? 'hidden lg:block' : ''}`}>
                {messages.length === 0 ? (
                    <div className="p-8 text-center text-stone-400 text-sm">No messages found.</div>
                ) : (
                    <div className="divide-y divide-stone-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedId(msg.id)}
                                className={`p-4 cursor-pointer transition-colors hover:bg-stone-50 ${selectedId === msg.id ? 'bg-stone-50' : ''} ${msg.status === 'new' ? 'border-l-2 border-[#A18058]' : 'border-l-2 border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm text-[#1C1917] ${msg.status === 'new' ? 'font-semibold' : 'font-medium'}`}>
                                        {msg.name}
                                    </h4>
                                    <span className="text-[10px] text-stone-400">
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-stone-600 truncate font-medium mb-1">{msg.subject}</p>
                                <p className="text-xs text-stone-400 truncate">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail */}
            <div className={`w-full lg:w-2/3 flex flex-col ${!selectedId ? 'hidden lg:flex' : ''}`}>
                {selectedId ? (
                    (() => {
                        const msg = messages.find(m => m.id === selectedId);
                        if (!msg) return null;
                        return (
                            <>
                                <div className="p-6 border-b border-stone-100 flex items-start justify-between bg-stone-50/50">
                                    <div>
                                        <button
                                            onClick={() => setSelectedId(null)}
                                            className="lg:hidden text-stone-400 mb-4 text-xs flex items-center gap-1"
                                        >
                                            ← Back to list
                                        </button>
                                        <h2 className="font-serif text-xl text-[#1C1917] mb-2">{msg.subject}</h2>
                                        <div className="flex items-center gap-2 text-sm text-stone-500">
                                            <span className="font-medium text-[#1C1917]">{msg.name}</span>
                                            <span className="text-stone-300">&lt;{msg.email}&gt;</span>
                                        </div>
                                        <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(msg.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {msg.status === 'new' && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(msg.id, e)}
                                                className="p-2 rounded-full border border-stone-200 text-stone-500 hover:text-[#A18058] hover:bg-white transition-colors"
                                                title="Mark as Read"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                            className="p-2 rounded-full bg-[#1C1917] text-white hover:bg-[#2C2926] transition-colors"
                                            title="Reply via Email"
                                        >
                                            <Reply size={18} />
                                        </a>
                                    </div>
                                </div>
                                <div className="p-8 overflow-y-auto flex-1 text-stone-700 leading-relaxed text-sm whitespace-pre-wrap">
                                    {msg.message}
                                </div>
                            </>
                        );
                    })()
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-stone-300 p-8">
                        <Mail size={48} className="mb-4 opacity-50" />
                        <p className="text-sm">Select a message to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
