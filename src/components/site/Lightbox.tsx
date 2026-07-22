'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: { url: string; title: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-luxury-white/60 hover:text-luxury-white transition-colors z-10"
      >
        <X size={28} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-luxury-white/40 hover:text-luxury-white transition-colors z-10"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-luxury-white/40 hover:text-luxury-white transition-colors z-10"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}

      <div className="relative max-w-[90vw] max-h-[85vh] animate-scale-in">
        <img
          src={current.url}
          alt={current.title}
          className="max-w-full max-h-[85vh] object-contain"
        />
        <p className="text-center text-luxury-silver/60 text-sm mt-4 tracking-[0.1em]">
          {current.title} {images.length > 1 && `— ${currentIndex + 1} of ${images.length}`}
        </p>
      </div>
    </div>
  );
}
