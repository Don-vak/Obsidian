'use client';

import React, { useState } from 'react';
import { Mail, Clock, CheckCircle, Reply, Send, X, MessageSquare, Loader2, ArrowLeft, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
    status: string;
    admin_reply?: string;
    replied_at?: string;
}

export function MessageList({ messages }: { messages: Message[] }) {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await fetch(`/api/admin/messages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'read' })
        });
        router.refresh();
    };

    const handleSendReply = async (messageId: string) => {
        if (!replyText.trim()) return;

        setSending(true);
        setSendStatus('idle');
        setErrorMessage('');

        try {
            const res = await fetch(`/api/admin/messages/${messageId}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ replyMessage: replyText })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send reply');
            }

            setSendStatus('success');
            setReplyText('');
            setShowReplyForm(false);

            // Refresh to update the message status
            setTimeout(() => {
                setSendStatus('idle');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            setSendStatus('error');
            setErrorMessage(err.message || 'Failed to send reply');
        } finally {
            setSending(false);
        }
    };

    const openReplyForm = () => {
        setShowReplyForm(true);
        setReplyText('');
        setSendStatus('idle');
        setErrorMessage('');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] uppercase font-bold tracking-wider border border-blue-100">
                        New
                    </span>
                );
            case 'read':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-50 text-stone-500 text-[10px] uppercase font-bold tracking-wider border border-stone-200">
                        Read
                    </span>
                );
            case 'responded':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] uppercase font-bold tracking-wider border border-green-100">
                        <CheckCheck size={10} />
                        Replied
                    </span>
                );
            case 'archived':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-50 text-stone-400 text-[10px] uppercase font-bold tracking-wider border border-stone-100">
                        Archived
                    </span>
                );
            default:
                return null;
        }
    };

    const selectedMsg = messages.find(m => m.id === selectedId);

    return (
        <div className="flex bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-[650px]">
            {/* Message List Panel */}
            <div className={`w-full lg:w-[360px] border-r border-stone-100 overflow-y-auto flex-shrink-0 ${selectedId ? 'hidden lg:block' : ''}`}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8">
                        <Mail size={40} className="mb-3 opacity-40" />
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="text-xs mt-1">Messages from guests will appear here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-stone-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => {
                                    setSelectedId(msg.id);
                                    setShowReplyForm(false);
                                    setSendStatus('idle');
                                }}
                                className={`p-4 cursor-pointer transition-all hover:bg-stone-50 ${selectedId === msg.id ? 'bg-stone-50 border-l-2 border-[#A18058]' : 'border-l-2 border-transparent'
                                    } ${msg.status === 'new' ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1.5">
                                    <h4 className={`text-sm text-[#1C1917] truncate pr-2 ${msg.status === 'new' ? 'font-semibold' : 'font-medium'}`}>
                                        {msg.name}
                                    </h4>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {getStatusBadge(msg.status)}
                                        <span className="text-[10px] text-stone-400">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-stone-600 truncate font-medium mb-1">{msg.subject}</p>
                                <p className="text-xs text-stone-400 truncate">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Detail Panel */}
            <div className={`w-full lg:flex-1 flex flex-col ${!selectedId ? 'hidden lg:flex' : ''}`}>
                {selectedMsg ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-stone-100 flex items-start justify-between bg-stone-50/50">
                            <div className="flex-1 min-w-0">
                                <button
                                    onClick={() => { setSelectedId(null); setShowReplyForm(false); }}
                                    className="lg:hidden text-stone-400 mb-4 text-xs flex items-center gap-1 hover:text-stone-600"
                                >
                                    <ArrowLeft size={12} /> Back to list
                                </button>
                                <div className="flex items-center gap-2 mb-2">
                                    <h2 className="font-serif text-xl text-[#1C1917]">{selectedMsg.subject}</h2>
                                    {getStatusBadge(selectedMsg.status)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-stone-500">
                                    <span className="font-medium text-[#1C1917]">{selectedMsg.name}</span>
                                    <span className="text-stone-300">&lt;{selectedMsg.email}&gt;</span>
                                </div>
                                <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(selectedMsg.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0 ml-4">
                                {selectedMsg.status === 'new' && (
                                    <button
                                        onClick={(e) => handleMarkAsRead(selectedMsg.id, e)}
                                        className="p-2 rounded-full border border-stone-200 text-stone-500 hover:text-[#A18058] hover:border-[#A18058] hover:bg-white transition-colors"
                                        title="Mark as Read"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={openReplyForm}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1917] text-white hover:bg-[#2C2926] transition-colors text-xs font-medium"
                                    title="Reply via Email"
                                >
                                    <Reply size={14} />
                                    Reply
                                </button>
                            </div>
                        </div>

                        {/* Message Body */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Original message */}
                            <div className="p-8 text-stone-700 leading-relaxed text-sm whitespace-pre-wrap">
                                {selectedMsg.message}
                            </div>

                            {/* Previous reply (if responded) */}
                            {selectedMsg.status === 'responded' && selectedMsg.admin_reply && (
                                <div className="mx-8 mb-6 bg-green-50/50 border border-green-100 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCheck size={14} className="text-green-600" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-green-700">Your Reply</span>
                                        {selectedMsg.replied_at && (
                                            <span className="text-[10px] text-green-500 ml-auto">
                                                {new Date(selectedMsg.replied_at).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-green-900 leading-relaxed whitespace-pre-wrap">
                                        {selectedMsg.admin_reply}
                                    </p>
                                </div>
                            )}

                            {/* Success toast */}
                            {sendStatus === 'success' && (
                                <div className="mx-8 mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                    <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Reply sent successfully!</p>
                                        <p className="text-xs text-green-600">Email delivered to {selectedMsg.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reply Form */}
                        {showReplyForm && (
                            <div className="border-t border-stone-200 bg-stone-50/50 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-xs text-stone-500">
                                        <MessageSquare size={13} />
                                        <span>Replying to <strong className="text-stone-700">{selectedMsg.name}</strong></span>
                                        <span className="text-stone-300">&lt;{selectedMsg.email}&gt;</span>
                                    </div>
                                    <button
                                        onClick={() => setShowReplyForm(false)}
                                        className="text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here..."
                                    rows={4}
                                    className="w-full p-4 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 resize-none focus:outline-none focus:border-[#A18058] focus:ring-1 focus:ring-[#A18058]/20 placeholder:text-stone-400 leading-relaxed"
                                    autoFocus
                                />

                                {sendStatus === 'error' && (
                                    <p className="text-xs text-red-500 mt-2">{errorMessage}</p>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-[10px] text-stone-400">
                                        Email will be sent from The Obsidian to {selectedMsg.email}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowReplyForm(false)}
                                            className="px-4 py-2 rounded-full border border-stone-200 text-stone-500 text-xs font-medium hover:bg-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSendReply(selectedMsg.id)}
                                            disabled={sending || !replyText.trim()}
                                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1C1917] text-white text-xs font-medium hover:bg-[#2C2926] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {sending ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Send size={14} />
                                            )}
                                            {sending ? 'Sending...' : 'Send Reply'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-stone-300 p-8">
                        <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center mb-4">
                            <Mail size={32} className="opacity-40" />
                        </div>
                        <p className="text-sm font-medium text-stone-400 mb-1">Select a message</p>
                        <p className="text-xs text-stone-300">Click on a message to view details and reply</p>
                    </div>
                )}
            </div>
        </div>
    );
}
