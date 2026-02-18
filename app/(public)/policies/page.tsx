'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CreditCard, XCircle, Clock, Home, Dog, Shield, Sparkles, ClipboardCheck, MessageCircle } from 'lucide-react';
import { PolicySection } from '@/components/PolicySection';

export default function PoliciesPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-20">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block"
                    >
                        House Rules
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3"
                    >
                        Policies & Guidelines
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-600 font-light max-w-2xl mx-auto"
                    >
                        Please review our policies to ensure a seamless stay in Music City.
                    </motion.p>
                </div>

                {/* Policy Sections */}
                <div className="space-y-6 mb-16">
                    {/* Booking & Payment */}
                    <PolicySection icon={CreditCard} title="Booking & Payment Policy" delay={0.3}>
                        <p>
                            A <strong>50% deposit</strong> is required to secure your reservation. The remaining 50% is due 14 days before check-in.
                        </p>
                        <p>
                            <strong>Accepted payment methods:</strong> Credit card (Visa, Mastercard, American Express).
                        </p>
                    </PolicySection>

                    {/* Cancellation */}
                    <PolicySection icon={XCircle} title="Cancellation Policy" delay={0.35}>
                        <p>We understand that plans can change. Our cancellation policy is:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li><strong>30+ days before check-in:</strong> Full refund</li>
                            <li><strong>14-30 days before check-in:</strong> 50% refund</li>
                            <li><strong>Under 14 days:</strong> Non-refundable</li>
                        </ul>
                    </PolicySection>

                    {/* Check-In & Check-Out */}
                    <PolicySection icon={Clock} title="Check-In & Check-Out" delay={0.4}>
                        <p>
                            <strong>Check-in:</strong> 4:00 PM<br />
                            <strong>Check-out:</strong> 11:00 AM
                        </p>
                        <p>
                            We offer a seamless, contactless check-in experience. You will receive a unique access code for the building and condo unit 24 hours before arrival.
                        </p>
                    </PolicySection>

                    {/* House Rules */}
                    <PolicySection icon={Home} title="House Rules" delay={0.45}>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li><strong>Minimum Age:</strong> Primary renter must be 21+</li>
                            <li><strong>Maximum occupancy:</strong> 8 guests</li>
                            <li><strong>Quiet hours:</strong> 10:00 PM - 8:00 AM (Strictly enforced by building management)</li>
                            <li><strong>No smoking:</strong> Anywhere in the condo or on the balcony ($250 fine)</li>
                            <li><strong>No parties or events:</strong> Immediate eviction without refund</li>
                        </ul>
                    </PolicySection>

                    {/* Pet Policy */}
                    <PolicySection icon={Dog} title="Pet Policy" delay={0.5}>
                        <p>
                            We love pets! <strong>Dogs are welcome</strong> with prior approval and a pet fee.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                            <li>Please inform us about your pet when booking</li>
                            <li>Pets must not be left unattended on the balcony</li>
                            <li>Please clean up after your pet</li>
                        </ul>
                    </PolicySection>

                    {/* Damage & Security */}
                    <PolicySection icon={Shield} title="Damage & Security" delay={0.55}>
                        <p>
                            A refundable <strong>security deposit hold of $500</strong> is placed on your card 1 day before arrival and released 3 days after checkout, provided there is no damage.
                        </p>
                    </PolicySection>

                    {/* Amenities Usage */}
                    <PolicySection icon={Sparkles} title="Amenities Usage" delay={0.6}>
                        <p><strong>Pool:</strong> Seasonal (Memorial Day to Labor Day). Open 9 AM - 10 PM.</p>
                        <p><strong>Gym:</strong> Open 24/7. Located on the 2nd floor.</p>
                        <p><strong>Parking:</strong> One free spot in the attached garage. Key fob provided at check-in.</p>
                        <p><strong>Rooftop Lounge:</strong> Open until 11 PM. Please respect other residents.</p>
                    </PolicySection>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-center bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-8 shadow-sm"
                >
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#A18058]/10 flex items-center justify-center">
                            <MessageCircle size={24} className="text-[#A18058]" />
                        </div>
                    </div>
                    <h2 className="text-2xl serif font-light text-stone-900 mb-2">
                        Questions?
                    </h2>
                    <p className="text-sm text-stone-600 mb-6">
                        Amy is here to help clarify any details
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg"
                    >
                        Contact Host
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
