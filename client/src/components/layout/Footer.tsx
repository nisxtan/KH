'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import axiosInstance from '@/api/axios';

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [settRes, catRes] = await Promise.all([
                axiosInstance.get('/settings'),
                axiosInstance.get('/categories')
            ]);
            setSettings(settRes.data);
            setCategories(catRes.data);
        } catch {}
    };
    fetchData();
  }, []);

  const siteName = settings['general_site_name'] || 'Kiran Handicraft Enterprises';
  const tagline = settings['general_tagline'] || 'Wholesaler, Retailer & Manufacturer';
  const address = settings['contact_address'] || 'Boudha-6, Stupa, Kathmandu, Nepal';
  const phone = settings['contact_phone'] || '01-4916351';
  const email = settings['contact_email'] || 'kijenshakya@gmail.com';
  const whatsapp = settings['contact_whatsapp'] || '9779851034260';
  const facebook = settings['contact_facebook'] || 'https://facebook.com/kiranhandicraft';
  const instagram = settings['contact_instagram'] || 'https://instagram.com/kiranhandicraft';

  return (
    <footer className="bg-sacred text-espresso border-t border-gold/10">
      <div className="container mx-auto px-6 pt-20 md:pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-20 border-b border-gold/10">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-10">
            <Link href="/" className="flex items-center gap-4 group w-fit mx-auto md:mx-0">
              <div className="bg-espresso w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl shadow-xl group-hover:scale-110 transition-all">
                <span className="text-sacred font-black text-lg md:text-xl">{siteName.charAt(0)}</span>
              </div>
              <div className="text-left">
                <h2 className="text-xs md:text-lg font-black tracking-tighter uppercase leading-none">{siteName}</h2>
                <p className="text-[7px] md:text-[9px] text-gold font-black uppercase tracking-[0.2em] mt-1.5 leading-none">{tagline}</p>
              </div>
            </Link>

            <p className="text-espresso/50 text-sm md:text-base font-medium leading-relaxed max-w-sm text-center md:text-left mx-auto md:mx-0">
              Preserving the sacred art of Nepalese craftsmanship since {settings['general_founded'] || '1988'}. Every statue is a bridge between the human and the divine.
            </p>

            <div className="space-y-4 max-w-md mx-auto md:mx-0">
              <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" className="flex items-center gap-5 text-espresso/60 hover:text-gold transition-colors group">
                <div className="p-3 rounded-xl bg-ivory group-hover:bg-gold/10 transition-colors shrink-0 shadow-sm border border-gold/5">
                  <MapPin size={16} />
                </div>
                <span className="text-xs md:text-sm font-bold leading-tight">{address}</span>
              </a>
              <a href={`tel:${phone}`} className="flex items-center gap-5 text-espresso/60 hover:text-gold transition-colors group">
                <div className="p-3 rounded-xl bg-ivory group-hover:bg-gold/10 transition-colors shrink-0 shadow-sm border border-gold/5">
                  <Phone size={16} />
                </div>
                <span className="text-xs md:text-sm font-bold">{phone}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-5 text-espresso/60 hover:text-gold transition-colors group">
                <div className="p-3 rounded-xl bg-ivory group-hover:bg-gold/10 transition-colors shrink-0 shadow-sm border border-gold/5">
                  <Mail size={16} />
                </div>
                <span className="text-xs md:text-sm font-bold">{email}</span>
              </a>
            </div>

            <div className="flex justify-center md:justify-start gap-4">
              {[
                { icon: <FaFacebook size={18} />, href: facebook, label: 'Facebook' },
                { icon: <FaInstagram size={18} />, href: instagram, label: 'Instagram' },
                { icon: <FaWhatsapp size={18} />, href: `https://wa.me/${whatsapp}`, label: 'WhatsApp' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-ivory border border-gold/10 text-espresso/40 hover:bg-gold hover:text-sacred hover:border-gold transition-all hover:scale-110 active:scale-95 shadow-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8 md:gap-12">
            
            {/* Dynamic Gallery Links */}
            <div className="md:text-left text-center">
                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-gold mb-8 md:mb-10">Gallery</h4>
                <ul className="space-y-4 md:space-y-6">
                    <li><Link href="/products" className="text-xs md:text-sm font-semibold text-espresso/50 hover:text-gold transition-colors">All Statues</Link></li>
                    {categories.slice(0, 4).map(cat => (
                        <li key={cat.id}>
                            <Link href={`/products?category=${cat.slug}`} className="text-xs md:text-sm font-semibold text-espresso/50 hover:text-gold transition-colors">
                                {cat.name} Collection
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Static Company Links */}
            <div className="md:text-left text-center">
                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-gold mb-8 md:mb-10">Company</h4>
                <ul className="space-y-4 md:space-y-6">
                    <li><Link href="/about" className="text-xs md:text-sm font-semibold text-espresso/50 hover:text-gold transition-colors">About Us</Link></li>
                    <li><Link href="/about" className="text-xs md:text-sm font-semibold text-espresso/50 hover:text-gold transition-colors">The Artisans</Link></li>
                    <li><Link href="/contact" className="text-xs md:text-sm font-semibold text-espresso/50 hover:text-gold transition-colors">Commission a Piece</Link></li>
                    <li><Link href="/contact" className="text-xs md:text-sm font-semibold text-espresso/50 hover:text-gold transition-colors">Showroom Visit</Link></li>
                </ul>
            </div>

          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-espresso/30 text-center">
          <p>&copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.</p>
          <p>Handcrafted with Devotion · {settings['general_location'] || 'Boudha, Kathmandu'}</p>
        </div>
      </div>
    </footer>
  );
}
