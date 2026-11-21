import { NextResponse } from 'next/server';
import { getOrders, updateOrderStatus } from '@/lib/db';
import { isUserAdmin } from '@/lib/security/auth';

export async function GET() {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, orderStatus, paymentStatus } = body;

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { success: false, error: 'orderId and orderStatus are required' },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderId, orderStatus, paymentStatus);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
