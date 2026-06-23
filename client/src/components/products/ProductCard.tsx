'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    size: string;
    material?: string;
    images: string[];
    category?: { name: string } | null;
    featured: boolean;
    description?: string;
  };
  hoverUp?: boolean;
}

export default function ProductCard({ product, hoverUp = false }: ProductCardProps) {
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={hoverUp ? { y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } } : {}}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group bg-espresso/40 backdrop-blur-md rounded-3xl border border-gold/20 overflow-hidden hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10 transition-[border-color,box-shadow] duration-300 h-full"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
        {/* Image - Square on mobile, 4/3 on desktop */}
        <div className="relative overflow-hidden bg-espresso/60 aspect-square md:aspect-[4/3] shimmer-hover">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1544111301-44754a01948d?q=80&w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 md:gap-2">
            {product.featured && (
              <span className="bg-gold text-espresso text-[7px] md:text-[8px] font-black uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl">
                Elite Collection
              </span>
            )}
            {product.category?.name && (
              <span className="bg-black/60 backdrop-blur-sm text-ivory/90 text-[7px] md:text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl border border-gold/15">
                {product.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3 md:p-5">
          <h3 className="font-black tracking-tight text-ivory group-hover:text-gold transition-colors leading-tight mb-1 text-xs md:text-base line-clamp-1">
            {product.name}
          </h3>

          {/* Size & Material */}
          <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider text-gold/70 mb-2 line-clamp-1">
            {[product.size, product.material].filter(Boolean).join(' · ') || 'Handcrafted'}
          </p>

          <p className="hidden md:block text-ivory/50 text-xs font-medium leading-relaxed mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description || 'Handcrafted in Bouddha, Kathmandu'}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 md:pt-3 border-t border-gold/20">
            <span className="font-black text-gold text-[10px] md:text-sm">
              {formatPrice(product.price)}
            </span>
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-espresso text-sacred group-hover:bg-gold group-hover:text-espresso transition-all duration-300">
              <ChevronRight size={10} className="md:w-4 md:h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
