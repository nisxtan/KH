'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 50,
  className = '',
}: ScrollRevealProps) {
  const getVariants = () => {
    const hiddenState = { opacity: 0 };
    const visibleState = { opacity: 1, x: 0, y: 0 };

    switch (direction) {
      case 'up':
        return {
          hidden: { ...hiddenState, y: distance },
          visible: visibleState,
        };
      case 'down':
        return {
          hidden: { ...hiddenState, y: -distance },
          visible: visibleState,
        };
      case 'left':
        return {
          hidden: { ...hiddenState, x: distance },
          visible: visibleState,
        };
      case 'right':
        return {
          hidden: { ...hiddenState, x: -distance },
          visible: visibleState,
        };
      case 'fade':
      default:
        return {
          hidden: hiddenState,
          visible: visibleState,
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={getVariants()}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // premium easeOutQuart curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
