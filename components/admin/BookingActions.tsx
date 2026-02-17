'use client';

import React, { useState } from 'react';
import { Send, X, Loader2, CheckCircle, AlertCircle, MessageSquare, Reply } from 'lucide-react';

interface BookingActionsProps {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    specialRequests?: string;
}

export function BookingActions({ bookingId, guestName, guestEmail, specialRequests }: BookingActionsProps) {
    const [showModal, setShowModal] = useState(false);
    const [messageType, setMessageType] = useState<'general' | 'special_request_reply'>('general');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const openModal = (type: 'general' | 'special_request_reply') => {
        setMessageType(type);
        setSubject('');
        setMessage('');
        setStatus('idle');
        setErrorMsg('');
        setShowModal(true);
    };

    const closeModal = () => {
        if (!sending) {
            setShowModal(false);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        setSending(true);
        setStatus('idle');
        setErrorMsg('');

        try {
            const res = await fetch(`/api/admin/bookings/${bookingId}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: subject.trim() || undefined,
                    message: message.trim(),
                    type: messageType,
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setStatus('success');
            setTimeout(() => {
                setShowModal(false);
                setStatus('idle');
            }, 2500);

        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {/* Action Buttons */}
            <div className="flex gap-3">
                <button className="px-4 py-2 rounded-full border border-stone-200 text-xs uppercase tracking-wider font-medium hover:bg-stone-50 transition-colors">
                    Edit Booking
                </button>
                <button
                    onClick={() => openModal('general')}
                    className="px-4 py-2 rounded-full bg-[#1C1917] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#2C2926] transition-colors flex items-center gap-2"
                >
                    <Send size={13} />
                    Send Message
                </button>
            </div>

            {/* Special Request Reply Button — rendered separately via portal-like approach */}
            {specialRequests && (
                <div id="special-request-reply" className="hidden">
                    {/* This is injected into the special requests section */}
                </div>
            )}

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-serif text-xl text-[#1C1917] mb-1">
                                        {messageType === 'special_request_reply'
                                            ? 'Reply to Special Request'
                                            : 'Send Message to Guest'}
                                    </h3>
                                    <p className="text-xs text-stone-500">
                                        Sending to <strong className="text-stone-700">{guestName}</strong>
                                        <span className="text-stone-400 ml-1">&lt;{guestEmail}&gt;</span>
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Success State */}
                        {status === 'success' ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                                    <CheckCircle size={32} className="text-green-500" />
                                </div>
                                <h4 className="font-serif text-lg text-[#1C1917] mb-1">Message Sent!</h4>
                                <p className="text-sm text-stone-500">Email delivered to {guestEmail}</p>
                            </div>
                        ) : (
                            <>
                                {/* Modal Body */}
                                <div className="p-6 space-y-4">
                                    {/* Special Request Quote */}
                                    {messageType === 'special_request_reply' && specialRequests && (
                                        <div className="bg-stone-50 border border-stone-100 rounded-xl p-4">
                                            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Guest&apos;s Special Request</p>
                                            <p className="text-sm text-stone-600 italic leading-relaxed">{specialRequests}</p>
                                        </div>
                                    )}

                                    {/* Subject (optional for general, pre-filled for special request) */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5">
                                            Subject <span className="normal-case tracking-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder={messageType === 'special_request_reply'
                                                ? 'Regarding Your Special Request'
                                                : 'Message from The Obsidian'}
                                            className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-[#A18058] focus:ring-1 focus:ring-[#A18058]/20 placeholder:text-stone-400"
                                        />
                                    </div>

                                    {/* Message Body */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5">
                                            Message
                                        </label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your message here..."
                                            rows={5}
                                            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 resize-none focus:outline-none focus:border-[#A18058] focus:ring-1 focus:ring-[#A18058]/20 placeholder:text-stone-400 leading-relaxed"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                                            <AlertCircle size={16} className="flex-shrink-0" />
                                            <span>{errorMsg}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                <div className="p-6 pt-0 flex items-center justify-end gap-3">
                                    <button
                                        onClick={closeModal}
                                        disabled={sending}
                                        className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={sending || !message.trim()}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-medium hover:bg-[#2C2926] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {sending ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                        {sending ? 'Sending...' : 'Send Email'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

/** Small inline button for special request reply — placed next to the special requests section */
export function SpecialRequestReplyButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#A18058] hover:text-[#8B6D48] font-medium transition-colors"
        >
            <Reply size={13} />
            Reply to request
        </button>
    );
}
