#!/usr/bin/env node
// Reports pages that emit FAQPage JSON-LD without TR coverage.
// Detects both static (`"inLanguage": "tr"`) and conditional
// (`language==='tr' ? 'tr' : 'en'`) patterns plus locale-conditional mainEntity.
// Informational only — does not exit non-zero.
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

// Pages with a dedicated TR sibling page — their FAQ is intentionally EN-only.
const TR_SIBLINGS = new Set(['Index.tsx', 'NotFound.tsx']);

const files = walk('src/pages');
const FAQ_BLOCK = /"@type":\s*"FAQPage"[\s\S]{0,1200}/g;
const TR_HINT = /['"]tr['"]/;
const EN_HINT = /['"]en['"]/;

const missing = [];
for (const f of files) {
  const base = f.replace(/^.*\//, '');
  if (TR_SIBLINGS.has(base)) continue;
  const s = readFileSync(f, 'utf8');
  const blocks = s.match(FAQ_BLOCK);
  if (!blocks) continue;
  const hasTr = blocks.some(b => TR_HINT.test(b));
  const hasEn = blocks.some(b => EN_HINT.test(b));
  if (!hasTr) missing.push({ file: base, hasEn });
}

if (missing.length === 0) {
  console.log('✓ Every page with a FAQPage block also covers TR.');
} else {
  console.log(`⚠ ${missing.length} page(s) with FAQPage JSON-LD lack TR coverage:\n`);
  for (const { file, hasEn } of missing) {
    console.log(`  - ${file}${hasEn ? '' : '  [also missing inLanguage tag]'}`);
  }
  console.log('\nNext: add `inLanguage: language===\'tr\' ? \'tr\' : \'en\'` plus a TR mainEntity branch.');
}
