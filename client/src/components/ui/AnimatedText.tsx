'use client';

import React, { ElementType } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * AnimatedTextProps holds the control configuration parameters for text animation rendering.
 */
export interface AnimatedTextProps {
  /** The text content to animate */
  text: string;
  /**
   * The container HTML element type.
   * @default 'span'
   */
  el?: ElementType;
  /** Additional CSS class names */
  className?: string;
  /**
   * The animation type.
   * - 'words': Fade and slide in word by word.
   * - 'letters': Premium typewriter-stagger style, character by character.
   * - 'lines': Rise and fade in line by line.
   * @default 'words'
   */
  animationType?: 'words' | 'letters' | 'lines';
  /** Delay before triggering the sequence (in seconds) */
  delay?: number;
  /** Stagger time between words/letters (in seconds) */
  staggerDelay?: number;
  /**
   * Custom direction displacement.
   * - 'up': Slides upwards.
   * - 'down': Slides downwards.
   * - 'fade': Stays in place, purely fading in opacity.
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'fade';
  /** If true, animates only once when visible in the viewport. Otherwise, triggers every view */
  once?: boolean;
  /** Optional decoration: adds a golden, draw-in animated underline beneath the heading */
  underline?: boolean;
  /** Color theme override for the animated underline */
  underlineColor?: string;
}

/**
 * A highly customizable text typography animator component.
 * Uses Framer Motion's stagger children to orchestrate high-fidelity text reveals.
 */
export default function AnimatedText({
  text,
  el: Wrapper = 'span',
  className = '',
  animationType = 'words',
  delay = 0,
  staggerDelay = 0.04,
  direction = 'up',
  once = true,
  underline = false,
  underlineColor = 'bg-amber-500/80',
}: AnimatedTextProps) {
  // Translate the animation direction to displacement values
  const displacement = direction === 'up' ? 24 : direction === 'down' ? -24 : 0;

  // Root wrapper element variants responsible for initiating stagger sequence
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  // Child items variants representing words or individual letters
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: displacement,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // easeOutQuart
      },
    },
  };

  // Split calculations
  const renderContent = () => {
    if (animationType === 'letters') {
      return text.split(' ').map((word, wordIndex, wordArr) => (
        <span
          key={`${word}-${wordIndex}`}
          className="inline-block whitespace-nowrap"
          style={{ marginRight: wordIndex < wordArr.length - 1 ? '0.25em' : '0' }}
        >
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${char}-${charIndex}`}
              className="inline-block"
              variants={itemVariants}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ));
    }

    if (animationType === 'lines') {
      // Splits text by standard newline character or paragraph splits
      return text.split('\n').map((line, index) => (
        <span key={`${line}-${index}`} className="block overflow-hidden py-1">
          <motion.span
            className="inline-block w-full"
            variants={itemVariants}
          >
            {line}
          </motion.span>
        </span>
      ));
    }

    // Default 'words' splitting (removed overflow-hidden to prevent vertical clipping)
    return text.split(' ').map((word, index) => (
      <span key={`${word}-${index}`} className="inline-block">
        <motion.span className="inline-block mr-[0.25em]" variants={itemVariants}>
          {word}
        </motion.span>
      </span>
    ));
  };

  // Underline drawing variant path configurations
  const lineDrawVariants: Variants = {
    hidden: { width: '0%', opacity: 0 },
    visible: {
      width: '100%',
      opacity: 1,
      transition: {
        delay: delay + (text.length * (staggerDelay / 3)) + 0.2,
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.span
      className={`relative inline-block w-full ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-10% 0px' }}
      variants={containerVariants}
    >
      <Wrapper className="inline-block">
        {renderContent()}
      </Wrapper>

      {underline && (
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once }}
          variants={lineDrawVariants}
          className={`block h-[2px] mt-1.5 rounded-full ${underlineColor}`}
          style={{ originX: 0 }}
        />
      )}
    </motion.span>
  );
}
