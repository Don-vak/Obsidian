'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Key, Menu, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Availability', href: '/availability' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'glass-panel border-stone-200/50 py-2' : 'bg-transparent border-transparent py-4'
      }`}>
      <div className="flex max-w-7xl mx-auto px-6 items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#1C1917] rounded-sm flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500 text-white">
            <Key size={16} strokeWidth={1.5} />
          </div>
          <div className={`flex flex-col justify-center transition-colors duration-300 ${scrolled ? 'text-stone-900' : 'text-stone-900 md:text-white'}`}>
            <span className="leading-none serif text-base font-medium tracking-tight">THE OBSIDIAN</span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#A18058] font-medium mt-0.5 font-sans">Private Residence</span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-medium transition-colors uppercase tracking-widest ${isActive
                    ? 'text-[#A18058]'
                    : scrolled
                      ? 'text-stone-500 hover:text-[#A18058]'
                      : 'text-stone-200 hover:text-[#A18058]'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-6">
          <Link href="/book" className="hidden md:flex items-center gap-2 group bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] text-xs font-medium py-2.5 px-5 rounded-full transition-all shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20">
            <span>Book Your Stay</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <button className={`md:hidden ${scrolled ? 'text-stone-900' : 'text-white'}`}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};