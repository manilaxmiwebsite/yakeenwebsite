'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Gem, Sparkles, Award } from 'lucide-react';

interface AboutSectionProps {
  title?: string;
  content?: string;
  image?: string;
}

export default function AboutSection({
  title = 'Our Legacy of Silver Craftsmanship',
  content = `For generations, Manilakshmi Silver has been synonymous with unparalleled craftsmanship and timeless elegance. Each piece is meticulously handcrafted by master artisans who transform pure silver into wearable art. Our commitment to quality, purity, and design excellence has made us a trusted name in premium silver jewelry.

Every creation from our atelier carries forward a tradition of excellence, blending heritage techniques with contemporary aesthetics. We source only the finest silver, ensuring each piece meets the highest standards of purity and durability.`,
  image = '',
}: AboutSectionProps) {
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

  const values = [
    {
      icon: Gem,
      title: 'Pure Craftsmanship',
      desc: 'Each piece handcrafted by master silversmiths with generations of expertise.',
    },
    {
      icon: Shield,
      title: 'Certified Purity',
      desc: 'Every product meets stringent purity standards. Certified authentic silver.',
    },
    {
      icon: Sparkles,
      title: 'Timeless Designs',
      desc: 'Blending heritage motifs with contemporary elegance for enduring beauty.',
    },
    {
      icon: Award,
      title: 'Heritage Trust',
      desc: 'Decades of unwavering commitment to quality and customer satisfaction.',
    },
  ];

  const paragraphs = content.split('\n').filter(Boolean);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background subtle texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/50 to-luxury-black" />
      </div>

      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt="Manilakshmi Silver Craftsmanship"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-luxury-gunmetal to-luxury-charcoal 
                              flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl font-display text-luxury-white/10">M</span>
                    <p className="text-luxury-white/20 text-xs tracking-[0.2em] uppercase mt-2">
                      Craftsmanship
                    </p>
                  </div>
                </div>
              )}

              {/* Decorative frame */}
              <div className="absolute -inset-0 border border-luxury-silver/10 pointer-events-none" />
              <div className="absolute top-6 left-6 right-6 bottom-6 border border-luxury-white/5 pointer-events-none" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-12 h-[1px] bg-luxury-silver/30" />
              <div className="absolute top-0 left-0 w-[1px] h-12 bg-luxury-silver/30" />
              <div className="absolute top-0 right-0 w-12 h-[1px] bg-luxury-silver/30" />
              <div className="absolute top-0 right-0 w-[1px] h-12 bg-luxury-silver/30" />
              <div className="absolute bottom-0 left-0 w-12 h-[1px] bg-luxury-silver/30" />
              <div className="absolute bottom-0 left-0 w-[1px] h-12 bg-luxury-silver/30" />
              <div className="absolute bottom-0 right-0 w-12 h-[1px] bg-luxury-silver/30" />
              <div className="absolute bottom-0 right-0 w-[1px] h-12 bg-luxury-silver/30" />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="section-label">About Us</span>
            <h2 className="section-title mb-8">{title}</h2>

            <div className="space-y-5 mb-10">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-luxury-white/60 leading-relaxed font-body font-light">
                  {para}
                </p>
              ))}
            </div>

            {/* Values */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
                    }}
                    className="p-5 border border-luxury-gunmetal/30 hover:border-luxury-silver/20 
                              transition-all duration-500 group"
                  >
                    <Icon
                      size={18}
                      className="text-luxury-silver/60 mb-3 group-hover:text-luxury-silver transition-colors duration-500"
                    />
                    <h4 className="text-sm font-display text-luxury-white mb-1">{value.title}</h4>
                    <p className="text-xs text-luxury-white/40 leading-relaxed">{value.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
