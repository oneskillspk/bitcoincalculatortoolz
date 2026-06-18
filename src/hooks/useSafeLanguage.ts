import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

/**
 * Returns the active monetization language ('en' | 'tr') without throwing
 * when used outside a LanguageProvider. Falls back to 'en'.
 *
 * Narrower than the full app `Language` type ('en' | 'tr' | 'ar') because the
 * affiliate engine only ships English and Turkish creatives — any other UI
 * language (e.g. 'ar') maps to 'en' until creatives exist.
 */
export type SafeLanguage = 'en' | 'tr';

export function useSafeLanguage(): SafeLanguage {
  const ctx = useContext(LanguageContext);
  if (ctx?.language === 'tr') return 'tr';
  if (ctx?.language === 'en') return 'en';
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
