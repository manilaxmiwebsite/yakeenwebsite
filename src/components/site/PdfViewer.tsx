'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { X, Download, Loader2, FileText } from 'lucide-react';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PdfViewer({ pdfUrl, title, isOpen, onClose }: PdfViewerProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setState('loading');

      // Timeout: if iframe hasn't loaded in 12 seconds, show error state
      timeoutRef.current = setTimeout(() => {
        setState((prev) => (prev === 'loading' ? 'error' : prev));
      }, 12000);

      // Force re-render of iframe by resetting key
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen, handleKeyDown, pdfUrl]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Prevent overwriting 'error' state if timeout fired first
    setState((prev) => (prev === 'loading' ? 'loaded' : prev));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 text-luxury-white/60 hover:text-luxury-white transition-colors z-10"
      >
        <X size={28} />
      </button>

      {/* Download button */}
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-xs tracking-[0.15em] uppercase 
                 text-luxury-silver/60 hover:text-luxury-silver transition-colors z-10"
      >
        <Download size={16} />
        <span className="hidden md:inline">Download</span>
      </a>

      {/* PDF Viewer */}
      <div className="relative w-[95vw] h-[90vh] md:w-[90vw] md:h-[88vh] animate-scale-in flex flex-col">
        {/* Title bar */}
        <div className="flex items-center gap-3 mb-3 text-luxury-white/80 shrink-0">
          <FileText size={18} className="text-luxury-silver/60" />
          <h3 className="text-sm font-display truncate max-w-[70vw]">{title}</h3>
        </div>

        {/* Viewer container */}
        <div className="flex-1 bg-luxury-black/60 border border-luxury-gunmetal/30 overflow-hidden relative">
          {/* Loading overlay */}
          {state === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-luxury-black/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-luxury-silver/60 animate-spin" />
                <span className="text-xs tracking-[0.15em] uppercase text-luxury-silver/40">
                  Loading PDF...
                </span>
              </div>
            </div>
          )}

          {/* Error state */}
          {state === 'error' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-luxury-black/80 z-10">
              <div className="flex flex-col items-center gap-4 text-center px-6">
                <FileText size={48} className="text-luxury-white/20" />
                <div>
                  <p className="text-sm text-luxury-white/60 font-display mb-1">Unable to preview PDF</p>
                  <p className="text-xs text-luxury-white/30">Click the download button above or open directly.</p>
                </div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 border border-luxury-silver/30 
                           text-xs tracking-[0.15em] uppercase text-luxury-silver/70 
                           hover:bg-luxury-silver/10 hover:border-luxury-silver/50 
                           transition-all duration-300"
                >
                  <Download size={14} />
                  <span>Open PDF</span>
                </a>
              </div>
            </div>
          ) : null}

          {/* PDF iframe — always rendered so load event fires */}
          <iframe
            key={pdfUrl}
            src={pdfUrl}
            className={`w-full h-full ${state === 'error' ? 'hidden' : ''}`}
            onLoad={handleIframeLoad}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
