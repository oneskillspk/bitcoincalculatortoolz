import type { AllTranslations, Language, Translations } from '@/types/translations';
import en from './en';

/**
 * Eager-loaded default locale (EN) keeps `translations.en[...]` synchronously
 * available so any non-context consumer that imports `{ translations }` still
 * works without flashing keys.
 *
 * Other locales are lazy-loaded via {@link loadLocale} from `LanguageContext`
 * and merged in once their chunk resolves. This removes ~85% of the legacy
 * translations bundle from the initial JS payload for EN visitors.
 */
export const translations: AllTranslations = { en };

const loaders: Record<Exclude<Language, 'en'>, () => Promise<{ default: Translations }>> = {
  es: () => import('./es'),
  fr: () => import('./fr'),
  de: () => import('./de'),
  pt: () => import('./pt'),
  ja: () => import('./ja'),
  ko: () => import('./ko'),
  ar: () => import('./en'), // fallback — no ar dictionary yet
  it: () => import('./en'),
  zh: () => import('./en'),
  ru: () => import('./en'),
  tr: () => import('./tr'),
};

const inflight = new Map<Language, Promise<Translations>>();

export function loadLocale(lang: Language): Promise<Translations> {
  if (translations[lang]) return Promise.resolve(translations[lang]);
  const cached = inflight.get(lang);
  if (cached) return cached;
  const loader = loaders[lang as Exclude<Language, 'en'>] ?? loaders.tr;
  const p = loader().then((m) => {
    translations[lang] = m.default;
    return m.default;
  });
  inflight.set(lang, p);
  return p;
}
