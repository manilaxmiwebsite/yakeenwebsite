import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Admin } from '@/lib/models/Admin';
import { Category } from '@/lib/models/Category';
import { Certificate } from '@/lib/models/Certificate';
import { Product } from '@/lib/models/Product';
import { Setting } from '@/lib/models/Setting';
import { SETTING_KEYS } from '@/lib/site-data';
import bcrypt from 'bcryptjs';

// Beautiful placeholder images for different product types (Unsplash)
const placeholderImages: Record<string, string[]> = {
  chains: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1602751584553-8ba7eb7f4ef0?w=800&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  ],
  bracelets: [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c8ab60908?w=800&q=80',
  ],
  'god-idols': [
    'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80',
    'https://images.unsplash.com/photo-1603201391502-444e188363d4?w=800&q=80',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
  ],
  rings: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
    'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800&q=80',
  ],
  anklets: [
    'https://images.unsplash.com/photo-1515562141589-67f0cabc5c7a?w=800&q=80',
    'https://images.unsplash.com/photo-1591085686354-5125c1b0d534?w=800&q=80',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
  ],
  'silver-gift-items': [
    'https://images.unsplash.com/photo-1606738132449-1b1c0cb81e32?w=800&q=80',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    'https://images.unsplash.com/photo-1546868871-af0de0ae72df?w=800&q=80',
  ],
};

const categoryImages: Record<string, string> = {
  chains: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  bracelets: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  'god-idols': 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80',
  rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  anklets: 'https://images.unsplash.com/photo-1515562141589-67f0cabc5c7a?w=800&q=80',
  'silver-gift-items': 'https://images.unsplash.com/photo-1606738132449-1b1c0cb81e32?w=800&q=80',
};

