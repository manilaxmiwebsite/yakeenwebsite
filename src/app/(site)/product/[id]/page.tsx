import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { getSiteSettings } from '@/lib/site-data';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();

  const product = await Product.findById(id)
    .populate('category', 'name slug')
    .lean();

  if (!product || !product.isActive) {
    notFound();
  }

  const settings = await getSiteSettings();
  const p = product as Record<string, unknown>;
  const cat = p.category as Record<string, unknown> | undefined;
  const categorySlug = cat && typeof cat === 'object' ? (cat.slug as string) || '' : '';

  const productData = {
    _id: (p._id as string).toString(),
    name: (p.name as string) || '',
    slug: (p.slug as string) || '',
    description: (p.description as string) || '',
    details: (p.details as string[]) || [],
    images: (p.images as string[]) || [],
    caption: (p.caption as string) || '',
    category: cat && typeof cat === 'object' ? (cat as unknown as import('@/types').ICategory) : ((p.category as string) || ''),
    isActive: (p.isActive as boolean) ?? true,
    isHero: (p.isHero as boolean) ?? false,
    heroOrder: (p.heroOrder as number) ?? 0,
    createdAt: (p.createdAt as Date)?.toISOString() || '',
    updatedAt: (p.updatedAt as Date)?.toISOString() || '',
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="luxury-container">
        {/* Back link */}
        <Link
          href={`/explore/${categorySlug}`}
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase 
                   text-luxury-silver/60 hover:text-luxury-silver 
                   transition-colors duration-300 mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Collection</span>
        </Link>

        <ProductDetailClient product={productData} settings={settings} />
      </div>
    </div>
  );
}
