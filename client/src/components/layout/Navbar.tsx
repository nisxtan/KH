'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/api/axios';
import { X, Menu, ChevronRight } from 'lucide-react';

const navLinks = [
  { name: 'Gallery', href: '/products' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    axiosInstance.get('/settings').then(res => setSettings(res.data)).catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenu]);

  const siteName = settings['general_site_name'] || 'Kiran Handicraft Enterprises';
  const tagline = settings['general_tagline'] || 'Wholesaler, Retailer & Manufacturer';

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 px-4 md:px-6 pointer-events-none ${scrolled ? 'py-3 md:py-4' : 'py-5 md:py-6'}`}>
        <div className={`container mx-auto px-4 md:px-10 h-16 md:h-20 flex justify-between items-center transition-all duration-500 rounded-2xl md:rounded-[2rem] pointer-events-auto ${scrolled ? 'bg-sacred/95 shadow-2xl border border-gold/20' : 'bg-transparent border-transparent'}`}>
          
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="bg-espresso w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl border border-gold/20 shadow-xl transition-all group-hover:scale-110 group-hover:bg-gold shrink-0">
              <span className="text-sacred font-black text-sm md:text-lg">{siteName.charAt(0)}</span>
            </div>
            <div className="flex flex-col max-w-[110px] xs:max-w-[130px] sm:max-w-none">
              <h1 className="text-[8px] sm:text-sm md:text-lg font-black tracking-tighter uppercase leading-tight text-espresso line-clamp-2 sm:line-clamp-none">{siteName}</h1>
              <p className="text-[6px] md:text-[7.5px] text-gold font-black uppercase tracking-[0.2em] leading-none mt-0.5 sm:block hidden">{tagline}</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 bg-sacred/40 backdrop-blur-xl px-8 py-3 rounded-full border border-gold/10 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[9px] uppercase tracking-[0.2em] font-black transition-all relative group ${
                  pathname === link.href ? 'text-gold' : 'text-espresso/60 hover:text-espresso'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-gold transition-all duration-300 ${
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/contact"
              className="hidden md:block bg-espresso text-sacred px-8 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gold transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Inquire Now
            </Link>
            
            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2.5 rounded-xl bg-espresso text-sacred border border-gold/10 hover:bg-gold hover:text-espresso transition-all shadow-lg active:scale-95 shrink-0"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-[100] md:hidden"
            />
            
            {/* Sidebar Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-ivory z-[101] md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-gold/10">
                <div className="flex items-center gap-3">
                  <div className="bg-espresso w-10 h-10 flex items-center justify-center rounded-xl text-sacred font-black">
                    {siteName.charAt(0)}
                  </div>
                  <h2 className="text-[10px] font-black uppercase tracking-tighter leading-tight text-espresso">{siteName}</h2>
                </div>
                <button 
                  onClick={() => setMobileMenu(false)}
                  className="p-3 rounded-xl bg-sacred border border-gold/10 text-espresso hover:bg-gold transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold mb-6">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenu(false)}
                    className={`flex items-center justify-between w-full p-6 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                      pathname === link.href 
                        ? 'bg-espresso text-sacred shadow-xl' 
                        : 'text-espresso/60 hover:bg-sacred hover:text-espresso'
                    }`}
                  >
                    {link.name}
                    <ChevronRight size={16} className={pathname === link.href ? 'text-gold' : 'text-espresso/20'} />
                  </Link>
                ))}
              </div>

              <div className="p-8 space-y-6">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full text-center bg-gold text-espresso py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Start a Commission
                </Link>
                <div className="text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-espresso/30">
                    Handcrafted in Nepal Since 1988
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