// Placeholder product names and descriptions for each category
const productTemplates: Record<string, { name: string; caption: string; description: string; details: string[] }[]> = {
  chains: [
    { name: 'Classic Silver Rope Chain', caption: 'Timeless elegance woven in pure silver', description: 'A meticulously crafted rope chain that embodies sophistication. Each link is handwoven by master artisans to create a seamless, fluid texture.', details: ['Pure Silver 925', 'Chain Length: 20 inches', 'Weight: 25g', 'Classic Rope Weave', 'Lobster Claw Lock'] },
    { name: 'Ancient Coin Pendant Chain', caption: 'Heritage inspired pendant chain', description: 'Adorned with antique-inspired coin pendants, this chain tells a story of timeless tradition and exquisite craftsmanship.', details: ['Pure Silver 925', 'Pendant Size: 2 inch', 'Chain Length: 22 inches', 'Antique Finish', 'Handcrafted Detail'] },
    { name: 'Floral Filigree Chain', caption: 'Delicate floral motifs in silver', description: 'Intricate filigree work captures the beauty of blooming flowers in this delicate yet statement-making chain.', details: ['Pure Silver 925', 'Filigree Work', 'Chain Length: 18 inches', 'Weight: 18g', 'Spring Ring Clasp'] },
  ],
  bracelets: [
    { name: 'Handcrafted Cuff Bracelet', caption: 'Bold elegance for the modern wrist', description: 'A substantial silver cuff with a hammered finish that catches light beautifully. Each piece is uniquely textured by hand.', details: ['Pure Silver 925', 'Width: 1.5 inches', 'Adjustable Fit', 'Hammered Finish', 'Handmade'] },
    { name: 'Tennis Bracelet Silver', caption: 'Brilliance in every link', description: 'Classic tennis bracelet featuring perfectly aligned links that create a continuous flow of silver elegance around the wrist.', details: ['Pure Silver 925', 'Length: 7.5 inches', 'Weight: 15g', 'Safety Clasp', 'High Polish Finish'] },
    { name: 'Beaded Silver Charm Bracelet', caption: 'Whimsical charm meets silver purity', description: 'Beautifully polished silver beads interspersed with handcrafted charms create a bracelet that is both playful and refined.', details: ['Pure Silver 925', 'Bead Size: 6mm', 'Length: 8 inches', 'Charm Attachments', 'Lobster Clasp'] },
  ],
  'god-idols': [
    { name: 'Lord Ganesha Silver Idol', caption: 'Divine craftsmanship in sacred silver', description: 'A beautifully crafted silver idol of Lord Ganesha, meticulously detailed with traditional ornamentation and a serene expression.', details: ['Pure Silver 925', 'Height: 4 inches', 'Weight: 80g', 'Handcrafted Detail', 'Antique Finish'] },
    { name: 'Lakshmi Goddess Idol', caption: 'Goddess of prosperity in radiant silver', description: 'An exquisite silver idol of Goddess Lakshmi, adorned with intricate jewelry and standing on a lotus pedestal.', details: ['Pure Silver 925', 'Height: 5 inches', 'Weight: 100g', 'Intricate Carvings', 'Polished Finish'] },
  ],
  rings: [
    { name: 'Solitaire Silver Ring', caption: 'One perfect stone, eternal elegance', description: 'A classic solitaire design featuring a brilliant-cut cubic zirconia set in a sleek silver band. Minimalist yet unforgettable.', details: ['Pure Silver 925', 'CZ Stone: 6mm', 'Ring Weight: 8g', 'High Polish', 'Comfort Fit'] },
    { name: 'Vintage Engraved Band', caption: 'Old-world charm reimagined', description: 'An intricately engraved silver band featuring traditional motifs. Each line is carved by hand, making every ring unique.', details: ['Pure Silver 925', 'Band Width: 8mm', 'Weight: 12g', 'Hand Engraved', 'Matte & Polish Finish'] },
    { name: 'Twisted Vine Ring', caption: 'Nature-inspired silver artistry', description: 'Two silver strands twist together like climbing vines, creating a romantic and organic silhouette that catches the eye.', details: ['Pure Silver 925', 'Adjustable Design', 'Weight: 6g', 'Twisted Detail', 'Half-polished Finish'] },
  ],
  anklets: [
    { name: 'Payal Traditional Anklet', caption: 'Celebrating heritage with every step', description: 'Traditional Indian payal design with delicate bells and intricate patterns. The gentle chime announces your presence with grace.', details: ['Pure Silver 925', 'Length: 10 inches', 'With Bells', 'Traditional Design', 'Safety Chain'] },
    { name: 'Minimal Silver Chain Anklet', caption: 'Understated elegance for every day', description: 'A delicate silver chain anklet with a small charm, perfect for everyday wear. Lightweight and comfortable.', details: ['Pure Silver 925', 'Length: 9 inches', 'Charm Included', 'Weight: 5g', 'Lobster Clasp'] },
  ],
  'silver-gift-items': [
    { name: 'Silver Pooja Thali Set', caption: 'Sacred traditions in pure silver', description: 'A complete silver pooja thali set including thali, small bowls, and diya. Perfect for daily worship or gifting on special occasions.', details: ['Pure Silver 925', 'Thali Diameter: 8 inches', '4-piece Set', 'Polished Finish', 'Gift Box Included'] },
    { name: 'Silver Photo Frame', caption: 'Cherish memories in silver', description: 'An elegant silver photo frame with handcrafted border details. A timeless gift for weddings, anniversaries, and celebrations.', details: ['Pure Silver 925', 'Frame Size: 5x7 inches', 'Intricate Border', 'Foldable Stand', 'Gift Packaged'] },
  ],
};

