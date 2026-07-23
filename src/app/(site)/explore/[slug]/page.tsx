import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';
import { getSiteSettings } from '@/lib/site-data';
import ProductCard from '@/components/site/ProductCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const fallbackImages: Record<string, string> = {
  'Chains': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  'Bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  'God Idols': 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80',
  'Rings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  'Anklets': 'https://images.unsplash.com/photo-1515562141589-67f0cabc5c7a?w=800&q=80',
  'Silver Gift Items': 'https://images.unsplash.com/photo-1606738132449-1b1c0cb81e32?w=800&q=80',
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  const category = await Category.findOne({ slug }).lean();

  if (!category) {
    notFound();
  }

  const catId = (category._id as string).toString();

  // Check if this category has sub-categories
  const subCategories = await Category.find({
    parentId: catId,
    isActive: true,
  })
    .sort({ order: 1 })
    .lean();

  // If sub-categories exist, show them instead of products
  if (subCategories.length > 0) {
    const subCategoriesData = subCategories.map((sc) => ({
      _id: (sc._id as string).toString(),
      name: sc.name,
      slug: sc.slug,
      description: sc.description || '',
      image: sc.image || '',
      images: (sc as any).images || [],
      parentId: sc.parentId?.toString() || null,
      isActive: sc.isActive,
      order: sc.order,
      createdAt: sc.createdAt?.toISOString() || '',
      updatedAt: sc.updatedAt?.toISOString() || '',
    }));

    return (
      <div className="pt-32 pb-24">
        <div className="luxury-container">
          <Link
            href="/#explore"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase 
                     text-luxury-silver/60 hover:text-luxury-silver transition-colors duration-300 mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Explore</span>
          </Link>

          <div className="mb-12">
            <span className="section-label">{category.name}</span>
            <h1 className="section-title mb-4">{category.name}</h1>
            {category.description && (
              <p className="section-subtitle">{category.description}</p>
            )}
            <div className="silver-divider mt-6" />
            <p className="text-sm text-luxury-white/30 mt-4 tracking-[0.05em]">
              {subCategoriesData.length} {subCategoriesData.length === 1 ? 'Collection' : 'Collections'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {subCategoriesData.map((subCat) => {
              const imgSrc = subCat.images?.[0] || subCat.image || fallbackImages[subCat.name] || '';
              return (
                <Link
                  key={subCat._id}
                  href={`/explore/${subCat.slug}`}
                  className="group relative overflow-hidden aspect-[3/4] bg-luxury-charcoal block
                           border border-luxury-gunmetal/20 hover:border-luxury-silver/20 
                           transition-all duration-500"
                >
                  <img
                    src={imgSrc}
                    alt={subCat.name}
                    className="w-full h-full object-cover transition-all duration-700 
                             group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/40 to-luxury-black/20
                                group-hover:from-luxury-black/80 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="font-display text-lg md:text-2xl text-luxury-white mb-1
                                transform transition-all duration-500 group-hover:translate-x-1">
                      {subCat.name}
                    </h3>
                    {subCat.description && (
                      <p className="text-xs text-luxury-white/40 mb-1 line-clamp-1">{subCat.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-luxury-silver/60
                                  opacity-0 group-hover:opacity-100 transition-all duration-500 
                                  transform translate-y-2 group-hover:translate-y-0 mt-1">
                      <span>View Collection</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // No sub-categories — show products
  const products = await Product.find({
    category: catId,
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
    category: catId,
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
