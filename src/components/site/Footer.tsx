'use client';

import Link from 'next/link';
import { MessageCircle, Mail, Phone, MapPin, ChevronUp } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';

interface FooterProps {
  brandName?: string;
  brandStatement?: string;
  email?: string;
  phone?: string;
  address?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  logo?: string;
}

export default function Footer({
  brandName = 'Manilakshmi Silver',
  brandStatement = 'Crafting timeless silver masterpieces since generations. Purity, elegance, and heritage in every piece.',
  email = 'hello@manilakshmi.com',
  phone = '+91 9876543210',
  address = 'Mumbai, Maharashtra, India',
  instagramUrl = 'https://instagram.com/manilakshmisilver',
  whatsappNumber = '919876543210',
  logo = '',
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hello ${brandName}, I would like to know more.`);
    window.open(
      `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#explore', label: 'Explore' },
    { href: '/#about', label: 'About' },
    { href: '/#certificates', label: 'Certificates' },
    { href: '/#instagram', label: 'Instagram' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <footer id="contact" className="relative bg-luxury-black border-t border-luxury-gunmetal/20">
      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 
                   border border-luxury-gunmetal/40 bg-luxury-black
                   flex items-center justify-center
                   hover:border-luxury-silver/30 hover:text-luxury-silver
                   text-luxury-white/40 transition-all duration-500 group"
      >
        <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
      </button>

      <div className="luxury-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              {logo ? (
                <img src={logo} alt={brandName} className="h-8 w-auto" />
              ) : (
                <div className="w-10 h-10 border border-luxury-silver/30 flex items-center justify-center">
                  <span className="text-luxury-silver text-lg font-display font-bold">M</span>
                </div>
              )}
              <span className="font-display text-lg text-luxury-white">{brandName}</span>
            </Link>
            <p className="text-sm text-luxury-white/40 leading-relaxed font-body font-light">
              {brandStatement}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-white/50 hover:text-luxury-silver transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-luxury-white/50 hover:text-luxury-silver transition-colors duration-300 group"
                >
                  <Mail size={14} className="text-luxury-silver/40 group-hover:text-luxury-silver transition-colors" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-sm text-luxury-white/50 hover:text-luxury-silver transition-colors duration-300 group"
                >
                  <Phone size={14} className="text-luxury-silver/40 group-hover:text-luxury-silver transition-colors" />
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-luxury-white/50">
                <MapPin size={14} className="text-luxury-silver/40 mt-0.5 shrink-0" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          {/* Social & WhatsApp */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-6 font-medium">
              Connect
            </h4>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-3 text-sm text-luxury-white/50 
                         hover:text-[#25D366] transition-colors duration-300 group"
              >
                <MessageCircle size={16} className="group-hover:scale-110 transition-transform duration-300" />
                <span>WhatsApp Inquiry</span>
              </button>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-luxury-white/50 
                         hover:text-luxury-silver transition-colors duration-300 group"
              >
                <InstagramIcon size={16} className="group-hover:scale-110 transition-transform duration-300" />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-luxury-gunmetal/40 to-transparent my-10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-luxury-white/30 tracking-[0.05em]">
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-xs text-luxury-white/20">
            Crafted with tradition &bull; Pure Silver &bull; Since 1965
          </p>
        </div>
      </div>
    </footer>
  );
}
