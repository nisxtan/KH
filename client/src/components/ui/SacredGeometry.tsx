'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

export interface SacredGeometryProps {
  /** Size width and height in pixels or percentage css class */
  className?: string;
  /** Primary line color. Supports tailwind color names or HEX values */
  color?: string;
  /** Secondary circle/ray color */
  accentColor?: string;
  /** Speed of continuous, slow background rotation in seconds */
  rotationSpeed?: number;
  /** Animation duration for the initial line drawing (in seconds) */
  drawDuration?: number;
  /** Delay before starting the draw animation */
  drawDelay?: number;
  /** Pattern selection */
  pattern?: 'mandala' | 'lotus' | 'yantra';
}

/**
 * A luxury decorative SVG component representing sacred Himalayan geometries.
 * Uses Framer Motion's pathLength to simulate a hand-drawn line animation
 * when the element scrolls into view. Fits beautifully as low-opacity backdrops.
 */
export default function SacredGeometry({
  className = 'w-64 h-64 opacity-20',
  color = 'currentColor',
  accentColor = 'rgba(212, 175, 55, 0.4)',
  rotationSpeed = 120, // seconds per full rotation
  drawDuration = 4.0,
  drawDelay = 0.2,
  pattern = 'mandala',
}: SacredGeometryProps) {
  // Framer Motion variant for path drawing
  const pathVariants: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 0.8,
      transition: {
        duration: drawDuration,
        delay: drawDelay,
        ease: [0.25, 0.1, 0.25, 1], // slow cubic ease
      },
    },
  };

  // Continuous rotational transition config
  const rotationVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: rotationSpeed,
        ease: 'linear' as const,
      },
    },
  } as any;

  // Shared path props
  const motionPathProps = {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true },
    variants: pathVariants,
    stroke: color,
    strokeWidth: '1.2',
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const renderPattern = () => {
    switch (pattern) {
      case 'lotus':
        return (
          <>
            {/* Concentric central rings */}
            <motion.circle cx="250" cy="250" r="25" {...motionPathProps} />
            <motion.circle cx="250" cy="250" r="45" {...motionPathProps} strokeDasharray="3 3" />
            <motion.circle cx="250" cy="250" r="65" {...motionPathProps} />

            {/* Inner Lotus Petals (8 Directions) */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x1 = 250 + 25 * Math.cos(angle);
              const y1 = 250 + 25 * Math.sin(angle);
              const x2 = 250 + 110 * Math.cos(angle);
              const y2 = 250 + 110 * Math.sin(angle);
              // Control points for bezier curve petals
              const cp1x = 250 + 80 * Math.cos(angle - 0.2);
              const cp1y = 250 + 80 * Math.sin(angle - 0.2);
              const cp2x = 250 + 80 * Math.cos(angle + 0.2);
              const cp2y = 250 + 80 * Math.sin(angle + 0.2);

              return (
                <g key={`lotus-inner-${i}`}>
                  <motion.path
                    d={`M ${x1} ${y1} Q ${cp1x} ${cp1y} ${x2} ${y2} Q ${cp2x} ${cp2y} ${x1} ${y1}`}
                    {...motionPathProps}
                  />
                </g>
              );
            })}

            {/* Outer Lotus Petals (Offset by 22.5 deg) */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4 + Math.PI / 8;
              const x1 = 250 + 65 * Math.cos(angle);
              const y1 = 250 + 65 * Math.sin(angle);
              const x2 = 250 + 180 * Math.cos(angle);
              const y2 = 250 + 180 * Math.sin(angle);
              const cp1x = 250 + 130 * Math.cos(angle - 0.25);
              const cp1y = 250 + 130 * Math.sin(angle - 0.25);
              const cp2x = 250 + 130 * Math.cos(angle + 0.25);
              const cp2y = 250 + 130 * Math.sin(angle + 0.25);

              return (
                <g key={`lotus-outer-${i}`}>
                  <motion.path
                    d={`M ${x1} ${y1} Q ${cp1x} ${cp1y} ${x2} ${y2} Q ${cp2x} ${cp2y} ${x1} ${y1}`}
                    {...motionPathProps}
                    stroke={accentColor}
                  />
                </g>
              );
            })}

            {/* Faint border ring */}
            <motion.circle cx="250" cy="250" r="220" {...motionPathProps} strokeWidth="0.8" />
            <motion.circle cx="250" cy="250" r="230" {...motionPathProps} stroke={accentColor} strokeWidth="0.5" strokeDasharray="6 4" />
          </>
        );

      case 'yantra':
        return (
          <>
            {/* Outer Square Bhupura (Gates of Yantra) */}
            <motion.path
              d="M 50 50 L 210 50 L 210 30 L 290 30 L 290 50 L 450 50 L 450 210 L 470 210 L 470 290 L 450 290 L 450 450 L 290 450 L 290 470 L 210 470 L 210 450 L 50 450 L 50 290 L 30 290 L 30 210 L 50 210 Z"
              {...motionPathProps}
            />

            {/* Circles inside Square */}
            <motion.circle cx="250" cy="250" r="180" {...motionPathProps} />
            <motion.circle cx="250" cy="250" r="160" {...motionPathProps} stroke={accentColor} />

            {/* Star of David / Triangles (Ashta Matrika Representation) */}
            {/* Upward Triangle */}
            <motion.path d="M 250 80 L 390 320 L 110 320 Z" {...motionPathProps} />
            {/* Downward Triangle */}
            <motion.path d="M 250 420 L 390 180 L 110 180 Z" {...motionPathProps} />

            {/* Inner layered triangles */}
            <motion.path d="M 250 120 L 360 300 L 140 300 Z" {...motionPathProps} stroke={accentColor} />
            <motion.path d="M 250 380 L 360 200 L 140 200 Z" {...motionPathProps} stroke={accentColor} />

            <motion.circle cx="250" cy="250" r="40" {...motionPathProps} />
            <motion.circle cx="250" cy="250" r="8" {...motionPathProps} fill={color} />
          </>
        );

      case 'mandala':
      default:
        return (
          <>
            {/* Concentric geometric base rings */}
            <motion.circle cx="250" cy="250" r="240" {...motionPathProps} strokeWidth="0.8" />
            <motion.circle cx="250" cy="250" r="225" {...motionPathProps} strokeDasharray="10 5" />
            <motion.circle cx="250" cy="250" r="200" {...motionPathProps} />
            <motion.circle cx="250" cy="250" r="175" {...motionPathProps} stroke={accentColor} />
            <motion.circle cx="250" cy="250" r="150" {...motionPathProps} />

            {/* Radial sunburst pointers (12 Rays) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / 12;
              const x1 = 250 + 150 * Math.cos(angle);
              const y1 = 250 + 150 * Math.sin(angle);
              const x2 = 250 + 200 * Math.cos(angle);
              const y2 = 250 + 200 * Math.sin(angle);

              return (
                <motion.line
                  key={`ray-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  {...motionPathProps}
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Intricate Sacred Knotwork / Quadrants */}
            {Array.from({ length: 4 }).map((_, i) => {
              const rotAngle = i * 90;
              return (
                <g key={`quad-${i}`} transform={`rotate(${rotAngle} 250 250)`}>
                  {/* Gate-like path in each cardinal direction */}
                  <motion.path
                    d="M 210 100 L 290 100 L 290 150 L 250 150 L 250 175 L 210 175 Z"
                    {...motionPathProps}
                    stroke={accentColor}
                  />
                  {/* Internal lotus seed motif */}
                  <motion.path
                    d="M 250 175 Q 220 200 250 225 Q 280 200 250 175"
                    {...motionPathProps}
                  />
                </g>
              );
            })}

            {/* Center Core */}
            <motion.circle cx="250" cy="250" r="45" {...motionPathProps} />
            <motion.circle cx="250" cy="250" r="30" {...motionPathProps} stroke={accentColor} strokeDasharray="3 3" />
            <motion.circle cx="250" cy="250" r="12" {...motionPathProps} />
            <motion.circle cx="250" cy="250" r="4" {...motionPathProps} fill={color} />
          </>
        );
    }
  };

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className={className}
      variants={rotationVariants}
      animate="animate"
    >
      {renderPattern()}
    </motion.svg>
  );
}
