'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Global elegant loading screen matching the premium gold/dark espresso brand identity.
 * Automatically shown by Next.js App Router during route transitions and data prefetching.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-espresso">
      {/* Subtle blur background glow */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8 text-center max-w-sm px-6">
        {/* Animated Sacred Mandala Loader */}
        <div className="relative w-32 h-32">
          {/* Outer rotating wheel */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border border-dashed border-gold/30 rounded-full"
          />

          {/* Middle pulsating lotus outline */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-2 border-2 border-gold/40 rounded-full flex items-center justify-center"
          >
            {/* Concentric diamond geometry */}
            <div className="w-12 h-12 border border-gold/50 rotate-45" />
          </motion.div>

          {/* Central glowing core dot */}
          <motion.div
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 m-auto w-3.5 h-3.5 bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full shadow-[0_0_12px_rgba(217,119,6,0.8)]"
          />
        </div>

        {/* Text indicators */}
        <div className="space-y-2 select-none">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[10px] font-black uppercase tracking-[0.35em] text-gold"
          >
            Kiran Handicraft
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[9px] font-bold uppercase tracking-widest text-ivory"
          >
            Unveiling Devotion...
          </motion.p>
        </div>
      </div>
    </div>
  );
}
