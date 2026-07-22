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

  const [products, categories, certificates, settings] = await Promise.all([
    Product.find({ isActive: true, isHero: true })
      .populate('category', 'name slug')
      .sort({ heroOrder: 1 })
      .lean(),
    Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean(),
    Certificate.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean(),
    getSiteSettings(),
  ]);

  const heroProducts = products.map((p) => ({
    _id: (p._id as string).toString(),
    name: p.name,
    caption: p.caption || '',
    images: p.images || [],
    category: p.category as { name: string; slug: string } | undefined,
  }));

  const categoriesData = categories.map((c) => ({
    _id: (c._id as string).toString(),
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    isActive: c.isActive,
    order: c.order,
    createdAt: c.createdAt?.toISOString() || '',
    updatedAt: c.updatedAt?.toISOString() || '',
  }));

  const certificatesData = certificates.map((c) => ({
    _id: (c._id as string).toString(),
    title: c.title,
    image: c.image || '',
    isActive: c.isActive,
    createdAt: c.createdAt?.toISOString() || '',
    updatedAt: c.updatedAt?.toISOString() || '',
  }));

  const { sections, aboutTitle, aboutContent, aboutImage, whatsappNumber, whatsappMessage, instagramUrl, instagramImages } = settings;

  return (
    <>
      {sections.hero && (
        <HeroCarousel
          products={heroProducts}
          whatsappNumber={whatsappNumber}
          whatsappMessage={whatsappMessage}
        />
      )}

      {sections.explore && (
        <ExploreSection categories={categoriesData} />
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
