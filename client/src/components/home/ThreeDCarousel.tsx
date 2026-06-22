'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { useLocale } from 'next-intl';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
}

// Fallback data used when settings haven't loaded yet
const defaultSlides: Slide[] = [
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
    image: '/green_tara.png',
  },
  {
    id: 3,
    title: 'Vajrasattva Deity',
    subtitle: 'The Great Purifier',
    desc: 'Extraordinary filigree carvings. Masterfully carved vajra and bell accents.',
    image: '/vajrasattva.png',
  },
  {
    id: 4,
    title: 'Four-Armed Chenrezig',
    subtitle: 'Lord of Compassion',
    desc: 'Full fire-gilded body. Intricate hand-etched robes depicting sacred mantras.',
    image: '/chenrezig.png',
  },
  {
    id: 5,
    title: 'Maharaja Ganesh',
    subtitle: 'Remover of Obstacles',
    desc: 'Oxidized copper finish with fine 24K gold highlights. Captures cosmic power in heavy casting.',
    image: '/ganesh.png',
  }
];

/**
 * Parses flat settings key-value map into Slide[] array.
 * Keys follow pattern: carousel_slide{N}_{field}
 * Falls back to default slides if settings are empty.
 */
function parseSlides(settings: Record<string, string>): Slide[] {
  const slideMap = new Map<number, Partial<Slide>>();

  for (const [key, value] of Object.entries(settings)) {
    const match = key.match(/^carousel_slide(\d+)_(image|title|subtitle|desc)$/);
    if (!match) continue;
    
    const num = parseInt(match[1], 10);
    const field = match[2] as 'image' | 'title' | 'subtitle' | 'desc';
    
    if (!slideMap.has(num)) slideMap.set(num, { id: num });
    const slide = slideMap.get(num)!;
    slide[field] = value;
  }

  if (slideMap.size === 0) return defaultSlides;

  // Sort by slide number and filter out slides missing an image
  return Array.from(slideMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, slide]) => slide as Slide)
    .filter((s) => s.image && s.title);
}

export default function ThreeDCarousel() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const locale = useLocale();

  // Fetch carousel settings from API
  useEffect(() => {
    axiosInstance.get(`/settings?lang=${locale}`)
      .then((res) => {
        const parsed = parseSlides(res.data);
        if (parsed.length > 0) setSlides(parsed);
      })
      .catch(() => {
        // Silently fall back to hardcoded defaults
      });
  }, [locale]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay — uses functional update to avoid stale closure
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

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
    <div 
      className="flex flex-col items-center justify-center w-full py-2 select-none relative -top-6 md:-top-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
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
                  stiffness: 300,
                  damping: 25
                }}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: -100, right: 100 }}
                dragElastic={0.08}
                onDragEnd={(e, info) => {
                  if (!isCenter) return;
                  const swipeThreshold = 30;
                  if (info.offset.x < -swipeThreshold) {
                    handleNext();
                  } else if (info.offset.x > swipeThreshold) {
                    handlePrev();
                  }
                }}
                onClick={() => {
                  if (!isCenter) setActiveIndex(index);
                }}
                className={`rounded-[2rem] md:rounded-[2.8rem] border overflow-hidden shadow-2xl cursor-pointer transition-[border-color,box-shadow] duration-300 ${
                  isCenter 
                    ? 'border-gold shadow-gold/20 cursor-grab active:cursor-grabbing' 
                    : 'border-gold/10 hover:border-gold/30 shadow-black/10'
                }`}
              >
                {/* Image and Overlay */}
                <div className="relative w-full h-full bg-espresso pointer-events-none select-none">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-1000 pointer-events-none select-none"
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

      {/* ─── Active Slide Info Panel ─── */}
      <div className="w-full max-w-md mx-auto text-center mt-2 md:mt-4 px-4 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-1.5"
          >
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gold">
              {activeSlide.subtitle}
            </p>
            <h3 className="text-lg md:text-2xl font-black text-ivory tracking-tight uppercase">
              {activeSlide.title}
            </h3>
            <p className="text-ivory/40 text-[10px] md:text-xs font-medium leading-relaxed max-w-sm mx-auto">
              {activeSlide.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dot Navigation */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? 'w-8 h-2 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                  : 'w-2 h-2 bg-ivory/20 hover:bg-ivory/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
