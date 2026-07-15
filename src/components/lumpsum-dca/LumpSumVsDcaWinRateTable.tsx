import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "./SectionHeader";

interface Row {
  year: string;
  phase: { en: string; tr: string };
  lump: string;
  dca: string;
  winner: 'lump' | 'dca';
  edge: string;
}

const ROWS: Row[] = [
  { year: '2017', phase: { en: 'Bull peak start', tr: 'Boğa zirvesi başlangıcı' }, lump: '$110,000', dca: '$78,000', winner: 'lump', edge: '+41%' },
  { year: '2018', phase: { en: 'Bear market start', tr: 'Ayı piyasası başlangıcı' }, lump: '$73,000', dca: '$96,000', winner: 'dca', edge: '+32%' },
  { year: '2019', phase: { en: 'Recovery', tr: 'Toparlanma' }, lump: '$181,000', dca: '$142,000', winner: 'lump', edge: '+27%' },
  { year: '2020', phase: { en: 'Pre-halving', tr: 'Halving öncesi' }, lump: '$148,000', dca: '$98,000', winner: 'lump', edge: '+51%' },
  { year: '2021', phase: { en: 'Bull peak', tr: 'Boğa zirvesi' }, lump: '$36,000', dca: '$58,000', winner: 'dca', edge: '+61%' },
  { year: '2022', phase: { en: 'Bear bottom', tr: 'Ayı dibi' }, lump: '$53,000', dca: '$72,000', winner: 'dca', edge: '+36%' },
  { year: '2023', phase: { en: 'Early bull', tr: 'Erken boğa' }, lump: '$62,000', dca: '$48,000', winner: 'lump', edge: '+29%' },
  { year: '2024', phase: { en: 'Halving year', tr: 'Halving yılı' }, lump: '$24,000', dca: '$20,500', winner: 'lump', edge: '+17%' },
];

export const LumpSumVsDcaWinRateTable = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const winnerLabel = (w: Row['winner']) =>
    w === 'lump' ? (tr ? 'Toplu Yatırım' : 'Lump Sum') : 'DCA';

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader
        eyebrow={tr ? 'Kazanma Oranları' : 'Win Rates'}
        title={tr ? 'Toplu Yatırım vs 12 Aylık DCA: Tarihsel Sonuçlar' : 'Lump Sum vs 12-Month DCA: Historical Results'}
        lead={tr
          ? 'Her yılın başında yatırılan $10.000, 2025 sonuna kadar tutuldu — piyasa aşamasına göre kazananı görün.'
          : '$10,000 invested at the start of each year, held until end of 2025 — see which strategy won by market phase.'}
      />

      {/* Mobile stacked cards */}
      <ul className="sm:hidden space-y-3" aria-label={tr ? 'Kazanma oranları tablosu' : 'Win rates table'}>
        {ROWS.map((r) => (
          <li key={r.year} className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">{r.year}</p>
              <span className={`text-xs font-semibold ${r.winner === 'lump' ? 'text-primary' : 'text-success'}`}>
                {winnerLabel(r.winner)} · {r.edge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{r.phase[tr ? 'tr' : 'en']}</p>
            <dl className="divide-y divide-border/40 text-sm">
              <div className="flex items-center justify-between py-2">
                <dt className="text-muted-foreground">{tr ? 'Toplu' : 'Lump Sum'}</dt>
                <dd className="font-mono tabular-nums text-foreground">{r.lump}</dd>
              </div>
              <div className="flex items-center justify-between py-2 last:pb-0">
                <dt className="text-muted-foreground">DCA</dt>
                <dd className="font-mono tabular-nums text-foreground">{r.dca}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <ScrollableTable
        className="hidden sm:block rounded-xl border border-border/50 bg-card"
        fadeFromClass="from-card"
        ariaLabel={tr ? 'Kazanma oranları tablosu' : 'Win rates table'}
      >
        <Table className="min-w-[640px]">
          <caption className="sr-only">
            {tr ? 'Yıllara göre toplu yatırım vs 12 aylık DCA sonuçları.' : 'Lump sum vs 12-month DCA results by starting year.'}
          </caption>
          <TableHeader>
            <TableRow className="border-border/50 bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground">
                {tr ? 'Başlangıç Yılı' : 'Start Year'}
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground">
                {tr ? 'Piyasa Aşaması' : 'Market Phase'}
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right">
                {tr ? 'Toplu Sonuç' : 'Lump Sum Final'}
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right">
                {tr ? 'DCA Sonuç' : 'DCA Final'}
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right">
                {tr ? 'Kazanan' : 'Winner'}
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-foreground text-right">
                {tr ? 'Fark' : 'Edge'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((r) => (
              <TableRow key={r.year} className="border-border/30">
                <TableCell className="font-medium text-foreground">{r.year}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.phase[tr ? 'tr' : 'en']}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-foreground">{r.lump}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-foreground">{r.dca}</TableCell>
                <TableCell className={`text-right font-semibold ${r.winner === 'lump' ? 'text-primary' : 'text-success'}`}>
                  {winnerLabel(r.winner)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-foreground">{r.edge}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollableTable>

      <p className="text-xs text-muted-foreground mt-4 text-center max-w-2xl mx-auto">
        {tr
          ? 'Puan: Toplu Yatırım 5, DCA 3. Toplu, döngü dibine veya erken boğa piyasasına yakın kazanır; DCA zirveye yakın veya uzun ayı piyasalarında kazanır.'
          : 'Score: Lump Sum 5, DCA 3. Lump sum wins near cycle bottoms and early bull markets; DCA wins near peaks and during prolonged bear markets.'}
      </p>
    </div>
  );
};
