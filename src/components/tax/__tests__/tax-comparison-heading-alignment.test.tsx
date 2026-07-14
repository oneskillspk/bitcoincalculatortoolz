/**
 * Comparison-section heading alignment lock.
 *
 * The "Bitcoin tax — country comparison" heading (and its CardHeader
 * wrapper) must stay centered on every viewport. jsdom can't measure
 * layout, but it can assert the class tokens survive future refactors.
 * The paired Playwright spec (`e2e/tax-header-breadcrumb-clearance.spec.ts`
 * and `e2e/tax-comparison-heading-centered.spec.ts`) verifies the
 * *computed* text-align at 320 and 1440 in a real browser.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TaxComparisonTable } from "@/components/tax/TaxComparisonTable";
import type { RegionId } from "@/components/tax/regionMeta";

const renderIn = (ui: React.ReactElement) =>
  render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  );

const regions: RegionId[] = ["in", "uk", "de"];

describe("TaxComparisonTable — heading centering", () => {
  it.each(regions)(
    "region %s: CardTitle carries text-center on all breakpoints",
    (region) => {
      const { container } = renderIn(
        <TaxComparisonTable highlight={region} isTr={false} />,
      );
      const heading = container.querySelector("#tax-compare-heading");
      expect(heading, "heading node not found").not.toBeNull();
      // Class must be an unconditional `text-center` (not `md:text-center`
      // or `lg:text-center`) so 320 px and 1440 px both stay centered.
      const classes = heading!.className;
      expect(classes).toMatch(/(^|\s)text-center(\s|$)/);
      expect(classes).not.toMatch(/(sm|md|lg|xl):text-(left|right|start|end)/);
    },
  );

  it.each(regions)(
    "region %s: CardHeader wrapper is also centered so any future subheading inherits alignment",
    (region) => {
      const { container } = renderIn(
        <TaxComparisonTable highlight={region} isTr={false} />,
      );
      // The CardHeader is the parent element of the CardTitle.
      const heading = container.querySelector("#tax-compare-heading");
      const cardHeader = heading?.parentElement;
      expect(cardHeader, "CardHeader wrapper not found").not.toBeNull();
      expect(cardHeader!.className).toMatch(/(^|\s)text-center(\s|$)/);
    },
  );

  it.each(regions)(
    "region %s: no rogue text-left / text-start anywhere in the CardHeader tree",
    (region) => {
      const { container } = renderIn(
        <TaxComparisonTable highlight={region} isTr={false} />,
      );
      const heading = container.querySelector("#tax-compare-heading");
      const cardHeader = heading?.parentElement;
      expect(cardHeader).not.toBeNull();
      const offenders = cardHeader!.querySelectorAll(
        "[class*='text-left'], [class*='text-start']",
      );
      expect(offenders.length, "found left-aligned nodes in CardHeader").toBe(0);
    },
  );

  it.each(regions)(
    "region %s: EVERY heading-level node inside the comparison <section> carries unconditional text-center (locks 320 & 1440)",
    (region) => {
      const { container } = renderIn(
        <TaxComparisonTable highlight={region} isTr={false} />,
      );
      const section = container.querySelector(
        'section[aria-labelledby="tax-compare-heading"]',
      );
      expect(section, "comparison <section> not found").not.toBeNull();
      const headings = section!.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, [role="heading"]',
      );
      expect(headings.length, "no heading nodes in section").toBeGreaterThan(0);
      for (const h of Array.from(headings)) {
        const cls = h.className || "";
        // Must have unconditional text-center …
        expect(
          cls,
          `heading <${h.tagName}> missing unconditional text-center: "${cls}"`,
        ).toMatch(/(^|\s)text-center(\s|$)/);
        // … and no responsive override that could break 320 or 1440.
        expect(
          cls,
          `heading <${h.tagName}> has a responsive alignment override that could flip at 320/1440: "${cls}"`,
        ).not.toMatch(/(sm|md|lg|xl|2xl):text-(left|right|start|end)/);
      }
    },
  );

  it.each(regions)(
    "region %s: heading centering survives RTL — no text-start/text-end tokens (which flip under RTL)",
    (region) => {
      const { container } = renderIn(
        <div dir="rtl">
          <TaxComparisonTable highlight={region} isTr={false} />
        </div>,
      );
      const section = container.querySelector(
        'section[aria-labelledby="tax-compare-heading"]',
      );
      expect(section).not.toBeNull();

      // In RTL, `text-start` resolves to right and `text-end` to left —
      // both would visibly de-center the heading. The whole comparison
      // subtree must therefore avoid these logical tokens.
      const logical = section!.querySelectorAll(
        "[class*='text-start'], [class*='text-end']",
      );
      expect(
        logical.length,
        "found logical alignment tokens that flip under RTL",
      ).toBe(0);

      // The heading + wrapper must still carry unconditional text-center
      // so RTL rendering keeps center alignment.
      const heading = section!.querySelector("#tax-compare-heading");
      expect(heading).not.toBeNull();
      expect(heading!.className).toMatch(/(^|\s)text-center(\s|$)/);
      expect(heading!.parentElement!.className).toMatch(
        /(^|\s)text-center(\s|$)/,
      );

      // And the section itself must be reachable from a document with
      // dir="rtl" set on an ancestor (sanity check that we actually
      // rendered inside an RTL context).
      const rtlAncestor = section!.closest('[dir="rtl"]');
      expect(rtlAncestor, "section not inside dir=rtl ancestor").not.toBeNull();
    },
  );
});

