import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ order: 1, name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    let slug = body.slug || slugify(body.name);

    // Ensure slug is unique: append -1, -2, etc. if slug already exists
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      let counter = 1;
      while (await Category.findOne({ slug: `${slug}-${counter}` })) {
        counter++;
      }
      slug = `${slug}-${counter}`;
    }

    // Clean up the body: convert empty parentId to null, filter empty images
    const cleanBody = {
      ...body,
      parentId: body.parentId || null,
      images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
    };

    const category = await Category.create({
      ...cleanBody,
      slug,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    // Check for MongoDB duplicate key error (code 11000)
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'A category with this name already exists. Try a different name.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
