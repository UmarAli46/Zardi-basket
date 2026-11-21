import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/db';
import { isUserAdmin } from '@/lib/security/auth';

export async function GET() {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
