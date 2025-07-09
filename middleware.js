import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { languages, cookieName } from './app/i18n/settings';
import acceptLanguage from 'accept-language';

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
}

// The middleware is used to refresh the user's session before loading Server Component routes
export async function middleware(req) {
  const res = NextResponse.next();
  
  // Add CORS headers for widget endpoints
  if (req.nextUrl.pathname === '/widjet' || req.nextUrl.pathname.startsWith('/widget')) {
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.headers.set('X-Frame-Options', 'ALLOWALL');
    res.headers.set('Content-Security-Policy', "frame-ancestors *");
  }
  
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  let lng;
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  }
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }
  if (!lng) {
    lng = languages[0];
  }
  
  const response = res;
  if (req.cookies.get(cookieName)?.value !== lng) {
    response.cookies.set(cookieName, lng);
  }

  return response;
}
