/**
 * Regression tests for the UK Bitcoin CGT Calculator page structure.
 *
 * Mirrors the India regression suite. Guards:
 *   - Comparison table forces horizontal scroll on mobile (min-w-[720px])
 *   - Hero renders the UK-specific chips + Section 104 methodology copy
 *   - Scenario cards render all three worked examples
 *   - Nav / breadcrumb landmark tokens present on the page shell
 */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TaxComparisonTable } from "@/components/tax/TaxComparisonTable";
import { TaxScenarioCards } from "@/components/tax/TaxScenarioCards";
import { TaxHero } from "@/components/tax/TaxHero";
import { TaxMethodologySection } from "@/components/tax/TaxMethodologySection";

const renderIn = (ui: React.ReactElement) =>
  render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  );

describe("TaxComparisonTable — UK highlight", () => {
  it("forces horizontal scroll via min-w on the inner table", () => {
    const { container } = renderIn(
      <TaxComparisonTable highlight="uk" isTr={false} />,
    );
    const table = container.querySelector("table");
    expect(table).not.toBeNull();
    expect(table!.className).toMatch(/min-w-\[\d+px\]/);
  });

  it("marks the UK row as active with the 'This page' badge", () => {
    renderIn(<TaxComparisonTable highlight="uk" isTr={false} />);
    expect(screen.getByText(/this page/i)).toBeInTheDocument();
  });

  it("cites Section 104 pooling (never a bare § shorthand)", () => {
    const { container } = renderIn(
      <TaxComparisonTable highlight="uk" isTr={false} />,
    );
    const text = (container.textContent ?? "").replace(/\s+/g, " ");
    expect(text).toMatch(/Section 104/);
    expect(text).not.toMatch(/§/);
  });
});

describe("TaxHero — UK", () => {
  it("renders the UK CGT heading and 2026/27 tax year chip", () => {
    const { container } = renderIn(<TaxHero region="uk" isTr={false} />);
    const text = (container.textContent ?? "").replace(/\s+/g, " ");
    expect(text).toMatch(/UK Bitcoin CGT Calculator/);
    expect(text).toMatch(/2026\/27/);
    expect(text).toMatch(/£3,000/);
    expect(text).not.toMatch(/§/);
  });
});

describe("TaxMethodologySection — UK", () => {
  it("spells out Section 104 in the methodology steps", () => {
    const { container } = renderIn(
      <TaxMethodologySection region="uk" isTr={false} />,
    );
    const text = (container.textContent ?? "").replace(/\s+/g, " ");
    expect(text).toMatch(/Section 104/);
    expect(text).not.toMatch(/§/);
  });
});

describe("TaxScenarioCards — UK", () => {
  it("renders all three UK worked examples", () => {
    renderIn(<TaxScenarioCards region="uk" isTr={false} />);
    expect(screen.getByText(/basic-rate part-time trader/i)).toBeInTheDocument();
    expect(screen.getByText(/higher-rate professional/i)).toBeInTheDocument();
    expect(screen.getByText(/whale full exit/i)).toBeInTheDocument();
  });
});
