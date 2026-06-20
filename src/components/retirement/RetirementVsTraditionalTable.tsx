import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "./SectionHeader";

/**
 * Bitcoin retirement vs. traditional 60/40 stocks-and-bonds portfolio.
 *
 * Figures are illustrative only — they bracket commonly-cited long-term
 * expected returns for each asset mix and the audit-disclosed Bitcoin
 * CAGR range (see MethodologyBlock). Both columns assume the same
 * $60,000/yr target income at a 4% safe withdrawal rate.
 */
const ROWS_EN = [
  {
    metric: "Target annual income (4% SWR)",
    btc: "$60,000",
    sixtyForty: "$60,000",
  },
  {
    metric: "Required portfolio at retirement",
    btc: "$1.5M",
    sixtyForty: "$1.5M",
  },
  {
    metric: "Assumed long-run growth (CAGR)",
    btc: "15–25% (base/bull)",
    sixtyForty: "~7% (historical 60/40)",
  },
  {
    metric: "Years to $1.5M from $0 @ $1,000/mo DCA",
    btc: "~16–22 yrs",
    sixtyForty: "~33 yrs",
  },
  {
    metric: "Historical max drawdown",
    btc: "−75 to −85%",
    sixtyForty: "−30 to −35%",
  },
  {
    metric: "Sequence-of-returns risk",
    btc: "High — needs cash buffer / variable SWR",
    sixtyForty: "Moderate — 4% rule designed for it",
  },
  {
    metric: "Income source flexibility",
    btc: "Self-custody, global, 24/7 liquid",
    sixtyForty: "Brokerage / IRA / 401(k) wrappers",
  },
];

const ROWS_TR = [
  {
    metric: "Hedef yıllık gelir (%4 SWR)",
    btc: "$60.000",
    sixtyForty: "$60.000",
  },
  {
    metric: "Emeklilikte gerekli portföy",
    btc: "$1,5M",
    sixtyForty: "$1,5M",
  },
  {
    metric: "Varsayılan uzun vadeli büyüme (CAGR)",
    btc: "%15–25 (temel/boğa)",
    sixtyForty: "~%7 (geçmiş 60/40)",
  },
  {
    metric: "$0'dan $1,5M'a — aylık $1.000 DCA ile yıl",
    btc: "~16–22 yıl",
    sixtyForty: "~33 yıl",
  },
  {
    metric: "Tarihsel maks. düşüş",
    btc: "−%75 ile −%85",
    sixtyForty: "−%30 ile −%35",
  },
  {
    metric: "Sıralı getiri riski",
    btc: "Yüksek — nakit tampon / değişken SWR gerekir",
    sixtyForty: "Orta — %4 kuralı bunun için tasarlandı",
  },
  {
    metric: "Gelir kaynağı esnekliği",
    btc: "Self-custody, küresel, 7/24 likit",
    sixtyForty: "Aracı kurum / IRA / 401(k) sarmalı",
  },
];

export const RetirementVsTraditionalTable = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const rows = tr ? ROWS_TR : ROWS_EN;

  return (
    <section
      data-currency-exempt="true"
      className="container mx-auto px-6 max-w-5xl py-16 md:py-20"
      aria-labelledby="retirement-vs-trad-heading"
    >
      <SectionHeader
        id="retirement-vs-trad-heading"
        eyebrow={tr ? 'Karşılaştırma' : 'Comparison'}
        title={tr ? 'Bitcoin Emekliliği vs. 60/40 Portföy' : 'Bitcoin Retirement vs. 60/40 Portfolio'}
        lead={tr
          ? 'Aynı $60.000/yıl hedef gelirde, Bitcoin ağırlıklı plan geleneksel %60/%40 karışıma karşı nasıl performans gösterir.'
          : 'Targeting the same $60,000/yr income, how a Bitcoin-led plan compares to a traditional 60/40 mix.'}
      />

      <ScrollableTable
        className="rounded-xl border border-border/50 bg-card"
        ariaLabel={tr ? 'Bitcoin emekliliği vs. 60/40 portföy karşılaştırması' : 'Bitcoin retirement vs. 60/40 portfolio comparison'}
      >
        <table className="w-full text-sm min-w-[640px]">
          <caption className="sr-only">{tr ? 'Bitcoin emekliliği ve geleneksel 60/40 portföy karşılaştırması.' : 'Side-by-side comparison of a Bitcoin-led retirement vs. a traditional 60/40 portfolio.'}</caption>
          <thead>
            <tr className="bg-muted/40 border-b border-border/50">
              <th scope="col" className="text-left p-3 font-semibold text-foreground text-xs uppercase tracking-wider">
                {tr ? 'Metrik' : 'Metric'}
              </th>
              <th scope="col" className="text-left p-3 font-semibold text-foreground text-xs uppercase tracking-wider">
                {tr ? 'Bitcoin Emekliliği' : 'Bitcoin Retirement'}
              </th>
              <th scope="col" className="text-left p-3 font-semibold text-foreground text-xs uppercase tracking-wider">
                {tr ? 'Geleneksel 60/40' : 'Traditional 60/40'}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.metric} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                <th scope="row" className="p-3 font-medium text-foreground text-left">{row.metric}</th>
                <td className="p-3 text-foreground/90 tabular-nums">{row.btc}</td>
                <td className="p-3 text-foreground/90 tabular-nums">{row.sixtyForty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>

      <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
        {tr
          ? 'Rakamlar yalnızca açıklayıcıdır, tahmin değildir. Geçmiş getiriler geleceği garanti etmez — varsayımlar ve kaynaklar için aşağıdaki yöntem bölümüne bakın.'
          : 'Figures are illustrative, not predictive. Past performance does not guarantee future results — see the methodology section below for assumptions and sources.'}
      </p>
    </section>
  );
};
