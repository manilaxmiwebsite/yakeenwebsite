import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';

export default async function AllCategoriesPage() {
  await connectDB();

  const categories = await Category.find({ isActive: true, parentId: null })
    .sort({ order: 1, name: 1 })
    .lean();

  // Get product counts and sub-category counts for each category
  const productCounts: Record<string, number> = {};
  const subCategoryCounts: Record<string, number> = {};
  for (const cat of categories) {
    const catId = (cat._id as string).toString();
    const [productCount, subCatCount] = await Promise.all([
      Product.countDocuments({ category: catId, isActive: true }),
      Category.countDocuments({ parentId: catId, isActive: true }),
    ]);
    productCounts[catId] = productCount;
    subCategoryCounts[catId] = subCatCount;
  }

  const categoriesData = categories.map((c) => {
    const cId = (c._id as string).toString();
    return {
      _id: cId,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || '',
      images: (c as any).images || [],
      productCount: productCounts[cId] || 0,
      subCategoryCount: subCategoryCounts[cId] || 0,
    };
  });

  const categoryImages: Record<string, string> = {
    'Chains': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'Bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'God Idols': 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80',
    'Rings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'Anklets': 'https://images.unsplash.com/photo-1515562141589-67f0cabc5c7a?w=800&q=80',
    'Silver Gift Items': 'https://images.unsplash.com/photo-1606738132449-1b1c0cb81e32?w=800&q=80',
  };

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
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label">Complete Collection</span>
          <h1 className="section-title mb-4">All Categories</h1>
          <div className="silver-divider mx-auto mb-6" />
          <p className="section-subtitle mx-auto">
            Browse our complete range of premium silver collections, 
            each crafted with generations of artistic mastery.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categoriesData.map((category) => {
            const imgSrc = category.images?.[0] || category.image || categoryImages[category.name] || '';
            return (
            <Link
              key={category._id}
              href={`/explore/${category.slug}`}
              className="group relative overflow-hidden aspect-[3/4] bg-luxury-charcoal block
                       border border-luxury-gunmetal/20 hover:border-luxury-silver/20 
                       transition-all duration-500"
            >
              {/* Background Image */}
              <img
                src={imgSrc}
                alt={category.name}
                className="w-full h-full object-cover transition-all duration-700 
                         group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/40 to-luxury-black/20
                            group-hover:from-luxury-black/80 transition-all duration-500" />

              {/* Silver border accent */}
              <div className="absolute inset-0 border border-luxury-white/0 group-hover:border-luxury-silver/15 
                            transition-all duration-500 m-3" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-display text-lg md:text-2xl text-luxury-white mb-1 
                            transform transition-all duration-500 group-hover:translate-x-1">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-luxury-white/40 mb-2 line-clamp-1 hidden md:block">
                    {category.description}
                  </p>
                )}
                <p className="text-[10px] tracking-[0.1em] uppercase text-luxury-silver/50 mb-2">
                  {category.subCategoryCount > 0
                    ? `${category.subCategoryCount} ${category.subCategoryCount === 1 ? 'Collection' : 'Collections'}`
                    : `${category.productCount} ${category.productCount === 1 ? 'Piece' : 'Pieces'}`
                  }
                </p>
                <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-luxury-silver/60
                              opacity-0 group-hover:opacity-100 transition-all duration-500 
                              transform translate-y-2 group-hover:translate-y-0">
                  <span>{category.subCategoryCount > 0 ? 'Browse Collections' : 'View Collection'}</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
            );
          })}
        </div>

        {categoriesData.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl font-display text-luxury-white/10 mb-4">—</div>
            <p className="text-luxury-white/30 text-lg font-display">No Categories Yet</p>
            <p className="text-luxury-white/20 text-sm mt-2">
              New collections are being added soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
