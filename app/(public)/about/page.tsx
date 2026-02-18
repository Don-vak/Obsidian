'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Music, MapPin, Home } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] bg-stone-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/chic-condo/imgi_126_e25a74e5.jpg"
                        alt="Music Row Skyline"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-stone-900/80 z-10" />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl serif font-light text-white mb-4"
                    >
                        Chic Music Row Condo
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
                        Luxury Living in the Heart of Nashville
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
                    The Location
                </motion.span>

                <div className="grid md:grid-cols-5 gap-8 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2"
                    >
                        <h2 className="text-4xl md:text-5xl serif font-light text-stone-900 mb-6">
                            Where Music History Meets Modern Luxury
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-3 bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl p-8 shadow-sm"
                    >
                        <p className="text-base text-stone-700 leading-relaxed mb-4">
                            Situated directly on legendary Music Row, our condo immerses you in the rhythm of Nashville. You are just steps away from the historic studios where icons like Elvis and Dolly Parton recorded their hits. This isn't just a place to stay; it's a front-row seat to music history.
                        </p>
                        <p className="text-base text-stone-700 leading-relaxed mb-4">
                            Beyond the history, you'll find every modern convenience. From the rooftop sky lounge with panoramic city views to the resort-style pool and state-of-the-art gym, we've designed this space to be your ultimate urban retreat. Walk to Vanderbilt, Belmont, or take a quick ride to the honky-tonks on Broadway.
                        </p>
                        <blockquote className="border-l-2 border-[#A18058] pl-4 italic text-[#A18058] text-lg">
                            "The perfect blend of excitement and relaxation, right in the heart of Music City."
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
                        Amenities
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl serif font-light text-stone-900 mb-12 text-center"
                    >
                        Everything You Need
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Music}
                            title="Music Row Location"
                            description="Walk to historic studios, Vanderbilt University, and Belmont. Minutes from Broadway."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="Rooftop Sky Lounge"
                            description="Relax with stunning views of the Nashville skyline from the massive rooftop deck."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Home}
                            title="Full Gym & Pool"
                            description="Stay active with our state-of-the-art fitness center and seasonal outdoor pool."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={MapPin}
                            title="Free Garage Parking"
                            description="Rare for the area: secure, covered parking included with your stay."
                            delay={0.5}
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#1C1917] py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl serif font-light text-white mb-6"
                    >
                        Ready for Your Nashville Getaway?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-stone-300 mb-8"
                    >
                        Book your dates today and experience the best of Music City.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            href="/#book"
                            className="inline-flex items-center gap-2 bg-[#A18058] hover:bg-[#8a6a47] text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all shadow-lg"
                        >
                            Book Now
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
