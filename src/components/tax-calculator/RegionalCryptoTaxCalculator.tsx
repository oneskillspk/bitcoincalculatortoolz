import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrencyForDisplay } from "@/utils/formatCurrency";
import { computeIndia115BBH } from "@/components/tax/india/india115bbh";

/**
 * Shared lightweight calculator powering the India / UK CGT / Germany
 * regional Bitcoin tax pages (P2 item 11). Keeps the UX consistent and
 * lets each page own only its copy, FAQs, and JSON-LD.
 *
 * Each region exposes a single `compute()` returning the tax owed and a
 * one-line rule summary the results card can quote. All formulas are
 * pure functions of (proceeds, costBasis, holdingMonths, extra).
 */

export type RegionId = "in" | "uk" | "de";

export interface RegionConfig {
  id: RegionId;
  currency: string; // ISO 4217 — display only.
  symbol: string;
  /** Optional extra numeric input (e.g. UK other gains, DE marginal rate). */
  extra?: { key: string; label: string; suffix?: string; defaultValue: number };
  /** Pure tax calculation. Returns { tax, taxableBase, rule, ... }. */
  compute: (input: {
    proceeds: number;
    costBasis: number;
    holdingMonths: number;
    extra: number;
  }) => {
    tax: number;
    taxableBase: number;
    rule: string;
    /** Optional prepaid/withheld amount that is creditable against `tax` (e.g. India §194S TDS). */
    withheld?: number;
    withheldLabel?: string;
  };
}

const REGIONS: Record<RegionId, RegionConfig> = {
  in: {
    id: "in",
    currency: "INR",
    symbol: "₹",
    compute: ({ proceeds, costBasis }) => {
      // India §115BBH (Finance Act 2022) — math lives in a shared pure
      // helper so it stays in lockstep with the TDS reclaim panel + tests.
      // §194S TDS is withheld on proceeds and is *creditable* against the
      // §115BBH liability, so it is surfaced separately as `withheld`.
      const r = computeIndia115BBH({ proceeds, costBasis });
      return {
        tax: r.liability,
        taxableBase: r.gain,
        withheld: r.tds,
        withheldLabel: "1% TDS withheld (creditable)",
        rule: "Section 115BBH tax is 30% flat + 4% cess = 31.2% of gain. 1% TDS is withheld on proceeds and credited against this liability. Losses cannot offset other income.",
      };
    },
  },
  uk: {
    id: "uk",
    currency: "GBP",
    symbol: "£",
    extra: {
      key: "otherTaxableIncome",
      label: "Other taxable income (this tax year)",
      suffix: "£",
      defaultValue: 30_000,
    },
    compute: ({ proceeds, costBasis, extra }) => {
      // UK CGT 2026/27: £3,000 annual exempt amount (unchanged from prior year).
      // Rate: 18% if total income+gain fits inside basic-rate band (£50,270, frozen
      // until 2028), else 24%. Source: HMRC Capital Gains Tax rates.
      const gain = Math.max(0, proceeds - costBasis);
      const allowance = 3_000;
      const taxable = Math.max(0, gain - allowance);
      const basicBandTop = 50_270;
      const personalAllowance = 12_570;
      const basicHeadroom = Math.max(
        0,
        basicBandTop - Math.max(personalAllowance, extra),
      );
      const basicSlice = Math.min(taxable, basicHeadroom);
      const higherSlice = taxable - basicSlice;
      const tax = basicSlice * 0.18 + higherSlice * 0.24;
      return {
        tax,
        taxableBase: taxable,
        rule: "£3,000 annual CGT allowance. 18% in basic band, 24% above (2026/27).",
      };
    },
  },
  de: {
    id: "de",
    currency: "EUR",
    symbol: "€",
    extra: {
      key: "marginalRate",
      label: "Your marginal income-tax rate (%)",
      defaultValue: 30,
    },
    compute: ({ proceeds, costBasis, holdingMonths, extra }) => {
      // Germany §23 EStG: BTC held >12 months → tax-free. Within 12 months,
      // gains taxed at your marginal income-tax rate; €1,000/year exemption.
      const gain = Math.max(0, proceeds - costBasis);
      if (holdingMonths > 12) {
        return {
          tax: 0,
          taxableBase: 0,
          rule: "Held >12 months — tax-free under Section 23 EStG (private sale).",
        };
      }
      const exemption = 1_000;
      const taxable = Math.max(0, gain - exemption);
      const rate = Math.max(0, Math.min(45, extra)) / 100;
      return {
        tax: taxable * rate,
        taxableBase: taxable,
        rule: "Held ≤12 months — gain taxed at your marginal rate after €1,000 exemption.",
      };
    },
  },
};

