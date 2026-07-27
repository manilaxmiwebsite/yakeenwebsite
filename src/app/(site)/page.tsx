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

  // Build a map of parent category -> subcategory IDs
  const subCategoryMap: Record<string, string[]> = {};
  for (const cat of categories) {
    if (cat.parentId) {
      const parentId = cat.parentId.toString();
      if (!subCategoryMap[parentId]) subCategoryMap[parentId] = [];
      subCategoryMap[parentId].push(cat._id.toString());
    }
  }

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

  // Build final images for each category, including subcategory products
  function getCategoryImages(cat: any): string[] {
    const catId = (cat._id as string).toString();
    const slideshowAuto = (cat as any).slideshowAuto !== false;
    const manualImages = (cat as any).images?.filter(Boolean) || [];

    if (!slideshowAuto && manualImages.length > 0) {
      // Manual override: use uploaded images
      return manualImages;
    }

    // Auto-populate: collect images from products in this category AND subcategories
    const subIds = subCategoryMap[catId] || [];
    const allCatIds = [catId, ...subIds];
    const productImgs: string[] = [];
    for (const cId of allCatIds) {
      const imgs = productImagesByCategory[cId];
      if (imgs?.length) {
        productImgs.push(...imgs);
      }
    }

    // If we have product images, use them (deduplicated, capped at 10)
    if (productImgs.length > 0) {
      return [...new Set(productImgs)].slice(0, 10);
    }

    // Fallback to manual images if no product images found
    return manualImages.slice(0, 6);
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
    images: getCategoryImages(c),
    parentId: (c as any).parentId?.toString() || null,
    isActive: c.isActive,
    order: c.order,
    slideshowAuto: (c as any).slideshowAuto !== false,
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

  const { sections, sectionOrder, aboutTitle, aboutContent, aboutImage, whatsappNumber, whatsappMessage, heroSpeed, exploreColumns, exploreCardSize, instagramUrl, instagramImages } = settings;

  const sectionComponents: Record<string, React.ReactNode> = {
    hero: sections.hero ? (
      <HeroCarousel
        key="hero"
        products={heroProducts}
        whatsappNumber={whatsappNumber}
        whatsappMessage={whatsappMessage}
        heroSpeed={parseInt(heroSpeed) || 5000}
      />
    ) : null,
    explore: sections.explore && categoriesData.length > 0 ? (
      <ExploreSection
        key="explore"
        categories={categoriesData}
        columns={parseInt(exploreColumns) || 3}
        cardSize={exploreCardSize || '4-5'}
        totalCategoryCount={categories.length}
      />
    ) : null,
    about: sections.about ? (
      <AboutSection
        key="about"
        title={aboutTitle}
        content={aboutContent}
        image={aboutImage}
      />
    ) : null,
    certificates: sections.certificates ? (
      <CertificatesSection key="certificates" certificates={certificatesData} />
    ) : null,
    instagram: sections.instagram ? (
      <InstagramSection
        key="instagram"
        instagramUrl={instagramUrl}
        instagramImages={instagramImages}
      />
    ) : null,
  };

  return (
    <>
      {sectionOrder.map((sectionKey) => sectionComponents[sectionKey])}
    </>
  );
}
