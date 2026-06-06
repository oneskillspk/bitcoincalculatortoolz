import type { Locale } from '@/hooks/useLocale';

/**
 * Format an ISO date string for display on article cards / hubs.
 * Short month, numeric day + year — localized to the active route locale.
 *   EN: "Jan 18, 2026"
 *   TR: "18 Oca 2026"
 */
export function formatArticleDateShort(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Localized reading-time label.
 *   EN: "5 min"  /  "5 min read"
 *   TR: "5 dk"   /  "5 dk okuma"
 */
export function formatReadingTime(
  minutes: number,
  locale: Locale,
  variant: 'short' | 'long' = 'short',
): string {
  if (locale === 'tr') {
    return variant === 'long' ? `${minutes} dk okuma` : `${minutes} dk`;
  }
  return variant === 'long' ? `${minutes} min read` : `${minutes} min`;
}
