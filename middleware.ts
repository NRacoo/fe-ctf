import { url } from 'inspector';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token');
  const {pathname} = req.nextUrl;

  const secret =new TextEncoder().encode(process.env.JWTSECRET)
  if(!token){
    return NextResponse.redirect(new URL('login', req.url))
  }
  
  if (pathname.startsWith('/admin/dashboard')){
    if(!token){
        const url = req.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
    }

    try {
        const { payload } = await jwtVerify(token.value, secret)
        if(payload.role !== 'admin'){
            const url = req.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
        
    } catch (error) {
        console.error("Token Error:", error);
        const url = req.nextUrl.clone();
        url.pathname = '/admin';
       
        const response = NextResponse.redirect(url);
        response.cookies.delete('access_token');
        return response;
    }
  }


  // Jika token ada, lanjutkan request
  return NextResponse.next();
}

export const config = {
    matcher: [ "/admin/dashboard/:path*"]
}