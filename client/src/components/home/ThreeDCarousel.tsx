'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Shakyamuni Buddha',
    subtitle: 'Symbol of Enlightenment',
    desc: 'Pure Copper gilding with 24K Gold Leaf. Master-crafted facial painting in gold dust.',
    image: '/golden_statue_bg.png',
  },
  {
    id: 2,
    title: 'Arya Green Tara',
    subtitle: 'Mother of Liberation',
    desc: 'Detailed lost-wax hand-casting. Features authentic hand-set coral and turquoise stones.',
    image: 'https://images.unsplash.com/photo-1544111301-44754a01948d?q=80&w=800',
  },
  {
    id: 3,
    title: 'Vajrasattva Deity',
    subtitle: 'The Great Purifier',
    desc: 'Extraordinary filigree carvings. Masterfully carved vajra and bell accents.',
    image: 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=800',
  },
  {
    id: 4,
    title: 'Four-Armed Chenrezig',
    subtitle: 'Lord of Compassion',
    desc: 'Full fire-gilded body. Intricate hand-etched robes depicting sacred mantras.',
    image: 'https://images.unsplash.com/photo-1616423641454-e6992925345b?q=80&w=800',
  },
  {
    id: 5,
    title: 'Maharaja Ganesh',
    subtitle: 'Remover of Obstacles',
    desc: 'Oxidized copper finish with fine 24K gold highlights. Captures cosmic power in heavy casting.',
    image: 'https://images.unsplash.com/photo-1533633517164-9da96eb5bb09?q=80&w=800',
  }
];

export default function ThreeDCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const getCardStyle = (index: number) => {
    const total = slides.length;
    let offset = index - activeIndex;

    // Handle cyclic offset wrapping
    if (offset < -total / 2) offset += total;
    if (offset > total / 2) offset -= total;

    const absOffset = Math.abs(offset);
    
    // Custom calculations for intense 3D curvature
    const xMultiplier = isMobile ? 75 : 130;
    const x = offset * xMultiplier;
    const scale = 1 - absOffset * 0.22;
    const rotateY = offset * -45;
    const zIndex = 10 - absOffset;
    const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.4;
    const blur = absOffset > 0 ? 'blur(5px)' : 'blur(0px)';

    return {
      x,
      scale,
      rotateY,
      zIndex,
      opacity,
      style: {
        filter: blur,
        transformStyle: 'preserve-3d' as const,
        perspective: '1000px',
      }
    };
  };

  const activeSlide = slides[activeIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full py-2 select-none relative -top-6 md:-top-16">
      {/* 3D Perspective Stage */}
      <div 
        className="relative w-full h-[360px] md:h-[560px] flex items-center justify-center overflow-visible"
        style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[240px] md:w-[400px] h-[240px] md:h-[400px] bg-gold/5 rounded-full blur-[80px]" />
        </div>

        <AnimatePresence initial={false}>
          {slides.map((slide, index) => {
            const cardParams = getCardStyle(index);
            const isCenter = index === activeIndex;

            return (
              <motion.div
                key={slide.id}
                style={{
                  position: 'absolute',
                  width: isMobile ? '220px' : '360px',
                  height: isMobile ? '320px' : '520px',
                  ...cardParams.style
                }}
                animate={{
                  x: cardParams.x,
                  scale: cardParams.scale,
                  rotateY: cardParams.rotateY,
                  zIndex: cardParams.zIndex,
                  opacity: cardParams.opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 18
                }}
                onClick={() => {
                  if (!isCenter) setActiveIndex(index);
                }}
                className={`rounded-[2rem] md:rounded-[2.8rem] border overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 ${
                  isCenter 
                    ? 'border-gold shadow-gold/20' 
                    : 'border-gold/10 hover:border-gold/30 shadow-black/10'
                }`}
              >
                {/* Image and Overlay */}
                <div className="relative w-full h-full bg-espresso">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-1000"
                    draggable={false}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/10 to-transparent transition-opacity duration-500 ${
                    isCenter ? 'opacity-80' : 'opacity-40'
                  }`} />

                  {/* Tiny floating title on the card itself for non-active cards */}
                  {!isCenter && (
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-sacred/80 truncate">
                        {slide.title}
                      </p>
                    </div>
                  )}

                  {/* Gilded Border Highlight */}
                  <div className="absolute inset-0 border border-gold/10 rounded-[2rem] md:rounded-[2.8rem] pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
