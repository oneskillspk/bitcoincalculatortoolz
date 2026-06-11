/**
 * Phase F2 — BreadcrumbSchema locale-awareness guard.
 *
 * Historical: callers used to pass `language` so BreadcrumbList JSON-LD would
 * emit `inLanguage`. Schema.org rejects `inLanguage` on BreadcrumbList
 * ("Unexpected property" in Rich Results), so the prop is now accepted but
 * NOT serialized. The locale-awareness contract still applies to the sibling
 * Article / WebPage / FAQPage blocks — those continue to carry `inLanguage`.
 *
 * Guards in this file:
 *   1. Every <BreadcrumbSchema> caller still passes a `language` prop (kept
 *      so any future re-introduction is mechanical).
 *   2. The emitted JSON-LD never contains `inLanguage` on BreadcrumbList.
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

  it('BreadcrumbSchema component does NOT emit inLanguage in JSON-LD', () => {
    const src = readFileSync('src/components/seo/BreadcrumbSchema.tsx', 'utf8');
    // The JSON-LD literal must not include an inLanguage key.
    const breadcrumbObj = src.match(/breadcrumbList\s*=\s*\{[\s\S]*?\};/)?.[0] ?? '';
    expect(breadcrumbObj).not.toMatch(/inLanguage/);
  });

  it('ArticleSchema breadcrumbSchema literal does NOT include inLanguage', () => {
    const src = readFileSync('src/components/learn/ArticleSchema.tsx', 'utf8');
    const breadcrumbObj = src.match(/breadcrumbSchema\s*=\s*\{[\s\S]*?\};/)?.[0] ?? '';
    expect(breadcrumbObj).not.toMatch(/inLanguage/);
  });
});
