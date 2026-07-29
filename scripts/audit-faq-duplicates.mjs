#!/usr/bin/env node
/**
 * FAQ duplicate audit (Phase 4).
 *
 * Scans FAQ question strings across:
 *   - src/components/**\/*FAQSection*.tsx           (visible FAQs)
 *   - src/data/articles/*.ts                        (article faqs[])
 *   - src/pages/*.tsx                               (inline JSON-LD FAQPage)
 *
 * Reports cross-URL duplicates (same question text on >1 page/article) with
 * the file list. Warns above THRESHOLD; fails hard above FAIL_THRESHOLD so
 * regressions are caught in CI.
 *
 * Environment overrides: FAQ_DUP_WARN, FAQ_DUP_FAIL.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WARN = Number(process.env.FAQ_DUP_WARN ?? 40);
const FAIL = Number(process.env.FAQ_DUP_FAIL ?? 160);

/** @type {Map<string, Set<string>>} */
const qToFiles = new Map();

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(t|j)sx?$/.test(name)) out.push(p);
  }
  return out;
}

function normalize(q) {
  return q.replace(/\s+/g, ' ').trim().toLowerCase().replace(/[?.!]+$/, '');
}

function record(question, file) {
  const key = normalize(question);
  if (!key || key.length < 8) return;
  if (!qToFiles.has(key)) qToFiles.set(key, new Set());
  qToFiles.get(key).add(file);
}

// Match FAQ question fields in TS/TSX. Covers:
//   question: "..." | '...' | `...`
//   { q: "..." , a: "..." }  (rare)
const QUESTION_RE = /(?:question|q)\s*:\s*(['"`])((?:[^\\`'"]|\\.){8,220}?)\1/gi;

const files = [
  ...walk('src/components'),
  ...walk('src/data/articles'),
  ...walk('src/pages'),
];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  let m;
  while ((m = QUESTION_RE.exec(src)) !== null) record(m[2], file);
}

function fileTokens(f) {
  return new Set(
    f
      .replace(/\.(t|j)sx?$/, '')
      .split(/[\/\-_.]|(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g)
      .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter(
        (t) =>
          t.length >= 5 &&
          !['bitcoin', 'section', 'faqsection', 'pages', 'components', 'articles', 'guide', 'calculator', 'optimized'].includes(t)
      )
  );
}

function isSameUrlCluster(files) {
  // If every file shares at least one distinctive token (e.g. "converter",
  // "drawdown"), treat as a component<->page mirror on one URL.
  const tokensList = files.map(fileTokens);
  const common = [...tokensList[0]].filter((t) => tokensList.every((s) => s.has(t)));
  return common.length > 0;
}

const dupes = [...qToFiles.entries()]
  .map(([q, filesSet]) => [q, [...filesSet]])
  .filter(([, files]) => !isSameUrlCluster(files));
dupes.sort((a, b) => b[1].length - a[1].length);

console.log(`\nFAQ duplicate audit: ${dupes.length} cross-file duplicate questions.`);
console.log(`  warn threshold: ${WARN}   fail threshold: ${FAIL}\n`);

for (const [q, filesArr] of dupes.slice(0, 25)) {
  console.log(`  [${filesArr.length}]  ${q.slice(0, 90)}${q.length > 90 ? '…' : ''}`);
  for (const f of filesArr.slice(0, 4)) console.log(`         ${f}`);
}

if (dupes.length > FAIL) {
  console.error(`\n[fail] ${dupes.length} duplicates exceeds FAIL threshold ${FAIL}.`);
  process.exit(1);
}
if (dupes.length > WARN) {
  console.warn(`\n[warn] ${dupes.length} duplicates exceeds WARN threshold ${WARN}.`);
}
