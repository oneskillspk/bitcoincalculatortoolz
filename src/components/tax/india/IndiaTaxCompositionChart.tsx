import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  isTr: boolean;
}

const fmtInr0 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/**
 * India-only replacement for the flat effective-rate chart.
 *
 * The point is: 1% TDS is a *share of proceeds*, not gain. So on
 * low-margin sales (small gain vs large proceeds) TDS is a much bigger
 * slice of the total bill than on high-margin sales. That only shows up
 * if the scenarios vary the proceeds-to-gain ratio — which is what the
 * old version got wrong (constant ratio meant every bar looked identical).
 */
const SCENARIOS: {
  key: string;
  label: { en: string; tr: string };
  proceeds: number;
  cost: number;
}[] = [
  {
    key: "thin",
    label: { en: "Thin margin", tr: "Dar marj" },
    proceeds: 500_000,
    cost: 450_000, // gain 50k
  },
  {
    key: "mid",
    label: { en: "Balanced sale", tr: "Dengeli satış" },
    proceeds: 500_000,
    cost: 250_000, // gain 250k
  },
  {
    key: "fat",
    label: { en: "High margin", tr: "Yüksek marj" },
    proceeds: 500_000,
    cost: 50_000, // gain 450k
  },
  {
    key: "whale",
    label: { en: "Long-held whale", tr: "Uzun tutulan büyük satış" },
    proceeds: 2_000_000,
    cost: 100_000, // gain 1.9M
  },
];

export const IndiaTaxCompositionChart = ({ isTr }: Props) => {
  const pick = <T,>(o: { en: T; tr: T }) => (isTr ? o.tr : o.en);

  const rows = SCENARIOS.map((s) => {
    const gain = Math.max(0, s.proceeds - s.cost);
    const base = gain * 0.3;
    const cess = base * 0.04;
    const tds = s.proceeds * 0.01;
    const total = base + cess + tds;
    return { ...s, gain, base, cess, tds, total };
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
              ? "Vergi bileşimi — satış senaryosuna göre"
              : "Tax composition by sale scenario"}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {isTr
              ? "Toplam vergi üç bileşenden oluşur: §115BBH temel vergisi, %4 cess ve satış tutarı üzerinden %1 TDS. TDS satış üzerinden alındığı için dar marjlı satışlarda toplam faturanın çok daha büyük bir kısmını oluşturur."
              : "Your total India tax splits into three pieces: base §115BBH tax, 4% cess, and 1% TDS on proceeds. Because TDS is charged on proceeds — not gain — it dominates the bill on low-margin sales and shrinks to a rounding error on high-margin ones."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-xs">
            <LegendDot className="bg-primary" label={isTr ? "%30 temel" : "30% base"} />
            <LegendDot className="bg-primary/60" label={isTr ? "%4 cess" : "4% cess"} />
            <LegendDot className="bg-primary/30" label={isTr ? "%1 TDS" : "1% TDS"} />
          </div>

          <div className="space-y-5">
            {rows.map((r) => {
              const share = (n: number) => (r.total > 0 ? (n / r.total) * 100 : 0);
              const barWidth = maxTotal > 0 ? (r.total / maxTotal) * 100 : 0;
              const tdsShare = share(r.tds);
              return (
                <div key={r.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1.5 text-sm">
                    <span className="font-medium text-foreground">
                      {pick(r.label)}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {isTr ? "kazanç" : "gain"} {fmtInr0.format(r.gain)}
                      </span>
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {isTr ? "Toplam" : "Total"}{" "}
                      <span className="font-semibold text-foreground">
                        {fmtInr0.format(r.total)}
                      </span>
                      <span className="ml-2 text-xs">
                        · TDS {tdsShare.toFixed(tdsShare < 10 ? 1 : 0)}%
                      </span>
                    </span>
                  </div>
                  <div
                    className="flex h-6 w-full overflow-hidden rounded-md bg-muted/40"
                    role="img"
                    aria-label={`${pick(r.label)}: ${fmtInr0.format(r.total)} ${isTr ? "toplam vergi" : "total tax"}, TDS ${tdsShare.toFixed(0)}%`}
                  >
                    <div
                      className="flex h-full items-stretch"
                      style={{ width: `${Math.max(barWidth, 6)}%` }}
                    >
                      <div
                        className="bg-primary flex items-center justify-end pr-1.5 text-[10px] font-medium text-primary-foreground"
                        style={{ width: `${share(r.base)}%` }}
                        title={`Base ${fmtInr0.format(r.base)}`}
                      >
                        {share(r.base) > 14 ? `${share(r.base).toFixed(0)}%` : ""}
                      </div>
                      <div
                        className="bg-primary/60"
                        style={{ width: `${share(r.cess)}%` }}
                        title={`Cess ${fmtInr0.format(r.cess)}`}
                      />
                      <div
                        className="bg-primary/30 flex items-center justify-end pr-1.5 text-[10px] font-medium text-foreground"
                        style={{ width: `${share(r.tds)}%` }}
                        title={`TDS ${fmtInr0.format(r.tds)}`}
                      >
                        {share(r.tds) > 14 ? `${share(r.tds).toFixed(0)}%` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
            {isTr
              ? "Tüm senaryolar ₹5,00,000 satış varsayar (son satır hariç). Maliyet arttıkça kazanç düşer, ancak %1 TDS satış üzerinden sabit kalır — bu yüzden dar marjlı satışlarda TDS payı büyür."
              : "All but the last scenario share the same ₹5,00,000 in proceeds. As cost basis rises the gain (and 30% base tax) shrinks, but 1% TDS stays fixed on proceeds — so TDS crowds out the bill on thin-margin sales."}
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
