'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Eye, Palette, Home, Building2, Mountain, Shield } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-stone-800 to-stone-900 overflow-hidden">
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-stone-900/70 z-10" />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-7xl serif font-light text-white mb-4"
                    >
                        The Obsidian
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-24 h-0.5 bg-[#A18058] mb-6"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl md:text-2xl text-stone-200 font-light"
                    >
                        A Sanctuary of Modern Luxury
                    </motion.p>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block"
                >
                    Our Story
                </motion.span>

                <div className="grid md:grid-cols-5 gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2"
                    >
                        <h2 className="text-4xl md:text-5xl serif font-light text-stone-900 mb-6">
                            Where Architecture Meets Nature
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-3 bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-8 shadow-sm"
                    >
                        <p className="text-base text-stone-700 leading-relaxed mb-4">
                            Perched atop the Malibu hills, The Obsidian is more than a residence—it is an architectural masterpiece where contemporary design harmonizes with the raw beauty of nature. Floor-to-ceiling windows frame breathtaking ocean vistas, while curated interiors by renowned designers create an atmosphere of refined elegance.
                        </p>
                        <p className="text-base text-stone-700 leading-relaxed mb-4">
                            Every detail has been thoughtfully considered, from the hand-selected furnishings to the seamless integration of smart home technology. Our vision was to create a space that feels both exclusive and welcoming, where luxury is experienced through simplicity and sophistication.
                        </p>
                        <blockquote className="border-l-2 border-[#A18058] pl-4 italic text-[#A18058] text-lg">
                            "A retreat designed for those who appreciate the finer things in life."
                        </blockquote>
                    </motion.div>
                </div>
            </div>

            {/* The Property Section */}
            <div className="bg-white/50 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block text-center"
                    >
                        The Property
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl serif font-light text-stone-900 mb-12 text-center"
                    >
                        Designed for Distinction
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Building2}
                            title="Architectural Excellence"
                            description="Modern design featuring floor-to-ceiling windows, clean lines, and seamless indoor-outdoor living spaces."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Eye}
                            title="Breathtaking Views"
                            description="Panoramic ocean and hillside vistas from every room, offering stunning sunsets and natural beauty."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Palette}
                            title="Curated Interiors"
                            description="Designer furnishings, original artwork, and premium finishes create an atmosphere of refined luxury."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="Exclusive Amenities"
                            description="Private infinity pool, in-home spa, gourmet kitchen, and state-of-the-art entertainment systems."
                            delay={0.5}
                        />
                    </div>
                </div>
            </div>

            {/* The Experience Section */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block text-center"
                >
                    The Experience
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl serif font-light text-stone-900 mb-6 text-center"
                >
                    Designed for Unforgettable Moments
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-stone-600 text-center max-w-3xl mx-auto mb-12"
                >
                    Whether you're seeking a peaceful retreat, celebrating a special occasion, or creating lasting memories with loved ones, The Obsidian provides the perfect backdrop. Our commitment to privacy, exceptional service, and attention to detail ensures that every stay is extraordinary.
                </motion.p>

                {/* Values */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#A18058]/10 flex items-center justify-center mx-auto mb-4">
                            <Shield size={28} className="text-[#A18058]" />
                        </div>
                        <h3 className="text-xl serif font-medium text-stone-900 mb-2">Privacy & Exclusivity</h3>
                        <p className="text-sm text-stone-600">Your sanctuary, exclusively yours. We host only one party at a time.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#A18058]/10 flex items-center justify-center mx-auto mb-4">
                            <Home size={28} className="text-[#A18058]" />
                        </div>
                        <h3 className="text-xl serif font-medium text-stone-900 mb-2">Exceptional Service</h3>
                        <p className="text-sm text-stone-600">24/7 concierge support to ensure every detail of your stay is perfect.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#A18058]/10 flex items-center justify-center mx-auto mb-4">
                            <Mountain size={28} className="text-[#A18058]" />
                        </div>
                        <h3 className="text-xl serif font-medium text-stone-900 mb-2">Sustainable Luxury</h3>
                        <p className="text-sm text-stone-600">Thoughtfully designed to minimize environmental impact while maximizing comfort.</p>
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-stone-900 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl serif font-light text-white mb-6"
                    >
                        Ready to Experience The Obsidian?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-stone-300 mb-8"
                    >
                        Discover your perfect dates and begin planning your luxury escape.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            href="/availability"
                            className="inline-flex items-center gap-2 bg-[#A18058] hover:bg-[#8a6a47] text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all shadow-lg"
                        >
                            View Availability
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
