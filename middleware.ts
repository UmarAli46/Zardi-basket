import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // In development, allow seamless testing of admin routes
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  // Protect all /admin routes except /login
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('zb_admin_token')?.value;

    if (!adminToken || !adminToken.startsWith('zbt_')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

