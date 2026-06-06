#!/usr/bin/env node
/**
 * Sitemap route resolver — verifies every <loc> in public/sitemap.xml
 * resolves to a real route declared in src/utils/localizedRoutes.ts
 * (EN_TO_TR keys for EN paths, values for TR paths), and that each
 * <url> block's hreflang alternates include its own <loc> as the
 * canonical reference for that locale.
 *
 * Fails build on:
 *   - <loc> that does not map to any declared EN or TR route.
 *   - <loc> whose path is not present among its own hreflang alternates
 *     (i.e. sitemap canonical ↔ alternates mismatch).
 *   - <loc> that maps to a locale (EN/TR) inconsistent with its URL prefix.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SITEMAP = join(ROOT, 'public/sitemap.xml');
const ROUTES_FILE = join(ROOT, 'src/utils/localizedRoutes.ts');

const routesSrc = readFileSync(ROUTES_FILE, 'utf8');

// Build EN and TR path sets from EN_TO_TR mapping.
const enPaths = new Set();
const trPaths = new Set();
const pairRe = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
let m;
while ((m = pairRe.exec(routesSrc)) !== null) {
  enPaths.add(m[1]);
  trPaths.add(m[2]);
}
// TR_TO_EN also seeds '/tr' → '/'
trPaths.add('/tr');

const norm = (p) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);
const knownEn = new Set([...enPaths].map(norm));
const knownTr = new Set([...trPaths].map(norm));

const xml = readFileSync(SITEMAP, 'utf8');
// Split into <url>…</url> blocks so we can pair <loc> with its alternates.
const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((b) => b[1]);

const errors = [];
let checked = 0;

for (const block of blocks) {
  const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
  if (!locMatch) continue;
  const loc = locMatch[1];
  let path;
  try {
    path = norm(new URL(loc).pathname);
  } catch {
    errors.push(`Malformed <loc>: ${loc}`);
    continue;
  }
  checked++;

  const isTr = path === '/tr' || path.startsWith('/tr/');
  const set = isTr ? knownTr : knownEn;

  if (!set.has(path)) {
    errors.push(`Unknown ${isTr ? 'TR' : 'EN'} route in sitemap: ${path}  (loc=${loc})`);
    continue;
  }

  // Verify the <loc> appears among the block's hreflang alternates
  // (sitemap canonical ↔ alternates parity).
  const alts = [...block.matchAll(/hreflang=["']([^"']+)["']\s+href=["']([^"']+)["']/g)].map(
    (a) => ({ lang: a[1], href: norm(new URL(a[2]).pathname) }),
  );
  if (alts.length === 0) continue; // no alternates declared — OK
  const found = alts.some((a) => a.href === path);
  if (!found) {
    errors.push(
      `Sitemap <loc> ${path} is not present in its own hreflang alternates ` +
        `[${alts.map((a) => `${a.lang}:${a.href}`).join(', ')}]`,
    );
  }
}

if (errors.length) {
  console.error(`\n[error] Sitemap-routes audit — ${errors.length} broken entries:\n`);
  errors.forEach((e) => console.error('  ' + e));
  console.error(
    `\nFix: ensure every sitemap <loc> matches an EN_TO_TR key (EN) or value (TR) in src/utils/localizedRoutes.ts, and each <url> block lists itself among its hreflang alternates.\n`,
  );
  process.exit(1);
}

console.log(
  `[ok] Sitemap-routes audit — ${checked} URLs verified against ${knownEn.size} EN + ${knownTr.size} TR declared routes.`,
);
