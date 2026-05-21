'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Award, ShieldCheck, Truck, Sparkles, Hammer } from "lucide-react";
import axiosInstance from "@/api/axios";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/products/ProductCard";
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

type Settings = Record<string, string>;
const def = (s: Settings, key: string, fb: string) => s[key] || fb;

export default function Home() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const [settings, setSettings] = useState<Settings>({});
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          axiosInstance.get(`/settings?lang=${locale}`),
          axiosInstance.get(`/products?featured=true&lang=${locale}`)
        ]);
        setSettings(settingsRes.data);
        setFeaturedProducts(productsRes.data.items.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locale]);

  const features = [
    {
      icon: <Award className="text-gold" size={32} />,
      title: def(settings, 'features_title1', 'Sacred Materials'),
      desc: def(settings, 'features_desc1', 'Pure copper, brass, and genuine 24K gold leaf sourced from certified suppliers.'),
    },
    {
      icon: <Hammer className="text-gold" size={32} />,
      title: def(settings, 'features_title2', '100% Hand-Crafted'),
      desc: def(settings, 'features_desc2', 'Every statue is shaped by hand using centuries-old Nepalese techniques.'),
    },
    {
      icon: <Truck className="text-gold" size={32} />,
      title: def(settings, 'features_title3', 'Worldwide Shipping'),
      desc: def(settings, 'features_desc3', 'Carefully packed and securely shipped to over 40 countries worldwide.'),
    },
  ];

  const philosophyItems = [
    { icon: <Hammer size={20} />, label: t('handHammered'), sub: t('traditional') },
    { icon: <Sparkles size={20} />, label: t('goldGilded'), sub: t('genuineLeaf') },
    { icon: <Award size={20} />, label: t('museumQuality'), sub: t('artisanCrafts') },
    { icon: <ShieldCheck size={20} />, label: t('exportGrade'), sub: t('worldwideCertified') },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="relative z-10">
        {/* ─── HERO ─── */}
        <Hero />

      {/* ─── FEATURES STRIP ─── */}
      <section className="py-12 md:py-24 bg-espresso border-y border-gold/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 px-6 md:px-12 py-8 group hover:bg-white/5 transition-all duration-500">
                <div className="group-hover:scale-110 transition-transform">{f.icon}</div>
                <div>
                  <h3 className="text-base font-black text-sacred tracking-tight mb-2">{f.title}</h3>
                  <p className="text-white/40 text-sm font-medium leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT US SECTION ─── */}
      <section className="py-12 md:py-24 overflow-hidden bg-transparent">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
              <div className="relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-gold/10 shadow-divine aspect-square max-w-xl mx-auto lg:mx-0 bg-ivory-dark">
                <img
                  src="https://images.unsplash.com/photo-1544111301-44754a01948d?q=80&w=1200"
                  alt="Master Artisan"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10">
                  <div className="bg-black/70 backdrop-blur-md rounded-2xl px-6 md:px-8 py-4 md:py-6 border border-gold/20 shadow-xl">
                    <p className="text-ivory text-[8px] md:text-[10px] font-black uppercase tracking-widest">{t('lostWax')}</p>
                    <p className="text-ivory/60 text-xs md:text-sm font-medium mt-1 italic">{t('secret')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-8 md:space-y-10 order-1 lg:order-2 text-center lg:text-left">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gold">
                  <span className="h-px w-8 md:w-12 bg-gold" /> {def(settings, 'philosophy_badge', 'About Us')}
                </span>
                <h2 className="text-4xl md:text-6xl xl:text-8xl font-black tracking-tighter text-ivory leading-[0.9] md:leading-[0.85] uppercase">
                  {def(settings, 'philosophy_title_line1', 'Where Faith')} <br/>
                  {def(settings, 'philosophy_title_line2', 'Meets')}<br />
                  <span className="text-divine-gold">{def(settings, 'philosophy_title_line3', 'the Chisel')}</span>
                </h2>
              </div>

              <p className="text-ivory/60 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 border-l-4 border-gold/30 pl-6 md:pl-8 italic">
                {def(settings, 'philosophy_desc', 'In the sacred air of Boudha, our artisans don\'t just carve metal—they transmit devotion into physical form. Every statue begins with a day of meditation.')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {philosophyItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-5 md:p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-gold/20 hover:border-gold/40 transition-all group text-left">
                    <div className="p-2.5 md:p-3 rounded-xl bg-gold/20 text-gold group-hover:bg-gold group-hover:text-espresso transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-black text-ivory">{item.label}</p>
                      <p className="text-[9px] md:text-[10px] text-ivory/40 font-bold uppercase tracking-widest">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-4 group font-black uppercase tracking-widest text-[10px] md:text-xs text-ivory/70 hover:text-gold transition-colors"
              >
                {t('enterWorkshop')}
                <span className="h-px w-8 md:w-12 bg-ivory/20 group-hover:w-24 group-hover:bg-gold transition-all duration-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED COLLECTION ─── */}
      <section className="py-12 md:py-24 bg-transparent border-y border-gold/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 md:mb-24 text-center md:text-left gap-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">{t('curated')}</span>
              <h2 className="text-4xl md:text-6xl xl:text-8xl font-black tracking-tighter text-ivory uppercase leading-[0.9] md:leading-[0.85]">
                {t('heritage')} <br />
                <span className="text-divine-gold">{t('masterpieces')}</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-3 group font-black uppercase tracking-widest text-[9px] md:text-[10px] text-espresso/40 hover:text-gold transition-colors"
            >
              {t('fullGallery')}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-[350px] bg-ivory animate-pulse rounded-[2rem] md:rounded-[2.5rem]" />
              ))
            )}
          </div>

          <div className="text-center mt-16 md:mt-20">
            <Link
              href="/products"
              className="btn-primary w-full sm:w-auto"
            >
              {t('exploreCollection')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-12 md:py-24 bg-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-bronze/10 pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-10 md:space-y-12">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-gold">{def(settings, 'cta_badge', 'Commission a Masterpiece')}</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-9xl font-black tracking-tighter text-ivory uppercase leading-[0.9] md:leading-[0.85]">
              {def(settings, 'cta_title_line1', 'Bring a God')} <br />
              <span className="text-divine-gold">{def(settings, 'cta_title_line2', 'Into Your Home')}</span>
            </h2>
            <p className="text-ivory/50 text-lg md:text-2xl font-medium leading-relaxed italic max-w-2xl mx-auto">
              {def(settings, 'cta_desc', 'Each statue is a one-of-a-kind creation. Commission a bespoke piece crafted to your exact spiritual vision.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 pt-6 md:pt-8">
              <Link
                href="/contact"
                className="btn-primary w-full sm:w-auto shadow-2xl"
              >
                {t('startCommission')}
              </Link>
              <Link
                href="/products"
                className="btn-secondary w-full sm:w-auto"
              >
                {t('browseGallery')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
