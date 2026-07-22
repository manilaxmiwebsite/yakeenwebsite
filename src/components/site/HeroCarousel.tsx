'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

interface HeroProduct {
  _id: string;
  name: string;
  caption: string;
  images: string[];
  category?: { name: string; slug: string };
}

interface HeroCarouselProps {
  products: HeroProduct[];
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export default function HeroCarousel({
  products,
  whatsappNumber = '919876543210',
  whatsappMessage = 'Hello Manilakshmi Silver, I am interested in this product: {product}. Please share more details.',
}: HeroCarouselProps) {
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
    }, 5000);
  };

  useEffect(() => {
    if (totalSlides === 0) return;
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSlides]);

  // Touch swipe handlers
  const handleTouchCancel = () => {
    isDragging.current = false;
    resetInterval();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isDragging.current = true;
    // Pause auto-scroll while touching
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

    // Resume auto-scroll
    resetInterval();
  };

  const handleWhatsApp = (productName: string) => {
    const msg = encodeURIComponent(
      whatsappMessage.replace('{product}', productName)
    );
    window.open(
      `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (totalSlides === 0) {
    return (
      <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center bg-luxury-black">
        <div className="text-center">
          <p className="text-luxury-white/30 font-display text-xl">No featured products</p>
          <p className="text-luxury-white/20 text-sm mt-2">Add hero products from the admin panel</p>
        </div>
      </section>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <section
      className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
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

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-luxury-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/60 via-transparent to-luxury-black/30" />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBtMCAuMDF2LS4wMSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')]" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="luxury-container w-full">
          <div className="max-w-3xl">
            {/* Category tag */}
            {currentProduct.category && (
              <div className="mb-6 animate-fade-in-down" key={`tag-${currentIndex}`}>
                <span className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 border border-luxury-silver/20 px-4 py-1.5 inline-block">
                  {typeof currentProduct.category === 'object' ? currentProduct.category.name : 'Featured'}
                </span>
              </div>
            )}

            {/* Product name */}
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-luxury-white font-medium leading-tight mb-4 md:mb-6"
            >
              {currentProduct.name}
            </motion.h1>

            {/* Caption */}
            {currentProduct.caption && (
              <motion.p
                key={`caption-${currentIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-sm sm:text-lg md:text-xl text-luxury-white/60 font-body font-light max-w-xl mb-6 md:mb-10 leading-relaxed"
              >
                {currentProduct.caption}
              </motion.p>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <button
                onClick={() => handleWhatsApp(currentProduct.name)}
                className="group inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 
                         bg-luxury-white/10 backdrop-blur-md border border-luxury-white/20
                         text-luxury-white text-xs md:text-sm tracking-[0.15em] uppercase font-medium
                         hover:bg-luxury-white hover:text-luxury-black 
                         transition-all duration-700"
              >
                <MessageCircle size={18} className="group-hover:scale-110 transition-transform duration-500" />
                <span>Inquire Now</span>
                <span className="text-luxury-white/30 group-hover:text-luxury-black/30 transition-colors duration-700">→</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {totalSlides > 1 && (
        <>            <button
            onClick={goPrev}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 
                     border border-luxury-white/10 text-luxury-white/40
                     hover:bg-luxury-white/10 hover:text-luxury-white hover:border-luxury-white/20
                     transition-all duration-500 flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 
                     border border-luxury-white/10 text-luxury-white/40
                     hover:bg-luxury-white/10 hover:text-luxury-white hover:border-luxury-white/20
                     transition-all duration-500 flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-700 ${
              index === currentIndex
                ? 'w-12 h-[2px] bg-luxury-silver'
                : 'w-6 h-[2px] bg-luxury-white/20 hover:bg-luxury-white/40'
            }`}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Counter */}
      <div className="absolute bottom-10 right-4 md:right-12 text-xs tracking-[0.2em] text-luxury-white/30 font-medium">
        {String(currentIndex + 1).padStart(2, '0')}
        <span className="mx-2">/</span>
        {String(totalSlides).padStart(2, '0')}
      </div>
    </section>
  );
}
