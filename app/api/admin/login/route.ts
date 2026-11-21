import { NextResponse } from 'next/server';
import { verifyCredentials, setAdminSession, clearAdminSession } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/security/rateLimiter';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local-login';
    const rate = checkRateLimit(`login_${ip}`, 8, 15 * 60 * 1000); // 8 tries per 15 min

    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many failed login attempts. Please wait 15 minutes.' },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!verifyCredentials(email, password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin email or password' },
        { status: 401 }
      );
    }

    await setAdminSession(email);

    return NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true, message: 'Logged out' });
}
