'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '@/api/axios';

export default function WhatsAppButton() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    axiosInstance.get('/settings').then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const whatsappNumber = settings['contact_whatsapp'] || "9779851034260"; 
  const message = `Greetings ${settings['general_site_name'] || 'Kiran Handicraft'}, I would like to inquire about your collection.`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -12, 0]
      }}
      transition={{
        y: {
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        },
        scale: { duration: 0.5 },
        opacity: { duration: 0.5 }
      }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-12 right-12 z-50 flex items-center gap-4 group cursor-pointer"
    >
      <div className="bg-espresso text-sacred px-6 py-3 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 border border-gold/20">
        Inquire Now
      </div>
      <div className="bg-espresso text-gold p-5 rounded-full shadow-2xl border border-gold/20 group-hover:bg-gold group-hover:text-espresso transition-all duration-500">
        <MessageCircle size={24} />
      </div>
    </motion.a>
  );
}
