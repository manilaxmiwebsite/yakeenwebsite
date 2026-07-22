// Auth is handled by the admin layout (src/app/admin/layout.tsx)
// which uses getServerSession() + redirect() on every admin page.
// This middleware is intentionally passthrough to avoid auth redirect loops.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
