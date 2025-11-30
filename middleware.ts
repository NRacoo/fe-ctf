import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req : NextRequest) {
  const token = req.cookies.get('token')?.value;
  const userCookie = req.cookies.get('ctf_user')?.value;
  const pathname = req.nextUrl.pathname;

  let userRole = null;
  if (userCookie) {
    try {
      userRole = JSON.parse(userCookie).role;
    } catch {}
  }

  // 1. Public pages
  if (pathname === '/login' || pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 2. Require token for all other pages
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 3. Admin pages require admin role
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!login$|admin/login$|api|_next|favicon.ico).*)',
  ],
};
