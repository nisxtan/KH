'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    size: string;
    images: string[];
    category: string;
    featured: boolean;
    description?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group bg-sacred rounded-3xl border border-gold/10 overflow-hidden shadow-divine hover:border-gold/30 hover:shadow-gold/10 transition-all duration-500 flex flex-col h-full"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
        {/* Image - Square on mobile, 4/3 on desktop */}
        <div className="relative overflow-hidden bg-ivory aspect-square md:aspect-[4/3]">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1544111301-44754a01948d?q=80&w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 md:gap-2">
            <span className="bg-sacred/90 backdrop-blur-sm text-espresso text-[7px] md:text-[8px] font-black uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl border border-gold/10">
              {product.category?.name || 'Uncategorized'}
            </span>
            {product.featured && (
              <span className="bg-gold text-espresso text-[7px] md:text-[8px] font-black uppercase tracking-wider px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl">
                Elite Collection
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3 md:p-6">
          <h3 className="font-black tracking-tight text-espresso group-hover:text-bronze transition-colors leading-tight mb-1 md:mb-2 text-xs md:text-lg line-clamp-1 md:line-clamp-2">
            {product.name}
          </h3>

          <p className="hidden md:block text-espresso/40 text-xs font-medium leading-relaxed line-clamp-2 mb-4 flex-1">
            {product.description || 'Handcrafted in Bouddha, Kathmandu'}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 md:pt-4 border-t border-gold/5">
            <span className="font-black text-espresso text-[10px] md:text-sm">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-espresso text-sacred group-hover:bg-gold group-hover:text-espresso transition-all">
              <ChevronRight size={10} className="md:w-4 md:h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
