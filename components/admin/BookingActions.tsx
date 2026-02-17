'use client';

import React, { useState } from 'react';
import { Send, X, Loader2, CheckCircle, AlertCircle, MessageSquare, Reply, Shield, ShieldCheck, ShieldX, DollarSign } from 'lucide-react';

interface BookingActionsProps {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    specialRequests?: string;
}

interface DepositManagerProps {
    bookingId: string;
    guestName: string;
    depositStatus: string;
    depositAmount: number;
    depositCapturedAmount?: number;
    depositUpdatedAt?: string;
}

export function DepositManager({
    bookingId,
    guestName,
    depositStatus: initialStatus,
    depositAmount,
    depositCapturedAmount,
    depositUpdatedAt,
}: DepositManagerProps) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [showCaptureInput, setShowCaptureInput] = useState(false);
    const [captureAmount, setCaptureAmount] = useState(depositAmount.toString());
    const [confirmAction, setConfirmAction] = useState<'release' | 'capture' | null>(null);
    const [captured, setCaptured] = useState(depositCapturedAmount || 0);

    const handleAction = async (action: 'release' | 'capture') => {
        setLoading(true);
        setActionResult(null);
        setConfirmAction(null);

        try {
            const body: any = { action };
            if (action === 'capture' && captureAmount) {
                body.amount = parseFloat(captureAmount);
            }

            const res = await fetch(`/api/admin/bookings/${bookingId}/deposit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${action} deposit`);
            }

            setStatus(data.depositStatus);
            if (data.capturedAmount) setCaptured(data.capturedAmount);
            setActionResult({ type: 'success', message: data.message });
            setShowCaptureInput(false);
        } catch (err: any) {
            setActionResult({ type: 'error', message: err.message || 'Operation failed' });
        } finally {
            setLoading(false);
        }
    };

    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
        none: { label: 'No Deposit', color: 'text-stone-500', icon: <Shield size={16} />, bg: 'bg-stone-50 border-stone-200' },
        held: { label: 'Hold Active', color: 'text-amber-700', icon: <Shield size={16} className="text-amber-600" />, bg: 'bg-amber-50 border-amber-200' },
        released: { label: 'Released', color: 'text-green-700', icon: <ShieldCheck size={16} className="text-green-600" />, bg: 'bg-green-50 border-green-200' },
        captured: { label: 'Captured', color: 'text-red-700', icon: <ShieldX size={16} className="text-red-600" />, bg: 'bg-red-50 border-red-200' },
        failed: { label: 'Hold Failed', color: 'text-stone-500', icon: <AlertCircle size={16} className="text-stone-400" />, bg: 'bg-stone-50 border-stone-200' },
    };

    const config = statusConfig[status] || statusConfig.none;

    if (status === 'none') return null;

    return (
        <div className="p-6 rounded-2xl bg-white border border-stone-200">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#A18058] mb-4 flex items-center gap-2">
                <DollarSign size={14} />
                Security Deposit
            </h3>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${config.bg} ${config.color} mb-4`}>
                {config.icon}
                {config.label}
                {status === 'held' && <span className="text-amber-500">• ${depositAmount.toLocaleString()}</span>}
                {status === 'captured' && <span className="text-red-500">• ${captured.toLocaleString()} charged</span>}
            </div>

            {depositUpdatedAt && (
                <p className="text-xs text-stone-400 mb-4">
                    Last updated: {new Date(depositUpdatedAt).toLocaleString()}
                </p>
            )}

            {/* Action Result */}
            {actionResult && (
                <div className={`mb-4 p-3 rounded-xl border text-sm flex items-center gap-2 ${actionResult.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                    {actionResult.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {actionResult.message}
                </div>
            )}

            {/* Actions (only show when deposit is held) */}
            {status === 'held' && (
                <div className="space-y-3">
                    {/* Confirmation Dialog */}
                    {confirmAction && (
                        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                            <p className="text-sm text-stone-700 mb-3">
                                {confirmAction === 'release'
                                    ? `Release the $${depositAmount.toLocaleString()} hold? ${guestName} will NOT be charged.`
                                    : `Capture $${parseFloat(captureAmount).toLocaleString()} from ${guestName}'s deposit? This WILL charge their card.`}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction(confirmAction)}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-full text-xs font-medium text-white flex items-center gap-1.5 ${confirmAction === 'release'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                        } disabled:opacity-50`}
                                >
                                    {loading && <Loader2 size={13} className="animate-spin" />}
                                    {confirmAction === 'release' ? 'Yes, Release' : 'Yes, Capture'}
                                </button>
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-full text-xs font-medium border border-stone-200 hover:bg-stone-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {!confirmAction && (
                        <div className="flex flex-wrap gap-2">
                            {/* Release Button */}
                            <button
                                onClick={() => setConfirmAction('release')}
                                className="px-4 py-2 rounded-full border border-green-200 text-green-700 text-xs font-medium hover:bg-green-50 transition-colors flex items-center gap-1.5"
                            >
                                <ShieldCheck size={13} />
                                Release Hold
                            </button>

                            {/* Capture Button */}
                            {showCaptureInput ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-stone-200 rounded-full overflow-hidden">
                                        <span className="pl-3 text-xs text-stone-500">$</span>
                                        <input
                                            type="number"
                                            value={captureAmount}
                                            onChange={(e) => setCaptureAmount(e.target.value)}
                                            max={depositAmount}
                                            min={1}
                                            step="0.01"
                                            className="w-24 px-2 py-2 text-xs border-none outline-none bg-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setConfirmAction('capture')}
                                        disabled={!captureAmount || parseFloat(captureAmount) <= 0}
                                        className="px-4 py-2 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        Capture
                                    </button>
                                    <button
                                        onClick={() => setShowCaptureInput(false)}
                                        className="p-2 rounded-full hover:bg-stone-100 text-stone-400"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowCaptureInput(true)}
                                    className="px-4 py-2 rounded-full border border-red-200 text-red-700 text-xs font-medium hover:bg-red-50 transition-colors flex items-center gap-1.5"
                                >
                                    <ShieldX size={13} />
                                    Capture for Damages
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
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
