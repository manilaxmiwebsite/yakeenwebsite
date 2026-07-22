'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { IProduct } from '@/types';

interface ProductCardProps {
  product: IProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
    <Link
      href={`/product/${product._id}`}
      className="group block"
    >
      <div className="relative overflow-hidden bg-luxury-charcoal/40 silver-border aspect-[3/4]">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 
                     group-hover:scale-105 group-hover:brightness-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-luxury-steel/30 text-4xl font-display">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/30 
                      transition-all duration-700" />

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-luxury-black/80 via-luxury-black/20 to-transparent" />

        {/* Product info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <h3 className="text-sm md:text-base font-display text-luxury-white font-medium
                        transform transition-all duration-500
                        group-hover:translate-y-[-2px]">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-luxury-white/40 mt-1 line-clamp-1
                        transform transition-all duration-500
                        group-hover:translate-y-[-2px]">
              {product.description}
            </p>
          )}
        </div>

        {/* Silver line accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-luxury-silver/0 
                      group-hover:bg-luxury-silver/60 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-silver/0 
                      group-hover:bg-luxury-silver/60 transition-all duration-700" />
      </div>
    </Link>
    </motion.div>
  );
}
