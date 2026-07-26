'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { IProduct } from '@/types';

interface ProductSlideshowProps {
  products: IProduct[];
  whatsappNumber?: string;
  whatsappMessage?: string;
  autoPlaySpeed?: number;
}

export default function ProductSlideshow({
  products,
  whatsappNumber = '919876543210',
  whatsappMessage = 'Hello Manilakshmi Silver, I am interested in this product: {product}. Please share more details.',
  autoPlaySpeed = 5000,
}: ProductSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);
  const totalSlides = products.length;

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
    resetInterval();
  };

  const goNext = () => {
    goToSlide((currentIndex + 1) % totalSlides);
  };

  const goPrev = () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlaySpeed);
  };

  useEffect(() => {
    if (totalSlides === 0) return;
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSlides]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isDragging.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const SWIPE_THRESHOLD = 50;
    if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
      if (touchDeltaX.current > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
    resetInterval();
  };

  const handleWhatsApp = (productName: string, productId: string) => {
    const productUrl = window.location.origin + '/product/' + productId;
    const msg = encodeURIComponent(
      whatsappMessage.replace('{product}', productName) +
      `\n\nProduct Link: ${productUrl}`
    );
    window.open(
      `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (totalSlides === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <section
      className="relative h-[70vh] min-h-[400px] max-h-[700px] overflow-hidden mb-12"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Background images */}
      {products.map((product, index) => (
        <div
          key={product._id}
          className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${
            index === currentIndex
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-luxury-charcoal to-luxury-black" />
          )}
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-luxury-black/40 to-luxury-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/40 via-transparent to-luxury-black/40" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-20">
        <div className="luxury-container w-full">
          <div className="max-w-2xl">
            {/* Product name */}
            <motion.h2
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-luxury-white font-medium leading-tight mb-2"
            >
              {currentProduct.name}
            </motion.h2>

            {/* Caption */}
            {currentProduct.caption && (
              <motion.p
                key={`caption-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-sm md:text-base text-luxury-white/60 font-body font-light max-w-lg leading-relaxed mb-4"
              >
                {currentProduct.caption}
              </motion.p>
            )}

            {/* View Product CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-center gap-3"
            >
              <a
                href={`/product/${currentProduct._id}`}
                className="group inline-flex items-center gap-3 px-5 py-2.5
                         bg-luxury-white/10 backdrop-blur-md border border-luxury-white/20
                         text-luxury-white text-xs tracking-[0.15em] uppercase font-medium
                         hover:bg-luxury-white hover:text-luxury-black
                         transition-all duration-500"
              >
                <span>View Details</span>
                <span className="text-luxury-white/30 group-hover:text-luxury-black/30 transition-colors duration-500">→</span>
              </a>
              <button
                onClick={() => handleWhatsApp(currentProduct.name, currentProduct._id)}
                className="group inline-flex items-center gap-2 px-4 py-2.5
                         border border-luxury-white/10 text-luxury-white/40
                         text-[10px] tracking-[0.15em] uppercase
                         hover:bg-[#25D366] hover:text-white hover:border-[#25D366]
                         transition-all duration-500"
              >
                <MessageCircle size={14} />
                <span>Inquire</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation arrows - hidden on mobile */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goPrev}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10
                     border border-luxury-white/10 text-luxury-white/40
                     hover:bg-luxury-white/10 hover:text-luxury-white hover:border-luxury-white/20
                     transition-all duration-500 items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNext}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10
                     border border-luxury-white/10 text-luxury-white/40
                     hover:bg-luxury-white/10 hover:text-luxury-white hover:border-luxury-white/20
                     transition-all duration-500 items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {products.slice(0, Math.min(totalSlides, 10)).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-700 rounded-full ${
              index === currentIndex
                ? 'w-8 h-1 bg-luxury-silver'
                : 'w-1.5 h-1.5 bg-luxury-white/20 hover:bg-luxury-white/40'
            }`}
          >
            <span className="sr-only">Product {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Product counter */}
      <div className="absolute top-6 right-6 text-[10px] tracking-[0.2em] text-luxury-white/30 font-mono">
        {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
      </div>
    </section>
  );
}
