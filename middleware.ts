import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'default-secret-change-in-production'
)

// Paths that require authentication
const protectedPaths = ['/admin']
// Paths that should redirect to dashboard if already authenticated
const authPaths = ['/admin-login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check path types
  const isAuthPath = authPaths.includes(pathname)
  // Protected path: starts with /admin but is NOT the login page
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path)) && !isAuthPath

  // Get token from cookie
  const token = request.cookies.get('admin_session')?.value

  // Verify token
  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch {
      isAuthenticated = false
    }
  }

  // Redirect to login if accessing protected path without auth
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/admin-login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing login page while authenticated
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
}
