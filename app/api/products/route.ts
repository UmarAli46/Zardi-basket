import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { isUserAdmin } from '@/lib/security/auth';
import { sanitizeString } from '@/lib/security/validator';
import { revalidatePath } from 'next/cache';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const all = searchParams.get('all') === 'true';

    const products = await getProducts({
      onlyActive: !all,
      category,
      search,
    });

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Admin Security Check
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const title = sanitizeString(body.title);
    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const newProduct = await createProduct({
      title,
      subtitle: sanitizeString(body.subtitle),
      description: sanitizeString(body.description),
      eggType: body.eggType || 'hen',
      breed: sanitizeString(body.breed),
      coopOrigin: sanitizeString(body.coopOrigin),
      region: sanitizeString(body.region),
      dietInfo: sanitizeString(body.dietInfo),
      yolkScore: Number(body.yolkScore) || 14,
      batchCode: sanitizeString(body.batchCode),
      layDate: sanitizeString(body.layDate) || 'Fresh Yesterday',
      price6Pack: Math.max(0, Number(body.price6Pack) || 450),
      price12Pack: Math.max(0, Number(body.price12Pack) || 850),
      price30Tray: Math.max(0, Number(body.price30Tray) || 1950),
      stockQuantity: Math.max(0, Number(body.stockQuantity) || 20),
      imageUrl: sanitizeString(body.imageUrl) || 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1000&q=80',
      badges: Array.isArray(body.badges) ? body.badges.map(sanitizeString) : ['Pasture-Raised'],
      isActive: body.isActive !== false,
      featured: Boolean(body.featured),
    });

    // Invalidate live site caches
    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
