/**
 * Phase M1 — ArticleSchema author URLs are locale-aware.
 *
 * Source-level guard: asserts the author Person.url and
 * <meta property="article:author"> in ArticleSchema.tsx are computed
 * from the `language` prop, not hardcoded to `/about`. On TR routes
 * these must point to `/tr/hakkimizda` to match the localized About route.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('Phase M1 — ArticleSchema author URL locale parity', () => {
  const src = readFileSync('src/components/learn/ArticleSchema.tsx', 'utf8');

  it('Person.url branches on language === "tr" → /tr/hakkimizda', () => {
    // Both Person entries must use the localized URL pattern.
    const matches = src.match(/language\s*===\s*["']tr["']\s*\?\s*["']\/tr\/hakkimizda["']\s*:\s*["']\/about["']/g);
    expect(
      matches?.length ?? 0,
      'Expected ≥3 occurrences of the language-branched author URL (2 Persons + article:author meta)',
    ).toBeGreaterThanOrEqual(3);
  });

  it('does not retain a hardcoded /about URL on author Person or article:author', () => {
    // The lingering `"https://bitcoincalculator.tools/about"` literal must
    // not appear as a Person.url or as an article:author meta content.
    const personUrlLiteral = /"url"\s*:\s*"https:\/\/bitcoincalculator\.tools\/about"/;
    const articleAuthorLiteral = /article:author"\s+content="https:\/\/bitcoincalculator\.tools\/about"/;
    expect(personUrlLiteral.test(src), 'Person.url must not be a literal /about').toBe(false);
    expect(articleAuthorLiteral.test(src), 'article:author must not be a literal /about').toBe(false);
  });
});
