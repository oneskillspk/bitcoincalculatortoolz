/**
 * Regression tests that lock the India §115BBH tax math against the
 * Finance Act 2022 rules. If any of these fail, someone changed the
 * calculation — verify against the Act before touching the constants.
 */
import { describe, expect, it } from "vitest";
import {
  computeIndia115BBH,
  IN_115BBH_EFFECTIVE_RATE_PCT,
} from "@/components/tax/india/india115bbh";

describe("computeIndia115BBH — §115BBH liability", () => {
  it("charges 30% flat + 4% cess = 31.2% of gain", () => {
    const r = computeIndia115BBH({ proceeds: 500_000, costBasis: 200_000 });
    expect(r.gain).toBe(300_000);
    expect(r.baseTax).toBe(90_000); // 300k × 30%
    expect(r.cess).toBeCloseTo(3_600, 5); // 90k × 4%
    expect(r.liability).toBeCloseTo(93_600, 5); // 300k × 31.2%
  });

  it("effective rate on gain is exactly 31.2% for any positive gain", () => {
    for (const gain of [10_000, 250_000, 1_000_000, 10_000_000]) {
      const r = computeIndia115BBH({ proceeds: gain + 100_000, costBasis: 100_000 });
      const effective = (r.liability / r.gain) * 100;
      expect(effective).toBeCloseTo(IN_115BBH_EFFECTIVE_RATE_PCT, 6);
    }
  });

  it("clamps gain to 0 when cost basis exceeds proceeds (no loss set-off)", () => {
    const r = computeIndia115BBH({ proceeds: 100_000, costBasis: 300_000 });
    expect(r.gain).toBe(0);
    expect(r.baseTax).toBe(0);
    expect(r.cess).toBe(0);
    expect(r.liability).toBe(0);
  });
});

describe("computeIndia115BBH — §194S TDS", () => {
  it("charges 1% TDS on gross proceeds, independent of gain", () => {
    const r = computeIndia115BBH({ proceeds: 500_000, costBasis: 490_000 });
    expect(r.tds).toBe(5_000); // 1% of 500k regardless of tiny gain
  });

  it("still charges TDS on loss-making sales (proceeds > 0)", () => {
    const r = computeIndia115BBH({ proceeds: 100_000, costBasis: 300_000 });
    expect(r.tds).toBe(1_000);
    expect(r.liability).toBe(0);
    expect(r.refund).toBe(1_000); // full TDS refundable
  });

  it("TDS does NOT get added to liability (it is a prepayment, not extra tax)", () => {
    // Regression guard for the pre-fix bug where liability included TDS
    // and produced e.g. ₹9,860 instead of the correct ₹9,360 on the
    // page's default 50k/20k example.
    const r = computeIndia115BBH({ proceeds: 50_000, costBasis: 20_000 });
    expect(r.liability).toBeCloseTo(9_360, 5); // 30k × 31.2%
    expect(r.tds).toBe(500); // 1% of 50k
    expect(r.liability).not.toBeCloseTo(9_860, 1);
  });
});

describe("computeIndia115BBH — refund vs payable split", () => {
  it("refunds excess TDS when withholding > liability", () => {
    const r = computeIndia115BBH({ proceeds: 1_000_000, costBasis: 990_000 });
    // gain 10k → liability 3,120 ; tds 10,000 → refund 6,880
    expect(r.refund).toBeCloseTo(6_880, 5);
    expect(r.payable).toBe(0);
  });

  it("shows additional payable when liability > TDS", () => {
    const r = computeIndia115BBH({ proceeds: 400_000, costBasis: 250_000 });
    // gain 150k → liability 46,800 ; tds 4,000 → payable 42,800
    expect(r.payable).toBeCloseTo(42_800, 5);
    expect(r.refund).toBe(0);
  });

  it("cashAtSale = liability + tds (matches composition chart totals)", () => {
    const r = computeIndia115BBH({ proceeds: 500_000, costBasis: 250_000 });
    expect(r.cashAtSale).toBeCloseTo(r.liability + r.tds, 5);
  });
});

describe("computeIndia115BBH — input hygiene", () => {
  it("treats negative proceeds and cost as zero", () => {
    const r = computeIndia115BBH({ proceeds: -100, costBasis: -50 });
    expect(r.gain).toBe(0);
    expect(r.tds).toBe(0);
    expect(r.liability).toBe(0);
  });
});
