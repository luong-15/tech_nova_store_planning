import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

const locales = ['vi', 'en', 'zh', 'ja', 'ko']
const defaultLocale = 'vi'

export function isValidLocale(locale: string): locale is typeof locales[number] {
  return locales.includes(locale as typeof locales[number])
}

export default getRequestConfig(async ({ locale }) => {
  if (!isValidLocale(locale)) {
    notFound()
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
