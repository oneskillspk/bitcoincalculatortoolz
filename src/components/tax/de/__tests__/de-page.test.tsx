/**
 * Regression tests for the Germany Bitcoin Tax Calculator page structure.
 *
 * Mirrors the India regression suite. Guards:
 *   - Comparison table forces horizontal scroll on mobile (min-w-[720px])
 *   - Hero renders the DE-specific chips + Section 23 EStG methodology copy
 *   - Scenario cards render all three worked examples
 *   - No user-facing '§' glyph anywhere in the rendered DOM
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TaxComparisonTable } from "@/components/tax/TaxComparisonTable";
import { TaxScenarioCards } from "@/components/tax/TaxScenarioCards";
import { TaxHero } from "@/components/tax/TaxHero";
import { TaxMethodologySection } from "@/components/tax/TaxMethodologySection";
import { TaxAccordionFAQ } from "@/components/tax/TaxAccordionFAQ";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const renderIn = (ui: React.ReactElement) =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <QueryClientProvider client={qc}><LanguageProvider>{ui}</LanguageProvider></QueryClientProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("TaxComparisonTable — Germany highlight", () => {
  it("forces horizontal scroll via min-w on the inner table", () => {
    const { container } = renderIn(
      <TaxComparisonTable highlight="de" isTr={false} />,
    );
    const table = container.querySelector("table");
    expect(table).not.toBeNull();
    expect(table!.className).toMatch(/min-w-\[\d+px\]/);
  });

  it("cites Section 23 EStG for the >12-month rule (never a bare § shorthand)", () => {
    const { container } = renderIn(
      <TaxComparisonTable highlight="de" isTr={false} />,
    );
    const text = (container.textContent ?? "").replace(/\s+/g, " ");
    expect(text).toMatch(/Section 23 EStG/);
    expect(text).not.toMatch(/§/);
  });
});

describe("TaxHero — Germany", () => {
  it("renders the Germany heading, Freigrenze chip, and Section 23 EStG highlight", () => {
    const { container } = renderIn(<TaxHero region="de" isTr={false} />);
    const text = (container.textContent ?? "").replace(/\s+/g, " ");
    expect(text).toMatch(/Germany Bitcoin Tax Calculator/);
    expect(text).toMatch(/Section 23 EStG/);
    expect(text).toMatch(/€1,000 Freigrenze/);
    expect(text).not.toMatch(/§/);
  });
});

describe("TaxMethodologySection — Germany", () => {
  it("spells out Section 23 EStG in the methodology steps", () => {
    const { container } = renderIn(
      <TaxMethodologySection region="de" isTr={false} />,
    );
    const text = (container.textContent ?? "").replace(/\s+/g, " ");
    expect(text).toMatch(/Section 23 EStG/);
    expect(text).not.toMatch(/§/);
  });
});

describe("TaxScenarioCards — Germany", () => {
  it("renders all three DE worked examples including the two tax-free HODL cases", () => {
    renderIn(<TaxScenarioCards region="de" isTr={false} />);
    expect(screen.getByText(/held under 1 yr — taxable/i)).toBeInTheDocument();
    expect(screen.getAllByText(/tax-free/i).length).toBeGreaterThanOrEqual(2);
  });
});

describe("TaxAccordionFAQ — Germany", () => {
  it("renders the FAQ headings without a raw § glyph", () => {
    const { container } = renderIn(<TaxAccordionFAQ region="de" isTr={false} />);
    const text = (container.textContent ?? "").replace(/\s+/g, " ");
    expect(text).toMatch(/Bitcoin/);
    expect(text).not.toMatch(/§/);
  });
});
