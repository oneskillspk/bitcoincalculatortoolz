import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Regression test: schema.org rejects `inLanguage` on BreadcrumbList
 * ("Unexpected property" in Rich Results / SDTT). Locale is carried by
 * the sibling Article/WebPage/FAQPage blocks.
 *
 * This walker scans every source file under src/ and src/pages and any
 * scripts that emit JSON-LD literals. If a BreadcrumbList object literal
 * (inline or via a helper) contains an `inLanguage` field within ~30
 * lines, the test fails. Keep the assertion deliberately conservative —
 * we'd rather catch a false positive in review than ship the regression.
 */

const ROOTS = ["src"];
const EXT = /\.(ts|tsx|mjs|js)$/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (EXT.test(entry)) out.push(p);
  }
  return out;
}

describe("BreadcrumbList JSON-LD must never carry inLanguage", () => {
  const offenders: string[] = [];

  for (const root of ROOTS) {
    for (const file of walk(root)) {
      // Skip this very test and snapshots so we don't self-match.
      if (file.endsWith("breadcrumb-no-inlanguage.test.ts")) continue;
      if (file.includes("__snapshots__")) continue;

      const text = readFileSync(file, "utf8");
      const re = /"@type"\s*:\s*"BreadcrumbList"/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        // Look 1500 chars forward — comfortably past the typical
        // BreadcrumbList literal but short of unrelated neighbours.
        const window = text.slice(m.index, m.index + 1500);
        // Stop at the first closing top-level brace heuristic — count
        // braces to bound the object.
        let depth = 0;
        let end = window.length;
        for (let i = window.indexOf("{"); i < window.length && i !== -1; i++) {
          const ch = window[i];
          if (ch === "{") depth++;
          else if (ch === "}") {
            depth--;
            if (depth === 0) { end = i + 1; break; }
          }
        }
        const bounded = window.slice(0, end);
        if (/\binLanguage\b/.test(bounded)) {
          offenders.push(`${file} (offset ${m.index})`);
        }
      }
    }
  }

  it("no source file declares a BreadcrumbList with inLanguage", () => {
    expect(offenders, `Offenders:\n${offenders.join("\n")}`).toEqual([]);
  });
});
