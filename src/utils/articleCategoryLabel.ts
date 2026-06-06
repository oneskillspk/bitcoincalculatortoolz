/**
 * Localized labels for article categories. Categories are stored in English
 * in article metadata; the UI translates them on render based on locale.
 */
export const CATEGORY_TR_LABELS: Record<string, string> = {
  All: 'Tümü',
  Investing: 'Yatırım',
  Trading: 'Ticaret',
  Mining: 'Madencilik',
  Basics: 'Temeller',
  Tax: 'Vergi',
  'Market Analysis': 'Piyasa Analizi',
};

export function getCategoryLabel(category: string, locale: 'en' | 'tr'): string {
  if (locale === 'tr') return CATEGORY_TR_LABELS[category] ?? category;
  return category;
}
