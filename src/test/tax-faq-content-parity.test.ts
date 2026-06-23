/**
 * Verifies the regional tax-page FAQs:
 *   1. Each region has exactly 5 Q/A entries (EN + TR).
 *   2. Every question / answer references the current 2026 tax year (no stale "2025").
 *   3. No stray glyphs (replacement chars, lone surrogates, mojibake patterns) appear.
 */
import { describe, it, expect } from 'vitest';
import { REGION_META, type RegionId } from '@/components/tax/regionMeta';

// Year strings expected to appear at least once in each region's FAQ corpus.
const YEAR_HINTS: Record<RegionId, RegExp> = {
  in: /2026-27/,
  uk: /2026\/27/,
  de: /2026/,
};

// Patterns flagged as broken text.
const BROKEN_GLYPH = /[\uFFFD\uD800-\uDFFF]/; // replacement char + lone surrogates
const MOJIBAKE = /(?:Ã.|â\u0080..|â\u0082¬|Â£|Â§|â‚¬)/; // common UTF-8 → Latin-1 corruption

const STALE_YEAR = /\b2025\b/;

describe('Regional tax FAQ content — 2026 freshness & glyph hygiene', () => {
  const regions: RegionId[] = ['in', 'uk', 'de'];

  for (const r of regions) {
    const meta = REGION_META[r];

    describe(`${r.toUpperCase()}`, () => {
      it('has exactly 5 FAQ entries with EN + TR strings', () => {
        expect(meta.faq).toHaveLength(5);
        for (const item of meta.faq) {
          expect(item.q.en.trim().length).toBeGreaterThan(10);
          expect(item.q.tr.trim().length).toBeGreaterThan(10);
          expect(item.a.en.trim().length).toBeGreaterThan(20);
          expect(item.a.tr.trim().length).toBeGreaterThan(20);
          expect(item.q.en.trim().endsWith('?')).toBe(true);
          expect(item.q.tr.trim().endsWith('?')).toBe(true);
        }
      });

      it('references the current 2026 tax year and never the stale 2025 year', () => {
        const corpus = meta.faq
          .flatMap((f) => [f.q.en, f.q.tr, f.a.en, f.a.tr])
          .join(' \n ');
        expect(corpus).toMatch(YEAR_HINTS[r]);
        expect(corpus).not.toMatch(STALE_YEAR);
      });

      it('contains no broken glyphs or mojibake', () => {
        for (const item of meta.faq) {
          for (const [field, val] of Object.entries({
            'q.en': item.q.en,
            'q.tr': item.q.tr,
            'a.en': item.a.en,
            'a.tr': item.a.tr,
          })) {
            expect(BROKEN_GLYPH.test(val), `${r}/${field}: replacement/surrogate in "${val}"`).toBe(false);
            expect(MOJIBAKE.test(val), `${r}/${field}: mojibake in "${val}"`).toBe(false);
          }
        }
      });
    });
  }
});
