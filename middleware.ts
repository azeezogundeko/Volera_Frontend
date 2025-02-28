import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /admin/settings)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/admin/login';

  // Get the token from cookies
  const token = request.cookies.get('admin_token')?.value;

  // Redirect logic for protected routes
  if (!isPublicPath && !token) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isPublicPath && token) {
    // Redirect to admin dashboard if trying to access login page with token
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure the paths that should be protected by the middleware
export const config = {
  matcher: [
    '/admin/:path*'  // Protect all routes under /admin
  ]
}; 