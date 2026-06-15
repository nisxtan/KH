import axiosInstance from "@/api/axios";
import { ChevronRight, Award, Truck, ShieldCheck, HeartHandshake, History, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from 'next-intl/server';

async function getSettings(locale: string) {
  try {
    const res = await axiosInstance.get(`/settings?lang=${locale}`);
    return res.data as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}

const englishDefaults: Record<string, string> = {
  about_hero_badge: 'Our Essence',
  about_hero_title: 'The Soul of the Chisel',
  about_hero_quote: 'We don\'t create statues; we uncover the divinity already present within the metal.',
  about_story_title: 'A Legacy Carved in Tradition',
  about_story_para1: 'Born in the sacred atmosphere of Boudha Stupa, KIRAN HANDICRAFT ENTERPRISES was founded in 1988 by Kiran Kumar Shakya.',
  about_story_para2: 'Our workshop is a place of silence and focus. As leading wholesalers and manufacturers, every piece we produce is the result of hundreds of hours of manual labor.',
};

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('About');
  const tHero = await getTranslations('Hero');
  const settings = await getSettings(locale);

  const s = (settings: Record<string, string>, key: string, fallback: string) => {
    const val = settings[key];
    if (!val) return fallback;
    if (locale !== 'en' && val === englishDefaults[key]) {
      return fallback;
    }
    return val;
  };

  return (
    <div className="bg-transparent">
      {/* ─── LIGHT HEADER ─── */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-start overflow-hidden bg-transparent">

        <div className="container mx-auto px-6 pt-32 md:pt-48 pb-24 relative z-10">
          <div className="max-w-4xl space-y-8 md:space-y-10 text-center md:text-left">
            <span className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 md:w-12 bg-gold" />
              {s(settings, 'about_hero_badge', t('essence'))}
            </span>
            <h1 className="text-5xl md:text-7xl xl:text-9xl font-black tracking-tighter text-ivory uppercase leading-[0.9] md:leading-[0.85]">
              {s(settings, 'about_hero_title', t('soulChisel'))}
            </h1>
            <p className="text-ivory/60 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto md:mx-0 border-l-4 border-gold/40 pl-6 md:pl-8 italic">
              "{s(settings, 'about_hero_quote', t('divinityQuote'))}"
            </p>
          </div>
        </div>
      </section>

      {/* ─── OUR STORY ─── */}
      <section className="py-24 md:py-24 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-10 order-2 lg:order-2 text-center lg:text-left">
              <div className="space-y-4">
                <span className="section-badge">
                  <span className="h-px w-8 bg-gold-dark" /> {tHero('since', { year: s(settings, 'general_founded', '1988') })}
                </span>
                <h2 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tighter text-ivory uppercase leading-[0.9]">
                  {s(settings, 'about_story_title', t('legacyTitle'))}
                </h2>
              </div>
              <div className="space-y-6 md:space-y-8 text-ivory/60 text-base md:text-lg font-medium leading-relaxed">
                <p>{s(settings, 'about_story_para1', 'Born in the sacred atmosphere of Boudha Stupa, KIRAN HANDICRAFT ENTERPRISES was founded in 1988 by Kiran Kumar Shakya.')}</p>
                <p>{s(settings, 'about_story_para2', 'Our workshop is a place of silence and focus. As leading wholesalers and manufacturers, every piece we produce is the result of hundreds of hours of manual labor.')}</p>
              </div>

            </div>

            <div className="relative order-1 lg:order-1">
              <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gold/10 shadow-divine aspect-[3/4] max-w-lg mx-auto lg:ml-auto">
                <img
                  src={s(settings, 'about_hero_img', 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=1000')}
                  alt="Master Artisan at work"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY KIRAN ─── */}
      <section className="py-24 md:py-24 bg-transparent border-t border-gold/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 md:mb-24 space-y-6">
            <span className="section-badge">
              <span className="h-px w-6 bg-gold-dark" />
              {t('whyChooseUs')}
              <span className="h-px w-6 bg-gold-dark" />
            </span>
            <h2 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tighter text-ivory uppercase leading-[0.9]">
              {t('differenceTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: <Award size={32} />, title: t('certifiedAuthentic'), desc: t('certifiedDesc') },
              { icon: <ShieldCheck size={32} />, title: t('museumPackaging'), desc: t('museumDesc') },
              { icon: <Truck size={32} />, title: t('worldwideShipping'), desc: t('shippingDesc') },
              { icon: <HeartHandshake size={32} />, title: t('lifetimeSupport'), desc: t('supportDesc') },
            ].map((item) => (
              <div key={item.title} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-black/40 backdrop-blur-md border border-gold/20 hover:border-gold/40 hover:-translate-y-2 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <span className="text-gold group-hover:scale-110 transition-transform">{item.icon}</span>
                <div>
                  <h3 className="text-xl font-black text-ivory tracking-tight mb-3">{item.title}</h3>
                  <p className="text-ivory/50 font-medium leading-relaxed text-sm md:text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-24 bg-transparent text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="container mx-auto px-6 max-w-4xl space-y-10 md:space-y-12">
          <h2 className="text-4xl md:text-6xl xl:text-8xl font-black tracking-tighter text-ivory uppercase leading-[0.9]">
            {t('beginSacred')}
          </h2>
          <p className="text-ivory/50 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            {t('showroomDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/products" className="btn-primary w-full sm:w-auto text-center">{t('browseGallery')}</Link>
            <Link href="/contact" className="btn-secondary w-full sm:w-auto text-center">{t('commissionPiece')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
