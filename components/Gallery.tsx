'use client';

import React from 'react';
import { motion } from 'framer-motion';

const images = [
  "/images/chic-condo/imgi_141_dbb0d895.jpg",
  "/images/chic-condo/imgi_158_cd6ea3b4.jpg",
  "/images/chic-condo/imgi_196_5cfa6a5b.jpg",
  "/images/chic-condo/imgi_199_3cefc501.jpg",
  "/images/chic-condo/imgi_180_ce83dc2b.jpg",
  "/images/chic-condo/imgi_167_1e67cddc.jpg",
  "/images/chic-condo/imgi_145_533b70ac.jpg",
  "/images/chic-condo/imgi_174_14c6cb90.jpg",
  "/images/chic-condo/imgi_177_ffaea34b.jpg"
];

export const Gallery: React.FC = () => {
  return (
    <section className="bg-[#FAFAF9] pt-24 pb-24" id="gallery">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block">Visual Tour</span>
          <h2 className="text-3xl md:text-4xl serif text-stone-900 font-light">Inside the Residence</h2>
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