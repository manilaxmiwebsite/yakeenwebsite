'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ICategory } from '@/types';

interface ExploreSectionProps {
  categories: ICategory[];
  columns?: number;
  cardSize?: string;
  totalCategoryCount?: number;
}

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${name} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } group-hover:scale-110`}
        />
      ))}
    </>
  );
}

export default function ExploreSection({ categories, columns = 3, cardSize = '4-5', totalCategoryCount }: ExploreSectionProps) {
  const aspectMap: Record<string, string> = {
    '2-3': 'aspect-[2/3]',
    '3-4': 'aspect-[3/4]',
    '4-5': 'aspect-[4/5]',
  };
  const aspectClass = aspectMap[cardSize] || 'aspect-[4/5]';

  const columnsClass = columns === 4
    ? 'grid-cols-2 md:grid-cols-4'
    : columns === 2
    ? 'grid-cols-2 md:grid-cols-2'
    : 'grid-cols-2 md:grid-cols-3';
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fallbackImages: Record<string, string> = {
    'Chains': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'Bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'God Idols': 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80',
    'Rings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'Anklets': 'https://images.unsplash.com/photo-1515562141589-67f0cabc5c7a?w=800&q=80',
    'Silver Gift Items': 'https://images.unsplash.com/photo-1606738132449-1b1c0cb81e32?w=800&q=80',
  };

  const allImages = (cat: ICategory): string[] => {
    const imgs = cat.images?.filter(Boolean) || [];
    if (imgs.length > 0) return imgs;
    const fallback = fallbackImages[cat.name];
    return fallback ? [fallback] : [];
  };

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="relative py-16 md:py-24"
    >
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16 reveal">
          <span className="section-label">Curated Collection</span>
          <h2 className="section-title mb-6">Explore Our Collection</h2>
          <div className="silver-divider mx-auto mb-6" />
          <p className="section-subtitle mx-auto">
            Discover the finest silver craftsmanship, each category a testament to 
            generations of artistic mastery and devotion to perfection.
          </p>
        </div>

        {/* Category Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className={`grid ${columnsClass} gap-3 md:gap-5`}
        >
          {categories.slice(0, 6).map((category, index) => {
            const images = allImages(category);
            return (
            <motion.div
              key={category._id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
              }}
              whileTap={{ scale: 0.96 }}
            >
            <Link
              href={`/explore/${category.slug}`}
              className={`group relative overflow-hidden ${aspectClass} bg-luxury-charcoal block ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              } ${index === 3 ? 'lg:col-span-2' : ''}`}
            >
              {/* Carousel Images */}
              {images.length > 0 ? (
                <ImageCarousel images={images} name={category.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-6xl text-luxury-white/5">{category.name.charAt(0)}</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/30 to-luxury-black/10
                            group-hover:from-luxury-black/80 transition-all duration-700" />

              {/* Silver line accent */}
              <div className="absolute inset-0 border border-luxury-white/0 group-hover:border-luxury-silver/20 
                            transition-all duration-700 m-4" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-8">
                <h3 className="font-display text-base md:text-3xl text-luxury-white mb-1 md:mb-2 
                            transform transition-all duration-500 
                            group-hover:translate-x-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-[10px] md:text-sm text-luxury-white/40 mb-1 md:mb-4 line-clamp-1 hidden md:block">
                    {category.description}
                  </p>
                )}
                <div className="hidden md:flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-luxury-silver/60
                              opacity-0 group-hover:opacity-100 transition-all duration-500 
                              transform translate-y-2 group-hover:translate-y-0">
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
            </motion.div>
            );
          })}
        </motion.div>

        {/* See All Button */}
        {totalCategoryCount !== undefined && totalCategoryCount > categories.length && categories.length >= 6 && (
          <div className="text-center mt-10 md:mt-14">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-luxury-silver/30 
                       text-xs tracking-[0.2em] uppercase text-luxury-silver/70 
                       hover:bg-luxury-silver/10 hover:border-luxury-silver/50 
                       transition-all duration-300 group"
            >
              <span>View All Categories</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
