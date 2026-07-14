/**
 * Semantic heading-order lock for the comparison <section>.
 *
 * Accessibility requires heading levels inside a landmark to descend
 * without skipping (h2 → h3 → h4, never h2 → h4). This test walks
 * every heading node inside the "Bitcoin tax — country comparison"
 * <section> and asserts:
 *   1. There is at least one heading.
 *   2. The first heading is <h2> or <h3> (section-level, never <h1>
 *      because the page already owns the single <h1>, and never below
 *      <h3> because that would be too deep for a top-level section).
 *   3. Each subsequent heading level is either equal to, one deeper
 *      than, or shallower than the previous — never deeper by more
 *      than 1 (no skipped levels).
 *   4. `role="heading"` nodes carry an explicit `aria-level` and are
 *      folded into the same monotonic check.
 *
 * The check runs in both LTR (default) and RTL (`dir="rtl"`) render
 * contexts because a future refactor that swaps semantic tags for
 * styled <div>s under RTL-specific branches would silently regress
 * screen-reader navigation for Arabic/Hebrew users.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TaxComparisonTable } from "@/components/tax/TaxComparisonTable";
import type { RegionId } from "@/components/tax/regionMeta";

const regions: RegionId[] = ["in", "uk", "de"];
const directions: Array<"ltr" | "rtl"> = ["ltr", "rtl"];

const renderIn = (ui: React.ReactElement, dir: "ltr" | "rtl") =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <div dir={dir}>{ui}</div>
      </MemoryRouter>
    </HelmetProvider>,
  );

function levelOf(el: Element): number | null {
  const tag = el.tagName.toLowerCase();
  const tagMatch = /^h([1-6])$/.exec(tag);
  if (tagMatch) return Number(tagMatch[1]);
  if (el.getAttribute("role") === "heading") {
    const attr = el.getAttribute("aria-level");
    return attr ? Number(attr) : null;
  }
  return null;
}

describe("TaxComparisonTable — semantic heading order (LTR + RTL)", () => {
  for (const dir of directions) {
    it.each(regions)(
      `region %s (${dir}): headings inside the comparison <section> descend without skipping levels`,
      (region) => {
        const { container } = renderIn(
          <TaxComparisonTable highlight={region} isTr={false} />,
          dir,
        );

        const section = container.querySelector(
          'section[aria-labelledby="tax-compare-heading"]',
        );
        expect(section, "comparison <section> not found").not.toBeNull();

        const nodes = Array.from(
          section!.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, [role="heading"]',
          ),
        );

        expect(
          nodes.length,
          `[${dir}] no heading nodes inside the comparison section`,
        ).toBeGreaterThan(0);

        const levels: number[] = [];
        for (const node of nodes) {
          const lvl = levelOf(node);
          expect(
            lvl,
            `[${dir}] heading <${node.tagName}> is missing an explicit level (role="heading" without aria-level?)`,
          ).not.toBeNull();
          levels.push(lvl!);
        }

        // 1) No <h1> — the page owns the single <h1>.
        expect(
          Math.min(...levels),
          `[${dir}] comparison section must not contain <h1> (page owns the single h1)`,
        ).toBeGreaterThanOrEqual(2);

        // 2) First heading must be h2 or h3 (section-level entry point).
        expect(
          levels[0],
          `[${dir}] first heading in section must be h2 or h3, got h${levels[0]}`,
        ).toBeGreaterThanOrEqual(2);
        expect(
          levels[0],
          `[${dir}] first heading in section must be h2 or h3, got h${levels[0]}`,
        ).toBeLessThanOrEqual(3);

        // 3) No skipped levels going deeper.
        for (let i = 1; i < levels.length; i++) {
          const prev = levels[i - 1];
          const curr = levels[i];
          expect(
            curr - prev,
            `[${dir}] heading order skips a level between #${i - 1} (h${prev}) and #${i} (h${curr})`,
          ).toBeLessThanOrEqual(1);
        }
      },
    );
  }
});
