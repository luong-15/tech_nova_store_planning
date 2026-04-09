import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';

export default createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale: defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*|.*\\.ico).*)',
  ],
};
