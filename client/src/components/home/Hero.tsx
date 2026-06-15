'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, Sparkles, MapPin, Award } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import ThreeDCarousel from './ThreeDCarousel';

type Settings = Record<string, string>;

export default function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const [settings, setSettings] = useState<Settings>({});

  const toCamelCase = (str: string) => {
    const stripped = str.startsWith('hero_') ? str.slice(5) : str;
    return stripped.replace(/_([a-z0-9])/g, (_, g) => g.toUpperCase());
  };

  const def = (s: Settings, key: string, fb: string) => {
    const val = s[key];
    if (!val) {
      if (locale !== 'en') {
        try {
          const tKey = toCamelCase(key);
          return t(tKey);
        } catch {
          return fb;
        }
      }
      return fb;
    }
    if (locale !== 'en' && val === fb) {
      try {
        const tKey = toCamelCase(key);
        return t(tKey);
      } catch {}
    }
    return val;
  };

  useEffect(() => {
    axiosInstance.get(`/settings?lang=${locale}`)
      .then(res => {
        console.log('Hero settings fetched for locale', locale, ':', res.data);
        setSettings(res.data);
      })
      .catch(() => {});
  }, [locale]);



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 18
      }
    }
  };

  return (
    <section className="relative flex items-start overflow-hidden bg-transparent">


      <div className="container mx-auto px-6 pt-28 md:pt-32 pb-4 md:pb-8 relative z-10 w-full flex items-center">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-12 w-full">

          {/* ─── Left Copy ─── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left"
          >
            {/* Address Text (Aligned to Navbar Company Name) */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 md:gap-4 lg:ml-[4rem] mt-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gold-dark">
                {def(settings, 'hero_badge', 'Est. 1988 · Boudha, Kathmandu')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className={`${
                ['ne', 'zh'].includes(locale)
                  ? 'text-3xl sm:text-4xl md:text-6xl xl:text-7xl leading-[1.3] md:leading-[1.2]'
                  : 'text-4xl sm:text-5xl md:text-7xl xl:text-[6.5rem] 2xl:text-[7.5rem] leading-[0.9] md:leading-[0.8]'
              } font-black tracking-tighter text-espresso uppercase`}
            >
              {def(settings, 'hero_title_line1', 'Divine')}<br />
              <span className="text-divine-gold">
                {def(settings, 'hero_title_line2', 'Statues')}
              </span><br />
              {def(settings, 'hero_title_line3', 'of Nepal')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-espresso/60 text-lg md:text-xl xl:text-2xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 border-l-4 border-gold/20 pl-6 md:pl-8 italic"
            >
              {def(settings, 'hero_subtitle', 'Elite hand-carved statues and ritual art created by master artisans in the ancient tradition of Himalayan craftsmanship.')}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-4">
              <Link href="/products" className="btn-primary group flex items-center justify-center gap-4 w-full sm:w-auto">
                {def(settings, 'hero_btn_primary', 'Browse Gallery')}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-secondary w-full sm:w-auto">
                {def(settings, 'hero_btn_secondary', 'Custom Order')}
              </Link>
            </motion.div>


          </motion.div>

          {/* ─── Right 3D Masterpiece Carousel ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 relative"
          >
            <ThreeDCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
