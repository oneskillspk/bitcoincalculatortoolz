/**
 * Consistency check: every source reference to India's Section 115BBH /
 * Section 194S rules must use the spelled-out "Section 115BBH" /
 * "Section 194S" phrasing (English) or "115BBH Bölümü" / "194S Bölümü"
 * (Turkish) — never the bare "§115BBH" / "§194S" shorthand.
 *
 * Motivation: the `§` glyph renders as tofu on some Android + Windows
 * font stacks, and we already had to hot-fix it once. Related-calculator
 * cards, nav labels, page-meta descriptions, and translation strings all
 * feed the same navigation surface, so drift between them is a shipping
 * risk. This test statically scans the codebase so a regression fails CI
 * before it hits the browser.
 *
 * Germany (`§23 EStG`, `§104`) is intentionally out of scope — those are
 * proper legal citations in German copy and not part of this rule.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

/** Recursively walk src/ for .ts/.tsx files, skipping tests + generated code. */
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (
        name === "__tests__" ||
        name === "node_modules" ||
        name.startsWith(".")
      )
        continue;
      walk(p, out);
    } else if (/\.(ts|tsx)$/.test(name) && !/\.(test|spec)\.[tj]sx?$/.test(name)) {
      // Skip auto-generated Supabase types
      if (p.includes(join("integrations", "supabase"))) continue;
      out.push(p);
    }
  }
  return out;
}

const files = walk(SRC);

describe("Section 115BBH / 194S consistency across nav + related calculators", () => {
  it("no source file uses the '§115BBH' shorthand", () => {
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      if (/§\s*115BBH/.test(text)) offenders.push(relative(ROOT, f));
    }
    expect(offenders, `Use "Section 115BBH" / "115BBH Bölümü" instead in:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("no source file uses the '§194S' shorthand", () => {
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      if (/§\s*194S/.test(text)) offenders.push(relative(ROOT, f));
    }
    expect(offenders, `Use "Section 194S" / "194S Bölümü" instead in:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("every India-tax related-calculator / nav string mentions the section explicitly", () => {
    // Files that render nav or related-calculator surfaces for the India page.
    const navSurfaces = [
      "src/components/RelatedCalculators.tsx",
      "src/translations/en.ts",
      "src/translations/tr.ts",
      "src/components/tax/regionMeta.ts",
    ].map((p) => join(ROOT, p));

    for (const f of navSurfaces) {
      const text = readFileSync(f, "utf8");
      // Pull out lines referencing India tax that also cite 115BBH.
      const lines = text.split("\n").filter((l) => /115BBH/.test(l));
      for (const line of lines) {
        // Every mention must be prefixed with the spelled-out section word,
        // in EN ("Section 115BBH") or TR ("115BBH Bölümü").
        const ok = /Section\s+115BBH/.test(line) || /115BBH\s+Bölümü/.test(line);
        expect(
          ok,
          `In ${relative(ROOT, f)}, "115BBH" must be preceded by "Section " or followed by " Bölümü":\n  ${line.trim()}`,
        ).toBe(true);
      }
    }
  });

  it("every India-tax nav string that mentions TDS cites Section 194S (not bare '194S')", () => {
    // Only enforce on the nav / meta surfaces the previous test covers.
    const navSurfaces = [
      "src/components/tax/regionMeta.ts",
    ].map((p) => join(ROOT, p));

    for (const f of navSurfaces) {
      const text = readFileSync(f, "utf8");
      const lines = text.split("\n").filter((l) => /\b194S\b/.test(l));
      for (const line of lines) {
        const ok = /Section\s+194S/.test(line) || /194S\s+Bölümü/.test(line);
        expect(
          ok,
          `In ${relative(ROOT, f)}, "194S" must be preceded by "Section " or followed by " Bölümü":\n  ${line.trim()}`,
        ).toBe(true);
      }
    }
  });
});
