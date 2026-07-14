/**
 * Automated a11y regression for the India Bitcoin Tax page.
 *
 * Covers:
 *   1. axe-core: no violations on the calculator + India-specific panels.
 *   2. Currency context: every numeric input on the India page exposes an
 *      aria-describedby pointing at an INR / currency hint element.
 *   3. Focus order: tab traversal follows the visual reading order
 *      (proceeds → cost → subsequent controls).
 *   4. Navigation elements (headings, section landmarks) expose accessible
 *      names so screen-reader landmark navigation works.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";

import RegionalCryptoTaxCalculator from "@/components/tax-calculator/RegionalCryptoTaxCalculator";
import { IndiaTDSReclaimPanel } from "@/components/tax/india/IndiaTDSReclaimPanel";
import { IndiaGlanceStrip } from "@/components/tax/india/IndiaGlanceStrip";
import { IndiaScheduleVDAPreview } from "@/components/tax/india/IndiaScheduleVDAPreview";
import { IndiaTaxCompositionChart } from "@/components/tax/india/IndiaTaxCompositionChart";

expect.extend(toHaveNoViolations);

const wrap = (ui: React.ReactNode) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <LanguageProvider>
            <main>{ui}</main>
          </LanguageProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

// jsdom can't measure real colors → skip color-contrast (covered by manual audit).
const axeOpts = { rules: { "color-contrast": { enabled: false } } };

const indiaSurface = (
  <>
    <IndiaGlanceStrip isTr={false} />
    <RegionalCryptoTaxCalculator region="in" />
    <IndiaTDSReclaimPanel isTr={false} />
    <IndiaTaxCompositionChart isTr={false} />
    <IndiaScheduleVDAPreview isTr={false} />
  </>
);

describe("India tax page — automated a11y", () => {
  it("has no detectable axe violations across all India sections", async () => {
    const { container } = render(wrap(indiaSurface));
    const results = await axe(container, axeOpts);
    expect(results).toHaveNoViolations();
  });

  it("every numeric input announces its currency context via aria-describedby", () => {
    const { container } = render(wrap(indiaSurface));
    const numberInputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[type="number"]'),
    );
    expect(numberInputs.length).toBeGreaterThan(0);
    for (const input of numberInputs) {
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy, `input#${input.id} missing aria-describedby`).toBeTruthy();
      const target = container.querySelector(`#${describedBy}`);
      expect(target, `describedby target #${describedBy} not found`).toBeTruthy();
      // The description must mention the currency (INR or ₹) so SRs read it aloud.
      expect(target?.textContent ?? "").toMatch(/INR|₹|rupee/i);
    }
  });

  it("focus order follows visual reading order (proceeds → cost)", async () => {
    const user = userEvent.setup();
    const { container } = render(wrap(<RegionalCryptoTaxCalculator region="in" />));
    const proceeds = container.querySelector<HTMLInputElement>("#proceeds")!;
    const cost = container.querySelector<HTMLInputElement>("#cost")!;
    expect(proceeds).toBeTruthy();
    expect(cost).toBeTruthy();
    proceeds.focus();
    expect(document.activeElement).toBe(proceeds);
    await user.tab();
    expect(document.activeElement).toBe(cost);
  });

  it("exposes navigation landmarks with accessible names on every India section", () => {
    const { container } = render(wrap(indiaSurface));
    const sections = container.querySelectorAll(
      'section[aria-labelledby], section[aria-label]',
    );
    expect(sections.length).toBeGreaterThanOrEqual(4);
    for (const s of Array.from(sections)) {
      const labelledBy = s.getAttribute("aria-labelledby");
      if (labelledBy) {
        const target = container.querySelector(`#${labelledBy}`);
        expect(target, `aria-labelledby target #${labelledBy} missing`).toBeTruthy();
        expect((target?.textContent ?? "").trim().length).toBeGreaterThan(0);
      }
    }
  });
});
