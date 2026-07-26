import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await connectDB();
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const existing = await Category.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // If name changed, regenerate slug and ensure uniqueness
    let updateData: Record<string, any> = { ...body, parentId: body.parentId || null };
    if (body.name && body.name !== existing.name) {
      let newSlug = slugify(body.name);
      // Check if slug conflicts with another category (excluding this one)
      const slugConflict = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
      if (slugConflict) {
        let counter = 1;
        while (await Category.findOne({ slug: `${newSlug}-${counter}`, _id: { $ne: id } })) {
          counter++;
        }
        newSlug = `${newSlug}-${counter}`;
      }
      updateData.slug = newSlug;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'A category with this name already exists. Try a different name.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${productCount} product(s). Move or delete products first.` },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
