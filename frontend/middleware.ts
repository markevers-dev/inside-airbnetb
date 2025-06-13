import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';

export const middleware = async (request: NextRequest) => {
  const authRes = await auth0.middleware(request);

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/auth') || pathname === '/') {
    return applyCspHeaders(authRes, request);
  }

  const { origin } = new URL(request.url);
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  return applyCspHeaders(authRes, request);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

const applyCspHeaders = (
  response: NextResponse,
  request: NextRequest,
): NextResponse => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const styleSrc = [
    "'self'",
    'https://fonts.googleapis.com',
    'https://api.mapbox.com',
    "'unsafe-inline'",
  ]
    .filter(Boolean)
    .join(' ');

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://api.mapbox.com https://cdnjs.cloudflare.com https://a.tiles.mapbox.com https://b.tiles.mapbox.com https://c.tiles.mapbox.com ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : null};
    style-src ${styleSrc};
    style-src-elem ${styleSrc};
    style-src-attr ${styleSrc};
    font-src 'self' https://fonts.gstatic.com https://api.mapbox.com;
    connect-src 'self' https://dev-3en8vocozkp65e3m.us.auth0.com https://localhost:7297 https://api.mapbox.com https://events.mapbox.com https://a.tiles.mapbox.com https://b.tiles.mapbox.com https://c.tiles.mapbox.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    img-src 'self' https://avatars.githubusercontent.com https://api.mapbox.com https://events.mapbox.com https://*.tile.openstreetmap.org https://*.tiles.mapbox.com data:;
    media-src 'self' https://api.mapbox.com https://events.mapbox.com data:;
    worker-src 'self' blob:;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
};
