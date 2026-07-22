import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';
import { getSiteSettings } from '@/lib/site-data';
import ProductCard from '@/components/site/ProductCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  const category = await Category.findOne({ slug }).lean();

  if (!category) {
    notFound();
  }

  const products = await Product.find({
    category: category._id,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  const settings = await getSiteSettings();

  const productsData = products.map((p) => ({
    _id: (p._id as string).toString(),
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    details: p.details || [],
    images: p.images || [],
    caption: (p as any).caption || '',
    category: (category._id as string).toString(),
    isActive: p.isActive,
    isHero: (p as any).isHero || false,
    heroOrder: (p as any).heroOrder || 0,
    createdAt: p.createdAt?.toISOString() || '',
    updatedAt: p.updatedAt?.toISOString() || '',
  }));

  return (
    <div className="pt-32 pb-24">
      <div className="luxury-container">
        {/* Back link */}
        <Link
          href="/#explore"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase 
                   text-luxury-silver/60 hover:text-luxury-silver transition-colors duration-300 mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Explore</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <span className="section-label">{category.name}</span>
          <h1 className="section-title mb-4">{category.name}</h1>
          {category.description && (
            <p className="section-subtitle">{category.description}</p>
          )}
          <div className="silver-divider mt-6" />

          <p className="text-sm text-luxury-white/30 mt-4 tracking-[0.05em]">
            {productsData.length} {productsData.length === 1 ? 'Piece' : 'Pieces'}
          </p>
        </div>

        {/* Product Grid */}
        {productsData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productsData.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl font-display text-luxury-white/10 mb-4">—</div>
            <p className="text-luxury-white/30 text-lg font-display">Coming Soon</p>
            <p className="text-luxury-white/20 text-sm mt-2">
              We are adding new pieces to this collection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
