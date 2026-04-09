export const locales = ['vi', 'en', 'zh', 'ja', 'ko'] as const;
export const defaultLocale = 'vi' as const;

export const localeNames: Record<string, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

export type Locale = (typeof locales)[number];

export const getLocalizedPathname = (
  pathname: string,
  locale: string,
  isDefaultLocale: boolean
): string => {
  if (isDefaultLocale && !pathname.startsWith(`/${locale}`)) {
    return pathname;
  }
  if (pathname.startsWith(`/${locale}`)) {
    return pathname;
  }
  return `/${locale}${pathname}`;
};
