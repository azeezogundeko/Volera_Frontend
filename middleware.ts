import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip authentication for the login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for admin token
    const token = request.cookies.get('admin_token')?.value || ''
    
    if (!token) {
      // Redirect to admin login if no token is present
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // You can add additional token verification logic here if needed
      return NextResponse.next()
    } catch (error) {
      // If token verification fails, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: '/admin/:path*'
} 