'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';
import { IInstagramImage } from '@/types';

interface InstagramSectionProps {
  instagramUrl?: string;
  instagramImages?: IInstagramImage[];
}

const placeholderPosts: IInstagramImage[] = [
  { image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', caption: 'Elegance in every detail' },
  { image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', caption: 'Handcrafted perfection' },
  { image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80', caption: 'Timeless silver artistry' },
  { image: 'https://images.unsplash.com/photo-1515562141589-67f0cabc5c7a?w=400&q=80', caption: 'Tradition meets design' },
  { image: 'https://images.unsplash.com/photo-1606738132449-1b1c0cb81e32?w=400&q=80', caption: 'Pure silver, pure art' },
  { image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', caption: 'Masterpiece in silver' },
  { image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', caption: 'Heritage crafted' },
  { image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80', caption: 'Designed for eternity' },
];

export default function InstagramSection({
  instagramUrl = '#',
  instagramImages = [],
}: InstagramSectionProps) {
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const posts = instagramImages.length > 0 ? instagramImages : placeholderPosts;

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

  useEffect(() => {
    if (!isAutoScrolling || !scrollRef.current || posts.length < 4) return;

    intervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (scrollRef.current.scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 1, behavior: 'smooth' });
        }
      }
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoScrolling, posts.length]);

  if (posts.length === 0) return null;

  return (
    <section
      id="instagram"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-silver/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="luxury-container mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 reveal">
          <div>
            <span className="section-label">Instagram</span>
            <h2 className="section-title mb-4">Follow Our Journey</h2>
            <div className="silver-divider" />
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline group"
          >
            <InstagramIcon size={16} />
            <span>Follow Us</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto px-6 md:px-12 lg:px-16 group`}
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
        onTouchStart={() => setIsAutoScrolling(false)}                    onTouchEnd={() => {
                      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
                      touchTimeoutRef.current = setTimeout(() => setIsAutoScrolling(true), 3000);
                    }}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[...posts, ...posts].map((post, index) => (
          <div
            key={`${post.image}-${index}`}
            className={`flex-shrink-0 w-[240px] md:w-[280px] aspect-square overflow-hidden bg-luxury-charcoal silver-border group/card hover:border-luxury-silver/30 transition-all duration-700 reveal`}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={post.image}
                alt={post.caption}
                className={`w-full h-full object-cover transition-all duration-700 group-hover/card:scale-110`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-luxury-black/0 via-transparent to-transparent group-hover/card:from-luxury-black/80 transition-all duration-700 flex items-end p-5`}>
                <p className={`text-luxury-white/0 group-hover/card:text-luxury-white/90 text-sm font-display transition-all duration-700 transform translate-y-4 group-hover/card:translate-y-0`}>
                  {post.caption}
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-luxury-black/60 to-transparent" />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
