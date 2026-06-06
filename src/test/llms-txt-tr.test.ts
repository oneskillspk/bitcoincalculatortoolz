/**
 * Phase F3 — public/llms.txt Turkish coverage guard.
 *
 * AI engines parse `llms.txt` to discover which languages and URLs a site
 * supports. The file MUST declare Türkçe and list a meaningful set of
 * `/tr/*` URLs so AI assistants cite Turkish pages for Turkish queries.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { EN_TO_TR } from '@/utils/localizedRoutes';

const FILE = 'public/llms.txt';

describe('llms.txt Türkçe coverage (F3)', () => {
  const txt = readFileSync(FILE, 'utf8');

  it('declares Türkçe in the Languages line', () => {
    expect(/Languages:\s*[^\n]*Türkçe/.test(txt)).toBe(true);
  });

  it('contains a `## Türkçe` H2 section', () => {
    expect(/^##\s+Türkçe/m.test(txt)).toBe(true);
  });

  it('lists at least 15 unique /tr/ URLs in the Türkçe section', () => {
    const start = txt.indexOf('## Türkçe');
    expect(start).toBeGreaterThan(0);
    const tail = txt.slice(start);
    const urls = new Set<string>();
    for (const m of tail.matchAll(/https:\/\/bitcoincalculator\.tools(\/tr\/[\w\-/]*)/g)) {
      urls.add(m[1]);
    }
    expect(urls.size).toBeGreaterThanOrEqual(15);
  });

  it('every /tr/ URL in the Türkçe section maps to a real EN_TO_TR entry', () => {
    const start = txt.indexOf('## Türkçe');
    const tail = txt.slice(start);
    const known = new Set<string>(Object.values(EN_TO_TR));
    const offenders: string[] = [];
    for (const m of tail.matchAll(/https:\/\/bitcoincalculator\.tools(\/tr\/[\w\-/]+)/g)) {
      const path = m[1];
      // Allow trailing slash variants
      const normalized = path.endsWith('/') && path !== '/tr/' ? path.slice(0, -1) : path;
      if (!known.has(normalized) && !known.has(normalized + '/')) {
        offenders.push(path);
      }
    }
    expect(offenders, `Unknown TR URLs in llms.txt:\n${offenders.join('\n')}`).toEqual([]);
  });
});
