'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Loader2, Shield } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
    clientSecret: string;
    onSuccess: (paymentIntentId: string, paymentMethodId: string) => void;
    onError: (error: string) => void;
    totalAmount: number;
}

function CheckoutForm({ onSuccess, onError, totalAmount }: Omit<PaymentFormProps, 'clientSecret'>) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [isElementReady, setIsElementReady] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || !isElementReady) {
            return;
        }

        setIsProcessing(true);
        setPaymentStatus('processing');

        try {
            // Submit the form elements first to ensure they're validated
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setPaymentStatus('failed');
                onError(submitError.message || 'Validation failed');
                setIsProcessing(false);
                return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/booking-success`,
                },
                redirect: 'if_required',
            });

            if (error) {
                setPaymentStatus('failed');
                onError(error.message || 'Payment failed');
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                setPaymentStatus('paid');
                const pmId = typeof paymentIntent.payment_method === 'string'
                    ? paymentIntent.payment_method
                    : paymentIntent.payment_method?.id || '';
                onSuccess(paymentIntent.id, pmId);
            }
        } catch (err) {
            setPaymentStatus('failed');
            onError('An unexpected error occurred. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Status Indicator */}
            {paymentStatus && (
                <div className={`p-4 rounded-xl border ${paymentStatus === 'processing' ? 'bg-blue-50 border-blue-200' :
                    paymentStatus === 'paid' ? 'bg-green-50 border-green-200' :
                        'bg-red-50 border-red-200'
                    }`}>
                    <p className={`text-sm font-medium ${paymentStatus === 'processing' ? 'text-blue-900' :
                        paymentStatus === 'paid' ? 'text-green-900' :
                            'text-red-900'
                        }`}>
                        {paymentStatus === 'processing' && '⏳ Processing your payment...'}
                        {paymentStatus === 'paid' && '✅ Payment successful!'}
                        {paymentStatus === 'failed' && '❌ Payment failed. Please try again.'}
                    </p>
                </div>
            )}

            {/* Stripe Payment Element */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 relative">
                {/* Loading overlay until element is ready */}
                {!isElementReady && (
                    <div className="absolute inset-0 bg-stone-50 rounded-2xl flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-[#A18058]" size={24} />
                            <p className="text-sm text-stone-500 font-light">Loading payment form...</p>
                        </div>
                    </div>
                )}
                <PaymentElement
                    onReady={() => setIsElementReady(true)}
                    options={React.useMemo(() => ({
                        layout: 'tabs' as const,
                    }), [])}
                />
            </div>

            {/* Payment Button */}
            <button
                type="submit"
                disabled={!stripe || !isElementReady || isProcessing}
                className={`w-full py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${!stripe || !isElementReady || isProcessing
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] cursor-pointer'
                    }`}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        Processing Payment...
                    </>
                ) : !isElementReady ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        Loading...
                    </>
                ) : (
                    <>Pay ${totalAmount.toFixed(2)}</>
                )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 font-light">
                <Shield size={14} className="text-[#A18058]" />
                <span>Secure payment powered by Stripe</span>
            </div>
        </form>
    );
}

export function StripePaymentForm({ clientSecret, onSuccess, onError, totalAmount }: PaymentFormProps) {
    const options = React.useMemo(() => ({
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#A18058',
                colorBackground: '#ffffff',
                colorText: '#1C1917',
                colorDanger: '#ef4444',
                fontFamily: 'system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '12px',
            },
        },
    }), [clientSecret]);

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm onSuccess={onSuccess} onError={onError} totalAmount={totalAmount} />
        </Elements>
    );
}
