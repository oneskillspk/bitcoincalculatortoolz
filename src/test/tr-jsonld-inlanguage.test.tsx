/**
 * Phase E4 — JSON-LD `inLanguage` walker.
 *
 * For every page module that mounts on a TR route (per EN_TO_TR), assert
 * that any JSON-LD literal inside a TR-gated branch declares
 * `inLanguage: "tr"`.
 *
 * Recognized TR gates:
 *   - `language === 'tr' && <>...</>}` fragment block
 *   - `language === 'tr' ? <script ...>...</script> : <script ...>...</script>` ternary
 *
 * Exempt schema types (set site-wide / language-agnostic):
 *   BreadcrumbList, ItemList, WebSite
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { EN_TO_TR } from '@/utils/localizedRoutes';

const PAGES_DIR = 'src/pages';
const EXEMPT_TYPES = ['BreadcrumbList', 'ItemList', 'WebSite'];

// Best-effort: map each page file by component name to its mounted EN routes.
// For this walker we don't need a precise mapping — we walk every page and
// only assert on files that actually emit TR-gated JSON-LD.
const trRouteCount = Object.keys(EN_TO_TR).length;

function extractTrBlocks(src: string): string[] {
  const blocks: string[] = [];
  // 1. Fragment gate
  const gateRe = /language\s*===?\s*['"]tr['"]\s*&&\s*<>/g;
  for (const m of src.matchAll(gateRe)) {
    const start = m.index ?? 0;
    const endIdx = src.indexOf('</>}', start);
    if (endIdx !== -1) blocks.push(src.slice(start, endIdx));
  }
  // 2. Ternary gate around a <script type="application/ld+json"> block
  const ternRe = /language\s*===?\s*['"]tr['"]\s*\?\s*\([\s\S]*?<script type="application\/ld\+json">[\s\S]*?<\/script>[\s\S]*?\)/g;
  for (const m of src.matchAll(ternRe)) blocks.push(m[0]);
  return blocks;
}

describe('TR JSON-LD inLanguage walker (E4)', () => {
  it(`tracks ${trRouteCount} TR routes; every TR JSON-LD has inLanguage:"tr" (or is exempt)`, () => {
    const offenders: string[] = [];
    const files = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.tsx'));
    for (const f of files) {
      const src = readFileSync(join(PAGES_DIR, f), 'utf8');
      const blocks = extractTrBlocks(src);
      for (const block of blocks) {
        // Find every JSON-LD script tag inside this block
        const scriptRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
        for (const sm of block.matchAll(scriptRe)) {
          const body = sm[1];
          // Detect @type — accept the first match (top-level)
          const typeMatch = body.match(/"@type"\s*:\s*"([^"]+)"/);
          const type = typeMatch?.[1] ?? '';
          if (EXEMPT_TYPES.includes(type)) continue;
          if (!/"inLanguage"\s*:\s*"tr"/.test(body)) {
            offenders.push(`${f}: <${type || 'unknown'}> JSON-LD missing inLanguage:"tr"`);
          }
        }
      }
    }
    expect(offenders, `Missing inLanguage:"tr":\n${offenders.join('\n')}`).toEqual([]);
  });
});
