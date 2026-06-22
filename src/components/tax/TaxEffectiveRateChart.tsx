import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REGION_META, type RegionId } from "./regionMeta";

interface Props {
  region: RegionId;
  isTr: boolean;
}

/**
 * Effective tax-rate curve across a sweep of gain sizes — visualizes
 * how allowances, cess, and bands change the effective % the user pays.
 */
export const TaxEffectiveRateChart = ({ region, isTr }: Props) => {
  const m = REGION_META[region];

  const data = useMemo(() => {
    const gains =
      region === "in"
        ? [10_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000]
        : region === "uk"
          ? [2_000, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000]
          : [500, 1_000, 2_000, 5_000, 10_000, 25_000, 50_000];

    return gains.map((g) => {
      let tax = 0;
      if (region === "in") {
        // mirror computeTax (proceeds ≈ cost + gain → use proceeds=gain*3 for TDS realism)
        const proceeds = g * 2;
        tax = g * 0.3 + g * 0.3 * 0.04 + proceeds * 0.01;
      } else if (region === "uk") {
        const taxable = Math.max(0, g - 3_000);
        // assume higher-rate filer for the curve (worst case)
        tax = taxable * 0.24;
      } else {
        // DE: <1-year scenario at 30% marginal
        const taxable = Math.max(0, g - 1_000);
        tax = taxable * 0.3;
      }
      const eff = g > 0 ? (tax / g) * 100 : 0;
      return {
        gain: g,
        effective: Number(eff.toFixed(1)),
        label: new Intl.NumberFormat("en", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(g),
      };
    });
  }, [region]);

  return (
    <section
      aria-labelledby="tax-chart-heading"
      className="container mx-auto max-w-5xl px-6 py-12"
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle id="tax-chart-heading" className="text-xl md:text-2xl">
            {isTr
              ? `Efektif vergi oranı — kazanca göre (${m.currency})`
              : `Effective tax rate by gain size (${m.currency})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/40"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  unit="%"
                  className="text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v}%`, isTr ? "Efektif" : "Effective"]}
                  labelFormatter={(l) =>
                    isTr ? `Kazanç: ${m.symbol}${l}` : `Gain: ${m.symbol}${l}`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="effective"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {isTr
              ? "Allowance ve cess/TDS etkileri nedeniyle küçük kazançlar farklı bir efektif oran taşır."
              : "Allowance and cess/TDS effects mean small gains carry a different effective rate than large ones."}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default TaxEffectiveRateChart;
