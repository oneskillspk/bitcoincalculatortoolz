#!/usr/bin/env node
/**
 * Brand-casing audit (P2 item 8).
 *
 * The canonical brand spelling is the lowercase domain
 *   bitcoincalculator.tools
 * Pluck violations like `BitcoinCalculator.Tools`, `BITCOINCALCULATOR.TOOLS`,
 * and mid-string capitalised variants from user-visible copy — translations,
 * meta tags, OG titles, JSON-LD `name` fields, and component strings.
 *
 * Allowed exceptions (NOT flagged):
 *   - `Bitcoin Calculator Tools` (the readable display name, with spaces)
 *   - URLs containing the lowercase domain (https://bitcoincalculator.tools/...)
 *   - Code identifiers / class names (TypeScript types, React components)
 *
 * Usage:
 *   node scripts/audit-brand-casing.mjs
 * Exits non-zero on violations so it can wire into CI.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src", "index.html", "public/robots.txt"];
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  "__tests__",
  "test",
  "__snapshots__",
]);
const FILE_EXT = /\.(tsx?|jsx?|md|html|json|mjs|cjs)$/;

// Match the brand domain in any casing other than the canonical lowercase.
// Case-insensitive `bitcoincalculator.tools` — flag every variant that isn't
// the all-lowercase canonical form.
const BRAND = /\bbitcoincalculator\.tools\b/gi;
const ALLOWED = "bitcoincalculator.tools";

function walk(path, out = []) {
  let st;
  try {
    st = statSync(path);
  } catch {
    return out;
  }
  if (st.isFile()) {
    if (FILE_EXT.test(path)) out.push(path);
    return out;
  }
  for (const entry of readdirSync(path)) {
    if (SKIP_DIRS.has(entry)) continue;
    walk(join(path, entry), out);
  }
  return out;
}

const offenders = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const src = readFileSync(file, "utf8");
    const lines = src.split("\n");
    lines.forEach((line, idx) => {
      const matches = line.match(BRAND);
      if (!matches) return;
      for (const m of matches) {
        if (m === ALLOWED) continue;
        offenders.push({ file, line: idx + 1, match: m, snippet: line.trim() });
      }
    });
  }
}

if (offenders.length === 0) {
  console.log("✓ Brand casing audit passed — all references use `bitcoincalculator.tools`.");
  process.exit(0);
}

console.error(`✗ Brand casing audit found ${offenders.length} violation(s):\n`);
for (const o of offenders.slice(0, 50)) {
  console.error(`  ${o.file}:${o.line}  → ${o.match}`);
  console.error(`    ${o.snippet.slice(0, 140)}`);
}
if (offenders.length > 50) {
  console.error(`  …and ${offenders.length - 50} more.`);
}
console.error(
  `\nFix: replace each match with the lowercase domain "${ALLOWED}". ` +
    `The readable display name "Bitcoin Calculator Tools" (with spaces) is allowed.`,
);
process.exit(1);
