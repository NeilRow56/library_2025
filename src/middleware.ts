import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const protectedRoutes = ['/profile', '/post/create', '/post/edit']

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname
  const sessionCookie = getSessionCookie(request)

  const isProtectedRoute = protectedRoutes.some(route =>
    pathName.startsWith(route)
  )

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  // If user is already logged in and user is accessing auth route
  //they will automatically be redirected to the home page

  if (pathName === '/auth' && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: ['/profile/:path*', '/post/create', '/post/edit/:path*', '/auth']
}
