#!/usr/bin/env node
/**
 * TR link audit — fails the build if hard-coded English internal paths
 * appear in user-facing rendering surfaces WITHOUT either:
 *   - going through the LocalizedLink wrapper (re-exported as `Link`
 *     from "@/components/LocalizedLink"), or
 *   - being gated by a locale check (isTurkish / language === 'tr' /
 *     useLocalizedHref / getLocalizedPath ternary), or
 *   - flowing through `localizeInternalHtml(html, locale)` for HTML
 *     strings rendered via dangerouslySetInnerHTML.
 *
 * Rules:
 *   R1. <Link to="/calculators/..."> on `react-router-dom` Link.
 *   R2. <a href="/calculators/..."> plain anchor in TSX (not gated).
 *   R3. EN hrefs baked into FAQ-style `answer:` template strings
 *       (dangerouslySetInnerHTML) without localizeInternalHtml.
 *   R4. EN markdown links `](/calculators/...)` inside any *.tr.ts
 *       article file.
 *   R5. EN_TO_TR coverage — every <Route path="/calculators/..."> in
 *       App.tsx must have a TR mirror.
 *   R6. Trailing-slash policy on /tr/* leaf paths.
 *
 * Intent: catch the "click any link on /tr → wrong locale or 404"
 * regression class at build time, not just runtime.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SCAN_EXTS = /\.(tsx?|jsx?)$/;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '__tests__', 'test']);
const ROOT = join(process.cwd(), 'src');

const EN_PATH_GROUP = '(?:calculators|learn|about|contact|tools|sitemap|privacy|terms)';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (SCAN_EXTS.test(entry)) out.push(full);
  }
  return out;
}

const offenders = [];

function skipFile(file) {
  return (
    file.endsWith('LocalizedLink.tsx') ||
    file.endsWith('InternalLinkInterceptor.tsx') ||
    file.endsWith('localizedRoutes.ts') ||
    file.endsWith('localizeHtml.ts') ||
    file.endsWith('useLocalizedHref.ts') ||
    file.endsWith('App.tsx')
  );
}

const localeGated = /(\bisTr\b|\bisTurkish\b|language\s*===\s*['"]tr['"]|useLocalizedHref|getLocalizedPath|localizeInternalHtml)/;

for (const file of walk(ROOT)) {
  if (skipFile(file)) continue;
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const rrdImportsLink = /import\s*\{[^}]*\bLink\b[^}]*\}\s*from\s*['"]react-router-dom['"]/.test(src);
  const fileLocalizesHtml = /\blocalizeInternalHtml\b/.test(src);

  lines.forEach((line, i) => {
    // R1: react-router-dom <Link to="/calc..">
    if (rrdImportsLink) {
      const m = line.match(new RegExp(`<Link[^>]*\\sto=["'](\\/${EN_PATH_GROUP}[^"']*)["']`));
      if (m && !localeGated.test(line)) {
        offenders.push({ file, line: i + 1, rule: 'R1-rrd-link-en', snippet: m[0] });
      }
    }

    // R2: plain <a href="/calc..">  (JSX only — skip HTML-string anchors handled by R3)
    const isHtmlString = /class=["']/.test(line); // class= (not className=) => string, not JSX
    const aMatch = line.match(new RegExp(`<a[^>]*\\shref=["'](\\/${EN_PATH_GROUP}(?:\\/[^"']*)?)["']`));
    if (aMatch && !localeGated.test(line) && !(isHtmlString && fileLocalizesHtml)) {
      offenders.push({ file, line: i + 1, rule: 'R2-plain-anchor-en', snippet: aMatch[0].slice(0, 140) });
    }

    // R3: `answer:` string containing href="/calc.." without file-level localizeInternalHtml
    if (/answer\s*:/.test(line)) {
      const ans = line.match(new RegExp(`href=["']\\/${EN_PATH_GROUP}`));
      if (ans && !fileLocalizesHtml) {
        offenders.push({ file, line: i + 1, rule: 'R3-faq-html-en', snippet: ans[0] });
      }
    }
  });
}

// R4: EN markdown links in TR article files
for (const file of walk(join(ROOT, 'data/articles'))) {
  if (!file.endsWith('.tr.ts')) continue;
  const src = readFileSync(file, 'utf8');
  src.split('\n').forEach((line, i) => {
    const m = line.match(new RegExp(`\\]\\((\\/${EN_PATH_GROUP}[^)]*)\\)`));
    if (m) offenders.push({ file, line: i + 1, rule: 'R4-tr-md-en-link', snippet: m[0].slice(0, 120) });
  });
}

// R7: misbuilt TR hrefs — `/tr/ogrenin/<en-slug>`, `/tr/hesaplayicilar/<en-slug>`,
// or `/tr/learn/...` / `/tr/calculators/...` (wrong segment). We resolve the
// EN slug sets from EN_TO_TR and flag any literal string in TS/TSX that mixes
// a TR segment with an English slug.
const routesSrcForR7 = readFileSync(join(process.cwd(), 'src/utils/localizedRoutes.ts'), 'utf8');
const enLearnSlugs = new Set(
  [...routesSrcForR7.matchAll(/['"]\/learn\/([a-z0-9-]+)['"]\s*:/g)].map((m) => m[1]),
);
const enCalcSlugs = new Set(
  [...routesSrcForR7.matchAll(/['"]\/calculators\/([a-z0-9-]+)['"]\s*:/g)].map((m) => m[1]),
);

const r7SkipFiles = new Set([
  'src/utils/localizedRoutes.ts',
  'src/components/InternalLinkInterceptor.tsx',
  'src/hooks/useLocalizedHref.ts',
  'scripts/audit-tr-links.mjs',
]);

for (const file of walk(ROOT)) {
  const rel = file.replace(process.cwd() + '/', '');
  if (r7SkipFiles.has(rel)) continue;
  const src = readFileSync(file, 'utf8');
  src.split('\n').forEach((line, i) => {
    // Wrong segment under /tr/  →  /tr/learn/... or /tr/calculators/...
    const wrongSeg = line.match(/['"]\/tr\/(learn|calculators)\/([a-z0-9-]+)/);
    if (wrongSeg) {
      offenders.push({
        file,
        line: i + 1,
        rule: 'R7-tr-en-segment',
        snippet: wrongSeg[0].slice(0, 140),
      });
    }
    // TR segment + EN slug
    const mixed = line.match(/['"]\/tr\/(ogrenin|hesaplayicilar)\/([a-z0-9-]+)/);
    if (mixed) {
      const [, seg, slug] = mixed;
      const enSet = seg === 'ogrenin' ? enLearnSlugs : enCalcSlugs;
      if (enSet.has(slug)) {
        offenders.push({
          file,
          line: i + 1,
          rule: 'R7-tr-mixed-en-slug',
          snippet: mixed[0].slice(0, 140),
        });
      }
    }
  });
}

if (offenders.length) {
  console.error(`\n[error] TR link audit — ${offenders.length} hard-coded English internal links found:\n`);
  for (const o of offenders) {
    console.error(`  ${o.file}:${o.line}  [${o.rule}]`);
    console.error(`    ${o.snippet}`);
  }
  console.error(`\nFix options:\n  - <Link to="/..">: import { Link } from "@/components/LocalizedLink"\n  - <a href="/..">: switch to <Link> above, or wrap with useLocalizedHref()\n  - FAQ HTML strings: pass through localizeInternalHtml(html, locale) before dangerouslySetInnerHTML\n  - TR markdown: rewrite to the /tr/hesaplayicilar/... mirror\n`);
  process.exit(1);
}

// R5: EN_TO_TR coverage — every /calculators/* route must have a TR mirror.
const app = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8');
const enCalcRoutes = [
  ...app.matchAll(/<Route path="(\/calculators\/[a-z0-9][a-z0-9_-]*)"\s+element=\{<(?!Navigate|LegacyRedirect)/g),
].map((m) => m[1]);

const localized = readFileSync(join(process.cwd(), 'src/utils/localizedRoutes.ts'), 'utf8');
const enToTrBlock = localized.match(/EN_TO_TR[^=]*=\s*\{([\s\S]*?)\n\}/);
const mappedEn = enToTrBlock
  ? new Set([...enToTrBlock[1].matchAll(/['"](\/[^'"]*)['"]\s*:/g)].map((m) => m[1]))
  : new Set();

const missingMirror = enCalcRoutes.filter((r) => !mappedEn.has(r));
if (missingMirror.length) {
  console.error('\n[error] EN_TO_TR coverage — calculator routes with no Turkish mirror:');
  [...new Set(missingMirror)].sort().forEach((r) => console.error('  ' + r));
  process.exit(1);
}

// R6: trailing-slash policy
const enToTrValues = enToTrBlock
  ? [...enToTrBlock[1].matchAll(/:\s*['"](\/tr[^'"]*)['"]/g)].map((m) => m[1])
  : [];
const slashOffenders = [];
for (const v of enToTrValues) {
  if (v === '/tr/' || v === '/tr') continue;
  if (v.endsWith('/')) slashOffenders.push(`EN_TO_TR value has trailing slash: ${v}`);
}
if (slashOffenders.length) {
  console.error('\n[error] TR trailing-slash policy violations:');
  slashOffenders.forEach((o) => console.error('  ' + o));
  process.exit(1);
}

console.log(`[ok] TR link audit clean — plain anchors, <Link>, FAQ HTML, and TR markdown all locale-aware.`);
console.log(`[ok] EN_TO_TR coverage — all ${enCalcRoutes.length} EN calculator routes have a Turkish mirror.`);
console.log(`[ok] TR trailing-slash policy — ${enToTrValues.length} TR paths checked.`);
