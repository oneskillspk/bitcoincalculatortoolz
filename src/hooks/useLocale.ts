import { useLocation } from 'react-router-dom';

export type Locale = 'en' | 'tr';

/**
 * Returns the active locale derived from the URL prefix and a sensible
 * default currency for that locale. Mirrors the behaviour of LocaleMeta
 * so non-context consumers (calculators, share cards, toasts) can localise
 * without depending on the LanguageContext provider tree.
 */
export function useLocale() {
  const { pathname } = useLocation();
  const isTr = pathname === '/tr' || pathname.startsWith('/tr/');
  const locale: Locale = isTr ? 'tr' : 'en';

  return {
    locale,
    isTr,
    /** BCP-47 tag for Intl.* APIs */
    intlLocale: isTr ? 'tr-TR' : 'en-US',
    /** Default fiat currency for the locale */
    defaultCurrency: isTr ? 'TRY' : 'USD',
    /**
     * Translate helper for tiny inline strings (toasts, aria-labels).
     * Pass a record keyed by locale.
     */
    pick: <T,>(map: { en: T; tr: T }): T => (isTr ? map.tr : map.en),
  };
}
