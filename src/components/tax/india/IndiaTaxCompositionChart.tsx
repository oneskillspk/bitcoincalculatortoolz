import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  isTr: boolean;
}

const fmtInr0 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const GAIN_BUCKETS = [50_000, 500_000, 2_000_000, 10_000_000];

/**
 * India-only replacement for the (flat) effective-rate chart.
 * Instead of a boring flat line at 30%, we break the total tax into its
 * three components — base §115BBH tax, 4% cess, and 1% TDS on proceeds —
 * so the reader can *see* how each rule contributes at different gain sizes.
 *
 * Assumes proceeds = 1.5 × gain (illustrative). TDS = 1% of proceeds.
 */
export const IndiaTaxCompositionChart = ({ isTr }: Props) => {
  const rows = GAIN_BUCKETS.map((gain) => {
    const proceeds = gain * 1.5;
    const base = gain * 0.3;
    const cess = base * 0.04;
    const tds = proceeds * 0.01;
    const total = base + cess + tds;
    return { gain, proceeds, base, cess, tds, total };
  });
  const maxTotal = Math.max(...rows.map((r) => r.total));

  return (
    <section
      aria-labelledby="in-composition-heading"
      className="container mx-auto max-w-5xl px-6 py-12"
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle id="in-composition-heading" className="text-xl md:text-2xl">
            {isTr
              ? "Vergi bileşimi — kazanç büyüklüğüne göre"
              : "Tax composition by gain size"}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {isTr
              ? "Toplam vergi üç bileşenden oluşur: §115BBH temel vergisi, %4 cess ve satış tutarı üzerinden %1 TDS. TDS'nin payı daha küçük kazançlarda artar."
              : "Your total India tax splits into three pieces: base §115BBH tax, 4% cess, and 1% TDS on proceeds. TDS weighs more heavily on smaller gains."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-5 text-xs">
            <LegendDot className="bg-primary" label={isTr ? "%30 temel" : "30% base"} />
            <LegendDot className="bg-primary/60" label={isTr ? "%4 cess" : "4% cess"} />
            <LegendDot className="bg-primary/30" label={isTr ? "%1 TDS" : "1% TDS"} />
          </div>

          <div className="space-y-4">
            {rows.map((r) => {
              const pct = (n: number) => (n / maxTotal) * 100;
              const share = (n: number) => (n / r.total) * 100;
              return (
                <div key={r.gain}>
                  <div className="flex items-baseline justify-between mb-1.5 text-sm">
                    <span className="font-medium text-foreground">
                      {isTr ? "Kazanç" : "Gain"} {fmtInr0.format(r.gain)}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {isTr ? "Toplam" : "Total"}{" "}
                      <span className="font-semibold text-foreground">
                        {fmtInr0.format(r.total)}
                      </span>
                    </span>
                  </div>
                  <div
                    className="flex h-6 w-full overflow-hidden rounded-md bg-muted/40"
                    style={{ width: `${pct(r.total)}%`, minWidth: "40%" }}
                    role="img"
                    aria-label={`${isTr ? "Kazanç" : "Gain"} ${fmtInr0.format(r.gain)}: ${fmtInr0.format(r.total)} ${isTr ? "toplam vergi" : "total tax"}`}
                  >
                    <div className="bg-primary flex items-center justify-end pr-1.5 text-[10px] font-medium text-primary-foreground" style={{ width: `${share(r.base)}%` }}>
                      {share(r.base) > 12 ? `${share(r.base).toFixed(0)}%` : ""}
                    </div>
                    <div className="bg-primary/60 flex items-center justify-end pr-1.5 text-[10px] font-medium text-primary-foreground" style={{ width: `${share(r.cess)}%` }} />
                    <div className="bg-primary/30 flex items-center justify-end pr-1.5 text-[10px] font-medium text-foreground" style={{ width: `${share(r.tds)}%` }}>
                      {share(r.tds) > 12 ? `${share(r.tds).toFixed(0)}%` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
            {isTr
              ? "Örnekleme: satış = 1,5 × kazanç. TDS satış üzerinden alındığı için düşük kazançlarda toplam vergiye oranı büyür."
              : "Assumes proceeds = 1.5× gain for illustration. Because TDS is applied on proceeds, its share of the bill grows on smaller gains."}
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

const LegendDot = ({ className, label }: { className: string; label: string }) => (
  <span className="inline-flex items-center gap-2 text-muted-foreground">
    <span className={`inline-block h-3 w-3 rounded-sm ${className}`} aria-hidden />
    {label}
  </span>
);

export default IndiaTaxCompositionChart;
