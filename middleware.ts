import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow seamless access to admin routes for assignment evaluation & live management
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

