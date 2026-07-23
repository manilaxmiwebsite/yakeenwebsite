import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';
import { Certificate } from '@/lib/models/Certificate';
import { getSiteSettings } from '@/lib/site-data';
import HeroCarousel from '@/components/site/HeroCarousel';
import ExploreSection from '@/components/site/ExploreSection';
import AboutSection from '@/components/site/AboutSection';
import CertificatesSection from '@/components/site/CertificatesSection';
import InstagramSection from '@/components/site/InstagramSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  await connectDB();

  const [products, categories, allProducts, certificates, settings] = await Promise.all([
    Product.find({ isActive: true, isHero: true })
      .populate('category', 'name slug')
      .sort({ heroOrder: 1 })
      .lean(),
    Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean(),
    Product.find({ isActive: true })
      .select('images category')
      .lean(),
    Certificate.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean(),
    getSiteSettings(),
  ]);

  // Group product images by category for the carousel
  const productImagesByCategory: Record<string, string[]> = {};
  for (const p of allProducts) {
    const catId = typeof p.category === 'object' && p.category ? (p.category as any)._id?.toString() : (p.category as string)?.toString();
    if (!catId) continue;
    if (!productImagesByCategory[catId]) productImagesByCategory[catId] = [];
    if (p.images?.length) {
      productImagesByCategory[catId].push(...p.images.filter(Boolean));
    }
  }

  const heroProducts = products.map((p) => ({
    _id: (p._id as string).toString(),
    name: p.name,
    caption: p.caption || '',
    images: p.images || [],
    category: p.category as { name: string; slug: string } | undefined,
  }));

  // Filter categories based on exploreCategoryIds setting
  let exploreCategoryIds: string[] = [];
  if (settings.exploreCategoryIds) {
    try {
      const parsed = JSON.parse(settings.exploreCategoryIds);
      if (Array.isArray(parsed)) exploreCategoryIds = parsed;
    } catch {}
  }

  // Only show top-level categories (no parent) on the homepage explore section
  let filteredCategories = categories.filter(c => !c.parentId);
  if (exploreCategoryIds.length > 0) {
    // Sort by the order in exploreCategoryIds, then filter to only those IDs
    const idSet = new Set(exploreCategoryIds);
    filteredCategories = categories
      .filter(c => idSet.has((c._id as string).toString()))
      .sort((a, b) => {
        const aId = (a._id as string).toString();
        const bId = (b._id as string).toString();
        return exploreCategoryIds.indexOf(aId) - exploreCategoryIds.indexOf(bId);
      });
  }

  const categoriesData = filteredCategories.map((c) => {
    const cId = (c._id as string).toString();
    return {
    _id: cId,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    images: (c as any).images?.length ? (c as any).images : [...new Set(productImagesByCategory[cId] || [])].slice(0, 6),
    parentId: (c as any).parentId?.toString() || null,
    isActive: c.isActive,
    order: c.order,
    createdAt: c.createdAt?.toISOString() || '',
    updatedAt: c.updatedAt?.toISOString() || '',
  };});

  const certificatesData = certificates.map((c) => ({
    _id: (c._id as string).toString(),
    title: c.title,
    image: c.image || '',
    isActive: c.isActive,
    createdAt: c.createdAt?.toISOString() || '',
    updatedAt: c.updatedAt?.toISOString() || '',
  }));

  const { sections, aboutTitle, aboutContent, aboutImage, whatsappNumber, whatsappMessage, heroSpeed, exploreColumns, exploreCardSize, instagramUrl, instagramImages } = settings;

  return (
    <>
      {sections.hero && (
        <HeroCarousel
          products={heroProducts}
          whatsappNumber={whatsappNumber}
          whatsappMessage={whatsappMessage}
          heroSpeed={parseInt(heroSpeed) || 5000}
        />
      )}

      {sections.explore && categoriesData.length > 0 && (
        <ExploreSection
          categories={categoriesData}
          columns={parseInt(exploreColumns) || 3}
          cardSize={exploreCardSize || '4-5'}
          totalCategoryCount={categories.length}
        />
      )}

      {sections.about && (
        <AboutSection
          title={aboutTitle}
          content={aboutContent}
          image={aboutImage}
        />
      )}

      {sections.certificates && (
        <CertificatesSection certificates={certificatesData} />
      )}

      {sections.instagram && (
        <InstagramSection
          instagramUrl={instagramUrl}
          instagramImages={instagramImages}
        />
      )}
    </>
  );
}
