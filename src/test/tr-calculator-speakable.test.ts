/**
 * Phase F6b — Speakable schema on top-10 TR calculator pages.
 *
 * The previous F6a test (`tr-article-speakable.test.tsx`) covers TR Learn
 * articles emitted by `<ArticleSchema>`. This test locks in the calculator
 * side: every page in `EXPECTED_PAGES` must wire `buildCalculatorSpeakable`
 * via `useLocalizedSchema` semantics (EN-side and TR-side both ship a
 * `SpeakableSpecification` block with locale-correct `inLanguage`, `@id`,
 * and `url`).
 *
 * Three assertions:
 *  1. Helper contract — `buildCalculatorSpeakable` returns the canonical
 *     shape for both EN and TR inputs (inLanguage flips, @id and url track
 *     the canonical URL, cssSelector includes `h1`).
 *  2. Wiring — each of the 10 calculator pages imports the helper and
 *     invokes it inside a `<script type="application/ld+json">` block.
 *  3. Walker — every `SpeakableSpecification` reference in `src/pages/*.tsx`
 *     sits next to an `inLanguage` field (prevents hardcoded-EN regressions).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildCalculatorSpeakable } from '@/components/seo/calculatorSpeakable';

const PAGES_DIR = 'src/pages';

const EXPECTED_PAGES = [
  'BitcoinProfitLossCalculator.tsx',
  'BitcoinDCACalculator.tsx',
  'BitcoinInvestmentCalculator.tsx',
  'BitcoinRetirementCalculator.tsx',
  'BitcoinAccumulationScoreCalculator.tsx',
  'BitcoinVolatilityCalculator.tsx',
  'BitcoinStakingCalculator.tsx',
  'BitcoinHalvingCountdown.tsx',
  'BitcoinDominanceCalculator.tsx',
  'BitcoinZakatCalculator.tsx',
];

describe('Phase F6b — Speakable schema on top-10 TR calculators', () => {
  it('buildCalculatorSpeakable returns a locale-correct SpeakableSpecification', () => {
    const tr = buildCalculatorSpeakable(
      'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-oynaklik',
      'tr',
    );
    expect(tr['@type']).toBe('WebPage');
    expect(tr.inLanguage).toBe('tr');
    expect(tr['@id']).toMatch(/#speakable$/);
    expect(tr.url).toBe('https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-oynaklik');
    expect(tr.speakable['@type']).toBe('SpeakableSpecification');
    expect(tr.speakable.cssSelector).toContain('h1');

    const en = buildCalculatorSpeakable(
      'https://bitcoincalculator.tools/calculators/volatility',
      'en',
    );
    expect(en.inLanguage).toBe('en');
    expect(en['@id']).toBe('https://bitcoincalculator.tools/calculators/volatility#speakable');
  });

  it.each(EXPECTED_PAGES)('%s imports + invokes buildCalculatorSpeakable inside Helmet', (page) => {
    const src = readFileSync(join(PAGES_DIR, page), 'utf8');
    expect(src, `${page} must import buildCalculatorSpeakable`).toMatch(
      /import\s*\{\s*buildCalculatorSpeakable\s*\}\s*from\s*['"]@\/components\/seo\/calculatorSpeakable['"]/,
    );
    // Must invoke inside a JSON-LD script block.
    const inScript =
      /<script\s+type=["']application\/ld\+json["']\s*>\s*\{?\s*JSON\.stringify\(\s*buildCalculatorSpeakable\(/;
    expect(src, `${page} must emit buildCalculatorSpeakable inside a JSON-LD <script>`).toMatch(
      inScript,
    );
  });

  it('every SpeakableSpecification reference under src/pages sits next to an inLanguage field', () => {
    const offenders: string[] = [];
    for (const f of readdirSync(PAGES_DIR)) {
      if (!f.endsWith('.tsx')) continue;
      const src = readFileSync(join(PAGES_DIR, f), 'utf8');
      // Inline literal SpeakableSpecification → require nearby inLanguage.
      const literalMatches = [...src.matchAll(/SpeakableSpecification/g)];
      for (const m of literalMatches) {
        const idx = m.index ?? 0;
        const window = src.slice(Math.max(0, idx - 800), Math.min(src.length, idx + 800));
        const hasInLanguage = /(["']?inLanguage["']?\s*:)/.test(window);
        // OR it's emitted via the helper which already enforces inLanguage.
        const viaHelper = /buildCalculatorSpeakable\s*\(/.test(window);
        if (!hasInLanguage && !viaHelper) {
          offenders.push(`${f} @ char ${idx}`);
        }
      }
    }
    expect(offenders, `Speakable refs without inLanguage:\n${offenders.join('\n')}`).toEqual([]);
  });
});
