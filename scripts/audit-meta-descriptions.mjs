#!/usr/bin/env node
/**
 * Meta-description uniqueness audit (Phase 5).
 *
 * Scans EN + TR translation strings and article files for the field
 * `metaDescription` / `meta.description`. Groups by the first 40 chars
 * (case-insensitive) — any group with >1 URL indicates a boilerplate opener
 * that hurts SERP differentiation. Also flags descriptions that start with
 * "Free" twice, the pattern the deep-audit called out.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WARN_HEAD_COLLISIONS = Number(process.env.META_WARN ?? 6);
const FAIL_HEAD_COLLISIONS = Number(process.env.META_FAIL ?? 30);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

// Matches:
//   metaDescription: '...'
//   description: '...'   (inside a meta:{ … } object)
const META_RE =
  /(?:metaDescription|["']description["'])\s*:\s*(['"`])((?:[^\\`'"]|\\.){20,320}?)\1/gi;

const entries = []; // { file, text }

for (const file of [
  ...walk('src/data/articles'),
  ...walk('src/translations'),
  ...walk('src/pages'),
]) {
  const src = readFileSync(file, 'utf8');
  let m;
  while ((m = META_RE.exec(src)) !== null) {
    entries.push({ file, text: m[2].replace(/\s+/g, ' ').trim() });
  }
}

const byHead = new Map();
for (const e of entries) {
  const head = e.text.slice(0, 40).toLowerCase();
  if (!byHead.has(head)) byHead.set(head, []);
  byHead.get(head).push(e);
}

const collisions = [...byHead.entries()].filter(([, arr]) => arr.length > 1);
collisions.sort((a, b) => b[1].length - a[1].length);

const doubleFree = entries.filter((e) => /\bfree\b[^.]*\.\s*free\b/i.test(e.text));

console.log(`\nMeta-description audit: ${entries.length} descriptions scanned.`);
console.log(`  head-collision groups: ${collisions.length}`);
console.log(`  "Free … . Free" repeaters: ${doubleFree.length}\n`);

for (const [head, arr] of collisions.slice(0, 15)) {
  console.log(`  [${arr.length}]  "${head}…"`);
  for (const e of arr.slice(0, 4)) console.log(`         ${e.file}`);
}
if (doubleFree.length) {
  console.log(`\n  "Free … . Free" pattern:`);
  for (const e of doubleFree.slice(0, 10)) console.log(`    ${e.file}`);
}

if (collisions.length > FAIL_HEAD_COLLISIONS) {
  console.error(
    `\n[fail] ${collisions.length} head-collision groups exceeds FAIL ${FAIL_HEAD_COLLISIONS}.`
  );
  process.exit(1);
}
if (collisions.length > WARN_HEAD_COLLISIONS) {
  console.warn(
    `\n[warn] ${collisions.length} head-collision groups exceeds WARN ${WARN_HEAD_COLLISIONS}.`
  );
}
