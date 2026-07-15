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

// Values computed from the calculator's historical BTC dataset
// (`public/data/bitcoin_prices_v1.json`, last updated 2026-07-09). $10,000
// stake per strategy. BTC lump = single buy at start-of-window close. BTC DCA
// = equal monthly buys over the window. S&P DCA = same monthly contributions
// growing at 10% annualized (long-run average). 2021→2026 window ends
// 2026-07-15. Regenerate on each dataset refresh.
const ROWS: Row[] = [
  { window: '2015 → 2020', btcLump: '$224,000', btcDca: '$91,700', spDca: '$13,000', best: 'btc-lump' },
  { window: '2017 → 2022', btcLump: '$476,100', btcDca: '$88,700', spDca: '$13,000', best: 'btc-lump' },
  { window: '2018 → 2023', btcLump: '$11,900', btcDca: '$15,200', spDca: '$13,000', best: 'btc-dca' },
  { window: '2019 → 2024', btcLump: '$112,200', btcDca: '$32,000', spDca: '$13,000', best: 'btc-lump' },
  { window: '2020 → 2025', btcLump: '$131,400', btcDca: '$40,500', spDca: '$13,000', best: 'btc-lump' },
  { window: '2021 → 2026', btcLump: '$20,100', btcDca: '$14,100', spDca: '$13,300', best: 'btc-lump' },
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
          ? 'Her strateji için $10.000 sermaye. BTC Toplu = pencere başında tek alım. BTC DCA = pencere boyunca eşit aylık alımlar (toplam $10.000). S&P DCA = aynı aylık katkılar, yıllık %10 bileşik büyüme varsayımı (uzun vadeli tarihsel ortalama). Nihai değerler pencere sonundadır (2021→2026 penceresi 15 Temmuz 2026\'da sona erer).'
          : 'Same $10,000 stake per strategy. BTC Lump = single buy at the start-of-window close. BTC DCA = equal monthly buys totaling $10,000 across the window. S&P DCA = the same monthly contributions compounded at 10%/yr (long-run historical average). Final values are at window end (the 2021→2026 window ends July 15, 2026).'}
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
          ? 'Aynı $10.000 sermaye, aynı aylık DCA çizelgesi — tek fark varlık. BTC değerleri hesaplayıcının veri setinden (`bitcoin_prices_v1.json`) hesaplanır; S&P DCA sabit %10/yıl bileşik oranla modellenir (gerçek endeks dönüşleri değil). Son gözden geçirme: Temmuz 2026.'
          : 'Same $10,000 stake, same monthly DCA schedule — only the asset differs. BTC values are computed from the calculator\'s dataset (`bitcoin_prices_v1.json`); the S&P DCA column is modeled at a flat 10%/yr compounding rate (not actual index returns). Last reviewed: July 2026.'}
      </p>
    </div>
  );
};
