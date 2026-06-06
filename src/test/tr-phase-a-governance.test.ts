/**
 * Phase A5 — Governance guards for the /tr SEO + i18n contract.
 *
 * Catches drift between:
 *   1. App.tsx mounted /tr routes vs EN_TO_TR + <Navigate> redirects.
 *   2. EN_TO_TR Turkish values vs public/sitemap.xml entries.
 *   3. Turkish meta description length (≤ 160 chars).
 *   4. Turkish JSON-LD blocks must declare `inLanguage: "tr"`.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { EN_TO_TR } from '@/utils/localizedRoutes';

const APP = readFileSync('src/App.tsx', 'utf8');
const SITEMAP = readFileSync('public/sitemap.xml', 'utf8');
const PAGES_DIR = 'src/pages';
const pageFiles = readdirSync(PAGES_DIR).filter((f) => f.endsWith('.tsx'));

describe('Phase A5 — /tr governance', () => {
  it('every /tr* path in App.tsx is either in EN_TO_TR or has a <Navigate> redirect', () => {
    // Extract every <Route path="/tr..." ... /> declaration from App.tsx.
    const pathRe = /path=["'](\/tr[^"']*)["']/g;
    const trPaths = new Set<string>();
    for (const m of APP.matchAll(pathRe)) {
      const p = m[1];
      // Skip catch-all and the bare /tr layout root.
      if (p === '/tr/*' || p === '/tr' || p === '/tr/') continue;
      // Skip dynamic `:param` routes — they are templates, not concrete paths.
      if (p.includes(':')) continue;
      trPaths.add(p);
    }

    const known = new Set(Object.values(EN_TO_TR));
    const missing: string[] = [];
    for (const p of trPaths) {
      if (known.has(p)) continue;
      // Allow <Navigate to="..." replace /> redirects — extract the surrounding
      // Route block (path + element) and check if its element is <Navigate>.
      const idx = APP.indexOf(`path="${p}"`);
      const slice = APP.slice(Math.max(0, idx - 200), idx + 400);
      if (/<Navigate\s+to=/.test(slice)) continue;
      missing.push(p);
    }
    expect(missing, `Unmapped /tr routes (add to EN_TO_TR or convert to <Navigate>):\n${missing.join('\n')}`).toEqual([]);
  });

  it('every Turkish path in EN_TO_TR appears in public/sitemap.xml', () => {
    const missing: string[] = [];
    for (const trPath of Object.values(EN_TO_TR)) {
      if (!SITEMAP.includes(`>https://bitcoincalculator.tools${trPath}<`)) {
        missing.push(trPath);
      }
    }
    expect(missing, `Sitemap is stale — run \`node scripts/generate-sitemap.mjs\`.\nMissing TR entries:\n${missing.join('\n')}`).toEqual([]);
  });

  it('all Turkish meta descriptions are ≤ 160 characters', () => {
    const overflow: string[] = [];
    const descRe = /(?:name=["']description["']|property=["']og:description["']|name=["']twitter:description["'])[^>]*content=\{[^}]*language\s*===?\s*['"]tr['"]\s*\?\s*['"]([^'"]+)['"]/g;
    for (const f of pageFiles) {
      const src = readFileSync(join(PAGES_DIR, f), 'utf8');
      for (const m of src.matchAll(descRe)) {
        const tr = m[1];
        if (tr.length > 160) overflow.push(`${f}: ${tr.length}c — ${tr.slice(0, 60)}…`);
      }
    }
    expect(overflow, `TR meta descriptions over 160 chars:\n${overflow.join('\n')}`).toEqual([]);
  });

  it('Turkish JSON-LD blocks declare inLanguage: "tr"', () => {
    // For each page that emits a `{language === 'tr' && <>` fragment, every
    // <script type="application/ld+json"> inside must include "inLanguage":"tr".
    const offenders: string[] = [];
    for (const f of pageFiles) {
      const src = readFileSync(join(PAGES_DIR, f), 'utf8');
      const trGateIdx = src.indexOf("language === 'tr' && <>");
      if (trGateIdx === -1) continue;
      const endIdx = src.indexOf('</>}', trGateIdx);
      if (endIdx === -1) continue;
      const block = src.slice(trGateIdx, endIdx);
      const scriptCount = (block.match(/application\/ld\+json/g) || []).length;
      const inLangCount = (block.match(/"inLanguage"\s*:\s*"tr"/g) || []).length;
      if (scriptCount > 0 && inLangCount < scriptCount) {
        offenders.push(`${f}: ${inLangCount}/${scriptCount} TR JSON-LD scripts tag inLanguage:"tr"`);
      }
    }
    expect(offenders, `TR JSON-LD blocks missing inLanguage:"tr":\n${offenders.join('\n')}`).toEqual([]);
  });
});
