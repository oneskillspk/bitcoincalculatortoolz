#!/usr/bin/env bun
/**
 * Chart Token Audit
 *
 * Lightweight static check that flags Recharts chart components
 * still using legacy/legacy-ish legend & tooltip styles instead of
 * the shared `chartTokens` primitives.
 *
 * Usage:
 *   bun scripts/audit-chart-tokens.ts             # report
 *   bun scripts/audit-chart-tokens.ts --strict    # exit 1 on findings
 *
 * Rules enforced:
 *   1. <Tooltip contentStyle={{ ... }} ... />  → must use `chartTooltipStyle`
 *   2. <Legend  wrapperStyle={{ ... }} ... />  → must use `chartLegendStyle`
 *   3. Inline `backgroundColor: '#xxxxxx'` or raw `hsl(0, 0%, ...)`
 *      literals inside Tooltip/Legend props (i.e. not `hsl(var(--token))`).
 *   4. Files importing `recharts` <Tooltip|Legend> but NOT importing
 *      from `@/components/calculator/chartTokens`.
 *
 * Series stroke/fill colors (e.g. `stroke="#10b981"`) are reported as
 * INFO only — those encode per-series identity and may legitimately
 * remain hard-coded.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

type Severity = 'error' | 'warn' | 'info';
interface Finding {
  file: string;
  line: number;
  severity: Severity;
  rule: string;
  snippet: string;
}

const ROOT = join(process.cwd(), 'src/components');
const TOKENS_IMPORT = '@/components/calculator/chartTokens';
const findings: Finding[] = [];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '__tests__') continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(entry)) out.push(full);
  }
  return out;
}

// File-level carve-outs — intentional brand/primitive exceptions.
const CARVE_OUTS = new Set<string>([
  // shadcn/ui chart primitive: arbitrary Tailwind selectors target Recharts default colors
  'src/components/ui/chart.tsx',
  // Rainbow chart is an intentional brand visualization (rainbow bands + white/black series)
  'src/components/rainbow/RainbowPriceChart.tsx',
]);

function audit(file: string): void {
  const rel = relative(process.cwd(), file);
  if (CARVE_OUTS.has(rel)) return;

  const src = readFileSync(file, 'utf8');
  if (!/from ['"]recharts['"]/.test(src)) return;
  const importsTokens = src.includes(TOKENS_IMPORT);
  const lines = src.split('\n');

  // Capture multi-line <Tooltip ...> / <Legend ...> JSX blocks to know whether
  // each occurrence already delegates rendering via `content={...}`. When it
  // does, the host file is responsible for its own theming — so we don't
  // require the chartTokens import for that occurrence.
  function tagBlocks(tag: 'Tooltip' | 'Legend'): Array<{ start: number; text: string }> {
    const open = new RegExp(`<${tag}\\b`);
    const blocks: Array<{ start: number; text: string }> = [];
    for (let i = 0; i < lines.length; i++) {
      if (!open.test(lines[i])) continue;
      let buf = lines[i];
      let j = i;
      // Accumulate until the JSX tag closes (>, />, or matching </Tag>).
      while (j < lines.length - 1 && !/\/?>/.test(lines[j])) {
        j++;
        buf += '\n' + lines[j];
      }
      blocks.push({ start: i + 1, text: buf });
    }
    return blocks;
  }

  const tooltipBlocks = tagBlocks('Tooltip');
  const legendBlocks  = tagBlocks('Legend');

  // A "bare" tag is one that does NOT have content={...} (custom renderer).
  const bareTooltip = tooltipBlocks.some(b => !/content=\{/.test(b.text));
  const bareLegend  = legendBlocks.some(b => !/content=\{/.test(b.text));

  lines.forEach((line, i) => {
    const ln = i + 1;

    // Rule 1 — inline contentStyle object literal
    if (/contentStyle=\{\{/.test(line)) {
      findings.push({ file, line: ln, severity: 'error', rule: 'inline-tooltip-contentStyle', snippet: line.trim() });
    }

    // Rule 2 — inline wrapperStyle on Legend (heuristic: nearby <Legend)
    if (/wrapperStyle=\{\{/.test(line)) {
      const ctx = lines.slice(Math.max(0, i - 3), i + 1).join('\n');
      if (/<Legend\b/.test(ctx)) {
        findings.push({ file, line: ln, severity: 'error', rule: 'inline-legend-wrapperStyle', snippet: line.trim() });
      }
    }

    // Rule 3 — hex literals in CSS chrome props (background/border)
    if (
      /(backgroundColor|borderColor):\s*['"]#[0-9a-fA-F]{3,6}['"]/.test(line) &&
      !/html2canvas/.test(lines.slice(Math.max(0, i - 4), i + 1).join('\n'))
    ) {
      findings.push({ file, line: ln, severity: 'error', rule: 'hardcoded-hex-in-style', snippet: line.trim() });
    }

    // Info — raw hex stroke/fill on series. Skip attribute-selector matches
    // inside className strings (e.g. `[&_.foo[stroke='#ccc']]:...`).
    if (
      /\b(stroke|fill)=['"]#[0-9a-fA-F]{3,6}['"]/.test(line) &&
      !/\[stroke=|\[fill=/.test(line)
    ) {
      findings.push({ file, line: ln, severity: 'info', rule: 'hardcoded-series-color', snippet: line.trim() });
    }
  });

  // Rule 4 — file uses a BARE Tooltip/Legend (no `content={...}`) but is
  // missing the shared tokens import. Files that fully delegate rendering
  // via `content={<CustomTooltip />}` are exempt.
  if ((bareTooltip || bareLegend) && !importsTokens) {
    findings.push({
      file, line: 1, severity: 'warn',
      rule: 'missing-chartTokens-import',
      snippet: `bare <${bareTooltip ? 'Tooltip' : ''}${bareTooltip && bareLegend ? '/' : ''}${bareLegend ? 'Legend' : ''}> without ${TOKENS_IMPORT}`,
    });
  }
}

const files = walk(ROOT);
for (const f of files) audit(f);

const byRule = new Map<string, number>();
for (const f of findings) byRule.set(f.rule, (byRule.get(f.rule) ?? 0) + 1);

const errors = findings.filter(f => f.severity === 'error');
const warns  = findings.filter(f => f.severity === 'warn');
const infos  = findings.filter(f => f.severity === 'info');

console.log(`\nChart token audit — scanned ${files.length} files\n${'─'.repeat(60)}`);
for (const f of [...errors, ...warns, ...infos]) {
  const tag = f.severity === 'error' ? 'ERROR' : f.severity === 'warn' ? 'WARN ' : 'INFO ';
  console.log(`${tag} ${relative(process.cwd(), f.file)}:${f.line}  [${f.rule}]`);
  console.log(`       ${f.snippet.slice(0, 120)}`);
}
console.log(`${'─'.repeat(60)}`);
console.log(`Summary: ${errors.length} error(s), ${warns.length} warning(s), ${infos.length} info`);
for (const [rule, n] of byRule) console.log(`  • ${rule}: ${n}`);

if (process.argv.includes('--strict') && errors.length > 0) process.exit(1);
