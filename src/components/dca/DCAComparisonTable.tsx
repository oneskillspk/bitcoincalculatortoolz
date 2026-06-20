import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from "@/components/retirement/SectionHeader";

export const DCAComparisonTable = () => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const rows = [
    { amount: "$50", y1: "$600", y3: "$1,800", y5: "$3,000", btc: "~0.035 BTC" },
    { amount: "$100", y1: "$1,200", y3: "$3,600", y5: "$6,000", btc: "~0.070 BTC" },
    { amount: "$250", y1: "$3,000", y3: "$9,000", y5: "$15,000", btc: "~0.175 BTC" },
    { amount: "$500", y1: "$6,000", y3: "$18,000", y5: "$30,000", btc: "~0.350 BTC" },
    { amount: "$1,000", y1: "$12,000", y3: "$36,000", y5: "$60,000", btc: "~0.700 BTC" },
  ];

  return (
    <section className="bg-muted/30 pt-10 pb-14 md:pt-12 md:pb-16 lg:pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow={tr ? 'Karşılaştırma' : 'Comparison'}
            title={tr ? 'Aylık Yatırım Miktarına Göre Bitcoin DCA Getirileri' : 'Bitcoin DCA Returns by Monthly Investment'}
            className="mb-8 md:mb-10"
            lead={tr
              ? 'Tutarlı aylık alımlar varsayımıyla farklı dönemler boyunca Bitcoin’e dolar maliyet ortalama yapmanın tarihsel getirileri.'
              : 'Historical returns for dollar-cost averaging into Bitcoin over different time periods, assuming consistent monthly purchases.'}
          />
          <ul className="sm:hidden space-y-3" aria-label={tr ? 'Aylık yatırıma göre Bitcoin DCA getirileri' : 'Bitcoin DCA returns by monthly investment'}>
            {rows.map((row) => (
              <li key={row.amount} className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                  {(tr ? 'Aylık Tutar' : 'Monthly Amount') + ' · ' + row.amount}
                </p>
                <dl className="divide-y divide-border/40">
                  {[
                    { label: tr ? '1 Yıllık Toplam Yatırım' : '1-Year Total Invested', value: row.y1, accent: false },
                    { label: tr ? '3 Yıllık Toplam Yatırım' : '3-Year Total Invested', value: row.y3, accent: false },
                    { label: tr ? '5 Yıllık Toplam Yatırım' : '5-Year Total Invested', value: row.y5, accent: false },
                    { label: tr ? '5 Yıllık Ort. Biriken BTC*' : '5-Year Avg. BTC Accumulated*', value: row.btc, accent: true },
                  ].map((col) => (
                    <div key={col.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <dt className="text-xs font-medium text-muted-foreground">{col.label}</dt>
                      <dd className={`text-sm font-mono tabular-nums text-right whitespace-nowrap ${col.accent ? 'text-primary' : 'text-foreground'}`}>{col.value}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
          <ScrollableTable className="hidden sm:block rounded-xl border border-border/50 bg-card" fadeFromClass="from-card" ariaLabel={tr ? 'Aylık yatırıma göre Bitcoin DCA getirileri' : 'Bitcoin DCA returns by monthly investment'}>
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="border-border/50 bg-muted/40 hover:bg-muted/40">
                  <TableHead className="sticky left-0 z-10 bg-muted/40 font-semibold text-xs uppercase tracking-wider text-foreground">{tr?'Aylık Tutar':'Monthly Amount'}</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right whitespace-nowrap">{tr?'1 Yıllık Toplam Yatırım':'1-Year Total Invested'}</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right whitespace-nowrap">{tr?'3 Yıllık Toplam Yatırım':'3-Year Total Invested'}</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right whitespace-nowrap">{tr?'5 Yıllık Toplam Yatırım':'5-Year Total Invested'}</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right whitespace-nowrap">{tr?'5 Yıllık Ort. Biriken BTC*':'5-Year Avg. BTC Accumulated*'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.amount} className="border-border/30">
                    <TableHead scope="row" className="sticky left-0 z-10 bg-card font-medium text-sm text-foreground text-left whitespace-nowrap h-auto">{row.amount}</TableHead>
                    <TableCell className="text-right text-sm font-mono tabular-nums text-foreground whitespace-nowrap">{row.y1}</TableCell>
                    <TableCell className="text-right text-sm font-mono tabular-nums text-foreground whitespace-nowrap">{row.y3}</TableCell>
                    <TableCell className="text-right text-sm font-mono tabular-nums text-foreground whitespace-nowrap">{row.y5}</TableCell>
                    <TableCell className="text-right text-sm font-mono tabular-nums text-primary whitespace-nowrap">{row.btc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableTable>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {tr
              ? '*Biriken BTC, tarihsel ortalama fiyatlara dayalı yaklaşık değerlerdir. Gerçek sonuçlar piyasa koşullarına göre değişir. Kesin tahminler için yukarıdaki hesaplayıcıyı kullanın.'
              : '*BTC accumulated is approximate based on historical average prices. Actual results vary by market conditions. Use the calculator above for precise projections.'}
          </p>
        </div>
      </div>
    </section>
  );
};
