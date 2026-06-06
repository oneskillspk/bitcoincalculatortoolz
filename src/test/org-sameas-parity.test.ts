/**
 * Phase G (F7a) — Organization JSON-LD `sameAs` parity guard.
 *
 * The EN Org block (Index.tsx, OptimizedAbout.tsx) must include every
 * identity link present in the TR Org block (TurkishHome.tsx). The TR
 * twin already lists LinkedIn + GitHub; without this guard EN can silently
 * drift back to a Twitter-only set and split the entity's identity graph
 * for crawlers / AI engines.
 *
 * Two assertions:
 *  1. Parity — EN Org `sameAs` set ⊇ TR Org `sameAs` set on every page
 *     emitting a top-level Organization block.
 *  2. Walker — every `"@type": "Organization"` block under src/pages/ or
 *     src/components/seo/ that is NOT a nested `publisher`/`provider`
 *     reference must include a `sameAs` field with at least one valid
 *     absolute `https://` URL.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const EN_ORG_FILES = ['src/pages/Index.tsx', 'src/pages/OptimizedAbout.tsx'];
const TR_ORG_FILE = 'src/pages/TurkishHome.tsx';

/** Pull every top-level Organization block's sameAs array from a source file. */
function extractOrgSameAs(src: string): string[][] {
  // Find each `"@type": "Organization"` occurrence and search forward
  // within ~1200 chars for the next `"sameAs": [...]` literal.
  const results: string[][] = [];
  const orgRe = /"@type"\s*:\s*"Organization"/g;
  let m: RegExpExecArray | null;
  while ((m = orgRe.exec(src)) !== null) {
    const window = src.slice(m.index, Math.min(src.length, m.index + 1500));
    const arrMatch = window.match(/"sameAs"\s*:\s*\[([\s\S]*?)\]/);
    if (!arrMatch) continue;
    const urls = [...arrMatch[1].matchAll(/["']([^"']+)["']/g)].map((u) => u[1]);
    results.push(urls);
  }
  return results;
}

/** Detect a nested Organization reference (publisher, provider, author,
 *  creator, sourceOrganization, brand, parentOrganization, memberOf, logo
 *  context) — these legitimately omit `sameAs` because they reference the
 *  canonical Org elsewhere. We look back ~250 chars for any such key. */
function isNestedOrgRef(src: string, orgIdx: number): boolean {
  const back = src.slice(Math.max(0, orgIdx - 250), orgIdx);
  // Match `provider:` AND `"provider":` (quoted-key JSON-LD style).
  return /["']?(publisher|provider|author|creator|sourceOrganization|brand|parentOrganization|memberOf|sponsor|funder)["']?\s*:\s*\{/.test(
    back,
  );
}

function walkTsx(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walkTsx(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

describe('Phase G — Organization sameAs parity + drift guard', () => {
  it('EN Org sameAs ⊇ TR Org sameAs on every Org-emitting page', () => {
    const trGroups = extractOrgSameAs(readFileSync(TR_ORG_FILE, 'utf8'));
    expect(trGroups.length, `${TR_ORG_FILE} must emit a top-level Org sameAs`).toBeGreaterThan(0);
    const trSet = new Set(trGroups[0]);
    expect(trSet.size, 'TR Org sameAs must be non-empty').toBeGreaterThan(0);

    for (const file of EN_ORG_FILES) {
      const enGroups = extractOrgSameAs(readFileSync(file, 'utf8'));
      expect(enGroups.length, `${file} must emit at least one Org sameAs`).toBeGreaterThan(0);
      // Take the first top-level Org block (canonical Org for the page).
      const enSet = new Set(enGroups[0]);
      const missing = [...trSet].filter((u) => !enSet.has(u));
      expect(
        missing,
        `${file} Org sameAs missing TR links:\n  ${missing.join('\n  ')}`,
      ).toEqual([]);
    }
  });

  it('every top-level Organization block emits a non-empty https sameAs', () => {
    const files = [
      ...walkTsx('src/pages'),
      ...walkTsx('src/components/seo'),
    ];
    const offenders: string[] = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const orgRe = /"@type"\s*:\s*"Organization"/g;
      let m: RegExpExecArray | null;
      while ((m = orgRe.exec(src)) !== null) {
        if (isNestedOrgRef(src, m.index)) continue;
        const window = src.slice(m.index, Math.min(src.length, m.index + 1500));
        const arrMatch = window.match(/"sameAs"\s*:\s*\[([\s\S]*?)\]/);
        if (!arrMatch) {
          offenders.push(`${file}: top-level Org @ char ${m.index} has no sameAs`);
          continue;
        }
        const urls = [...arrMatch[1].matchAll(/["']([^"']+)["']/g)].map((u) => u[1]);
        if (urls.length === 0) {
          offenders.push(`${file}: top-level Org @ char ${m.index} sameAs is empty`);
          continue;
        }
        for (const u of urls) {
          if (!/^https:\/\//.test(u)) {
            offenders.push(`${file}: Org sameAs URL not https — ${u}`);
          }
        }
      }
    }
    expect(offenders, `Org sameAs offenders:\n${offenders.join('\n')}`).toEqual([]);
  });
});
