/**
 * Phase H2 — LearnArticle date formatting respects active locale.
 *
 * Lightweight source-level guard: asserts LearnArticle.tsx constructs its
 * Intl.DateTimeFormat from the language flag rather than a hardcoded
 * 'en-US'. This catches the regression where TR articles rendered
 * "January 15, 2026" instead of "15 Ocak 2026".
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('Phase H2 — TR article date formatting', () => {
  const src = readFileSync('src/pages/LearnArticle.tsx', 'utf8');

  it('Intl.DateTimeFormat is parameterized by language, not literal en-US', () => {
    // Find the dateFormatter construction
    const m = src.match(/Intl\.DateTimeFormat\(([^,]+),/);
    expect(m, 'LearnArticle must build an Intl.DateTimeFormat').not.toBeNull();
    const localeArg = m![1].trim();
    expect(
      localeArg,
      `dateFormatter locale must depend on language — got "${localeArg}"`,
    ).not.toMatch(/^['"]en-US['"]$/);
    expect(localeArg).toMatch(/tr-TR/);
    expect(localeArg).toMatch(/en-US/);
  });

  it('Intl returns Turkish month names for tr-TR', () => {
    // Sanity-check the runtime supports tr-TR.
    const f = new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const out = f.format(new Date('2026-01-15'));
    expect(out).toMatch(/Ocak/);
    expect(out).not.toMatch(/January/);
  });
});
