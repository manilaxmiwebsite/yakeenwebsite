'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle } from 'lucide-react';

interface HeaderProps {
  whatsappNumber?: string;
  brandName?: string;
  logo?: string;
  tagline?: string;
  logoScale?: number;
  logoOffsetX?: number;
  logoOffsetY?: number;
}

export default function Header({
  whatsappNumber = '919876543210',
  brandName = 'Manilakshmi Silver',
  logo = '',
  tagline = 'Since 1965',
  logoScale = 1,
  logoOffsetX = 0,
  logoOffsetY = 0,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#explore', label: 'Explore' },
    { href: '/#about', label: 'About' },
    { href: '/#certificates', label: 'Certificates' },
    { href: '/#instagram', label: 'Instagram' },
    { href: '/#contact', label: 'Contact' },
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hello ${brandName}, I would like to know more about your premium silver collection.`
    );
    window.open(
      `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'bg-luxury-black/95 backdrop-blur-xl border-b border-luxury-gunmetal/20 shadow-dark'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
        }`}
      >
        <div className="luxury-container">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link href="/" prefetch={true} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="flex items-center gap-2 group min-w-0">
              {logo ? (
                <div className="h-12 md:h-16 w-fit overflow-hidden flex-shrink-0">
                  <img 
                    src={logo} 
                    alt={brandName} 
                    className="h-full w-auto"
                    style={{
                      transform: `scale(${logoScale}) translate(${logoOffsetX}px, ${logoOffsetY}px)`
                    }}
                  />
                </div>
              ) : (
                <span className="text-luxury-silver text-2xl md:text-3xl font-display font-bold">M</span>
              )}
              <div className="block min-w-0 flex-1">
                <span className="font-display text-sm sm:text-lg md:text-xl text-luxury-white tracking-[0.05em] block leading-tight truncate">
                  {brandName}
                </span>
                <div className="text-[10px] tracking-[0.2em] uppercase text-luxury-silver/40 font-body leading-tight whitespace-normal">
                  {tagline}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* WhatsApp CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-5 py-2.5 border border-luxury-silver/30 
                         text-luxury-silver text-xs tracking-[0.15em] uppercase font-medium
                         hover:bg-luxury-silver/10 hover:border-luxury-silver/50 
                         transition-all duration-500 group"
              >
                <MessageCircle size={16} className="group-hover:scale-110 transition-transform duration-500" />
                <span>Inquire</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-luxury-white/70 hover:text-luxury-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Menu Overlay - slides from right */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 z-[100] lg:hidden transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-[85vw] max-w-sm z-[110] lg:hidden 
                     bg-luxury-charcoal border-l border-luxury-gunmetal/20
                     transform transition-all duration-700 ease-out
                     shadow-2xl shadow-black/50
                     ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 h-20 md:h-24 border-b border-luxury-gunmetal/20">
            <span className="text-xs tracking-[0.2em] uppercase text-luxury-silver/40 font-medium">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center border border-luxury-gunmetal/30 
                       text-luxury-white/50 hover:text-luxury-white hover:border-luxury-gunmetal/60
                       transition-all duration-300"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-6 pt-10 flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <div
                key={link.href}
                className={`transform transition-all duration-500 ${
                  isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 75}ms` : '0ms',
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 px-4 text-lg text-luxury-white/60 hover:text-luxury-white 
                           tracking-[0.1em] uppercase font-body font-light
                           hover:bg-luxury-white/5 transition-all duration-300
                           border-b border-luxury-gunmetal/10"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.2em] text-luxury-silver/30 font-medium w-6 shrink-0">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span>{link.label}</span>
                  </span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div
            className={`absolute bottom-0 left-0 right-0 px-6 pb-12 pt-8 
                       bg-gradient-to-t from-luxury-charcoal via-luxury-charcoal/95 to-transparent
                       transform transition-all duration-700 ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{
              transitionDelay: isMobileMenuOpen ? '400ms' : '0ms',
            }}
          >
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setTimeout(handleWhatsAppClick, 100);
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 
                       border border-luxury-silver/30 text-luxury-silver 
                       text-sm tracking-[0.15em] uppercase font-medium
                       hover:bg-luxury-silver/10 hover:border-luxury-silver/50
                       transition-all duration-500 group"
            >
              <MessageCircle size={18} className="group-hover:scale-110 transition-transform duration-500" />
              <span>WhatsApp Inquiry</span>
              <span className="text-luxury-silver/20 group-hover:text-luxury-silver/40 transition-colors duration-500">→</span>
            </button>
          </div>
        </div>
      </>
    </>
  );
}
