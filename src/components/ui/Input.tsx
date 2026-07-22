'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs tracking-[0.15em] uppercase text-luxury-silver/60 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-luxury-charcoal border border-luxury-gunmetal/50 px-4 py-3 
                     text-luxury-white placeholder:text-luxury-steel/50
                     focus:outline-none focus:border-luxury-silver/50 focus:bg-luxury-charcoal/80
                     transition-all duration-300 ${error ? 'border-red-500/50' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
