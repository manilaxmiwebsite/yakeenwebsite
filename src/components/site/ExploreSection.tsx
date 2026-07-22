'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ICategory } from '@/types';

interface ExploreSectionProps {
  categories: ICategory[];
}

export default function ExploreSection({ categories }: ExploreSectionProps) {
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

  const categoryImages: Record<string, string> = {
    'Chains': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'Bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'God Idols': 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80',
    'Rings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'Anklets': 'https://images.unsplash.com/photo-1515562141589-67f0cabc5c7a?w=800&q=80',
    'Silver Gift Items': 'https://images.unsplash.com/photo-1606738132449-1b1c0cb81e32?w=800&q=80',
  };

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="relative py-24 md:py-32"
    >
      <div className="luxury-container">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 reveal">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {categories.slice(0, 6).map((category, index) => (
            <motion.div
              key={category._id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
              }}
            >
            <Link
              href={`/explore/${category.slug}`}
              className={`group relative overflow-hidden aspect-[4/5] bg-luxury-charcoal block ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              } ${index === 3 ? 'lg:col-span-2' : ''}`}
            >
              {/* Background Image */}
              <img
                src={category.image || categoryImages[category.name] || ''}
                alt={category.name}
                className="w-full h-full object-cover transition-all duration-1000 
                         group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/30 to-luxury-black/10
                            group-hover:from-luxury-black/80 transition-all duration-700" />

              {/* Silver line accent */}
              <div className="absolute inset-0 border border-luxury-white/0 group-hover:border-luxury-silver/20 
                            transition-all duration-700 m-4" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-display text-2xl md:text-3xl text-luxury-white mb-2 
                            transform transition-all duration-500 
                            group-hover:translate-x-2">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-luxury-white/40 mb-4 line-clamp-1">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-luxury-silver/60
                              opacity-0 group-hover:opacity-100 transition-all duration-500 
                              transform translate-y-2 group-hover:translate-y-0">
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
