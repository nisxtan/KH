'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import axiosInstance from '@/api/axios';

type Settings = Record<string, string>;
const def = (s: Settings, key: string, fb: string) => s[key] || fb;

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    axiosInstance.get('/settings').then(r => setSettings(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      await axiosInstance.post('/inquiries', form);
      setStatus({ type: 'success', msg: 'Your inquiry has been sent successfully. We will get back to you soon.' });
      setForm({ name: '', email: '', subject: '', message: '' });
      
      // Optional: Also open WhatsApp if needed, but usually email is enough now
      // const whatsapp = def(settings, 'contact_whatsapp', '97798XXXXXXXX');
      // const msg = `Hello Kiran Handicraft!\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage: ${form.message}`;
      // window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    } catch (error) {
      console.error('Inquiry error:', error);
      setStatus({ type: 'error', msg: 'Failed to send inquiry. Please try again or contact us via WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    { icon: <MapPin size={20} />, label: 'Showroom', value: def(settings, 'contact_address', 'Bouddha, Kathmandu, Nepal'), href: 'https://maps.google.com/?q=Bouddha,Kathmandu' },
    { icon: <Phone size={20} />, label: 'Direct Line', value: def(settings, 'contact_phone', '+977 1234 567 890'), href: `tel:${def(settings, 'contact_phone', '')}` },
    { icon: <Mail size={20} />, label: 'Email Us', value: def(settings, 'contact_email', 'info@kiranhandicraft.com'), href: `mailto:${def(settings, 'contact_email', '')}` },
  ];

  const socials = [
    { icon: <FaFacebook size={20} />, label: 'Facebook', href: def(settings, 'contact_facebook', '#') },
    { icon: <FaInstagram size={20} />, label: 'Instagram', href: def(settings, 'contact_instagram', '#') },
    { icon: <MessageCircle size={20} />, label: 'WhatsApp', href: `https://wa.me/${def(settings, 'contact_whatsapp', '97798XXXXXXXX')}` },
  ];

  return (
    <div className="bg-ivory min-h-screen pt-32 md:pt-60 pb-20 md:pb-40">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="max-w-2xl mb-10 md:mb-20 space-y-6">
          <span className="section-badge"><span className="h-px w-8 bg-gold-dark" /> Get in Touch</span>
          <h1 className="text-4xl md:text-6xl xl:text-8xl font-black tracking-tighter text-espresso uppercase leading-[0.85]">
            {def(settings, 'contact_title', 'Inquiries &\nCommissions')}
          </h1>
          <p className="text-espresso/55 text-lg font-medium leading-relaxed">
            {def(settings, 'contact_subtitle', 'Whether you are a collector or an interior visionary, we invite you to connect with us.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ─── Contact Info ─── */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              {contactItems.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-6 p-6 rounded-3xl bg-sacred border border-gold/10 shadow-divine hover:border-gold/30 transition-all group"
                >
                  <div className="p-3 rounded-2xl bg-espresso text-gold group-hover:bg-gold group-hover:text-espresso transition-all flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-espresso/40 mb-1">{item.label}</p>
                    <p className="font-black text-espresso text-base">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Socials */}
            <div className="p-8 rounded-3xl bg-sacred border border-gold/10 shadow-divine space-y-5">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-espresso">Follow Our Artistry</p>
              <div className="flex gap-4">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-espresso text-sacred hover:bg-gold hover:text-espresso transition-all hover:scale-110 active:scale-95"
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Inquiry Form ─── */}
          <div className="lg:col-span-3 bg-sacred rounded-[2.5rem] border border-gold/10 shadow-divine p-10 xl:p-14">
            <h2 className="text-2xl font-black tracking-tighter text-espresso uppercase mb-10">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso/50">Full Name *</label>
                  <input
                    type="text" required
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Nischal Tamang"
                    className="w-full bg-ivory border border-gold/15 focus:border-gold rounded-2xl px-5 py-4 text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-espresso/30 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso/50">Email *</label>
                  <input
                    type="email" required
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-ivory border border-gold/15 focus:border-gold rounded-2xl px-5 py-4 text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-espresso/30 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso/50">Subject</label>
                <input
                  type="text"
                  value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Custom Commission / General Inquiry"
                  className="w-full bg-ivory border border-gold/15 focus:border-gold rounded-2xl px-5 py-4 text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-espresso/30 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso/50">Message *</label>
                <textarea
                  rows={6} required
                  value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about the statue you're looking for, your budget, and preferred dimensions..."
                  className="w-full bg-ivory border border-gold/15 focus:border-gold rounded-2xl px-5 py-4 text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none placeholder:text-espresso/30 text-sm"
                />
              </div>

              {/* Status Alert */}
              {status && (
                <div className={`p-4 rounded-2xl text-[10px] md:text-sm font-bold uppercase tracking-wider leading-relaxed break-words ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Send size={16} />
                {submitting ? 'Sending...' : 'Send Inquiry'}
              </button>
              <p className="text-center text-[9px] text-espresso/30 font-bold uppercase tracking-widest">
                Our team typically responds within 24-48 hours.
              </p>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 md:mt-20 h-64 md:h-96 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-gold/10 shadow-divine grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14126.963428172911!2d85.35824965!3d27.7205153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19607cf27393%3A0x77a6448e894c7717!2sBoudhha%2C%20Kathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2snp!4v1715780000000!5m2!1sen!2snp"
            width="100%" height="100%"
            style={{ border: 0 }}
            allowFullScreen loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
