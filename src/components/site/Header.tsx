'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle } from 'lucide-react';

interface HeaderProps {
  whatsappNumber?: string;
  brandName?: string;
  logo?: string;
}

export default function Header({
  whatsappNumber = '919876543210',
  brandName = 'Manilakshmi Silver',
  logo = '',
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
            <Link href="/" className="flex items-center gap-3 group">
              {logo ? (
                <img src={logo} alt={brandName} className="h-8 md:h-10 w-auto" />
              ) : (
                <span className="text-luxury-silver text-2xl md:text-3xl font-display font-bold">M</span>
              )}
              <div className="block truncate max-w-[140px] sm:max-w-none">
                <span className="font-display text-sm sm:text-lg md:text-xl text-luxury-white tracking-[0.05em] truncate block">
                  {brandName}
                </span>
                <div className="text-[10px] tracking-[0.2em] uppercase text-luxury-silver/40 font-body -mt-0.5 truncate">
                  Since 1965
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

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="luxury-container pb-8 pt-2 border-t border-luxury-gunmetal/20">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg text-luxury-white/70 hover:text-luxury-silver tracking-[0.1em] uppercase font-body font-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 mt-4 px-6 py-3 border border-luxury-silver/30 
                         text-luxury-silver text-sm tracking-[0.15em] uppercase font-medium
                         hover:bg-luxury-silver/10 transition-all duration-500"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Inquiry</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
