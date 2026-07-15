import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "./SectionHeader";

interface Row {
  window: string;
  btcLump: string;
  btcDca: string;
  spDca: string;
  best: 'btc-lump' | 'btc-dca' | 'sp';
}

const ROWS: Row[] = [
  { window: '2015 → 2020', btcLump: '$212,000', btcDca: '$95,000', spDca: '$14,200', best: 'btc-lump' },
  { window: '2017 → 2022', btcLump: '$47,000', btcDca: '$68,000', spDca: '$14,900', best: 'btc-dca' },
  { window: '2018 → 2023', btcLump: '$74,000', btcDca: '$54,000', spDca: '$15,800', best: 'btc-lump' },
  { window: '2019 → 2024', btcLump: '$182,000', btcDca: '$118,000', spDca: '$17,400', best: 'btc-lump' },
  { window: '2020 → 2025', btcLump: '$148,000', btcDca: '$103,000', spDca: '$18,900', best: 'btc-lump' },
];

export const LumpSumVsDcaVsTradTable = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const bestLabel = (b: Row['best']) =>
    b === 'btc-lump' ? (tr ? 'BTC Toplu' : 'BTC Lump')
    : b === 'btc-dca' ? 'BTC DCA'
    : 'S&P DCA';

  return (
    <div className="max-w-4xl mx-auto pt-14 md:pt-16">
      <SectionHeader
        eyebrow={tr ? 'Karşılaştırma' : 'Comparison'}
        title={tr ? 'Bitcoin Stratejileri vs Geleneksel S&P 500 DCA' : 'Bitcoin Strategies vs Traditional S&P 500 DCA'}
        lead={tr
          ? '$10.000\'lık 5 yıllık pencerelerde her strateji için nihai portföy değeri (aylık DCA varsayımı).'
          : 'Final portfolio value for a $10,000 stake across 5-year windows (monthly DCA where applicable).'}
      />

      {/* Mobile */}
      <ul className="sm:hidden space-y-3" aria-label={tr ? 'BTC vs geleneksel tablo' : 'BTC vs traditional table'}>
        {ROWS.map((r) => (
          <li key={r.window} className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">{r.window}</p>
              <span className="text-xs font-semibold text-primary">{bestLabel(r.best)}</span>
            </div>
            <dl className="divide-y divide-border/40 text-sm">
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">{tr ? 'BTC Toplu' : 'BTC Lump'}</dt>
                <dd className="font-mono tabular-nums text-foreground">{r.btcLump}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">BTC DCA</dt>
                <dd className="font-mono tabular-nums text-foreground">{r.btcDca}</dd>
              </div>
              <div className="flex items-center justify-between py-2 last:pb-0">
                <dt className="text-muted-foreground">S&P DCA</dt>
                <dd className="font-mono tabular-nums text-foreground">{r.spDca}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop */}
      <ScrollableTable
        className="hidden sm:block rounded-xl border border-border/50 bg-card"
        fadeFromClass="from-card"
        ariaLabel={tr ? 'BTC vs geleneksel tablo' : 'BTC vs traditional table'}
      >
        <Table className="min-w-[640px]">
          <caption className="sr-only">
            {tr ? 'BTC Toplu, BTC DCA ve S&P 500 DCA pencere karşılaştırması.' : 'BTC lump sum, BTC DCA, and S&P 500 DCA window comparison.'}
          </caption>
          <TableHeader>
            <TableRow className="border-border/50 bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground">
                {tr ? 'Pencere' : 'Window'}
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right">
                {tr ? 'BTC Toplu' : 'BTC Lump'}
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right">
                BTC DCA
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right">
                S&amp;P DCA
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right">
                {tr ? 'En İyi' : 'Best'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((r) => (
              <TableRow key={r.window} className="border-border/30">
                <TableCell className="font-medium text-foreground whitespace-nowrap">{r.window}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-foreground">{r.btcLump}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-foreground">{r.btcDca}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-foreground">{r.spDca}</TableCell>
                <TableCell className="text-right font-semibold text-primary">{bestLabel(r.best)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollableTable>

      <p className="text-xs text-muted-foreground mt-4 text-center max-w-2xl mx-auto">
        {tr
          ? 'İllüstratif rakamlar — tam sonuçlar için yukarıdaki hesaplayıcıyı kullanın. S&P 500 varsayılan ortalama yıllık ~%10 getiri.'
          : 'Illustrative figures — use the calculator above for exact backtests. S&P 500 assumes ~10% average annual return.'}
      </p>
    </div>
  );
};
