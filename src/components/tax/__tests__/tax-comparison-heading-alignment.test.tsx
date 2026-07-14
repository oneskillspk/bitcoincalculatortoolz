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
});
