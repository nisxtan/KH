'use client';

import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

export interface StaggerContainerProps {
  /** The child list items to stagger */
  children: ReactNode;
  /** Custom CSS classes for the container element */
  className?: string;
  /** Stagger delay between children (in seconds) */
  staggerDelay?: number;
  /** Delay before starting the container animation sequence (in seconds) */
  delay?: number;
  /** If true, triggers the stagger sequence only once on viewport entry */
  once?: boolean;
  /** Viewport margin threshold to trigger the animation */
  viewportMargin?: string;
  /** Custom ease curve or preset name */
  ease?: number[] | string;
}

/**
 * A highly customizable layout orchestrator component.
 * Staggers the animation of child motion components in order of appearance
 * using Framer Motion variants.
 */
export default function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.12,
  delay = 0,
  once = true,
  viewportMargin = '-80px',
  ease = 'easeOut',
}: StaggerContainerProps) {
  // Container variants that orchestrate kids
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin }}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // Always wrap children in a motion.div with stagger variants.
        // Previous approach checked child.type?.name which is unreliable
        // in production builds where minification strips function names.
        return (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: ease as any,
                },
              },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
