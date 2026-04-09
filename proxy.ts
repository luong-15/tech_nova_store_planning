import createMiddleware from 'next-intl/middleware'

const locales = ['vi', 'en', 'zh', 'ja', 'ko']
const defaultLocale = 'vi'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*|.*\\.ico).*)',
  ],
}
