'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
  brandName?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = '919876543210',
  message = 'Hello Manilakshmi Silver, I would like to know more about your premium silver collection.',
  brandName = 'Manilakshmi Silver',
}: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show after scrolling past hero section
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const encoded = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encoded}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-luxury-charcoal border border-luxury-gunmetal/40 px-4 py-3 shadow-xl animate-fade-in-up max-w-[200px]">
          <p className="text-xs text-luxury-white/70 leading-relaxed">
            Chat with us on WhatsApp for inquiries
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-luxury-gunmetal border border-luxury-black 
                     flex items-center justify-center hover:bg-luxury-steel transition-colors"
          >
            <X size={10} className="text-luxury-white/60" />
          </button>
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative w-14 h-14 md:w-16 md:h-16 rounded-full 
                 bg-[#25D366] shadow-lg shadow-[#25D366]/30
                 hover:bg-[#22c35e] hover:shadow-xl hover:shadow-[#25D366]/40
                 hover:scale-105 active:scale-95
                 transition-all duration-500 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle
          size={28}
          className="text-white group-hover:scale-110 transition-transform duration-500"
        />
      </button>
    </div>
  );
}
