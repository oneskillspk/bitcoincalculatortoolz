/**
 * Phase F1 — Article-level FAQPage TR parity walker.
 *
 * Calculator/static pages are covered by `tr-faq-schema-parity.test.tsx`.
 * Learn articles are rendered through a single component (`LearnArticle.tsx`
 * → `ArticleSchema.tsx`), which emits `FAQPage` JSON-LD with
 * `inLanguage: language` derived from the active route. That means TR
 * `FAQPage` parity for articles is enforced by ensuring that, for every
 * EN article shipping a non-empty `faqs:` array, its mapped TR sibling
 * (per `EN_TO_TR` in `src/utils/localizedRoutes.ts`) also exists and
 * also ships a non-empty `faqs:` array.
 *
 * If this test fails:
 *   - "no TR sibling mapped"  → add the EN→TR slug pair to EN_TO_TR.
 *   - "TR sibling file missing" → create `src/data/articles/<slug>.tr.ts`.
 *   - "TR sibling has empty faqs" → author the TR Q&A.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { EN_TO_TR } from '@/utils/localizedRoutes';

const ARTICLES_DIR = 'src/data/articles';

function hasNonEmptyFaqs(src: string): boolean {
  // Match `faqs: [ ... { ... } ... ]` — at least one object literal inside.
  const m = src.match(/faqs\s*:\s*\[([\s\S]*?)\n\s*\]/);
  if (!m) return false;
  return /\{[\s\S]*?\}/.test(m[1]);
}

function enFiles(): string[] {
  return readdirSync(ARTICLES_DIR).filter(
    (f) => f.endsWith('.ts') && !f.endsWith('.tr.ts') && f !== 'index.ts',
  );
}

function trSlugFor(enSlug: string): string | null {
  const trPath = EN_TO_TR[`/learn/${enSlug}`];
  if (!trPath) return null;
  return trPath.replace(/^\/tr\/ogrenin\//, '');
}

describe('Article FAQPage TR parity (F1 / articles)', () => {
  it('every EN article with FAQs has a TR sibling article with FAQs', () => {
    const failures: string[] = [];

    for (const file of enFiles()) {
      const enPath = join(ARTICLES_DIR, file);
      const enSrc = readFileSync(enPath, 'utf8');
      if (!hasNonEmptyFaqs(enSrc)) continue; // EN has no FAQ → skip

      const enSlug = file.replace(/\.ts$/, '');
      if (!trSlugFor(enSlug)) {
        failures.push(`${file}: no TR sibling mapped in EN_TO_TR for /learn/${enSlug}`);
        continue;
      }

      // Convention: TR data lives in `<EN-slug>.tr.ts`; the TR route slug
      // is read from the file's `slug:` field at runtime.
      const trFile = `${enSlug}.tr.ts`;
      const trPath = join(ARTICLES_DIR, trFile);
      if (!existsSync(trPath)) {
        failures.push(`${file}: TR sibling file missing (${trFile})`);
        continue;
      }

      const trSrc = readFileSync(trPath, 'utf8');
      if (!hasNonEmptyFaqs(trSrc)) {
        failures.push(`${file}: TR sibling ${trFile} has empty faqs array`);
      }
    }

    expect(
      failures,
      `\nFAQ parity failures (${failures.length}):\n` +
        failures.map((f) => '  ' + f).join('\n') +
        `\n\nFix per the header comment in this test file.\n`,
    ).toEqual([]);
  });

  it('ArticleSchema emits FAQPage with dynamic inLanguage from the language prop', () => {
    const src = readFileSync('src/components/learn/ArticleSchema.tsx', 'utf8');
    // FAQPage block must include `"inLanguage": language` so /tr/* routes
    // emit inLanguage:"tr" automatically.
    const faqIdx = src.indexOf('"FAQPage"');
    expect(faqIdx, 'ArticleSchema.tsx must emit a FAQPage block').toBeGreaterThan(-1);
    const window = src.slice(faqIdx, faqIdx + 600);
    expect(
      window,
      'FAQPage block must bind inLanguage to the language prop (dynamic, not hard-coded "en")',
    ).toMatch(/inLanguage"?\s*:\s*language\b/);
  });
});
