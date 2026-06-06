import { useCallback } from 'react';
import { getLocalizedPath, normalizeLocalizedPath } from '@/utils/localizedRoutes';
import { useLocale } from '@/hooks/useLocale';

/**
 * Resolve any internal href to its locale-appropriate mirror based on the
 * current URL.
 *
 * - Canonical EN paths (`/learn/...`, `/calculators/...`) → mapped TR mirror.
 * - "Misbuilt" TR hrefs that leak through with EN slugs
 *   (`/tr/ogrenin/<en-slug>`, `/tr/learn/...`) → forward-fixed via
 *   `normalizeLocalizedPath`.
 * - External / mailto / tel / hash / protocol-relative hrefs pass through.
 */
export function useLocalizedHref() {
  const { locale } = useLocale();

  return useCallback(
    (to: string): string => {
      if (!to || typeof to !== 'string') return to;
      if (
        to.startsWith('http://') ||
        to.startsWith('https://') ||
        to.startsWith('//') ||
        to.startsWith('mailto:') ||
        to.startsWith('tel:') ||
        to.startsWith('#')
      ) {
        return to;
      }

      // Already locale-prefixed: still run through the normalizer so any
      // misbuilt /tr/<en-segment>/<slug> or /tr/<tr-segment>/<en-slug>
      // pair gets forwarded to the correct TR mirror.
      if (locale === 'tr' && (to === '/tr' || to.startsWith('/tr/'))) {
        return normalizeLocalizedPath(to);
      }
      if (locale === 'en' && !to.startsWith('/tr')) return to;

      return getLocalizedPath(to, locale);
    },
    [locale],
  );
}
