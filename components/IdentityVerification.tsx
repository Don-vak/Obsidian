'use client';

import React, { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Shield, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface IdentityVerificationProps {
    guestName: string;
    guestEmail: string;
    onVerified: (sessionId: string) => void;
    onError: (error: string) => void;
}

type VerificationStatus = 'idle' | 'loading' | 'verifying' | 'verified' | 'failed';

export function IdentityVerification({ guestName, guestEmail, onVerified, onError }: IdentityVerificationProps) {
    const [status, setStatus] = useState<VerificationStatus>('idle');
    const [sessionId, setSessionId] = useState<string>('');

    const startVerification = useCallback(async () => {
        setStatus('loading');

        try {
            // Create verification session on the backend
            const response = await fetch('/api/create-verification-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestName,
                    guestEmail,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create verification session');
            }

            setSessionId(data.sessionId);

            // Load Stripe and open the verification modal
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe failed to load');
            }

            setStatus('verifying');

            const result = await stripe.verifyIdentity(data.clientSecret);

            if (result.error) {
                // User closed the modal or verification failed
                if (result.error.code === 'session_cancelled') {
                    setStatus('idle');
                    return;
                }
                throw new Error(result.error.message || 'Verification failed');
            }

            // Verification submitted successfully (may still be processing)
            setStatus('verified');
            onVerified(data.sessionId);

        } catch (error: any) {
            console.error('Verification error:', error);
            setStatus('failed');
            onError(error.message || 'Identity verification failed');
        }
    }, [guestName, guestEmail, onVerified, onError]);

    return (
        <div className="space-y-6">
            {/* Explanation Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-50 to-[#A18058]/5 border border-stone-200">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#A18058]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield size={20} className="text-[#A18058]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-stone-900 mb-1">
                            Identity Verification Required
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                            For the safety of our property and guests, we require identity verification before completing your booking.
                            This is a quick, secure process powered by Stripe — your information is never stored on our servers.
                        </p>
                    </div>
                </div>
            </div>

            {/* What's Needed */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#A18058] mb-4">
                    What You'll Need
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-semibold text-stone-600">1</div>
                        <span className="text-sm text-stone-700">A valid government-issued ID (passport, driver's license, or national ID)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-semibold text-stone-600">2</div>
                        <span className="text-sm text-stone-700">A quick selfie to confirm your identity</span>
                    </div>
                </div>
            </div>

            {/* Status Display */}
            {status === 'verified' && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-green-900">Identity Verified</p>
                        <p className="text-xs text-green-700">Your identity has been confirmed. You may proceed to payment.</p>
                    </div>
                </div>
            )}

            {status === 'failed' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                    <XCircle size={20} className="text-red-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-red-900">Verification Failed</p>
                        <p className="text-xs text-red-700">
                            We couldn't verify your identity. Please try again or contact us for assistance.
                        </p>
                    </div>
                </div>
            )}

            {/* Action Button */}
            {status !== 'verified' && (
                <button
                    type="button"
                    onClick={startVerification}
                    disabled={status === 'loading' || status === 'verifying'}
                    className={`w-full py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group ${status === 'loading' || status === 'verifying'
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : status === 'failed'
                                ? 'bg-[#A18058] hover:bg-[#8B6D4A] text-white cursor-pointer'
                                : 'bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] cursor-pointer'
                        }`}
                >
                    {status === 'loading' && (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Preparing Verification...
                        </>
                    )}
                    {status === 'verifying' && (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Verifying...
                        </>
                    )}
                    {status === 'idle' && (
                        <>
                            <Shield size={16} />
                            Verify My Identity
                        </>
                    )}
                    {status === 'failed' && (
                        <>
                            <AlertTriangle size={16} />
                            Try Again
                        </>
                    )}
                </button>
            )}

            {/* Privacy Notice */}
            <div className="text-center">
                <p className="text-[10px] text-stone-400 leading-relaxed">
                    🔒 Powered by Stripe Identity. Your documents are processed securely and never stored on our servers.
                    <br />
                    Stripe's privacy policy applies. Verification typically takes less than 60 seconds.
                </p>
            </div>
        </div>
    );
}