async function seedData() {
  await connectDB();

  const results: Record<string, string> = {};

  // 1. Seed Admin
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@manilakshmi.com',
      password: hashedPassword,
    });
    results.admin = 'Created admin account';
  } else {
    results.admin = 'Admin already exists';
  }

  // 2. Seed Categories
  let categories: Record<string, string> = {};
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    const defaultCategories = [
      { name: 'Chains', slug: 'chains', description: 'Elegant silver chains for every occasion', image: categoryImages.chains, order: 1 },
      { name: 'Bracelets', slug: 'bracelets', description: 'Handcrafted silver bracelets with timeless designs', image: categoryImages.bracelets, order: 2 },
      { name: 'God Idols', slug: 'god-idols', description: 'Divine silver idols crafted with devotion', image: categoryImages['god-idols'], order: 3 },
      { name: 'Rings', slug: 'rings', description: 'Exquisite silver rings for all styles', image: categoryImages.rings, order: 4 },
      { name: 'Anklets', slug: 'anklets', description: 'Traditional and modern silver anklets', image: categoryImages.anklets, order: 5 },
      { name: 'Silver Gift Items', slug: 'silver-gift-items', description: 'Premium silver gift items for every occasion', image: categoryImages['silver-gift-items'], order: 6 },
    ];
    const createdCategories = await Category.insertMany(defaultCategories);
    createdCategories.forEach((c) => { categories[c.slug] = c._id.toString(); });
    results.categories = `Created ${createdCategories.length} categories`;
  } else {
    // Get existing categories
    const existingCategories = await Category.find({});
    existingCategories.forEach((c) => { categories[c.slug] = c._id.toString(); });
    results.categories = `Categories already exist (${existingCategories.length})`;
  }

  // Ensure categories map is populated
  if (Object.keys(categories).length === 0) {
    const existingCategories = await Category.find({});
    existingCategories.forEach((c) => { categories[c.slug] = c._id.toString(); });
  }

  // 3. Seed Products
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    let productsToCreate: any[] = [];
    let heroOrder = 0;

    for (const [catSlug, templates] of Object.entries(productTemplates)) {
      const catId = categories[catSlug];
      if (!catId) continue;
      const images = placeholderImages[catSlug] || [];

      templates.forEach((template, idx) => {
        productsToCreate.push({
          name: template.name,
          slug: template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: template.description,
          details: template.details,
          images: [images[idx % images.length]],
          caption: template.caption,
          category: catId,
          isActive: true,
          isHero: true,
          heroOrder: heroOrder++,
        });
      });
    }

    await Product.insertMany(productsToCreate);
    results.products = `Created ${productsToCreate.length} placeholder products`;
  } else {
    results.products = `Products already exist (${productCount})`;
  }

  // 4. Seed Certificates
  const certCount = await Certificate.countDocuments();
  if (certCount === 0) {
    const placeholderCertificates = [
      { title: 'Hallmark Certification', image: 'https://images.unsplash.com/photo-1586339949916-3e5457d58f20?w=600&q=80', isActive: true },
      { title: 'Purity Test Certificate', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80', isActive: true },
      { title: 'Silver Quality Assurance', image: 'https://images.unsplash.com/photo-1577896851231-70acf6941cc4?w=600&q=80', isActive: true },
      { title: 'Authenticity Certification', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80', isActive: true },
      { title: 'Assay Certificate', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80', isActive: true },
      { title: 'Gemstone Certification', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80', isActive: true },
    ];
    await Certificate.insertMany(placeholderCertificates);
    results.certificates = `Created ${placeholderCertificates.length} certificates`;
  } else {
    results.certificates = `Certificates already exist (${certCount})`;
  }

  // 5. Seed Settings
  const defaultSettings = [
    { key: SETTING_KEYS.WHATSAPP_NUMBER, value: '919876543210' },
    { key: SETTING_KEYS.WHATSAPP_MESSAGE, value: 'Hello Manilakshmi Silver, I am interested in this product: {product}. Please share more details.' },
    { key: SETTING_KEYS.HERO_SPEED, value: '5000' },
    { key: SETTING_KEYS.BRAND_NAME, value: 'Manilakshmi Silver' },
    { key: SETTING_KEYS.ABOUT_TITLE, value: 'Our Legacy of Silver Craftsmanship' },
    { key: SETTING_KEYS.ABOUT_CONTENT, value: 'For generations, Manilakshmi Silver has been synonymous with unparalleled craftsmanship and timeless elegance. Each piece is meticulously handcrafted by master artisans who transform pure silver into wearable art. Our commitment to quality, purity, and design excellence has made us a trusted name in premium silver jewelry.\n\nEvery creation from our atelier carries forward a tradition of excellence, blending heritage techniques with contemporary aesthetics. We source only the finest silver, ensuring each piece meets the highest standards of purity and durability. Our artisans pour their soul into every detail, creating pieces that transcend trends and become cherished heirlooms.' },
    { key: SETTING_KEYS.FOOTER_STATEMENT, value: 'Crafting timeless silver masterpieces since generations. Purity, elegance, and heritage in every piece.' },
    { key: SETTING_KEYS.FOOTER_EMAIL, value: 'hello@manilakshmi.com' },
    { key: SETTING_KEYS.FOOTER_PHONE, value: '+91 9876543210' },
    { key: SETTING_KEYS.FOOTER_ADDRESS, value: 'Mumbai, Maharashtra, India' },
    { key: SETTING_KEYS.INSTAGRAM_URL, value: 'https://instagram.com/manilakshmisilver' },
    { key: SETTING_KEYS.INSTAGRAM_IMAGES, value: '' },
  ];

  for (const setting of defaultSettings) {
    await Setting.findOneAndUpdate(
      { key: setting.key },
      { value: setting.value },
      { upsert: true }
    );
  }
  results.settings = 'Default settings configured';

  return results;
}

// Handle GET (browser visit) and POST
export async function GET() {
  try {
    const results = await seedData();
    return NextResponse.json({
      message: 'Database seeded successfully!',
      ...results,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database: ' + (error as Error).message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const results = await seedData();
    return NextResponse.json({
      message: 'Database seeded successfully!',
      ...results,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database: ' + (error as Error).message }, { status: 500 });
  }
}
