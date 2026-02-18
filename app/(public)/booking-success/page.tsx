'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Users, Mail, Phone, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PricingBreakdown } from '@/lib/mock-data/pricing';

interface BookingData {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    guestCount: number;
    pricing: PricingBreakdown;
    specialRequests?: string;
}

export default function BookingSuccessPage() {
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

    useEffect(() => {
        const data = sessionStorage.getItem('bookingData');
        if (data) {
            setBookingData(JSON.parse(data));
        }
    }, []);

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-6 py-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full text-center"
                >
                    <div className="w-24 h-24 rounded-full bg-[#1C1917] text-[#A18058] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <CheckCircle size={48} strokeWidth={1} />
                    </div>

                    <h1 className="text-4xl md:text-5xl serif text-stone-900 mb-6">Request Received</h1>
                    <p className="text-stone-500 font-light text-lg mb-10 leading-relaxed">
                        Thank you for choosing Chic Music Row Condo. Your reservation request has been securely transmitted to our concierge team.
                    </p>

                    <Link href="/" className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg hover:-translate-y-1">
                        Return to Site
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF9]">
            {/* Header */}
            <nav className="bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link href="/" className="text-xl serif font-light text-stone-900">
                        Chic Music Row Condo
                    </Link>
                </div>
            </nav>

            {/* Success Content */}
            <div className="max-w-3xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
                    >
                        <CheckCircle size={40} className="text-green-600" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl serif font-light text-stone-900 mb-4">
                        Booking Request Received!
                    </h1>
                    <p className="text-lg text-stone-600 font-light max-w-xl mx-auto">
                        Thank you for your booking request. We'll review it and send you a confirmation email shortly.
                    </p>
                    <p className="text-sm text-stone-500 mt-2">
                        Booking ID: <span className="font-mono">#{bookingData.bookingId}</span>
                    </p>
                </motion.div>

                {/* Booking Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-8 rounded-[2rem] shadow-2xl border border-white/60 mb-8"
                >
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-[#A18058] mb-6">
                        Booking Details
                    </h2>

                    <div className="space-y-6">
                        {/* Dates */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                                <Calendar size={18} className="text-[#A18058]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Dates</p>
                                <p className="text-sm font-medium text-stone-900">
                                    {new Date(bookingData.checkIn).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                    {' → '}
                                    {new Date(bookingData.checkOut).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="text-xs text-stone-500 mt-1">
                                    {bookingData.pricing.nights} {bookingData.pricing.nights === 1 ? 'night' : 'nights'}
                                </p>
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                                <Users size={18} className="text-[#A18058]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Guests</p>
                                <p className="text-sm font-medium text-stone-900">
                                    {bookingData.guestCount} {bookingData.guestCount === 1 ? 'Guest' : 'Guests'}
                                </p>
                            </div>
                        </div>

                        {/* Guest Information */}
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                                <Mail size={18} className="text-[#A18058]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Guest Information</p>
                                <p className="text-sm font-medium text-stone-900">{bookingData.guestName}</p>
                                <p className="text-xs text-stone-600 mt-1">{bookingData.guestEmail}</p>
                                <p className="text-xs text-stone-600">{bookingData.guestPhone}</p>
                            </div>
                        </div>

                        {/* Special Requests */}
                        {bookingData.specialRequests && (
                            <div className="pt-4 border-t border-stone-200">
                                <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">Special Requests</p>
                                <p className="text-sm text-stone-700">{bookingData.specialRequests}</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Pricing Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-8 rounded-[2rem] shadow-2xl border border-white/60 mb-8"
                >
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-[#A18058] mb-6">
                        Pricing Summary
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-600">
                                ${bookingData.pricing.nightlyRate} × {bookingData.pricing.nights} {bookingData.pricing.nights === 1 ? 'night' : 'nights'}
                            </span>
                            <span className="font-medium text-stone-900">
                                ${bookingData.pricing.subtotal.toFixed(2)}
                            </span>
                        </div>

                        {bookingData.pricing.discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-[#A18058]">
                                    {bookingData.pricing.nights >= 28 ? 'Monthly' : 'Weekly'} discount
                                </span>
                                <span className="font-medium text-[#A18058]">
                                    -${bookingData.pricing.discount.toFixed(2)}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between text-sm">
                            <span className="text-stone-600">Cleaning fee</span>
                            <span className="font-medium text-stone-900">
                                ${bookingData.pricing.cleaningFee.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-stone-600">Service fee</span>
                            <span className="font-medium text-stone-900">
                                ${bookingData.pricing.serviceFee.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-stone-600">Taxes</span>
                            <span className="font-medium text-stone-900">
                                ${bookingData.pricing.taxAmount.toFixed(2)}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-stone-200">
                            <div className="flex justify-between">
                                <span className="font-semibold text-stone-900">Total</span>
                                <span className="text-2xl font-semibold serif text-stone-900">
                                    ${bookingData.pricing.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-2xl bg-[#A18058]/10 border border-[#A18058]/20 mb-8"
                >
                    <h3 className="text-sm font-semibold text-[#A18058] mb-3">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-stone-700">
                        <li className="flex items-start gap-2">
                            <span className="text-[#A18058] mt-0.5">•</span>
                            <span>We'll review your booking request within 24 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#A18058] mt-0.5">•</span>
                            <span>You'll receive a confirmation email at {bookingData.guestEmail}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#A18058] mt-0.5">•</span>
                            <span>Payment instructions will be included in the confirmation</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#A18058] mt-0.5">•</span>
                            <span>Check-in details will be sent 48 hours before your arrival</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/"
                        className="flex-1 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl text-center flex items-center justify-center gap-2"
                    >
                        <Home size={16} />
                        Return Home
                    </Link>
                    <Link
                        href="/house-rules"
                        className="flex-1 bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all text-center"
                    >
                        View House Rules
                    </Link>
                </div>
            </div>
        </div>
    );
}
