#!/usr/bin/env node
/**
 * Internal-link anchor-text diversity audit (Phase 6).
 *
 * For every internal href used in JSX (`to="/…"` or `href="/…"`), collect the
 * visible anchor text and compute per-target diversity. Fails when any target
 * has >SHARE_FAIL of its inbound anchors on a single string (default 0.85);
 * warns above SHARE_WARN (default 0.7). Ignores nav/footer chrome files where
 * a single canonical anchor is expected.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WARN = Number(process.env.ANCHOR_WARN ?? 0.7);
const FAIL = Number(process.env.ANCHOR_FAIL ?? 0.9);
const MIN_INBOUND = Number(process.env.ANCHOR_MIN ?? 6);

const IGNORE_FILE = /(Header|Footer|MobileNavigation|Breadcrumb|Sitemap|LanguageSelector)\.tsx$/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(name) && !IGNORE_FILE.test(name)) out.push(p);
  }
  return out;
}

// Captures <(Link|LocalizedLink|a) …to|href="/…"…>ANCHOR</…>
const LINK_RE =
  /<(?:LocalizedLink|Link|a)\b[^>]*?\b(?:to|href)=(['"])(\/[^'"#?]*)\1[^>]*>([\s\S]{1,140}?)<\/(?:LocalizedLink|Link|a)>/g;

/** target -> Map<anchor, count> */
const targets = new Map();

for (const file of walk('src')) {
  const src = readFileSync(file, 'utf8');
  let m;
  while ((m = LINK_RE.exec(src)) !== null) {
    const target = m[2].replace(/\/$/, '') || '/';
    const anchor = m[3]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\{[^}]+\}/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    if (!anchor || anchor.length < 3) continue;
    if (!targets.has(target)) targets.set(target, new Map());
    const bucket = targets.get(target);
    bucket.set(anchor, (bucket.get(anchor) ?? 0) + 1);
  }
}

const offenders = [];
for (const [target, bucket] of targets) {
  const total = [...bucket.values()].reduce((a, b) => a + b, 0);
  if (total < MIN_INBOUND) continue;
  const top = [...bucket.entries()].sort((a, b) => b[1] - a[1])[0];
  const share = top[1] / total;
  if (share >= WARN)
    offenders.push({ target, total, topAnchor: top[0], topCount: top[1], share });
}
offenders.sort((a, b) => b.share - a.share || b.total - a.total);

console.log(`\nAnchor diversity audit: ${targets.size} internal targets scanned.`);
console.log(`  min inbound: ${MIN_INBOUND}   warn: ${WARN}   fail: ${FAIL}\n`);
for (const o of offenders.slice(0, 20)) {
  console.log(
    `  ${(o.share * 100).toFixed(0)}%  ${o.topCount}/${o.total}  ${o.target}`
  );
  console.log(`         top anchor: "${o.topAnchor}"`);
}

const failing = offenders.filter((o) => o.share >= FAIL);
if (failing.length) {
  console.error(
    `\n[fail] ${failing.length} target(s) exceed ${(FAIL * 100).toFixed(0)}% single-anchor share.`
  );
  process.exit(1);
}
if (offenders.length) {
  console.warn(
    `\n[warn] ${offenders.length} target(s) above ${(WARN * 100).toFixed(0)}% single-anchor share.`
  );
}
