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
            <span className="text-[10px] uppercase block font-semibold text-[#A18058] tracking-[0.2em] mb-4">The Property</span>
            <h2 className="text-4xl lg:text-5xl mb-8 serif leading-tight tracking-tight text-stone-900 font-light">
              Designed for the <br />
              <span className="text-stone-500 italic">discerning traveler.</span>
            </h2>
            <div className="space-y-6 text-stone-500 text-sm font-light leading-relaxed max-w-md">
              <p>
                Nestled on a private ridge, The Obsidian is more than a vacation rental; it is a curated experience of modern luxury. Constructed with sustainable materials and seamlessly integrated into the landscape, the residence blurs the line between indoor comfort and outdoor majesty.
              </p>
              <p>
                Whether you are seeking a creative retreat or a romantic getaway, the silence here is broken only by the wind in the pines. Every detail, from the linen sheets to the locally sourced ceramics, has been chosen with intention.
              </p>
            </div>

            <div className="mt-10 flex gap-8 border-t pt-8 border-stone-200">
              <div>
                <div className="text-2xl serif mb-1 text-stone-900">3,200</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400">Square Feet</div>
              </div>
              <div>
                <div className="text-2xl serif mb-1 text-stone-900">2.5</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400">Acres</div>
              </div>
              <div>
                <div className="text-2xl serif mb-1 text-stone-900">2023</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-400">Built</div>
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
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2606&auto=format&fit=crop" className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-1000" alt="Exterior" />
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
                <p className="text-[10px] leading-relaxed font-medium text-stone-600">"The most stunning property we have ever stayed at. A true masterpiece."</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};