/**
 * Phase F6b — Speakable schema for top-10 TR calculator pages.
 *
 * Returns a `SpeakableSpecification` JSON-LD object that targets the page
 * answer headline (`h1` is universally present on every calculator). The
 * `@id`, `url`, and `inLanguage` fields are locale-correct so EN and TR
 * variants emit a parallel block for AI voice surfaces.
 *
 * Usage:
 *   <script type="application/ld+json">
 *     {JSON.stringify(buildCalculatorSpeakable(canonicalUrl, language))}
 *   </script>
 */
export function buildCalculatorSpeakable(
  canonicalUrl: string,
  language: string,
) {
  const lang = language === 'tr' ? 'tr' : 'en';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#speakable`,
    inLanguage: lang,
    url: canonicalUrl,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1'],
    },
  };
}
