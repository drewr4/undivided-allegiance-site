import { next, rewrite } from '@vercel/edge';

export default function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.hostname === 'book.undividedallegiance.com') {
    // Let static assets pass through
    if (url.pathname.startsWith('/_astro') || url.pathname.match(/\.\w+$/)) {
      return next();
    }
    // Rewrite all other requests to the book landing page
    return rewrite(new URL('/book-landing/', url.origin));
  }

  return next();
}

export const config = {
  matcher: '/(.*)',
};
