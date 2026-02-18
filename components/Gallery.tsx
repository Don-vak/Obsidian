'use client';

import React from 'react';
import { motion } from 'framer-motion';

const images = [
  "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop",
  "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ed0a13b6-9910-46dd-b50a-742d26eb0221_1600w.jpg",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop"
];

export const Gallery: React.FC = () => {
  return (
    <section className="bg-[#FAFAF9] pt-24 pb-24" id="gallery">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block">Visual Tour</span>
          <h2 className="text-3xl md:text-4xl serif text-stone-900 font-light">Life at The Obsidian</h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer relative"
            >
              <img
                src={src}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={`Gallery ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 group-hover:bg-black/10 transition-colors bg-black/0"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};