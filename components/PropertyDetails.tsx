'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const PropertyDetails: React.FC = () => {
  return (
    <section className="bg-[#FAFAF9] pt-24 pb-24" id="residence">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-x-16 gap-y-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <span className="text-[10px] uppercase block font-semibold text-[#A18058] tracking-[0.2em] mb-4">The Residence</span>
            <h2 className="text-4xl lg:text-5xl mb-8 serif leading-tight tracking-tight text-stone-900 font-light">
              Your Backstage Pass <br />
              <span className="text-stone-500 italic">to Nashville.</span>
            </h2>
            <div className="space-y-6 text-stone-500 text-sm font-light leading-relaxed max-w-md">
              <p>
                Luxury condo with <strong>free garage parking</strong> connected to this new, secure building. Incredible amenities including a pool, massive rooftop deck with city views, gym, and conference room.
              </p>
              <p>
                Located on legendary <strong>Music Row</strong>, walk past recording studios on your way to coffee & live music. Only 2 miles to Downtown Broadway bars and 0.5 miles to Belmont & Vanderbilt. Furnished with thoughtful, high-end decor for maximum comfort.
              </p>
            </div>

            <div className="mt-10 flex gap-8 border-t pt-8 border-stone-200">
              <div>
                <div className="text-2xl serif mb-1 text-stone-900">8</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400">Sleeps</div>
              </div>
              <div>
                <div className="text-2xl serif mb-1 text-stone-900">2</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400">Bedrooms</div>
              </div>
              <div>
                <div className="text-2xl serif mb-1 text-stone-900">Prime</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400">Location</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <img src="/images/chic-condo/imgi_160_ab16be7b.jpg" className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-1000" alt="Chic Condo Exterior" />
              {/* Floating Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 left-8 backdrop-blur-md p-4 rounded-xl border shadow-lg max-w-[200px] bg-white/90 border-white"
              >
                <div className="flex gap-1 text-[#A18058] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-[#A18058]" />
                  ))}
                </div>
                <p className="text-[10px] leading-relaxed font-medium text-stone-600">"10/10 Loved by Guests. Top 10% of guest reviews in this area."</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};