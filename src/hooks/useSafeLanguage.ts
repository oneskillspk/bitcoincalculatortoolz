import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import type { Language } from '@/types/translations';

/**
 * Returns the active UI language ('en' | 'tr') without throwing when used
 * outside a LanguageProvider. Falls back to 'en'.
 *
 * Used by monetization components (AffiliatePlacement) so we never crash
 * a calculator page just because we forgot to wire the provider in a test
 * or storybook context.
 */
export function useSafeLanguage(): Language {
  const ctx = useContext(LanguageContext);
  if (ctx?.language === 'tr' || ctx?.language === 'en') return ctx.language;
  // Last-resort URL sniff (prevents EN flash on /tr/* if context missing)
  try {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p === '/tr' || p.startsWith('/tr/')) return 'tr';
    }
  } catch {
    // ignore
  }
  return 'en';
}
