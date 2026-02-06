'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { ContactInfoCard } from '@/components/ContactInfoCard';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-20">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block"
                    >
                        Contact
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl serif font-light text-stone-900 mb-3"
                    >
                        We're Here to Help
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-stone-600 font-light max-w-2xl mx-auto"
                    >
                        Whether you're planning your stay or have questions about The Obsidian, our concierge team is ready to assist you.
                    </motion.p>
                </div>

                {/* Two-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:w-3/5"
                    >
                        <ContactForm />
                    </motion.div>

                    {/* Right Column - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:w-2/5 space-y-6"
                    >
                        {/* Direct Contact */}
                        <ContactInfoCard icon={Mail} title="Direct Contact">
                            <div className="space-y-2">
                                <a
                                    href="mailto:contact@theobsidian.com"
                                    className="block text-sm text-stone-700 hover:text-[#A18058] transition-colors"
                                >
                                    contact@theobsidian.com
                                </a>
                                <a
                                    href="tel:+15551234567"
                                    className="block text-sm text-stone-700 hover:text-[#A18058] transition-colors"
                                >
                                    +1 (555) 123-4567
                                </a>
                                <p className="text-xs text-stone-500 pt-2">
                                    Available 9AM - 9PM daily
                                </p>
                            </div>
                        </ContactInfoCard>

                        {/* Location */}
                        <ContactInfoCard icon={MapPin} title="Location">
                            <div className="space-y-1">
                                <p className="text-sm text-stone-700">Hillside Retreat</p>
                                <p className="text-sm text-stone-700">Malibu, California</p>
                                <p className="text-xs text-stone-500 pt-2">
                                    Exact address shared upon booking
                                </p>
                            </div>
                        </ContactInfoCard>

                        {/* Social Media */}
                        <ContactInfoCard icon={Instagram} title="Follow Us">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <a
                                        href="https://instagram.com/theobsidian"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-stone-700 hover:text-[#A18058] transition-colors"
                                    >
                                        <Instagram size={18} />
                                        <span>Instagram</span>
                                    </a>
                                    <a
                                        href="https://facebook.com/theobsidian"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-stone-700 hover:text-[#A18058] transition-colors"
                                    >
                                        <Facebook size={18} />
                                        <span>Facebook</span>
                                    </a>
                                </div>
                                <p className="text-xs text-stone-500">
                                    @theobsidian
                                </p>
                            </div>
                        </ContactInfoCard>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
