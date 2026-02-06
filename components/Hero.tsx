'use client';

import React, { useState } from 'react';
import { Star, Calendar, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { checkAvailability } from '@/lib/mock-data/availability';
import { mockPricing } from '@/lib/mock-data/pricing';

export const Hero: React.FC = () => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (nights < mockPricing.minimumNights) {
      setError(`Minimum stay is ${mockPricing.minimumNights} nights`);
      return;
    }

    if (nights <= 0) {
      setError('Check-out must be after check-in');
      return;
    }

    // Check availability
    setIsChecking(true);
    const availability = checkAvailability(checkIn, checkOut);

    if (!availability.available) {
      setError(availability.message);
      setIsChecking(false);
      return;
    }

    // Redirect to booking page with pre-filled data
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guestCount.toString(),
    });

    router.push(`/book?${params.toString()}`);
  };

  return (
    <header className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop"
          alt="The Obsidian Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3f3b35]/20 mix-blend-multiply"></div>
        <div className="bg-gradient-to-b via-transparent from-stone-900/40 to-stone-900/20 absolute top-0 right-0 bottom-0 left-0"></div>
      </div>

      <div className="z-10 w-full max-w-7xl mx-auto pt-20 px-6 relative">
        <div className="flex flex-col lg:flex-row lg:gap-20 gap-x-12 gap-y-12 items-end">

          {/* Hero Content */}
          <div className="lg:w-7/12 lg:mb-0 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFAF9]/10 backdrop-blur-md border border-[#FAFAF9]/20 text-[#FAFAF9] text-[10px] font-medium tracking-[0.2em] uppercase mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A18058] animate-pulse-slow"></span>
              Direct Booking Exclusive
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="md:text-7xl lg:text-8xl leading-[0.95] text-5xl font-light text-gray-50 tracking-tight font-serif mb-6 drop-shadow-lg"
            >
              Sanctuary in <br />
              <span className="font-light text-stone-200 opacity-90 italic">the hills.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="leading-relaxed text-lg font-light text-gray-50 opacity-90 max-w-md mb-10 drop-shadow-md"
            >
              A masterfully designed architectural gem offering absolute privacy and panoramic views.
            </motion.p>
          </div>

          {/* Direct Booking Widget */}
          <motion.div
            id="book"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="lg:w-5/12 w-full"
          >
            <div className="glass-panel p-6 rounded-[2rem] shadow-2xl border shadow-stone-900/20 border-white/60 backdrop-blur-3xl bg-white/10">
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-stone-200/60">
                <div>
                  <span className="block text-xl font-medium serif text-stone-900">$850 <span className="text-sm font-normal text-stone-600 font-sans">/ night</span></span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="text-[#A18058] fill-[#A18058]" />
                    <span className="text-[10px] font-medium text-stone-700">4.98 (124 reviews)</span>
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#A18058] font-semibold border border-[#A18058]/30 px-3 py-1 rounded-full bg-[#FAFAF9]/50">
                  Instant Book
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white/90 border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                    <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">Check In</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium p-0 z-10 relative text-stone-900"
                    />
                    <div className="absolute right-4 bottom-3 pointer-events-none text-stone-400">
                      <Calendar size={16} />
                    </div>
                  </div>
                  <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white/90 border-stone-200 hover:border-[#A18058]/50 focus-within:border-[#A18058]">
                    <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">Check Out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium p-0 z-10 relative text-stone-900"
                    />
                  </div>
                </div>

                <div className="group relative px-4 py-3 rounded-2xl border transition-colors bg-white/90 border-stone-200 hover:border-[#A18058]/50">
                  <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">Guests</label>
                  <div className="flex justify-between items-center">
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900 cursor-pointer"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                    </select>
                    <Users size={16} className="text-stone-400" />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50/90 border border-red-200">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isChecking}
                  className="w-full bg-[#1C1917] hover:bg-[#292524] disabled:bg-stone-400 disabled:cursor-not-allowed text-[#FAFAF9] py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                  {isChecking ? 'Checking...' : 'Check Availability'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[10px] text-stone-600 font-light">
                  You won't be charged yet
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </header>
  );
};