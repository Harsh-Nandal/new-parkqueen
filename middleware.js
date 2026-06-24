import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === '/admin/login'
  const token = request.cookies.get('admin_token')?.value

  if (pathname.startsWith('/admin') && !isLogin && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLogin && token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
