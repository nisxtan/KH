'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axiosInstance from '@/api/axios';
import { ChevronRight, ShieldCheck, Sparkles, MapPin, Award } from 'lucide-react';

type Settings = Record<string, string>;

const def = (s: Settings, key: string, fb: string) => s[key] || fb;

export default function Hero() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    axiosInstance.get('/settings')
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  const stats = [
    { value: def(settings, 'hero_stat1_value', '35+'), label: def(settings, 'hero_stat1_label', 'Years of Mastery') },
    { value: def(settings, 'hero_stat2_value', '3,200+'), label: def(settings, 'hero_stat2_label', 'Statues Delivered') },
    { value: def(settings, 'hero_stat3_value', '12'), label: def(settings, 'hero_stat3_label', 'Master Artisans') },
    { value: def(settings, 'hero_stat4_value', '40+'), label: def(settings, 'hero_stat4_label', 'Countries Shipped') },
  ];

  return (
    <section className="relative min-h-screen flex items-start overflow-hidden bg-ivory">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-gold/10 rounded-full blur-[80px] md:blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-bronze/10 rounded-full blur-[70px] md:blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 pt-32 md:pt-48 pb-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">

          {/* ─── Left Copy ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 space-y-8 md:space-y-12 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2 md:py-3 rounded-full bg-sacred/50 border border-gold/20 shadow-sm">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gold-dark">
                {def(settings, 'hero_badge', 'Est. 1988 · Boudha, Kathmandu')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-[9rem] font-black tracking-tighter leading-[0.9] md:leading-[0.8] text-espresso uppercase">
              {def(settings, 'hero_title_line1', 'Divine')}<br />
              <span className="text-divine-gold">{def(settings, 'hero_title_line2', 'Statues')}</span><br />
              {def(settings, 'hero_title_line3', 'of Nepal')}
            </h1>

            {/* Subtitle */}
            <p className="text-espresso/60 text-lg md:text-xl xl:text-2xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 border-l-4 border-gold/20 pl-6 md:pl-8 italic">
              {def(settings, 'hero_subtitle', 'Elite hand-carved statues and ritual art created by master artisans in the ancient tradition of Himalayan craftsmanship.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-4">
              <Link href="/products" className="btn-primary group flex items-center justify-center gap-4 w-full sm:w-auto">
                {def(settings, 'hero_btn_primary', 'Browse Gallery')}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-secondary w-full sm:w-auto">
                {def(settings, 'hero_btn_secondary', 'Custom Order')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-10 md:pt-12 border-t border-gold/15">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl xl:text-4xl font-black text-divine-gold tracking-tighter">{s.value}</p>
                  <p className="text-[8px] md:text-[9px] xl:text-[10px] uppercase tracking-widest text-espresso/40 font-bold mt-1 md:mt-2 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── Right Image Grid ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 relative hidden md:block"
          >
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-8 mt-24">
                <div className="rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-gold/15 shadow-divine aspect-square bg-ivory-dark">
                  <img src={def(settings, 'hero_img_1', 'https://images.unsplash.com/photo-1616423641454-e6992925345b?q=80&w=700')} alt="Gold Statue" className="w-full h-full object-cover hover:scale-110 transition-all duration-1000 grayscale hover:grayscale-0" />
                </div>
                <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-gold/15 shadow-divine aspect-[4/3] bg-ivory-dark">
                  <img src={def(settings, 'hero_img_2', 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=700')} alt="Craftsman" className="w-full h-full object-cover hover:scale-110 transition-all duration-1000" />
                </div>
              </div>
              <div className="space-y-8">
                <div className="rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-gold/15 shadow-divine aspect-[3/4] bg-ivory-dark">
                  <img src={def(settings, 'hero_img_3', 'https://images.unsplash.com/photo-1544111301-44754a01948d?q=80&w=700')} alt="Divine Statue" className="w-full h-full object-cover hover:scale-110 transition-all duration-1000" />
                </div>
                <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-gold/15 shadow-divine aspect-square bg-ivory-dark">
                  <img src={def(settings, 'hero_img_4', 'https://images.unsplash.com/photo-1533633517164-9da96eb5bb09?q=80&w=700')} alt="Nepal Art" className="w-full h-full object-cover hover:scale-110 transition-all duration-1000 grayscale hover:grayscale-0" />
                </div>
              </div>
            </div>

            {/* Floating trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-sacred/90 backdrop-blur-xl px-6 md:px-10 py-4 md:py-6 rounded-full md:rounded-[2.5rem] whitespace-nowrap shadow-divine border border-gold/20"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex -space-x-2 md:-space-x-3">
                  {[<Award key={1} size={14} />, <ShieldCheck key={2} size={14} />, <MapPin key={3} size={14} />, <Sparkles key={4} size={14} />].map((icon, i) => (
                    <div key={i} className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-ivory border-2 md:border-4 border-sacred flex items-center justify-center text-gold shadow-sm">
                      {icon}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-black text-espresso">Trusted by Collectors</p>
                  <p className="text-[7px] md:text-[10px] text-espresso/40 font-bold uppercase tracking-[0.2em]">Since 1988</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
