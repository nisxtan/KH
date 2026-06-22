'use client';

import React, { useRef, MouseEvent, ReactElement } from 'react';
import { motion, useSpring } from 'framer-motion';

export interface MagneticProps {
  /** The single element to apply magnetic pull on. Must accept a ref */
  children: ReactElement;
  /** Maximum movement range in pixels */
  range?: number;
  /** Custom stiffness configuration for the attraction pull */
  stiffness?: number;
  /** Custom damping configuration for the attraction pull */
  damping?: number;
  /** Mass of the spring object */
  mass?: number;
  /** Enable optional interactive scaling on cursor drag/attraction */
  scaleOnHover?: boolean;
}

/**
 * A luxury magnetic attraction wrapper.
 * Dynamically calculated relative pointer vectors warp the targeted node's translation space,
 * pulling it toward the mouse coordinates whenever the pointer approaches.
 */
export default function Magnetic({
  children,
  range = 40,
  stiffness = 150,
  damping = 15,
  mass = 0.8,
  scaleOnHover = false,
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);

  // Spring values for smooth magnetic snapback
  const springConfig = { stiffness, damping, mass };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);
  const springScale = useSpring(1, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Displacement distance calculations
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < range) {
      // Attract element based on proximity
      const pullForce = 0.35; // Strength multiplier
      springX.set(distanceX * pullForce);
      springY.set(distanceY * pullForce);
      if (scaleOnHover) {
        springScale.set(1.05);
      }
    } else {
      // Snapback when mouse leaves boundaries
      springX.set(0);
      springY.set(0);
      springScale.set(1);
    }
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
    springScale.set(1);
  };

  // Attach mouse tracking listeners globally when inside the hover bounds of child element
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        scale: springScale,
      }}
      className="inline-block relative"
    >
      {React.cloneElement(children as ReactElement<any>, {
        ref: (node: HTMLElement | null) => {
          // Preserve the original ref of the child element if it exists
          const { ref: originalRef } = children as any;
          if (typeof originalRef === 'function') {
            originalRef(node);
          } else if (originalRef) {
            originalRef.current = node;
          }
          // Set local ref for center point calculations
          (ref as any).current = node;
        },
      })}
    </motion.div>
  );
}
