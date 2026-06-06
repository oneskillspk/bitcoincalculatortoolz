#!/usr/bin/env node
/**
 * Audit every external URL referenced in src/ for 4xx/5xx.
 *
 * Scans:
 *   - src/data/articles/*.ts (sources, citations)
 *   - src/pages/*.tsx (methodology blocks, inline citations)
 *   - src/components/learn/**, src/components/calculator/MethodologyBlock.tsx
 *
 * Fails (non-zero exit) on any HTTP 4xx / 5xx so CI can catch regressions.
 * Skips archive.org wildcard URLs (already HEAD-checked manually) and
 * known-flaky hosts that block HEAD (e.g. some publishers — falls back to GET).
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOTS = ['src/data/articles', 'src/pages', 'src/components'];
const URL_RE = /https?:\/\/[^\s'"`)<>${}]+/g;
const SKIP_HOSTS = new Set(['localhost', '127.0.0.1', 'bitcoincalculator.tools', 'btccalctoolsnw1.lovable.app']);
// Hosts that reject programmatic HEAD/GET probes (share intents, APIs needing params, antibot).
// Real-world usage works; skipping avoids false-positive CI failures.
const SKIP_PROBE = [/^twitter\.com\/intent/, /^x\.com\/intent/, /^www\.facebook\.com\/sharer/, /^www\.reddit\.com\/submit/, /^api\.coingecko\.com\//, /^optout\.aboutads\.info/, /^lottie\.host/, /^www\.sec\.gov\//, /^www\.bls\.gov\//, /^www\.consumerfinance\.gov\//, /^example\.com\//, /^www\.retailinvestor\.org\//];
const TIMEOUT_MS = 12000;
const CONCURRENCY = 8;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (/\.(tsx?|mdx?)$/.test(entry.name)) out.push(p);
  }
  return out;
}

async function collectUrls() {
  const files = (await Promise.all(ROOTS.map(async r => {
    try { await stat(r); return walk(r); } catch { return []; }
  }))).flat();
  const urls = new Map(); // url -> Set(file)
  for (const f of files) {
    const text = await readFile(f, 'utf8');
    for (const m of text.matchAll(URL_RE)) {
      let u = m[0].replace(/[.,;:!?)\]}'"]+$/, '');
      try {
        const parsed = new URL(u);
        if (SKIP_HOSTS.has(parsed.host)) continue;
        const hostPath = parsed.host + parsed.pathname;
        if (SKIP_PROBE.some(re => re.test(hostPath))) continue;
      } catch { continue; }
      if (!urls.has(u)) urls.set(u, new Set());
      urls.get(u).add(f);
    }
  }
  return urls;
}

async function check(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    let r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 LinkAudit' } });
    if (r.status === 405 || r.status === 403 || r.status === 501) {
      r = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 LinkAudit' } });
    }
    return { url, status: r.status };
  } catch (e) {
    return { url, status: 0, err: e.message };
  } finally {
    clearTimeout(timer);
  }
}

async function run() {
  const urls = await collectUrls();
  console.log(`Auditing ${urls.size} unique external URLs…`);
  const entries = [...urls.entries()];
  const results = [];
  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const batch = entries.slice(i, i + CONCURRENCY);
    const r = await Promise.all(batch.map(([u]) => check(u)));
    results.push(...r);
    process.stdout.write('.');
  }
  console.log('\n');
  const failures = results.filter(r => r.status === 0 || r.status >= 400);
  if (failures.length === 0) {
    console.log('✅ All external links healthy');
    process.exit(0);
  }
  console.error(`❌ ${failures.length} failing URL(s):\n`);
  for (const f of failures) {
    const files = [...urls.get(f.url)].slice(0, 3).join(', ');
    console.error(`  [${f.status || 'ERR'}] ${f.url}\n    in: ${files}${f.err ? `\n    err: ${f.err}` : ''}`);
  }
  process.exit(1);
}

run().catch(e => { console.error(e); process.exit(2); });
