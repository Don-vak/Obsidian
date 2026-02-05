import React from 'react';
import { Mail, Phone, Calendar, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAFAF9] pt-12 pb-12 sm:pt-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1C1917] text-[#FAFAF9] shadow-2xl shadow-stone-900/10 p-8 md:p-12 lg:p-16 border border-stone-800">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light"></div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#A18058]/10 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-[11vw] sm:text-[7vw] lg:text-[5.5vw] leading-[0.9] serif font-medium tracking-tight mb-12 sm:mb-16">
              <span className="block text-[#FAFAF9]">Your private</span>
              <span className="block text-stone-600 italic">sanctuary awaits.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 border-t border-stone-800/60 pt-10 sm:pt-12">
              {/* Column 1: Contact */}
              <div className="flex flex-col justify-start">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A18058] mb-4 font-sans font-medium">Concierge</p>
                <a href="mailto:stay@theobsidian.com" className="text-xl sm:text-2xl font-light hover:text-[#A18058] transition-colors font-sans flex items-center gap-3 group">
                  <Mail size={24} className="text-stone-500 group-hover:text-[#A18058] transition-colors" />
                  <span className="border-b border-transparent group-hover:border-[#A18058] transition-colors pb-0.5">stay@theobsidian.com</span>
                </a>
                <a href="tel:+15550192834" className="text-lg sm:text-xl font-light text-stone-400 hover:text-[#A18058] transition-colors font-sans flex items-center gap-3 group mt-3">
                  <Phone size={22} className="text-stone-600 group-hover:text-[#A18058] transition-colors" />
                  <span className="border-b border-transparent group-hover:border-[#A18058] transition-colors pb-0.5">+1 (555) 019-2834</span>
                </a>
              </div>

              {/* Column 2: CTA */}
              <div className="flex flex-col justify-start">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A18058] mb-4 font-sans font-medium">Reservations</p>
                <a href="#book" className="inline-flex w-fit items-center gap-3 bg-[#FAFAF9] text-[#1C1917] px-6 py-4 rounded-full hover:bg-[#A18058] hover:text-white transition-all duration-300 group shadow-lg shadow-white/5">
                  <Calendar size={18} />
                  <span className="text-xs font-semibold uppercase tracking-widest">Book Now</span>
                </a>
              </div>

              {/* Column 3: Social */}
              <div className="flex flex-col justify-start">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A18058] mb-4 font-sans font-medium">Follow</p>
                <div className="flex flex-wrap gap-3">
                  {[Instagram, Twitter, Facebook].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 rounded-full border border-stone-700/50 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:bg-[#FAFAF9] hover:text-[#1C1917] hover:border-[#FAFAF9] transition-all duration-300 group">
                      <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-16 pt-8 border-t border-stone-800/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs text-stone-500 font-light font-sans">
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {['Residence', 'Amenities', 'Gallery', 'Location'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#FAFAF9] transition-colors uppercase tracking-wider">{item}</a>
                ))}
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                <div className="flex gap-6">
                  <a href="#" className="hover:text-stone-300 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-stone-300 transition-colors">Terms</a>
                  <a href="#" className="hover:text-stone-300 transition-colors">House Rules</a>
                </div>
                <p className="opacity-60">© 2024 The Obsidian.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};