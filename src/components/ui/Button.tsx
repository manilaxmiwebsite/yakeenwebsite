'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'silver';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-body text-sm tracking-[0.15em] uppercase font-medium transition-all duration-500';

    const variants = {
      primary: 'bg-luxury-white text-luxury-black hover:bg-luxury-silver',
      outline: 'border border-luxury-silver/40 text-luxury-silver hover:bg-luxury-silver/10 hover:border-luxury-silver/60',
      ghost: 'text-luxury-silver hover:text-luxury-white',
      silver: 'bg-gradient-to-r from-luxury-silver to-luxury-white text-luxury-black hover:from-luxury-white hover:to-luxury-silver',
    };

    const sizes = {
      sm: 'px-6 py-2.5 text-xs',
      md: 'px-8 py-3.5',
      lg: 'px-10 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
