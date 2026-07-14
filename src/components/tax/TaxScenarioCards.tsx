import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REGION_META, type RegionId } from "./regionMeta";
import { formatCurrencyForDisplay } from "@/utils/formatCurrency";

/** Pure tax calc duplicated from RegionalCryptoTaxCalculator so scenarios
 *  can compute without mounting the live UI. */
function computeTax(
  region: RegionId,
  proceeds: number,
  costBasis: number,
  holdingMonths: number,
  extra: number,
): number {
  const gain = Math.max(0, proceeds - costBasis);
  if (region === "in") {
    return gain * 0.3 + gain * 0.3 * 0.04 + proceeds * 0.01;
  }
  if (region === "uk") {
    const allowance = 3_000;
    const taxable = Math.max(0, gain - allowance);
    const basicHead = Math.max(0, 50_270 - Math.max(12_570, extra));
    const basicSlice = Math.min(taxable, basicHead);
    return basicSlice * 0.18 + (taxable - basicSlice) * 0.24;
  }
  // de
  if (holdingMonths > 12) return 0;
  const taxable = Math.max(0, gain - 1_000);
  return taxable * (Math.max(0, Math.min(45, extra)) / 100);
}

interface Scenario {
  key: string;
  title: { en: string; tr: string };
  proceeds: number;
  cost: number;
  hold: number;
  /** UK: other income, DE: marginal %, IN: ignored */
  extra: number;
}

const SCENARIOS: Record<RegionId, Scenario[]> = {
  in: [
    {
      key: "small",
      title: {
        en: "Small retail seller",
        tr: "Küçük perakende satıcı",
      },
      proceeds: 200_000,
      cost: 150_000,
      hold: 6,
      extra: 0,
    },
    {
      key: "mid",
      title: { en: "Mid-size profit taker", tr: "Orta ölçek kâr realizasyonu" },
      proceeds: 1_500_000,
      cost: 800_000,
      hold: 18,
      extra: 0,
    },
    {
      key: "whale",
      title: { en: "High-value disposal", tr: "Yüksek tutarlı satış" },
      proceeds: 10_000_000,
      cost: 3_000_000,
      hold: 36,
      extra: 0,
    },
  ],
  uk: [
    {
      key: "small",
      title: { en: "Basic-rate part-time trader", tr: "Yarı zamanlı temel dilim" },
      proceeds: 12_000,
      cost: 6_000,
      hold: 14,
      extra: 25_000,
    },
    {
      key: "mid",
      title: { en: "Higher-rate professional", tr: "Üst dilim profesyonel" },
      proceeds: 60_000,
      cost: 20_000,
      hold: 24,
      extra: 70_000,
    },
    {
      key: "whale",
      title: { en: "Whale full exit", tr: "Whale tam çıkış" },
      proceeds: 500_000,
      cost: 100_000,
      hold: 60,
      extra: 80_000,
    },
  ],
  de: [
    {
      key: "small",
      title: { en: "Held under 1 yr — taxable", tr: "1 yıl altı — vergilendirilebilir" },
      proceeds: 8_000,
      cost: 3_000,
      hold: 9,
      extra: 30,
    },
    {
      key: "mid",
      title: { en: "Held over 1 yr — tax-free", tr: "1 yıl üstü — vergisiz" },
      proceeds: 50_000,
      cost: 12_000,
      hold: 15,
      extra: 35,
    },
    {
      key: "whale",
      title: { en: "Whale 5-yr HODL — tax-free", tr: "Whale 5 yıllık HODL — vergisiz" },
      proceeds: 600_000,
      cost: 60_000,
      hold: 60,
      extra: 42,
    },
  ],
};

function fmt(n: number, currency: string) {
  return formatCurrencyForDisplay(n, currency, { decimals: 0, fullDecimals: 0 }).full;
}

interface Props {
  region: RegionId;
  isTr: boolean;
}

export const TaxScenarioCards = ({ region, isTr }: Props) => {
  const meta = REGION_META[region];
  const pick = <T,>(o: { en: T; tr: T }): T => (isTr ? o.tr : o.en);

  return (
    <section
      aria-labelledby="tax-scenarios-heading"
      className="container mx-auto max-w-5xl px-6 py-12"
    >
      <h2
        id="tax-scenarios-heading"
        className="mb-6 text-2xl md:text-3xl font-semibold text-foreground"
      >
        {isTr ? "Worked örnekler" : "Worked examples"}
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {SCENARIOS[region].map((s) => {
          const gain = s.proceeds - s.cost;
          const tax = computeTax(region, s.proceeds, s.cost, s.hold, s.extra);
          const effective = gain > 0 ? (tax / gain) * 100 : 0;
          return (
            <Card key={s.key} className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{pick(s.title)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label={isTr ? "Hasılat" : "Proceeds"} value={fmt(s.proceeds, meta.currency)} />
                <Row label={isTr ? "Maliyet" : "Cost basis"} value={fmt(s.cost, meta.currency)} />
                <Row
                  label={isTr ? "Tutma" : "Holding"}
                  value={`${s.hold} ${isTr ? "ay" : "mo"}`}
                />
                <div className="my-2 border-t border-border/60" />
                <Row
                  label={isTr ? "Tahmini vergi" : "Estimated tax"}
                  value={fmt(tax, meta.currency)}
                  emphasis
                />
                <Row
                  label={isTr ? "Efektif oran" : "Effective rate"}
                  value={`${effective.toFixed(1)}%`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          emphasis ? "font-semibold text-foreground" : "text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default TaxScenarioCards;
