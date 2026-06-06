/**
 * Sitemap hreflang validator.
 *
 * Parses public/sitemap.xml and asserts that for every EN page mapped in
 * EN_TO_TR:
 *
 *   1. Both <url> entries exist (EN canonical + TR mirror).
 *   2. Each entry carries the complete hreflang triplet
 *      (en, tr, x-default).
 *   3. The hrefs point at the EN_TO_TR-correct absolute URLs.
 *   4. The EN and TR entries' hreflang siblings agree (symmetric set).
 *
 * Pure XML parse — no rendering, no network. Fast guard for sitemap drift.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { EN_TO_TR } from '@/utils/localizedRoutes';

const BASE = 'https://bitcoincalculator.tools';

interface UrlEntry {
  loc: string;
  hreflangs: Record<string, string>;
}

const xml = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');

const entries: UrlEntry[] = [];
for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const block = m[1];
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
  const hreflangs: Record<string, string> = {};
  for (const link of block.matchAll(
    /<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g,
  )) {
    hreflangs[link[1]] = link[2];
  }
  entries.push({ loc, hreflangs });
}

const byLoc = new Map(entries.map((e) => [e.loc, e]));

const trEntries = Object.entries(EN_TO_TR);

describe('Sitemap hreflang validator — every page has a complete EN↔TR triplet', () => {
  it('sitemap parsed at least one <url>', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(trEntries)(
    '%s → %s: both <url> entries present in sitemap',
    (enPath, trPath) => {
      expect(byLoc.has(`${BASE}${enPath}`), `missing EN <url> for ${enPath}`).toBe(true);
      expect(byLoc.has(`${BASE}${trPath}`), `missing TR <url> for ${trPath}`).toBe(true);
    },
  );

  it.each(trEntries)(
    '%s emits hreflang triplet pointing at %s',
    (enPath, trPath) => {
      const en = byLoc.get(`${BASE}${enPath}`)!;
      expect(en.hreflangs.en, `EN entry missing hreflang=en`).toBe(`${BASE}${enPath}`);
      expect(en.hreflangs.tr, `EN entry missing hreflang=tr`).toBe(`${BASE}${trPath}`);
      expect(en.hreflangs['x-default'], `EN entry missing hreflang=x-default`).toBe(
        `${BASE}${enPath}`,
      );
    },
  );

  it.each(trEntries)(
    '%s (TR mirror %s) emits matching hreflang triplet',
    (enPath, trPath) => {
      const tr = byLoc.get(`${BASE}${trPath}`)!;
      expect(tr.hreflangs.en, `TR entry missing hreflang=en`).toBe(`${BASE}${enPath}`);
      expect(tr.hreflangs.tr, `TR entry missing hreflang=tr`).toBe(`${BASE}${trPath}`);
      expect(tr.hreflangs['x-default'], `TR entry missing hreflang=x-default`).toBe(
        `${BASE}${enPath}`,
      );
    },
  );

  it('EN and TR siblings agree on the hreflang set (symmetric)', () => {
    const mismatches: string[] = [];
    for (const [enPath, trPath] of trEntries) {
      const en = byLoc.get(`${BASE}${enPath}`);
      const tr = byLoc.get(`${BASE}${trPath}`);
      if (!en || !tr) continue;
      for (const lang of ['en', 'tr', 'x-default']) {
        if (en.hreflangs[lang] !== tr.hreflangs[lang]) {
          mismatches.push(
            `${enPath} ↔ ${trPath} disagree on hreflang="${lang}" (${en.hreflangs[lang]} vs ${tr.hreflangs[lang]})`,
          );
        }
      }
    }
    expect(mismatches, mismatches.join('\n')).toHaveLength(0);
  });

  it('no <url> with a /tr path is missing its hreflang triplet', () => {
    const incomplete = entries
      .filter((e) => e.loc.startsWith(`${BASE}/tr`))
      .filter(
        (e) =>
          !e.hreflangs.en || !e.hreflangs.tr || !e.hreflangs['x-default'],
      )
      .map((e) => e.loc);
    expect(incomplete, `incomplete TR entries:\n${incomplete.join('\n')}`).toHaveLength(0);
  });
});
