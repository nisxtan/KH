'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * PageTransitionProps defines the configurations available for the page transitions.
 * It provides various transition styles (fade, slide up, slide down, scale)
 * and allows custom transition controls, durational controls, and progress indicators.
 */
export interface PageTransitionProps {
  /** The child elements representing the page content */
  children: ReactNode;
  /**
   * The animation effect presets.
   * - 'fade': Simple opacity fade transition.
   * - 'slide-up': Elegant slide up with high damping spring feel.
   * - 'slide-down': Slide down transition for special modal pages.
   * - 'scale-up': Premium scale-in transition resembling camera zoom focus.
   * @default 'slide-up'
   */
  mode?: 'fade' | 'slide-up' | 'slide-down' | 'scale-up';
  /** The time in seconds for the animation to complete */
  duration?: number;
  /** Delay before initiating the animation */
  delay?: number;
  /** Shows a premium golden progress indicator line at the top of the page */
  showProgressBar?: boolean;
}

/**
 * A premium page-level transition wrapper utilizing Framer Motion.
 * It detects page navigation and triggers subtle entrance, exits, and
 * progress animations to deliver a boutique hotel or digital art gallery feel.
 */
export default function PageTransition({
  children,
  mode = 'slide-up',
  duration = 0.8,
  delay = 0.05,
  showProgressBar = true,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger a subtle, golden loading progress indicator when path changes
  useEffect(() => {
    setIsLoading(true);
    setProgress(15);
    
    const interval1 = setTimeout(() => {
      setProgress(45);
    }, 150);

    const interval2 = setTimeout(() => {
      setProgress(85);
    }, 400);

    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 600);

    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
      clearTimeout(completeTimeout);
    };
  }, [pathname]);

  // Easing presets suited for luxury brand website feel (smooth deceleration)
  const premiumEase = [0.22, 1, 0.36, 1] as const;

  // Animation variant presets mapped dynamically from prop configuration
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    'slide-up': {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -24 },
    },
    'slide-down': {
      initial: { opacity: 0, y: -24 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 24 },
    },
    'scale-up': {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
    },
  };

  const selectedVariants = variants[mode];

  return (
    <>
      {/* Top Floating Golden Progress Bar */}
      {showProgressBar && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none overflow-hidden">
          <motion.div
            initial={{ width: '0%', opacity: 0 }}
            animate={{
              width: `${progress}%`,
              opacity: isLoading ? 1 : 0,
            }}
            transition={{
              width: { type: 'spring', damping: 20, stiffness: 80 },
              opacity: { duration: 0.2 },
            }}
            className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 shadow-[0_0_8px_rgba(217,119,6,0.6)]"
          />
        </div>
      )}

      {/* Main Animated Wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={selectedVariants}
          transition={{
            duration,
            delay,
            ease: premiumEase,
          }}
          className="w-full flex-grow flex flex-col relative"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
