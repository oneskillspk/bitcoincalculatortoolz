import { describe, it, expect } from "vitest";
import {
  normalizeText,
  normalizeAmount,
  textEquals,
  textIncludes,
  diffTokens,
  formatTokenDiff,
} from "@/lib/affiliateAI/textNormalize";
import { extractAmounts } from "@/lib/affiliateAI/configValidator";

describe("text normalization", () => {
  it("folds casing, unicode spaces and decoration", () => {
    expect(normalizeText("Claim  Bonus\u00a0Now →")).toBe("claim bonus now");
    expect(normalizeText("Regulated • MT4/MT5")).toBe("regulated mt4/mt5");
  });

  it("unifies currency wording and symbols", () => {
    expect(normalizeText("8,000 USDT")).toBe("$8,000");
    expect(normalizeText("USD 200")).toBe("$200");
    expect(normalizeText("$ 200")).toBe("$200");
    expect(normalizeText("79 EUR")).toBe("€79");
  });

  it("normalizes amounts across en/tr grouping and multipliers", () => {
    expect(normalizeAmount("8,000")).toBe(8000);
    expect(normalizeAmount("8.000")).toBe(8000);
    expect(normalizeAmount("1,5")).toBe(1.5);
    expect(normalizeAmount("2", "k")).toBe(2000);
  });

  it("compares config copy to creative text on equal footing", () => {
    expect(textEquals("Get up to $200", "get  up to USD 200")).toBe(true);
    expect(textIncludes("Earn Up to $2,000 today", "up to 2,000 USD")).toBe(true);
    expect(textIncludes("Start stacking", "up to $200")).toBe(false);
  });

  it("extracts the same amount from differently written copy", () => {
    expect(extractAmounts("Claim 8,000 USDT")).toEqual(["8000"]);
    expect(extractAmounts("Claim 8.000 USDT")).toEqual(["8000"]);
    expect(extractAmounts("USD 2k welcome bonus")).toEqual(["2000"]);
    expect(extractAmounts("Get up to $2,000")).toEqual(["2000"]);
  });
});

describe("token diff reporting", () => {
  it("names the tokens that differ between config copy and creative text", () => {
    const d = diffTokens("Up to $2,000 bonus", "Get up to $200 in crypto");
    expect(d.normalizedA).toBe("up to $2,000 bonus");
    expect(d.onlyA).toContain("$2,000");
    expect(d.onlyB).toContain("$200");
    expect(d.shared).toEqual(expect.arrayContaining(["up", "to"]));
  });

  it("keeps a currency word from gluing onto the next word", () => {
    expect(normalizeText("8,000 USDT beginner reward")).toBe("$8,000 beginner reward");
    expect(extractAmounts("8,000 USDT beginner reward")).toEqual(["8000"]);
  });

  it("renders a readable one-line diff", () => {
    const line = formatTokenDiff(diffTokens("Claim $200", "up to $200"));
    expect(line).toContain('config="claim $200"');
    expect(line).toContain("only-in-config: claim");
    expect(line).toContain("only-in-creative: up, to");
  });
});
