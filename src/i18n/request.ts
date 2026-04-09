import { getRequestConfig } from 'next-intl/server'

const locales = ['vi', 'en', 'zh', 'ja', 'ko'] as const
export type Locale = (typeof locales)[number]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale as Locale
  
  let messages
  
  try {
    messages = (await import(`../../messages/${validLocale}.json`)).default
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error)
    messages = {}
  }

  return {
    messages,
  }
})
