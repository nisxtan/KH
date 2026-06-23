'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/api/axios';
import { motion } from 'framer-motion';
import { MessageCircle, Ruler, Info, Box, ArrowLeft, Share2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useCurrency } from '@/context/CurrencyContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, EffectFade } from 'swiper/modules';
import AnimatedText from "@/components/ui/AnimatedText";
import SacredGeometry from "@/components/ui/SacredGeometry";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';

const getWatermarkedUrl = (url: string) => {
  if (url && url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    // 3 transparent watermarks: top, center, bottom — no background box
    return url.replace(
      '/image/upload/',
      '/image/upload/' +
        'l_text:Arial_28_bold:Copyright%20Kiran%20Handicrafts,co_rgb:FFFFFFAA,o_40/fl_layer_apply,g_north,y_80/' +
        'l_text:Arial_28_bold:Copyright%20Kiran%20Handicrafts,co_rgb:FFFFFFAA,o_40/fl_layer_apply,g_center/' +
        'l_text:Arial_28_bold:Copyright%20Kiran%20Handicrafts,co_rgb:FFFFFFAA,o_40/fl_layer_apply,g_south,y_80/'
    );
  }
  return url;
};

export default function ProductDetails() {
  const { slug } = useParams();
  const locale = useLocale();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, settRes] = await Promise.all([
          axiosInstance.get(`/products/${slug}?lang=${locale}`),
          axiosInstance.get(`/settings?lang=${locale}`)
        ]);
        setProduct(prodRes.data);
        setSettings(settRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, locale]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft' && product?.images?.length > 1) {
        setActivePhotoIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight' && product?.images?.length > 1) {
        setActivePhotoIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, product]);

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Kiran Handicraft Masterpiece',
      text: `Check out this handcrafted masterpiece: ${product?.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      // User cancelled or share failed
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="text-gold animate-spin" size={40} />
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold animate-pulse">Curating Masterpiece...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex items-center justify-center bg-transparent">
      <div className="text-center space-y-8">
        <h2 className="text-5xl font-premium text-ivory">Masterpiece Not Found</h2>
        <Link href="/products" className="inline-block px-10 py-4 bg-gold text-espresso rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-gold-light hover:scale-105 transition-all shadow-xl">
          Return to Gallery
        </Link>
      </div>
    </div>
  );

  const whatsappNumber = settings['contact_whatsapp'] || '9779849532402';
  const whatsappMessage = `Greetings Kiran Handicraft, I am deeply interested in the ${product.name} (Ref: ${product.slug}). May I have more information?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-transparent min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
        <SacredGeometry pattern="lotus" className="w-[800px] h-[800px]" color="#D4AF37" rotationSpeed={200} />
      </div>
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Back Button */}
        <div className="flex justify-center lg:justify-start gap-3 mb-12">
            <Link href="/products" className="inline-flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-md border border-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest text-ivory/60 hover:text-ivory hover:border-gold/50 transition-all shadow-sm">
                <ArrowLeft size={14} /> Back to Collection
            </Link>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-md border border-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest text-ivory/60 hover:text-ivory hover:border-gold/50 transition-all shadow-sm cursor-pointer"
            >
              <Share2 size={14} /> Share
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start relative z-10">
          
          {/* Visual Showcase */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="w-full max-w-[500px] space-y-6"
            >
              <div className="relative">
                <Swiper
                  spaceBetween={0}
                  effect={'fade'}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Navigation, Thumbs, EffectFade]}
                  className="aspect-square bg-black/40 backdrop-blur-md rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-divine border border-gold/20"
                >
                  {product.images.map((img: string, idx: number) => (
                    <SwiperSlide key={idx}>
                      <img 
                        src={img} 
                        alt={product.name} 
                        className="w-full h-full object-cover cursor-zoom-in" 
                        onClick={() => {
                          setActivePhotoIndex(idx);
                          setIsLightboxOpen(true);
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Image Count Decoration */}
                <div className="absolute bottom-6 right-6 z-10 hidden md:block">
                   <span className="text-[9px] tracking-[0.2em] uppercase bg-black/80 backdrop-blur-md text-ivory px-5 py-2.5 rounded-xl font-black shadow-2xl border border-gold/25">
                     Ref: 0{product.id}
                   </span>
                </div>
              </div>

              <div className="w-full">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={12}
                    slidesPerView={4}
                    watchSlidesProgress={true}
                    modules={[Navigation, Thumbs]}
                    className="thumbs-swiper"
                >
                    {product.images.map((img: string, idx: number) => (
                    <SwiperSlide key={idx} className="cursor-pointer aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-gold transition-all grayscale hover:grayscale-0 shadow-sm bg-black/40">
                        <img src={img} alt={product.name} className="w-full h-full object-cover" />
                    </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </motion.div>
          </div>

          {/* Intellectual Showcase */}
          <div className="w-full lg:w-1/2 space-y-12 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-8 flex flex-col items-center lg:items-start"
            >
              <h1 className="text-5xl md:text-6xl xl:text-8xl font-black text-ivory uppercase tracking-tighter leading-[0.9]">
                <AnimatedText text={product.name} animationType="words" direction="up" delay={0.05} underline />
              </h1>
              
              <div className="w-full flex flex-col sm:flex-row items-center justify-between py-10 border-y border-gold/20 gap-8">
                <span className="text-4xl md:text-5xl font-black text-gold tracking-tighter">{formatPrice(product.price)}</span>
                <div className="flex flex-col items-center lg:items-end">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/40 mb-2 font-black">Availability</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${product.available ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-red-950/40 text-red-400 border border-red-500/30'}`}>
                    {product.available ? 'In Sanctuary' : 'By Commission'}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-ivory/40 font-black">Ritual Narrative</h3>
                <p className="text-ivory/70 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-gold/30 pl-8 text-left max-w-2xl mx-auto lg:mx-0">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-black/40 backdrop-blur-md p-8 rounded-[2rem] border border-gold/20 space-y-3 text-left">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/40 font-black">Dimensions</p>
                  <p className="text-xl font-black text-ivory tracking-tight">{product.size}</p>
                </div>
                <div className="bg-black/40 backdrop-blur-md p-8 rounded-[2rem] border border-gold/20 space-y-3 text-left">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/40 font-black">Sacred Core</p>
                  <p className="text-xl font-black text-ivory tracking-tight leading-tight">{product.material}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="pt-4"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-4 w-full bg-gold text-espresso py-6 rounded-3xl md:rounded-[2.5rem] overflow-hidden transition-all duration-700 shadow-2xl hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gold-light translate-y-[101%] group-hover:translate-y-0 transition-transform duration-700"></div>
                <MessageCircle size={22} className="relative z-10 group-hover:text-espresso transition-colors" />
                <span className="relative z-10 text-xs uppercase tracking-[0.4em] font-black group-hover:text-espresso transition-colors">Inquire via WhatsApp</span>
              </a>
              
              <div className="text-center mt-10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-ivory/20">Handcrafted Excellence Since 1988</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal Carousel */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl p-4 md:p-8 select-none transition-all duration-300 animate-fade-in">
          {/* Top Bar with close button */}
          <div className="flex justify-between items-center text-ivory/80 relative z-10 w-full max-w-7xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gold">
              Secured Masterpiece Preview ({activePhotoIndex + 1} / {product.images.length})
            </span>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="p-3 rounded-full hover:bg-white/10 text-ivory hover:text-gold transition-colors duration-300"
              aria-label="Close Preview"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Showcase (Image and controls) */}
          <div className="relative flex-grow flex items-center justify-center py-4 w-full max-w-7xl mx-auto">
            {/* Prev Button */}
            {product.images.length > 1 && (
              <button 
                onClick={() => setActivePhotoIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                className="absolute left-2 md:left-6 p-4 rounded-full bg-black/60 hover:bg-gold/20 text-ivory hover:text-gold transition-colors z-20 border border-gold/20"
                aria-label="Previous Image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Image (With Diagonal Repeating Watermark) */}
            <div className="w-full max-h-[70vh] flex items-center justify-center relative">
              <img 
                src={getWatermarkedUrl(product.images[activePhotoIndex])}
                alt={`${product.name} Preview`}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-gold/20 shadow-2xl transition-all duration-500"
              />
            </div>

            {/* Next Button */}
            {product.images.length > 1 && (
              <button 
                onClick={() => setActivePhotoIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 md:right-6 p-4 rounded-full bg-black/60 hover:bg-gold/20 text-ivory hover:text-gold transition-colors z-20 border border-gold/20"
                aria-label="Next Image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Thumbnail list (bottom) */}
          {product.images.length > 1 && (
            <div className="flex justify-center gap-3 overflow-x-auto pb-4 max-w-xl mx-auto z-10 w-full scrollbar-hide">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    idx === activePhotoIndex ? 'border-gold scale-105 shadow-lg shadow-gold/20' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
