/**
 * Cross-region visual regression: no user-facing '§' glyph and no mojibake
 * on any of the three regional tax page surfaces (IN / UK / DE), in both
 * English and Turkish variants.
 *
 * The `§` glyph renders as tofu on some Android + Windows font stacks — we
 * had to hot-fix it once for India and want the same guard on UK + DE.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TaxHero } from "@/components/tax/TaxHero";
import { TaxMethodologySection } from "@/components/tax/TaxMethodologySection";
import { TaxAccordionFAQ } from "@/components/tax/TaxAccordionFAQ";
import { TaxComparisonTable } from "@/components/tax/TaxComparisonTable";
import { TaxScenarioCards } from "@/components/tax/TaxScenarioCards";
import type { RegionId } from "@/components/tax/regionMeta";

const renderIn = (ui: React.ReactElement) =>
  render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  );

const flat = (el: HTMLElement) =>
  (el.textContent ?? "").replace(/\s+/g, " ").trim();

const regions: RegionId[] = ["in", "uk", "de"];
const langs = [false, true] as const;

describe.each(regions)("region %s", (region) => {
  describe.each(langs)("isTr=%s", (isTr) => {
    const surfaces = [
      { name: "TaxHero", ui: <TaxHero region={region} isTr={isTr} /> },
      {
        name: "TaxMethodologySection",
        ui: <TaxMethodologySection region={region} isTr={isTr} />,
      },
      {
        name: "TaxAccordionFAQ",
        ui: <TaxAccordionFAQ region={region} isTr={isTr} />,
      },
      {
        name: "TaxComparisonTable",
        ui: <TaxComparisonTable highlight={region} isTr={isTr} />,
      },
      {
        name: "TaxScenarioCards",
        ui: <TaxScenarioCards region={region} isTr={isTr} />,
      },
    ];

    describe.each(surfaces)("$name", ({ ui }) => {
      it("never renders a raw '§' glyph", () => {
        const { container } = renderIn(ui);
        expect(flat(container)).not.toMatch(/§/);
      });

      it("never renders mojibake or replacement characters", () => {
        const { container } = renderIn(ui);
        const text = flat(container);
        expect(text).not.toMatch(/\uFFFD/);
        expect(text).not.toMatch(/Â§|Ã‚Â§|â€/);
      });
    });
  });
});
