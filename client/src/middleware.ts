import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matcher matches all pathnames except for:
  // - API routes (/api)
  // - Next.js internals (_next)
  // - Admin routes (/admin) - keeping admin in English and un-prefixed
  // - Static files containing a dot (e.g. favicon.ico, images)
  matcher: ['/((?!api|_next|admin|.*\\..*).*)']
};
