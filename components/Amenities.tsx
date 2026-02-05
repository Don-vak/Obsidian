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

          {/* Large Feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 relative group rounded-[2rem] overflow-hidden border shadow-sm bg-white border-stone-200"
          >
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Pool" />
            <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/60"></div>
            <div className="absolute bottom-0 p-8 text-white">
              <div className="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center mb-4 border bg-white/20 border-white/20">
                <Waves size={20} />
              </div>
              <h3 className="text-xl serif italic mb-2">Infinity Edge Pool</h3>
              <p className="text-xs font-light max-w-xs text-stone-200">Heated saline pool overlooking the valley, featuring automated cover and night lighting.</p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-1 md:row-span-1 rounded-[2rem] p-6 border shadow-sm flex flex-col justify-between hover:border-[#A18058]/30 transition-colors group bg-white border-stone-200"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center group-hover:bg-[#1C1917] group-hover:text-white transition-colors text-stone-900">
              <ChefHat size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg mb-2 serif text-stone-900">Chef's Kitchen</h3>
              <p className="text-stone-500 text-[11px] leading-relaxed">Wolf & Sub-Zero appliances, espresso bar, and curated wine fridge.</p>
            </div>
          </motion.div>

          {/* Feature 3 */}
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
              <h3 className="text-lg mb-2 serif text-stone-900">Cinema Room</h3>
              <p className="text-stone-500 text-[11px] leading-relaxed">4K projection, Sonos Arc surround sound, and Apple TV integration.</p>
            </div>
          </motion.div>

          {/* Wide Feature */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-1 bg-[#1C1917] rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center border border-stone-800"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#A18058]/20 to-transparent"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl text-[#FAFAF9] mb-2 serif italic">Wellness Suite</h3>
                <p className="text-xs font-light max-w-xs mb-4 text-stone-400">Private sauna and cold plunge circuit on the lower deck.</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[#A18058] text-[10px] uppercase tracking-widest font-semibold">
                    <CheckCircle size={10} /> Sauna
                  </div>
                  <div className="flex items-center gap-2 text-[#A18058] text-[10px] uppercase tracking-widest font-semibold">
                    <CheckCircle size={10} /> Yoga Deck
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border flex items-center justify-center border-stone-700 text-white">
                <Leaf size={22} strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};