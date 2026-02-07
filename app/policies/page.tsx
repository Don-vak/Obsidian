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
                        Policies & Guidelines
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3"
                    >
                        House Rules & Policies
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-600 font-light max-w-2xl mx-auto"
                    >
                        Please review our policies to ensure a seamless stay
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
                            <strong>Accepted payment methods:</strong> Credit card (Visa, Mastercard, American Express) and bank transfer.
                        </p>
                        <p>
                            Booking confirmation will be sent within 24 hours of receiving your deposit. You will receive detailed arrival instructions 24 hours before check-in.
                        </p>
                    </PolicySection>

                    {/* Cancellation */}
                    <PolicySection icon={XCircle} title="Cancellation Policy" delay={0.35}>
                        <p>We understand that plans can change. Our cancellation policy is as follows:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li><strong>30+ days before check-in:</strong> Full refund</li>
                            <li><strong>14-30 days before check-in:</strong> 50% refund</li>
                            <li><strong>Under 14 days:</strong> Non-refundable</li>
                        </ul>
                        <p>
                            We strongly recommend purchasing travel insurance for added peace of mind. In cases of force majeure or exceptional circumstances, we will work with you to find a fair solution.
                        </p>
                    </PolicySection>

                    {/* Check-In & Check-Out */}
                    <PolicySection icon={Clock} title="Check-In & Check-Out" delay={0.4}>
                        <p>
                            <strong>Check-in:</strong> 4:00 PM<br />
                            <strong>Check-out:</strong> 11:00 AM
                        </p>
                        <p>
                            We offer a seamless, contactless check-in experience with smart lock access codes sent 24 hours before arrival. Our concierge team is available to greet you personally if preferred.
                        </p>
                        <p>
                            Early check-in and late check-out may be available upon request, subject to availability. Additional fees may apply.
                        </p>
                    </PolicySection>

                    {/* House Rules */}
                    <PolicySection icon={Home} title="House Rules" delay={0.45}>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li><strong>Maximum occupancy:</strong> 8 guests</li>
                            <li><strong>Quiet hours:</strong> 10:00 PM - 8:00 AM</li>
                            <li><strong>No smoking:</strong> Anywhere on the property (including outdoor areas)</li>
                            <li><strong>No parties or events:</strong> Without prior written approval</li>
                            <li><strong>Respect for neighbors:</strong> Required at all times</li>
                            <li><strong>Proper use of amenities:</strong> Please follow all posted guidelines</li>
                        </ul>
                        <p className="mt-3">
                            We maintain our commitment to exclusivity by hosting only one party at a time, ensuring your complete privacy.
                        </p>
                    </PolicySection>

                    {/* Pet Policy */}
                    <PolicySection icon={Dog} title="Pet Policy" delay={0.5}>
                        <p>
                            We understand pets are family. <strong>Well-behaved dogs are welcome</strong> with prior approval and a <strong>$200 pet fee</strong>.
                        </p>
                        <p>
                            Please inform us during booking and provide details about your furry companion, including breed, size, and temperament. Approval is granted on a case-by-case basis.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                            <li>Pets must be supervised at all times</li>
                            <li>Not permitted on furniture or beds</li>
                            <li>Guests are responsible for any pet-related damage</li>
                            <li>Please clean up after your pet on the property</li>
                        </ul>
                    </PolicySection>

                    {/* Damage & Security */}
                    <PolicySection icon={Shield} title="Damage & Security" delay={0.55}>
                        <p>
                            A refundable <strong>security deposit of $1,000</strong> is required and will be returned within 7 days after checkout, provided there is no damage beyond normal wear and tear.
                        </p>
                        <p>
                            Please report any damage or issues immediately to our concierge team. Guests are responsible for any damages caused during their stay.
                        </p>
                        <p>
                            The property is fully insured, and we maintain comprehensive security measures for your peace of mind.
                        </p>
                    </PolicySection>

                    {/* Amenities Usage */}
                    <PolicySection icon={Sparkles} title="Amenities Usage" delay={0.6}>
                        <p><strong>Pool and Spa:</strong> Follow all safety guidelines. No glass containers near the pool. Children must be supervised at all times.</p>
                        <p><strong>Kitchen:</strong> Fully equipped gourmet kitchen. Please clean after use and dispose of waste properly.</p>
                        <p><strong>Smart Home Technology:</strong> Instructions provided in the welcome guide. Tech support available 24/7.</p>
                        <p><strong>Outdoor Areas:</strong> Please respect property boundaries and maintain the natural beauty of the surroundings.</p>
                        <p><strong>Parking:</strong> Secure parking for up to 4 vehicles in the designated area.</p>
                    </PolicySection>

                    {/* Guest Responsibilities */}
                    <PolicySection icon={ClipboardCheck} title="Guest Responsibilities" delay={0.65}>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li><strong>Property care:</strong> Treat the property with respect as you would your own home</li>
                            <li><strong>Waste disposal:</strong> Use designated bins. Recycling is encouraged</li>
                            <li><strong>Energy conservation:</strong> Turn off lights and AC when not in use</li>
                            <li><strong>Lost keys/codes:</strong> $100 replacement fee</li>
                            <li><strong>Checkout:</strong> Leave property in good condition, remove all trash, and lock all doors</li>
                        </ul>
                        <p className="mt-3">
                            Our housekeeping team will prepare the property for the next guests. Please do not strip beds or start laundry.
                        </p>
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
                        Questions about our policies?
                    </h2>
                    <p className="text-sm text-stone-600 mb-6">
                        Our concierge team is here to help clarify any details
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg"
                    >
                        Contact Us
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
