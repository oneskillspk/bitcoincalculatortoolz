/**
 * Phase F1 — FAQ JSON-LD TR parity walker.
 *
 * For every page module that:
 *   (a) emits at least one `<script type="application/ld+json">` containing
 *       `"@type": "FAQPage"`, AND
 *   (b) is TR-mounted (file contains `language === 'tr'` gating, i.e. ships
 *       a Turkish Helmet / view),
 * we require at least one FAQPage block within ~600 chars of an
 * `"inLanguage": "tr"` marker — i.e. a parallel TR FAQ schema exists so
 * AI Overviews and Google can extract a Turkish FAQ on `/tr/*`.
 *
 * Pages currently pending conversion are listed in PENDING_TR_FAQ_PARITY.
 * The test asserts that the *actual* pending set equals this list exactly:
 *   - adding a new EN FAQPage to a TR-mounted page without a TR sibling
 *     → fails because the file is not in the allowlist;
 *   - silently dropping a TR FAQ from a converted page
 *     → fails for the same reason.
 *
 * When you convert a page, REMOVE its basename from PENDING_TR_FAQ_PARITY.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_DIR = 'src/pages';

// Pages that emit an EN FAQPage on a TR-mounted route but do NOT yet emit a
// TR FAQPage sibling. Shrink as Phase F1 lands page-by-page.
const PENDING_TR_FAQ_PARITY = new Set<string>([]);

// Pure-EN pages (no `/tr/*` mount; TurkishHome serves the TR home).
// FAQPage on these is intentionally EN-only.
const EN_ONLY_PAGES = new Set<string>([
  'Index.tsx',
  'Learn.tsx',
  'Calculators.tsx',
  'Tools.tsx',
  'OptimizedAbout.tsx',
  'TurkishHome.tsx', // TR-only twin; no EN/TR ternary needed
]);

function emitsFaqPage(src: string): boolean {
  return /"@type"\s*:\s*"FAQPage"/.test(src);
}

function isTrMounted(src: string): boolean {
  return /language\s*===?\s*['"]tr['"]/.test(src);
}

function hasTrFaqBlock(src: string): boolean {
  const faqMatches = [...src.matchAll(/"@type"\s*:\s*"FAQPage"/g)];
  // Accept any of:
  //   "inLanguage": "tr"             (literal, JSON-style)
  //   inLanguage: "tr"               (literal, JS-object shorthand key)
  //   "inLanguage": language === 'tr' ? "tr" : "en"   (dynamic ternary)
  const TR_MARKER =
    /(?:"inLanguage"|inLanguage)\s*:\s*(?:["']tr["']|language\s*===?\s*['"]tr['"]\s*\?\s*['"]tr['"])/;
  for (const m of faqMatches) {
    const idx = m.index ?? 0;
    const win = src.slice(Math.max(0, idx - 500), idx + 500);
    if (TR_MARKER.test(win)) return true;
  }
  return false;
}

describe('TR FAQ JSON-LD parity walker (F1)', () => {
  const files = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.tsx'));

  it('every TR-mounted page with an EN FAQPage has a TR FAQPage sibling (or is in PENDING allowlist)', () => {
    const actualPending: string[] = [];
    const unexpectedlyConverted: string[] = [];

    for (const f of files) {
      if (EN_ONLY_PAGES.has(f)) continue;
      const src = readFileSync(join(PAGES_DIR, f), 'utf8');
      if (!emitsFaqPage(src)) continue;
      if (!isTrMounted(src)) continue;
      const ok = hasTrFaqBlock(src);
      if (!ok) actualPending.push(f);
      else if (PENDING_TR_FAQ_PARITY.has(f)) unexpectedlyConverted.push(f);
    }

    const missingFromAllowlist = actualPending.filter(
      (f) => !PENDING_TR_FAQ_PARITY.has(f),
    );

    expect(
      missingFromAllowlist,
      `\nThese TR-mounted pages emit an EN FAQPage but no TR FAQPage:\n` +
        missingFromAllowlist.map((f) => '  ' + f).join('\n') +
        `\n\nFix: add a parallel FAQPage schema with "inLanguage": "tr" ` +
        `(translate Q&A through docs/TR_TRANSLATION_GUIDELINES.md), ` +
        `or — if intentional — add the basename to PENDING_TR_FAQ_PARITY in this test.\n`,
    ).toEqual([]);

    expect(
      unexpectedlyConverted,
      `\nThese pages now have a TR FAQPage. Remove them from PENDING_TR_FAQ_PARITY:\n` +
        unexpectedlyConverted.map((f) => '  ' + f).join('\n'),
    ).toEqual([]);
  });
});
