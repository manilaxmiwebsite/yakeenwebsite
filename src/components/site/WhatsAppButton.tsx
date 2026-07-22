'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
  variant?: 'primary' | 'outline' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export default function WhatsAppButton({
  phoneNumber,
  message,
  variant = 'primary',
  className = '',
  children,
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 text-luxury-silver hover:text-luxury-white transition-colors duration-300 ${className}`}
        aria-label="Inquire on WhatsApp"
      >
        <MessageCircle size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={
        variant === 'primary'
          ? `inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 
             text-sm tracking-[0.1em] uppercase font-medium
             hover:bg-[#22c35e] transition-all duration-500 ${className}`
          : `inline-flex items-center gap-2 border border-[#25D366]/50 text-[#25D366] px-6 py-3
             text-sm tracking-[0.1em] uppercase font-medium
             hover:bg-[#25D366]/10 transition-all duration-500 ${className}`
      }
    >
      <MessageCircle size={18} />
      {children || 'Inquire via WhatsApp'}
    </button>
  );
}
