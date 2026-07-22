'use client';

import { useState } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { IProduct, ISiteSettings } from '@/types';

interface ProductDetailClientProps {
  product: IProduct;
  settings: ISiteSettings;
}

export default function ProductDetailClient({ product, settings }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const categoryName =
    product.category && typeof product.category === 'object' && 'name' in product.category
      ? product.category.name
      : '';

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      (settings.whatsappMessage || 'Hello Manilakshmi Silver, I am interested in this product: {product}. Please share more details.').replace('{product}', product.name)
    );
    window.open(
      `https://wa.me/${(settings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '')}?text=${msg}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Image Gallery */}
      <div>
        {/* Main Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-luxury-charcoal silver-border mb-3">
          {product.images && product.images[selectedImage] ? (
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-display text-luxury-white/10">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Navigation arrows for images */}
          {product.images && product.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 
                         bg-luxury-black/50 text-luxury-white/60
                         hover:bg-luxury-black/70 hover:text-luxury-white
                         transition-all duration-300 flex items-center justify-center"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 
                         bg-luxury-black/50 text-luxury-white/60
                         hover:bg-luxury-black/70 hover:text-luxury-white
                         transition-all duration-300 flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 shrink-0 overflow-hidden border transition-all duration-300 ${
                  index === selectedImage
                    ? 'border-luxury-silver/60'
                    : 'border-luxury-gunmetal/30 hover:border-luxury-silver/30'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col">
        {/* Category */}
        {categoryName && (
          <span className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-4">
            {categoryName}
          </span>
        )}

        {/* Name */}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-luxury-white font-medium mb-6">
          {product.name}
        </h1>

        {/* Divider */}
        <div className="w-16 h-[1px] bg-luxury-silver/40 mb-8" />

        {/* Description */}
        {product.description && (
          <div className="mb-8">
            <h3 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-3 font-medium">
              Description
            </h3>
            <p className="text-luxury-white/60 leading-relaxed font-body font-light">
              {product.description}
            </p>
          </div>
        )}

        {/* Details/Specifications */}
        {product.details && product.details.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 mb-4 font-medium">
              Details
            </h3>
            <ul className="space-y-2.5">
              {product.details.map((detail, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-luxury-white/50"
                >
                  <Check size={14} className="text-luxury-silver/40 mt-0.5 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Inquiry Button */}
        <button
          onClick={handleWhatsApp}
          className="group inline-flex items-center justify-center gap-3 w-full 
                   bg-[#25D366] text-white px-8 py-4
                   text-sm tracking-[0.15em] uppercase font-medium
                   hover:bg-[#22c35e] transition-all duration-500
                   shadow-lg shadow-[#25D366]/20"
        >
          <MessageCircle size={20} className="group-hover:scale-110 transition-transform duration-500" />
          <span>Inquire on WhatsApp</span>
        </button>

        <p className="text-xs text-luxury-white/20 text-center mt-3 tracking-[0.05em]">
          Click above to inquire about this piece. We&apos;ll respond promptly.
        </p>
      </div>
    </div>
  );
}
