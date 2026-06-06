import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Picks the locale-appropriate JSON-LD payload for the current page.
 *
 * Usage:
 *   const schema = useLocalizedSchema(enSchema, trSchema);
 *   <script type="application/ld+json">{JSON.stringify(schema)}</script>
 *
 * The TR payload should already include `inLanguage: "tr"` and any TR
 * `@id` / `url` / `description` fields. This hook just selects between
 * the two and leaves authoring to the caller.
 */
export function useLocalizedSchema<TEn, TTr>(en: TEn, tr: TTr): TEn | TTr {
  const { language } = useLanguage();
  return language === 'tr' ? tr : en;
}
