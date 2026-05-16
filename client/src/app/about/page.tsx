import axiosInstance from "@/api/axios";
import { ChevronRight, Award, Truck, ShieldCheck, HeartHandshake, History, Users, LayoutGrid } from "lucide-react";
import Link from "next/link";

async function getSettings() {
  try {
    const res = await axiosInstance.get('/settings');
    return res.data as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}

const s = (settings: Record<string, string>, key: string, fallback: string) =>
  settings[key] || fallback;

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="bg-ivory">
      {/* ─── LIGHT HEADER ─── */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-start overflow-hidden bg-ivory">
        <div className="absolute top-0 right-0 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-gold/5 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-bronze/5 rounded-full blur-[70px] md:blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 pt-32 md:pt-48 pb-24 relative z-10">
          <div className="max-w-4xl space-y-8 md:space-y-10 text-center md:text-left">
            <span className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-8 md:w-12 bg-gold" />
              {s(settings, 'about_hero_badge', 'Our Essence')}
            </span>
            <h1 className="text-5xl md:text-7xl xl:text-9xl font-black tracking-tighter text-espresso uppercase leading-[0.9] md:leading-[0.85]">
              {s(settings, 'about_hero_title', 'The Soul of the Chisel')}
            </h1>
            <p className="text-espresso/60 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto md:mx-0 border-l-4 border-gold/20 pl-6 md:pl-8 italic">
              "{s(settings, 'about_hero_quote', 'We don\'t create statues; we uncover the divinity already present within the metal.')}"
            </p>
          </div>
        </div>
      </section>

      {/* ─── OUR STORY ─── */}
      <section className="py-24 md:py-40 bg-sacred">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-10 order-2 lg:order-1 text-center lg:text-left">
              <div className="space-y-4">
                <span className="section-badge"><span className="h-px w-8 bg-gold-dark" /> Since {s(settings, 'general_founded', '1988')}</span>
                <h2 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tighter text-espresso uppercase leading-[0.9]">
                  {s(settings, 'about_story_title', 'A Legacy Carved in Tradition')}
                </h2>
              </div>
              <div className="space-y-6 md:space-y-8 text-espresso/60 text-base md:text-lg font-medium leading-relaxed">
                <p>{s(settings, 'about_story_para1', 'Born in the sacred atmosphere of Boudha Stupa, KIRAN HANDICRAFT ENTERPRISES was founded in 1988 by Kiran Kumar Shakya.')}</p>
                <p>{s(settings, 'about_story_para2', 'Our workshop is a place of silence and focus. As leading wholesalers and manufacturers, every piece we produce is the result of hundreds of hours of manual labor.')}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="p-6 md:p-8 rounded-3xl bg-ivory border border-gold/10 shadow-divine text-center">
                  <div className="flex justify-center mb-4 text-gold"><History size={24} /></div>
                  <p className="text-3xl md:text-4xl font-black text-divine-gold">{s(settings, 'about_stat1_value', '3,200+')}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-espresso/40 mt-2">{s(settings, 'about_stat1_label', 'Statues Delivered')}</p>
                </div>
                <div className="p-6 md:p-8 rounded-3xl bg-ivory border border-gold/10 shadow-divine text-center">
                  <div className="flex justify-center mb-4 text-gold"><Users size={24} /></div>
                  <p className="text-3xl md:text-4xl font-black text-divine-gold">{s(settings, 'about_stat2_value', '12')}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-espresso/40 mt-2">{s(settings, 'about_stat2_label', 'Master Artisans')}</p>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gold/10 shadow-divine aspect-[3/4] max-w-lg mx-auto lg:mx-0">
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
      <section className="py-24 md:py-40 bg-sacred border-t border-gold/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 md:mb-24 space-y-6">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl xl:text-7xl font-black tracking-tighter text-espresso uppercase leading-[0.9]">
              The <span className="text-divine-gold">Kiran</span> Difference
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: <Award size={32} />, title: "Certified Authentic", desc: "Every piece comes with a certificate of authenticity and provenance from our workshop." },
              { icon: <ShieldCheck size={32} />, title: "Museum-Grade Packaging", desc: "Triple-layered protective packaging ensures your statue arrives in perfect condition." },
              { icon: <Truck size={32} />, title: "Worldwide Shipping", desc: "We ship to 40+ countries with full insurance and customs documentation included." },
              { icon: <HeartHandshake size={32} />, title: "Lifetime Support", desc: "Our team offers lifetime care advice for your statue, including cleaning guidance." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-ivory border border-gold/10 shadow-divine hover:border-gold/30 transition-all group">
                <span className="text-gold group-hover:scale-110 transition-transform">{item.icon}</span>
                <div>
                  <h3 className="text-xl font-black text-espresso tracking-tight mb-3">{item.title}</h3>
                  <p className="text-espresso/50 font-medium leading-relaxed text-sm md:text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-40 bg-ivory text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="container mx-auto px-6 max-w-4xl space-y-10 md:space-y-12">
          <h2 className="text-4xl md:text-6xl xl:text-8xl font-black tracking-tighter text-espresso uppercase leading-[0.9]">
            Begin Your <span className="text-divine-gold">Sacred Journey</span>
          </h2>
          <p className="text-espresso/50 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Visit our showroom in Boudha or commission a bespoke masterpiece designed to your exact vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/products" className="btn-primary w-full sm:w-auto text-center">Browse Gallery</Link>
            <Link href="/contact" className="btn-secondary w-full sm:w-auto text-center">Commission a Piece</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
