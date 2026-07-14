import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RegionId } from "./regionMeta";

interface Row {
  id: RegionId | "us";
  flag: string;
  jurisdiction: { en: string; tr: string };
  taxYear: string;
  rate: { en: string; tr: string };
  allowance: { en: string; tr: string };
  longTermRule: { en: string; tr: string };
}

const ROWS: Row[] = [
  {
    id: "in",
    flag: "IN",
    jurisdiction: { en: "India", tr: "Hindistan" },
    taxYear: "FY 2026-27",
    rate: { en: "30% flat + 4% cess", tr: "%30 sabit + %4 cess" },
    allowance: { en: "None", tr: "Yok" },
    longTermRule: {
      en: "No benefit — flat regardless of holding",
      tr: "Avantaj yok — tutma süresinden bağımsız sabit",
    },
  },
  {
    id: "uk",
    flag: "UK",
    jurisdiction: { en: "United Kingdom", tr: "Birleşik Krallık" },
    taxYear: "2026/27",
    rate: { en: "18% basic / 24% higher", tr: "%18 temel / %24 üst" },
    allowance: { en: "£3,000 / year", tr: "£3.000 / yıl" },
    longTermRule: {
      en: "Same rate — pooled cost basis (Section 104)",
      tr: "Aynı oran — havuzlanmış maliyet (Section 104)",
    },
  },
  {
    id: "de",
    flag: "DE",
    jurisdiction: { en: "Germany", tr: "Almanya" },
    taxYear: "2026",
    rate: { en: "Marginal income rate", tr: "Marjinal gelir oranı" },
    allowance: { en: "€1,000 / year", tr: "€1.000 / yıl" },
    longTermRule: {
      en: "0% after >12 months (Section 23 EStG)",
      tr: ">12 ay sonra %0 (Section 23 EStG)",
    },
  },
  {
    id: "us",
    flag: "US",
    jurisdiction: { en: "United States", tr: "Amerika Birleşik Devletleri" },
    taxYear: "2026",
    rate: {
      en: "10–37% short / 0/15/20% long",
      tr: "%10–37 kısa / %0/15/20 uzun",
    },
    allowance: { en: "Standard deduction only", tr: "Yalnızca standart indirim" },
    longTermRule: {
      en: "Preferential long-term rate after 1 yr",
      tr: "1 yıl sonra avantajlı uzun vadeli oran",
    },
  },
];

interface Props {
  highlight: RegionId;
  isTr: boolean;
}

export const TaxComparisonTable = ({ highlight, isTr }: Props) => {
  const pick = <T,>(o: { en: T; tr: T }): T => (isTr ? o.tr : o.en);

  return (
    <section
      aria-labelledby="tax-compare-heading"
      className="container mx-auto max-w-5xl px-6 py-12"
    >
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle
            id="tax-compare-heading"
            className="text-xl md:text-2xl"
          >
            {isTr
              ? "Bitcoin vergisi — ülke karşılaştırması"
              : "Bitcoin tax — country comparison"}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0 sm:p-6">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  {isTr ? "Ülke" : "Jurisdiction"}
                </th>
                <th className="px-4 py-3 font-medium">
                  {isTr ? "Vergi yılı" : "Tax year"}
                </th>
                <th className="px-4 py-3 font-medium">
                  {isTr ? "Oran" : "Headline rate"}
                </th>
                <th className="px-4 py-3 font-medium">
                  {isTr ? "Muafiyet" : "Allowance"}
                </th>
                <th className="px-4 py-3 font-medium">
                  {isTr ? "Uzun vadeli kural" : "Long-term rule"}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => {
                const active = r.id === highlight;
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-b border-border/40 last:border-0",
                      active && "bg-primary/5",
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      <span className="mr-2 inline-flex items-center justify-center rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-foreground align-middle">
                        {r.flag}
                      </span>
                      <span className="align-middle whitespace-nowrap">{pick(r.jurisdiction)}</span>
                      {active ? (
                        <span className="ml-2 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary whitespace-nowrap align-middle">
                          {isTr ? "Bu sayfa" : "This page"}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.taxYear}</td>
                    <td className="px-4 py-3 text-foreground">{pick(r.rate)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {pick(r.allowance)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {pick(r.longTermRule)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
};

export default TaxComparisonTable;
