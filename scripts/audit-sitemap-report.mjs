#!/usr/bin/env node
/**
 * Merges /tmp/audit/{http,hreflang,router-diff}.json into a single
 * markdown report at /tmp/audit/sitemap-audit-report.md.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const read = (p, fb) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fb);
const probes = read('/tmp/audit/http.json', []);
const hreflang = read('/tmp/audit/hreflang.json', []);
const diff = read('/tmp/audit/router-diff.json', { ghosts: [], orphans: [] });

const today = new Date().toISOString().slice(0, 10);
const by = (pred) => probes.filter(pred).length;
const tot = probes.length;
const s2 = by((r) => r.status >= 200 && r.status < 300);
const s3 = by((r) => r.status >= 300 && r.status < 400);
const s4 = by((r) => r.status >= 400 && r.status < 500);
const s5 = by((r) => r.status >= 500);
const err = by((r) => r.status === 0);
const redir = by((r) => r.redirected);
const noindex = hreflang.filter((i) => i.kind === 'noindex').length;
const canonBad = hreflang.filter((i) => i.kind.startsWith('canonical')).length;
const hrefBad = hreflang.filter((i) => i.kind.startsWith('hreflang') || i.kind === 'reciprocity-broken').length;
const langBad = hreflang.filter((i) => i.kind.startsWith('html-lang')).length;

const lines = [];
lines.push(`# Sitemap audit — ${today}`);
lines.push('');
lines.push(`URLs in sitemap: **${tot}**`);
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push('| Check | Count |');
lines.push('|---|---|');
lines.push(`| 2xx | ${s2} |`);
lines.push(`| 3xx redirected | ${s3 + redir} |`);
lines.push(`| 4xx | ${s4} |`);
lines.push(`| 5xx | ${s5} |`);
lines.push(`| network errors | ${err} |`);
lines.push(`| canonical issues | ${canonBad} |`);
lines.push(`| hreflang issues | ${hrefBad} |`);
lines.push(`| <html lang> issues | ${langBad} |`);
lines.push(`| noindex meta | ${noindex} |`);
lines.push(`| router ghosts (in sitemap, not in router) | ${diff.ghosts.length} |`);
lines.push(`| router orphans (in router, not in sitemap) | ${diff.orphans.length} |`);
lines.push('');

lines.push('## Blocking');
const block = [
  ...probes.filter((r) => r.status >= 400 || r.status === 0).map((r) => `- \`${r.url}\` → status ${r.status}${r.error ? ' ' + r.error : ''}`),
  ...hreflang.filter((i) => i.kind === 'noindex').map((i) => `- \`${i.url}\` → noindex (${i.detail})`),
  ...diff.ghosts.map((p) => `- ghost route \`${p}\` (in sitemap, no <Route>)`),
];
lines.push(block.length ? block.join('\n') : '_none_');
lines.push('');

lines.push('## High-priority');
const high = [
  ...hreflang.filter((i) => i.kind.startsWith('canonical') || i.kind.startsWith('hreflang') || i.kind === 'reciprocity-broken').map((i) => `- \`${i.url}\` → ${i.kind} ${i.detail}`),
];
lines.push(high.length ? high.join('\n') : '_none_');
lines.push('');

lines.push('## Nice-to-fix');
const nice = [
  ...probes.filter((r) => r.redirected).map((r) => `- \`${r.url}\` → 3xx → \`${r.finalUrl}\``),
  ...diff.orphans.map((p) => `- orphan route \`${p}\` (in router, not in sitemap)`),
  ...hreflang.filter((i) => i.kind.startsWith('html-lang')).map((i) => `- \`${i.url}\` → ${i.kind} ${i.detail}`),
];
lines.push(nice.length ? nice.join('\n') : '_none_');
lines.push('');

lines.push('## Per-URL appendix');
lines.push('');
lines.push('| URL | Status | Canonical OK | Hreflang OK |');
lines.push('|---|---|---|---|');
const issuesByUrl = hreflang.reduce((a, i) => ((a[i.url] = a[i.url] || []).push(i), a), {});
for (const r of probes) {
  const u = issuesByUrl[r.url] || [];
  const can = u.some((x) => x.kind.startsWith('canonical')) ? '❌' : '✓';
  const href = u.some((x) => x.kind.startsWith('hreflang') || x.kind === 'reciprocity-broken') ? '❌' : '✓';
  lines.push(`| ${r.url} | ${r.status} | ${can} | ${href} |`);
}

writeFileSync('/tmp/audit/sitemap-audit-report.md', lines.join('\n'));
console.log(`[report] /tmp/audit/sitemap-audit-report.md (${tot} URLs)`);
