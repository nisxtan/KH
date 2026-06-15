'use client';

import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface HoverCardProps {
  /** The children elements contained within the card */
  children: React.ReactNode;
  /** Custom CSS classes for the outer animated container */
  className?: string;
  /** Customize maximum tilt degree on X and Y axes */
  maxTilt?: number;
  /** Custom spring stiffness for the tilt return action */
  stiffness?: number;
  /** Custom spring damping for the tilt return action */
  damping?: number;
  /** Add a shiny reflective glare overlay that follows the cursor */
  glare?: boolean;
  /** Custom glare opacity limit */
  maxGlareOpacity?: number;
  /** Scale card up slightly on hover */
  scaleOnHover?: boolean;
  /** Target link or callback when card is clicked */
  onClick?: () => void;
}

/**
 * A premium 3D Tilt Hover card wrapper.
 * Combines CSS 3D perspective transforms with mouse tracking hooks
 * in Framer Motion to create a tactile card interaction with dynamic glare.
 */
export default function HoverCard({
  children,
  className = '',
  maxTilt = 10,
  stiffness = 200,
  damping = 25,
  glare = true,
  maxGlareOpacity = 0.15,
  scaleOnHover = true,
  onClick,
}: HoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Framer Motion motion values for cursor position tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map motion values to rotational ranges
  const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Smooth the rotations using spring physics
  const springConfig = { stiffness, damping, mass: 1 } as const;
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Setup scale spring
  const scale = useMotionValue(1);
  const smoothScale = useSpring(scale, springConfig);

  // Glare overlay values
  const glareX = useMotionValue(0);
  const glareY = useMotionValue(0);
  const glareOpacity = useMotionValue(0);
  const smoothGlareOpacity = useSpring(glareOpacity, springConfig);

  // Mouse event handlers
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position normalized from -0.5 to 0.5
    const relativeX = (event.clientX - rect.left) / width - 0.5;
    const relativeY = (event.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);

    if (glare) {
      const gX = ((event.clientX - rect.left) / width) * 100;
      const gY = ((event.clientY - rect.top) / height) * 100;
      glareX.set(gX);
      glareY.set(gY);
      glareOpacity.set(maxGlareOpacity);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (scaleOnHover) {
      scale.set(1.02);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    scale.set(1);
    if (glare) {
      glareOpacity.set(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        scale: smoothScale,
      }}
      className={`relative select-none will-change-transform ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Glare Reflection overlay */}
      {glare && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            pointerEvents: 'none',
            background: useTransform(
              [glareX, glareY],
              ([gX, gY]) =>
                `radial-gradient(circle 280px at ${gX}% ${gY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`
            ),
            opacity: smoothGlareOpacity,
            borderRadius: 'inherit',
          }}
          className="w-full h-full mix-blend-overlay"
        />
      )}

      {/* Actual content container */}
      <div 
        className="w-full h-full transition-[border-color,box-shadow] duration-300"
        style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </motion.div>
  );
}
