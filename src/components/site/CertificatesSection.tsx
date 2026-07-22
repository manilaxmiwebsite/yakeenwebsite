'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ICertificate } from '@/types';
import Lightbox from './Lightbox';

interface CertificatesSectionProps {
  certificates: ICertificate[];
}

export default function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

    const current = sectionRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = certificates.map((c) => ({
    url: c.image,
    title: c.title,
  }));

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="luxury-container">
        <div className="text-center mb-16 md:mb-20 reveal">
          <span className="section-label">Authenticity</span>
          <h2 className="section-title mb-6">Our Certifications</h2>
          <div className="silver-divider mx-auto mb-6" />
          <p className="section-subtitle mx-auto">
            We are proud to display our certifications that attest to our commitment to quality, purity, and authentic silver craftsmanship.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        ref={scrollRef}
        className="relative"
      >
        <div
          className={`flex gap-6 overflow-x-auto px-6 md:px-12 lg:px-16 pb-4 snap-x snap-mandatory scrollbar-hide`}
          id="certificates-scroll"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {certificates.map((certificate, index) => (
            <button
              key={certificate._id}
              onClick={() => openLightbox(index)}
              className={`flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] group cursor-pointer snap-start`}
            >
              <div className={`relative aspect-[3/4] overflow-hidden bg-luxury-charcoal silver-border hover:border-luxury-silver/30 transition-all duration-700`}>
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105`}
                />

                <div className={`absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/30 transition-all duration-700 flex items-center justify-center`}>
                  <span className={`text-luxury-white/0 group-hover:text-luxury-white/80 text-xs tracking-[0.15em] uppercase transition-all duration-700`}>
                    Click to enlarge
                  </span>
                </div>

                {/* Title at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-luxury-black/80 to-transparent">
                  <p className="text-sm text-luxury-white/80 font-display">{certificate.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % certificates.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + certificates.length) % certificates.length)}
      />

      {/* Hide scrollbar */}

    </section>
  );
}
