'use client';

import React from 'react';
import { Waves, ChefHat, Armchair, Leaf, CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const Amenities: React.FC = () => {
  return (
    <section className="bg-[#F5F5F4] pt-24 pb-24" id="amenities">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 md:flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg"
          >
            <span className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block">Elevated Living</span>
            <h2 className="text-3xl md:text-4xl serif leading-tight text-stone-900">Curated Amenities</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <a href="#" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider border-b pb-1 transition-all text-stone-900 border-stone-300 hover:border-stone-900">
              Download House Guide
              <Download size={14} />
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">

          {/* Large Feature - Pool */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 relative group rounded-[2rem] overflow-hidden border shadow-sm bg-white border-stone-200"
          >
            <img src="/images/chic-condo/imgi_143_df529aa6.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Pool" />
            <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/60"></div>
            <div className="absolute bottom-0 p-8 text-white">
              <div className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center mb-4 border bg-white/20 border-white/20">
                <Waves size={20} />
              </div>
              <h3 className="text-xl serif italic mb-2">Seasonal Pool</h3>
              <p className="text-xs font-light max-w-xs text-stone-200">Relax at the pool deck with city views. A perfect urban oasis.</p>
            </div>
          </motion.div>

          {/* Feature 2 - Gym */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-1 md:row-span-1 rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between hover:border-[#A18058]/30 transition-colors group bg-white border-stone-200"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center group-hover:bg-[#1C1917] group-hover:text-white transition-colors text-stone-900">
              <CheckCircle size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg mb-2 serif text-stone-900">Full Gym</h3>
              <p className="text-stone-500 text-[11px] leading-relaxed">Treadmills, ellipticals, rower, stationary bike, and free weights.</p>
            </div>
          </motion.div>

          {/* Feature 3 - Parking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-1 md:row-span-1 rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between hover:border-[#A18058]/30 transition-colors group bg-white border-stone-200"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center group-hover:bg-[#1C1917] group-hover:text-white transition-colors text-stone-900">
              <Armchair size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg mb-2 serif text-stone-900">Garage Parking</h3>
              <p className="text-stone-500 text-[11px] leading-relaxed">Secure garage parking connected to the building. A rare find!</p>
            </div>
          </motion.div>

          {/* Wide Feature - Rooftop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-1 bg-[#1C1917] rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center border border-stone-800"
          >
            <img src="/images/chic-condo/imgi_176_7aae0f6c.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 block" alt="Rooftop" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent mix-blend-multiply"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl text-[#FAFAF9] mb-2 serif italic">Rooftop Sky Lounge</h3>
                <p className="text-xs font-light max-w-xs mb-4 text-stone-300">Massive rooftop deck with outdoor seating, pool table, and kitchen.</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[#A18058] text-[10px] uppercase tracking-widest font-semibold">
                    <CheckCircle size={10} /> City Views
                  </div>
                  <div className="flex items-center gap-2 text-[#A18058] text-[10px] uppercase tracking-widest font-semibold">
                    <CheckCircle size={10} /> Lounge
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border flex items-center justify-center border-stone-700 text-white backdrop-blur-sm bg-black/20">
                <Leaf size={22} strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};