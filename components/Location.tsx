'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Car } from 'lucide-react';

export const Location: React.FC = () => {
  return (
    <section id="location" className="relative py-24 bg-[#1C1917] overflow-hidden">
      {/* Background Map Image (Simulated) */}
      <div className="absolute inset-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop"
          alt="Map Background"
          className="w-full h-full object-cover grayscale invert contrast-125"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917] via-[#1C1917]/80 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-5/12"
          >
            <span className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block">The Location</span>
            <h2 className="text-4xl md:text-5xl serif leading-tight text-[#FAFAF9] mb-6">
              Steps from <br />
              <span className="text-stone-500 italic">History.</span>
            </h2>
            <p className="text-stone-400 font-light leading-relaxed mb-8">
              Located on legendary Music Row, you are walking distance to Vanderbilt, Belmont, and historic recording studios. Enjoy a quiet escape that is just a short ride to the energy of Broadway.
            </p>

            <div className="space-y-6">
              {[
                { label: "Vanderbilt University", time: "3 min walk", icon: MapPin },
                { label: "Broadway Bars", time: "5 min drive", icon: Car },
                { label: "BNA Airport", time: "15 min drive", icon: Navigation },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-stone-300 group">
                  <div className="w-10 h-10 rounded-full border border-stone-700 bg-stone-800/50 flex items-center justify-center text-[#A18058] group-hover:bg-[#A18058] group-hover:text-white transition-all">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#FAFAF9]">{item.label}</div>
                    <div className="text-xs text-stone-500">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-7/12 w-full h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden border border-stone-700 shadow-2xl relative group"
          >
            {/* Interactive Map Visual */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.715220361521!2d-118.49479388485646!3d34.05118798060613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sSanta%20Monica%2C%20CA!5e0!3m2!1sen!2sus!4v1645564756252!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }}
              allowFullScreen={false}
              loading="lazy"
              className="group-hover:filter-none transition-all duration-700"
            ></iframe>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative">
                <div className="w-4 h-4 bg-[#A18058] rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                <div className="w-4 h-4 bg-[#A18058] rounded-full absolute top-0 animate-ping opacity-50"></div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};