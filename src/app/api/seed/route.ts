import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Admin } from '@/lib/models/Admin';
import { Category } from '@/lib/models/Category';
import { Setting } from '@/lib/models/Setting';
import { SETTING_KEYS } from '@/lib/site-data';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@manilakshmi.com',
        password: hashedPassword,
      });
    }

    // Check if categories exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: 'Chains', slug: 'chains', description: 'Elegant silver chains for every occasion', image: '', order: 1 },
        { name: 'Bracelets', slug: 'bracelets', description: 'Handcrafted silver bracelets with timeless designs', image: '', order: 2 },
        { name: 'God Idols', slug: 'god-idols', description: 'Divine silver idols crafted with devotion', image: '', order: 3 },
        { name: 'Rings', slug: 'rings', description: 'Exquisite silver rings for all styles', image: '', order: 4 },
        { name: 'Anklets', slug: 'anklets', description: 'Traditional and modern silver anklets', image: '', order: 5 },
        { name: 'Silver Gift Items', slug: 'silver-gift-items', description: 'Premium silver gift items for every occasion', image: '', order: 6 },
      ];
      await Category.insertMany(defaultCategories);
    }

    // Seed default settings
    const defaultSettings = [
      { key: SETTING_KEYS.WHATSAPP_NUMBER, value: '919876543210' },
      { key: SETTING_KEYS.WHATSAPP_MESSAGE, value: 'Hello Manilakshmi Silver, I am interested in this product: {product}. Please share more details.' },
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

    return NextResponse.json({
      message: 'Database seeded successfully!',
      adminCreated: !existingAdmin,
      categoriesCreated: categoryCount === 0,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
