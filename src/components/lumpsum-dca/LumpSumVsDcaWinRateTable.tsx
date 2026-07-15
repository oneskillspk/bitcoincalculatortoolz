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

// Values computed from the same historical Bitcoin price dataset that powers
// the calculator above (`public/data/bitcoin_prices_v1.json`, last updated
// 2026-07-09). $10,000 invested Jan 1 of each start year, held to July 15,
// 2026 (BTC ≈ $59,147). Lump = single buy at start-of-year close; DCA =
// equal monthly buys from Jan of start year through July 2026, then held.
// Regenerate on each dataset refresh.
const ROWS: Row[] = [
  { year: '2017', phase: { en: 'Bull peak start', tr: 'Boğa zirvesi başlangıcı' }, lump: '$590,500', dca: '$65,100', winner: 'lump', edge: '+808%' },
  { year: '2018', phase: { en: 'Bear market start', tr: 'Ayı piyasası başlangıcı' }, lump: '$42,500', dca: '$36,800', winner: 'lump', edge: '+15%' },
  { year: '2019', phase: { en: 'Recovery', tr: 'Toparlanma' }, lump: '$150,200', dca: '$31,300', winner: 'lump', edge: '+380%' },
  { year: '2020', phase: { en: 'Pre-halving', tr: 'Halving öncesi' }, lump: '$82,100', dca: '$21,100', winner: 'lump', edge: '+289%' },
  { year: '2021', phase: { en: 'Bull peak', tr: 'Boğa zirvesi' }, lump: '$20,100', dca: '$14,100', winner: 'lump', edge: '+43%' },
  { year: '2022', phase: { en: 'Bear bottom', tr: 'Ayı dibi' }, lump: '$12,400', dca: '$14,200', winner: 'dca', edge: '+14%' },
  { year: '2023', phase: { en: 'Early bull', tr: 'Erken boğa' }, lump: '$35,800', dca: '$11,900', winner: 'lump', edge: '+201%' },
  { year: '2024', phase: { en: 'Halving year (Apr 2024)', tr: 'Halving yılı (Nis 2024)' }, lump: '$13,400', dca: '$7,900', winner: 'lump', edge: '+69%' },
  { year: '2025', phase: { en: 'Post-ATH cycle top', tr: 'ATH sonrası döngü zirvesi' }, lump: '$6,300', dca: '$6,800', winner: 'dca', edge: '+9%' },
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
        title={tr ? 'Toplu Yatırım vs Aylık DCA: Tarihsel Sonuçlar' : 'Lump Sum vs Monthly DCA: Historical Results'}
        lead={tr
          ? 'Her yılın başında yatırılan $10.000, 15 Temmuz 2026\'ya kadar tutuldu. DCA aynı toplam sermayeyi aylık eşit dilimlerde yatırır. Kaynak: hesaplayıcıyı besleyen tarihsel BTC veri seti.'
          : '$10,000 invested at the start of each year, held to July 15, 2026. DCA deploys the same total capital in equal monthly buys. Source: the same historical BTC dataset that powers the calculator above.'}
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
          ? 'Puan: Toplu Yatırım 7, DCA 2 (2017–2025 başlangıçları, 15 Temmuz 2026\'ya kadar tutuldu). Toplu, uzun boğa döngülerinin başlarında güçlü kazanır; DCA yalnızca ayı zeminine (2022) veya çok geç bir zirveye (2025) yakın kazanır. Son gözden geçirme: Temmuz 2026.'
          : 'Score: Lump Sum 7, DCA 2 (2017–2025 start years, held to July 15, 2026). Lump sum wins decisively when the start year comes early in a bull cycle; DCA only wins near a bear-market floor (2022) or a very late cycle top (2025). Last reviewed: July 2026.'}
      </p>
    </div>
  );
};
