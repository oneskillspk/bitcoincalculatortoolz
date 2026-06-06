/**
 * Phase F2 — BreadcrumbSchema locale-awareness guard.
 *
 * `BreadcrumbSchema` accepts a `language` prop that drives `inLanguage`
 * on the emitted `BreadcrumbList` JSON-LD. Every caller in src/pages
 * MUST thread `language` through so `/tr/*` pages don't emit
 * `inLanguage: "en"` schema on Turkish URLs.
 *
 * Failure to pass `language` is a Phase F regression — gate it in CI.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES_DIR = 'src/pages';

describe('BreadcrumbSchema locale-awareness (F2)', () => {
  it('every BreadcrumbSchema call passes a language prop', () => {
    const offenders: string[] = [];
    const files = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.tsx'));
    for (const f of files) {
      const src = readFileSync(join(PAGES_DIR, f), 'utf8');
      // Match each JSX call to <BreadcrumbSchema ...>  capturing up to the
      // closing `/>` or `>`. Tolerates multi-line prop spreads.
      const callRe = /<BreadcrumbSchema\b([^>]*?)\/?>/gs;
      for (const m of src.matchAll(callRe)) {
        const props = m[1];
        if (!/\blanguage\s*=/.test(props)) {
          offenders.push(`${f}: <BreadcrumbSchema> call missing language= prop`);
        }
      }
    }
    expect(
      offenders,
      `BreadcrumbSchema callers missing language prop:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });
});