function fmt(value: number, currency: string) {
  if (!Number.isFinite(value)) return "—";
  return formatCurrencyForDisplay(value, currency, { decimals: 0, fullDecimals: 0 }).full;
}

interface Props {
  region: RegionId;
}

export const RegionalCryptoTaxCalculator = ({ region }: Props) => {
  const cfg = REGIONS[region];
  const [proceeds, setProceeds] = useState(50_000);
  const [costBasis, setCostBasis] = useState(20_000);
  const [holdingMonths, setHoldingMonths] = useState(18);
  const [extra, setExtra] = useState(cfg.extra?.defaultValue ?? 0);

  const result = useMemo(
    () => cfg.compute({ proceeds, costBasis, holdingMonths, extra }),
    [cfg, proceeds, costBasis, holdingMonths, extra],
  );

  const effective =
    result.taxableBase > 0 ? (result.tax / result.taxableBase) * 100 : 0;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-xl">Estimate your tax</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <p id="calc-currency-hint" className="sr-only">
            {`Enter amount in ${cfg.currency} (${cfg.symbol}).`}
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="proceeds">Sale proceeds ({cfg.symbol})</Label>
            <Input
              id="proceeds"
              type="number"
              inputMode="decimal"
              min={0}
              value={proceeds}
              aria-describedby="calc-currency-hint"
              onChange={(e) => setProceeds(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cost">Cost basis ({cfg.symbol})</Label>
            <Input
              id="cost"
              type="number"
              inputMode="decimal"
              min={0}
              value={costBasis}
              aria-describedby="calc-currency-hint"
              onChange={(e) => setCostBasis(Number(e.target.value) || 0)}
            />
          </div>
          {region !== "in" ? (
            <div className="space-y-1.5">
              <Label htmlFor="hold">Holding period (months)</Label>
              <Select
                value={String(holdingMonths)}
                onValueChange={(v) => setHoldingMonths(Number(v))}
              >
                <SelectTrigger id="hold" aria-label="Holding period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 6, 11, 12, 13, 18, 24, 36].map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m} {m === 1 ? "month" : "months"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Holding period does not affect India tax — Section 115BBH applies a flat 30% regardless of how long you held.
            </p>
          )}
          {cfg.extra ? (
            <div className="space-y-1.5">
              <Label htmlFor="extra">{cfg.extra.label}</Label>
              <Input
                id="extra"
                type="number"
                inputMode="decimal"
                min={0}
                value={extra}
                aria-describedby="calc-currency-hint"
                onChange={(e) => setExtra(Number(e.target.value) || 0)}
              />
            </div>
          ) : null}
        </div>


        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/30 p-5">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Estimated tax
            </div>
            <div className="text-3xl font-semibold text-foreground">
              {fmt(result.tax, cfg.currency)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Taxable base</div>
              <div className="font-medium">
                {fmt(result.taxableBase, cfg.currency)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Effective rate</div>
              <div className="font-medium">{effective.toFixed(1)}%</div>
            </div>
          </div>
          {result.withheld !== undefined && result.withheld > 0 ? (
            <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {result.withheldLabel ?? "Withheld (creditable)"}
              </div>
              <div className="font-medium tabular-nums">
                {fmt(result.withheld, cfg.currency)}
              </div>
              <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
                Deducted by the exchange and credited against your tax bill — not extra tax.
              </div>
            </div>
          ) : null}
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.rule} Estimate only — consult a qualified tax advisor for
            filing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalCryptoTaxCalculator;
