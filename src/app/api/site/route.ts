import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';
import { Certificate } from '@/lib/models/Certificate';
import { getSiteSettings } from '@/lib/site-data';

export async function GET() {
  try {
    await connectDB();

    const [products, categories, certificates, settings] = await Promise.all([
      Product.find({ isActive: true })
        .populate('category', 'name slug')
        .sort({ heroOrder: 1, createdAt: -1 }),
      Category.find({ isActive: true })
        .sort({ order: 1, name: 1 }),
      Certificate.find({ isActive: true })
        .sort({ createdAt: -1 }),
      getSiteSettings(),
    ]);

    const heroProducts = products.filter((p) => p.isHero).slice(0, 15);

    return NextResponse.json({
      products,
      heroProducts,
      categories,
      certificates,
      settings,
    });
  } catch (error) {
    console.error('Error fetching site data:', error);
    return NextResponse.json({ error: 'Failed to fetch site data' }, { status: 500 });
  }
}
