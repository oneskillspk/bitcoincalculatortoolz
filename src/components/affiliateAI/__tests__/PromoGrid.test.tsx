import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PromoGrid } from "@/components/affiliateAI/PromoGrid";
import type { ResolvedAffiliate } from "@/lib/affiliateAI/placementResolver";
import type { AffiliateProgram } from "@/lib/affiliateAI/types";

const program = (id: string, category: AffiliateProgram["category"]): AffiliateProgram =>
  ({
    id,
    name: `${id} Partner`,
    category,
    enabled: true,
    logo_color: "#123456",
    creatives: [],
  }) as unknown as AffiliateProgram;

const item = (id: string, category: AffiliateProgram["category"] = "trading"): ResolvedAffiliate => ({
  program: program(id, category),
  url: `https://example.com/${id}?ref=abc`,
  cta: "Get started",
  description: `${id} description`,
  badge: "Hot",
  effectiveLang: "en",
});

describe("PromoGrid", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders one card per resolved offer up to the limit", () => {
    render(
      <PromoGrid
        items={[item("a"), item("b"), item("c"), item("d")]}
        slug="dca"
        lang="en"
        zone="post-result"
        limit={3}
      />
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("degrades to two and one offers without crashing", () => {
    const { rerender } = render(
      <PromoGrid items={[item("a"), item("b")]} slug="dca" lang="en" zone="post-result" />
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);

    rerender(<PromoGrid items={[item("a")]} slug="dca" lang="en" zone="post-result" />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders nothing when there are no offers", () => {
    const { container } = render(
      <PromoGrid items={[]} slug="dca" lang="en" zone="post-result" />
    );
    expect(container.querySelector("[data-promo-grid]")).toBeNull();
  });

  it("collapses to a single card on mobile limit", () => {
    render(
      <PromoGrid items={[item("a"), item("b"), item("c")]} slug="dca" lang="en" zone="post-result" limit={1} />
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("preserves the partner URL and appends UTM + click id", () => {
    render(<PromoGrid items={[item("a")]} slug="dca" lang="en" zone="post-result" variantId="promo-grid-v1" />);
    const href = screen.getByRole("link").getAttribute("href") || "";
    expect(href).toContain("https://example.com/a");
    expect(href).toContain("ref=abc");
    expect(href).toMatch(/utm_/);
  });

  it("marks links as sponsored and opens in a new tab", () => {
    render(<PromoGrid items={[item("a")]} slug="dca" lang="en" zone="post-result" />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("rel")).toContain("sponsored");
    expect(link.getAttribute("rel")).toContain("nofollow");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("falls back to a category illustration when the partner has no creative", () => {
    render(<PromoGrid items={[item("a", "hardware-wallet")]} slug="dca" lang="en" zone="post-result" />);
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.getAttribute("src")).toBeTruthy();
    expect(img.getAttribute("loading")).toBe("lazy");
  });

  it("localizes the status badge and category meta in Turkish", () => {
    render(<PromoGrid items={[item("a", "exchange")]} slug="dca" lang="tr" zone="post-result" />);
    expect(screen.getByText("Devam ediyor")).toBeInTheDocument();
    expect(screen.getByText("Borsa")).toBeInTheDocument();
  });
});
