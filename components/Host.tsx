'use client';

import React from 'react';
import { Star, ShieldCheck, MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Host: React.FC = () => {
    return (
        <section className="bg-[#F5F5F4] pt-24 pb-24" id="host">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-stone-200">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

                        {/* Host Image */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop"
                                    alt="Amy Bream"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[#A18058] text-white p-2 rounded-full border-4 border-white shadow-md">
                                <ShieldCheck size={20} />
                            </div>
                        </motion.div>

                        {/* Host Info */}
                        <div className="text-center md:text-left flex-1">
                            <span className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-2 block">Your Host</span>
                            <h2 className="text-3xl serif text-stone-900 mb-2">Amy Bream</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-xs font-medium text-stone-600">
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="fill-[#A18058] text-[#A18058]" />
                                    <span>Premier Host</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                                <div>10/10 Communication</div>
                                <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                                <div>0% Cancellation Rate</div>
                            </div>

                            <p className="text-stone-500 font-light leading-relaxed text-sm mb-6">
                                "Top rated by travelers for reliability and guest experiences. I am dedicated to making your stay in Nashville unforgettable. From local recommendations to ensuring the condo is spotless, I'm here for you."
                            </p>

                            <div className="flex justify-center md:justify-start gap-4">
                                <button className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917] text-white px-6 py-3 rounded-full hover:bg-stone-800 transition-colors">
                                    <MessageCircle size={14} /> Contact Host
                                </button>
                                <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 px-4 py-3">
                                    <Clock size={14} /> Responds within 1 hour
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
