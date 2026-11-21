import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';
import { isUserAdmin } from '@/lib/security/auth';
import { sanitizeString } from '@/lib/security/validator';
import { revalidatePath } from 'next/cache';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    const updates: any = {};
    if (body.title !== undefined) updates.title = sanitizeString(body.title);
    if (body.subtitle !== undefined) updates.subtitle = sanitizeString(body.subtitle);
    if (body.description !== undefined) updates.description = sanitizeString(body.description);
    if (body.eggType !== undefined) updates.eggType = body.eggType;
    if (body.breed !== undefined) updates.breed = sanitizeString(body.breed);
    if (body.coopOrigin !== undefined) updates.coopOrigin = sanitizeString(body.coopOrigin);
    if (body.region !== undefined) updates.region = sanitizeString(body.region);
    if (body.dietInfo !== undefined) updates.dietInfo = sanitizeString(body.dietInfo);
    if (body.yolkScore !== undefined) updates.yolkScore = Number(body.yolkScore);
    if (body.batchCode !== undefined) updates.batchCode = sanitizeString(body.batchCode);
    if (body.layDate !== undefined) updates.layDate = sanitizeString(body.layDate);
    if (body.expiryDays !== undefined) updates.expiryDays = Number(body.expiryDays);
    if (body.price6Pack !== undefined) updates.price6Pack = Math.max(0, Number(body.price6Pack));
    if (body.price12Pack !== undefined) updates.price12Pack = Math.max(0, Number(body.price12Pack));
    if (body.price30Tray !== undefined) updates.price30Tray = Math.max(0, Number(body.price30Tray));
    if (body.originalPrice12Pack !== undefined) updates.originalPrice12Pack = Number(body.originalPrice12Pack) || null;
    if (body.stockQuantity !== undefined) updates.stockQuantity = Math.max(0, Number(body.stockQuantity));
    if (body.packagingSize !== undefined) updates.packagingSize = body.packagingSize;
    if (body.boxLabel !== undefined) updates.boxLabel = sanitizeString(body.boxLabel);
    if (body.qualityTier !== undefined) updates.qualityTier = sanitizeString(body.qualityTier);
    if (body.imageUrl !== undefined) updates.imageUrl = sanitizeString(body.imageUrl);
    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.badges !== undefined && Array.isArray(body.badges)) {
      updates.badges = body.badges.map(sanitizeString);
    }

    const updated = await updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/shop/${updated.slug}`);
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}/edit`);

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const success = await deleteProduct(id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json({ success: true, message: 'Product removed' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
