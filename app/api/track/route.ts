import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';
import { sanitizeString } from '@/lib/security/validator';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = sanitizeString(searchParams.get('query') || '').toLowerCase();

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query parameter required' }, { status: 400 });
    }

    const orders = await getOrders();
    const matched = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.orderNumber.toLowerCase() === query ||
        o.customerPhone.replace(/[\s-]/g, '') === query.replace(/[\s-]/g, '') ||
        o.customerEmail.toLowerCase() === query
    );

    if (!matched) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: matched });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
