#!/usr/bin/env bun
/**
 * Codemod: migrate inline Recharts <Tooltip contentStyle={{...}}> and
 * <Legend wrapperStyle={{...}}> to the shared chartTokens primitives.
 *
 *   contentStyle={{ ... }}  →  contentStyle={chartTooltipStyle}
 *   wrapperStyle={{ ... }}  →  wrapperStyle={chartLegendStyle}      (only on <Legend>)
 *
 * Adds the named imports from '@/components/calculator/chartTokens'.
 * Idempotent: rerunning is a no-op.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'src/components');
const TOKENS = '@/components/calculator/chartTokens';

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    if (e === '__tests__' || e === 'node_modules') continue;
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(e)) out.push(p);
  }
  return out;
}

/** Find matching closing }} for `{{` starting at index of the first `{`. */
function findEndOfDoubleBrace(src: string, openIdx: number): number {
  // openIdx points at the first '{' of '{{'
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i; // matches the OUTER closing `}` of the JSX expression
    }
  }
  return -1;
}

function transform(src: string): { code: string; usesTooltip: boolean; usesLegend: boolean; changed: boolean } {
  let out = '';
  let i = 0;
  let usesTooltip = false;
  let usesLegend = false;
  let changed = false;

  while (i < src.length) {
    // Look for contentStyle={{
    const cs = src.indexOf('contentStyle={{', i);
    const ws = src.indexOf('wrapperStyle={{', i);
    let next = -1;
    let kind: 'cs' | 'ws' | null = null;
    if (cs !== -1 && (ws === -1 || cs < ws)) { next = cs; kind = 'cs'; }
    else if (ws !== -1) { next = ws; kind = 'ws'; }

    if (next === -1) { out += src.slice(i); break; }

    out += src.slice(i, next);
    const propName = kind === 'cs' ? 'contentStyle' : 'wrapperStyle';
    const openBrace = next + propName.length + 1; // index of first `{` of the JSX expression
    const end = findEndOfDoubleBrace(src, openBrace);
    if (end === -1) { out += src.slice(next); break; }

    if (kind === 'cs') {
      out += `contentStyle={chartTooltipStyle}`;
      usesTooltip = true;
      changed = true;
    } else {
      // Only rewrite if this wrapperStyle is on a <Legend (heuristic: scan back ~200 chars)
      const back = src.slice(Math.max(0, next - 200), next);
      if (/<Legend\b[^>]*$/s.test(back)) {
        out += `wrapperStyle={chartLegendStyle}`;
        usesLegend = true;
        changed = true;
      } else {
        out += src.slice(next, end + 1);
      }
    }
    i = end + 1;
  }

  if (changed) {
    // Add import if missing
    if (!out.includes(`from '${TOKENS}'`) && !out.includes(`from "${TOKENS}"`)) {
      const names: string[] = [];
      if (usesTooltip) names.push('chartTooltipStyle');
      if (usesLegend) names.push('chartLegendStyle');
      const importLine = `import { ${names.join(', ')} } from '${TOKENS}';\n`;
      // Insert after last existing import
      const lastImport = out.lastIndexOf('\nimport ');
      if (lastImport !== -1) {
        const eol = out.indexOf('\n', lastImport + 1);
        out = out.slice(0, eol + 1) + importLine + out.slice(eol + 1);
      } else {
        out = importLine + out;
      }
    } else {
      // Already imports tokens — make sure both names are present
      const re = new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*['"]${TOKENS.replace(/\//g, '\\/')}['"]`);
      const m = out.match(re);
      if (m) {
        const existing = m[1].split(',').map(s => s.trim()).filter(Boolean);
        const need = [
          ...(usesTooltip ? ['chartTooltipStyle'] : []),
          ...(usesLegend ? ['chartLegendStyle'] : []),
        ];
        const merged = Array.from(new Set([...existing, ...need]));
        out = out.replace(re, `import { ${merged.join(', ')} } from '${TOKENS}'`);
      }
    }
  }

  return { code: out, usesTooltip, usesLegend, changed };
}

const files = walk(ROOT);
let touched = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  if (!src.includes('contentStyle={{') && !src.includes('wrapperStyle={{')) continue;
  if (!src.includes("from 'recharts'") && !src.includes('from "recharts"')) continue;
  const { code, changed } = transform(src);
  if (changed && code !== src) {
    writeFileSync(f, code);
    touched++;
    console.log(`✓ ${f}`);
  }
}
console.log(`\nMigrated ${touched} file(s).`);
