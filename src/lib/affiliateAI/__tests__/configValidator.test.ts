import { describe, it, expect } from "vitest";
import {
  validateAffiliateConfig,
  extractAmounts,
  formatIssues,
} from "@/lib/affiliateAI/configValidator";
import { AFFILIATES } from "@/config/affiliates.config";
import type { AffiliateProgram } from "@/lib/affiliateAI/types";

const base = (over: Partial<AffiliateProgram> & { id: string }): AffiliateProgram =>
  ({
    name: over.id,
    category: "exchange",
    enabled: true,
    creatives: [],
    ...over,
  }) as unknown as AffiliateProgram;

describe("affiliate config validator", () => {
  it("extracts money amounts from copy", () => {
    expect(extractAmounts("Get up to $2,000")).toEqual(["2000"]);
    expect(extractAmounts("Claim 8,000 USDT")).toEqual(["8000"]);
    expect(extractAmounts("no money here")).toEqual([]);
  });

  it("flags category wording inside a badge", () => {
    const issues = validateAffiliateConfig([
      base({ id: "x", badge_en: "Top Exchange bonus" } as Partial<AffiliateProgram> & { id: string }),
    ]);
    expect(issues.map((i) => i.code)).toContain("category-in-badge");
  });

  it("flags badge text repeated in the CTA copy", () => {
    const issues = validateAffiliateConfig([
      base({
        id: "x",
        badge_en: "Up to $200",
        cta_short_en: "Earn Up to $200 today",
      } as Partial<AffiliateProgram> & { id: string }),
    ]);
    expect(issues.map((i) => i.code)).toContain("badge-repeated-in-copy");
  });

  it("flags the same badge shared by two partners", () => {
    const issues = validateAffiliateConfig([
      base({ id: "a", badge_en: "Zero fees" } as Partial<AffiliateProgram> & { id: string }),
      base({ id: "b", badge_en: "Zero fees" } as Partial<AffiliateProgram> & { id: string }),
    ]);
    expect(issues.map((i) => i.code)).toContain("duplicate-badge-across-partners");
  });

  it("flags config copy that contradicts the native creative (Coinbase $200 case)", () => {
    const issues = validateAffiliateConfig([
      base({
        id: "coinbase",
        badge_en: "Up to $2,000",
        creatives: [
          {
            size: "300x250",
            width: 300,
            height: 250,
            image_url: "https://x/300/250",
            alt: "Get up to $200 in crypto",
          },
        ],
      } as unknown as Partial<AffiliateProgram> & { id: string }),
    ]);
    expect(issues.map((i) => i.code)).toContain("amount-mismatch-with-creative");
  });

  it("flags CTA copy that ships its own trailing arrow", () => {
    const issues = validateAffiliateConfig([
      base({ id: "mexc", cta_short_en: "Claim 8,000 USDT on MEXC →" } as Partial<AffiliateProgram> & {
        id: string;
      }),
    ]);
    expect(issues.map((i) => i.code)).toContain("cta-trailing-arrow");
  });

  it("passes clean copy", () => {
    expect(
      validateAffiliateConfig([
        base({ id: "clean", badge_en: "Up to $200", cta_short_en: "Start stacking" } as Partial<AffiliateProgram> & {
          id: string;
        }),
      ])
    ).toEqual([]);
  });

  it("the shipped partner registry is clean", () => {
    const issues = validateAffiliateConfig(AFFILIATES);
    expect(formatIssues(issues)).toBe("");
  });
});

describe("detailed validation output", () => {
  it("flags an unqualified headline money claim (the MEXC case)", () => {
    const issues = validateAffiliateConfig([
      base({ id: "mexc", cta_short_en: "Claim 8,000 USDT on MEXC" } as Partial<AffiliateProgram> & {
        id: string;
      }),
    ]);
    expect(issues.map((i) => i.code)).toContain("unqualified-amount-claim");
  });

  it("allows small fixed rewards without an 'up to' qualifier", () => {
    const issues = validateAffiliateConfig([
      base({ id: "redotpay", cta_short_en: "Claim your $5 + Visa card" } as Partial<AffiliateProgram> & {
        id: string;
      }),
    ]);
    expect(issues.map((i) => i.code)).not.toContain("unqualified-amount-claim");
  });

  it("reports which normalized tokens differ on an amount mismatch", () => {
    const [issue] = validateAffiliateConfig([
      base({
        id: "coinbase",
        badge_en: "Up to $2,000",
        creatives: [
          { size: "300x250", width: 300, height: 250, image_url: "x", alt: "Get up to $200 in crypto" },
        ],
      } as unknown as Partial<AffiliateProgram> & { id: string }),
    ]);
    expect(issue.details?.amounts).toEqual({ config: ["2000"], creative: ["200"] });
    expect(issue.details?.tokenDiff?.onlyA).toContain("$2,000");
    expect(issue.details?.tokenDiff?.onlyB).toContain("$200");
    expect(formatIssues([issue])).toContain("only-in-creative");
  });
});
