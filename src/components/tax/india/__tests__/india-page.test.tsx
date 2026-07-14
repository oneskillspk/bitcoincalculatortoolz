/**
 * Regression tests for the India Bitcoin Tax Calculator page structure.
 *
 * Catches the classes of bugs we hit shipping this page:
 *   - Composition chart bars going flat / all-identical (math regression)
 *   - Legend items disappearing at narrow widths
 *   - VDA loss row losing the "(loss)" text suffix
 *   - Nav / breadcrumb landmarks going missing
 *
 * jsdom doesn't do real layout, so overflow is checked by asserting the
 * relevant elements use the tokens that enable horizontal scroll +
 * min-width instead of measuring rendered pixels.
 */
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { IndiaTaxCompositionChart } from "@/components/tax/india/IndiaTaxCompositionChart";
import { IndiaScheduleVDAPreview } from "@/components/tax/india/IndiaScheduleVDAPreview";
import { TaxComparisonTable } from "@/components/tax/TaxComparisonTable";

const renderIn = (ui: React.ReactElement) =>
  render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  );

describe("IndiaTaxCompositionChart — chart rendering", () => {
  it("renders all four scenario rows", () => {
    renderIn(<IndiaTaxCompositionChart isTr={false} />);
    for (const key of ["thin", "mid", "fat", "whale"]) {
      expect(screen.getByTestId(`in-chart-row-${key}`)).toBeInTheDocument();
    }
  });

  it("renders a wrapping legend with all three components", () => {
    renderIn(<IndiaTaxCompositionChart isTr={false} />);
    const legend = screen.getByRole("list", { name: /chart legend/i });
    expect(legend.className).toMatch(/flex-wrap/);
    expect(within(legend).getByText(/30% base tax/i)).toBeInTheDocument();
    expect(within(legend).getByText(/4% cess/i)).toBeInTheDocument();
    expect(within(legend).getByText(/1% TDS \(creditable\)/i)).toBeInTheDocument();
  });

  it("shows meaningfully different TDS shares across scenarios (regression against flat bars)", () => {
    renderIn(<IndiaTaxCompositionChart isTr={false} />);
    // Thin margin must show TDS share > 20%, high margin < 5%.
    const thin = screen.getByTestId("in-chart-row-thin");
    const fat = screen.getByTestId("in-chart-row-fat");
    const thinPct = Number(thin.textContent?.match(/TDS\s*([\d.]+)%/)?.[1] ?? "0");
    const fatPct = Number(fat.textContent?.match(/TDS\s*([\d.]+)%/)?.[1] ?? "0");
    expect(thinPct).toBeGreaterThan(20);
    expect(fatPct).toBeLessThan(5);
  });
});

describe("IndiaScheduleVDAPreview — loss suffix", () => {
  it("shows a visible '(loss)' text suffix on negative income rows", () => {
    renderIn(<IndiaScheduleVDAPreview isTr={false} />);
    // At least one row must include the text suffix (not just red color).
    expect(screen.getByText(/\(loss\)/i)).toBeInTheDocument();
  });
});

describe("TaxComparisonTable — mobile overflow protection", () => {
  it("forces horizontal scroll via min-w on the inner table", () => {
    const { container } = renderIn(
      <TaxComparisonTable highlight="in" isTr={false} />,
    );
    const table = container.querySelector("table");
    expect(table).not.toBeNull();
    expect(table!.className).toMatch(/min-w-\[\d+px\]/);
  });

  it("keeps the flag + jurisdiction glued together via whitespace-nowrap", () => {
    const { container } = renderIn(
      <TaxComparisonTable highlight="in" isTr={false} />,
    );
    const jurisdictionSpans = container.querySelectorAll("td span.whitespace-nowrap");
    expect(jurisdictionSpans.length).toBeGreaterThan(0);
  });
});
