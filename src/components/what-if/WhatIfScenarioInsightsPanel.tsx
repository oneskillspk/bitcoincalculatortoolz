import React, { useMemo, useState } from 'react';
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { ResultPanel } from '@/components/calculator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from "@/components/LocalizedLink";
import {
  CalendarRange,
  Landmark,
  Receipt,
  Sparkles,
  TrendingUp,
  ArrowRight,
  GitCompare,
} from 'lucide-react';
import type { CalculationResult } from '@/services/bitcoinApi';
import { useCpiData, FALLBACK_CPI } from '@/hooks/useCpiData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';

interface Props {
  result: CalculationResult;
}

const JAN1_PRICES: Record<number, number> = {
  2011: 0.30,
  2012: 5.27,
  2013: 13.30,
  2014: 805,
  2015: 314,
  2016: 434,
  2017: 998,
  2018: 13412,
  2019: 3746,
  2020: 7200,
  2021: 29000,
  2022: 47700,
  2023: 16500,
  2024: 42500,
  2025: 95000,
  2026: 98000,
};

interface CycleEntry {
  id: string;
  label: string;
  labelTr: string;
  date: string;
  dateTr: string;
  price: number;
  type: 'low' | 'ath';
  cycle: string;
}

const CYCLE_TABLE = [
  { cycle: 'Cycle 1', cycleTr: 'Döngü 1', lowLabel: 'Oct 2011', lowLabelTr: 'Eki 2011', low: 2.0, athLabel: 'Nov 2013', athLabelTr: 'Kas 2013', ath: 1242 },
  { cycle: 'Cycle 2', cycleTr: 'Döngü 2', lowLabel: 'Jan 2015', lowLabelTr: 'Oca 2015', low: 172, athLabel: 'Dec 2017', athLabelTr: 'Ara 2017', ath: 19800 },
  { cycle: 'Cycle 3', cycleTr: 'Döngü 3', lowLabel: 'Dec 2018', lowLabelTr: 'Ara 2018', low: 3191, athLabel: 'Nov 2021', athLabelTr: 'Kas 2021', ath: 69000 },
  { cycle: 'Cycle 4', cycleTr: 'Döngü 4', lowLabel: 'Nov 2022', lowLabelTr: 'Kas 2022', low: 15500, athLabel: 'Oct 2025', athLabelTr: 'Eki 2025', ath: 122260 },
];

const CYCLE_ENTRIES: CycleEntry[] = CYCLE_TABLE.flatMap((c) => [
  { id: `${c.cycle}-low`, label: `${c.cycle} low`, labelTr: `${c.cycleTr} dibi`, date: c.lowLabel, dateTr: c.lowLabelTr, price: c.low, type: 'low', cycle: c.cycle },
  { id: `${c.cycle}-ath`, label: `${c.cycle} ATH`, labelTr: `${c.cycleTr} ZEN`, date: c.athLabel, dateTr: c.athLabelTr, price: c.ath, type: 'ath', cycle: c.cycle },
]);

const TAX_RATES = [
  { label: '%0', labelEn: '0%', value: 0 },
  { label: '%15', labelEn: '15%', value: 15 },
  { label: '%20', labelEn: '20%', value: 20 },
  { label: '%23,8 NIIT', labelEn: '23.8% NIIT', value: 23.8 },
  { label: '%37 KV', labelEn: '37% ST', value: 37 },
];

const makeFmt = (currency: string, lang: 'en' | 'tr') => {
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  return (n: number) => {
    if (n >= 1_000_000) {
      // Use compact notation for large numbers (handles every ISO currency).
      return formatCurrencyAmount(n, currency, { locale, compact: true, decimals: 2 });
    }
    if (n >= 1000) return formatCurrencyAmount(n, currency, { locale, decimals: 0 });
    return formatCurrencyAmount(n, currency, { locale, decimals: 2 });
  };
};

const makeFullFmt = (currency: string, lang: 'en' | 'tr') => {
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  return (n: number) => formatCurrencyAmount(n, currency, { locale, decimals: 2 });
};

const fmtPct = (n: number) =>
  Math.abs(n) >= 1000
    ? `${n >= 0 ? '+' : ''}${(n / 100).toFixed(1)}x`
    : `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

function getCpi(table: Record<number, number>, year: number): number {
  if (table[year]) return table[year];
  const years = Object.keys(table).map(Number).sort();
  if (year < years[0]) return table[years[0]];
  return table[years[years.length - 1]];
}

export const WhatIfScenarioInsightsPanel: React.FC<Props> = ({ result }) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const fxRate = useUsdToTryRate();
  const resultCurrency = (result as any).currency || (tr ? 'TRY' : 'USD');
  const fmtCur = useMemo(() => makeFmt(resultCurrency, tr ? 'tr' : 'en'), [resultCurrency, tr]);
  const fmtFull = useMemo(() => makeFullFmt(resultCurrency, tr ? 'tr' : 'en'), [resultCurrency, tr]);
  // Convert historical USD prices to result currency for apples-to-apples math.
  const usdToCur = resultCurrency === 'TRY' ? fxRate : 1;

  const [inflationAdjusted, setInflationAdjusted] = useState(false);
  const [taxOn, setTaxOn] = useState(false);
  const [taxRate, setTaxRate] = useState(20);
  const [compareOpen, setCompareOpen] = useState(false);
  const [entryAId, setEntryAId] = useState<string>(CYCLE_ENTRIES[0].id);
  const [entryBId, setEntryBId] = useState<string>(CYCLE_ENTRIES[1].id);

  const { data: cpiData } = useCpiData();
  const cpiTable = cpiData?.cpi ?? FALLBACK_CPI;
  const cpiSourceLabel = cpiData?.isLive
    ? (tr ? 'BLS anlık (CUUR0000SA0)' : 'BLS live (CUUR0000SA0)')
    : (tr ? 'BLS referans (önbellek)' : 'BLS reference (cached)');

  const startYear = useMemo(() => new Date(result.startDate).getFullYear(), [result.startDate]);

  const cpiStart = getCpi(cpiTable, startYear);
  const cpiNow = getCpi(cpiTable, 2026);
  const inflationFactor = cpiNow / cpiStart;
  const realCurrentValue = result.currentValue / inflationFactor;
  const realRoi = ((realCurrentValue - result.investmentAmount) / result.investmentAmount) * 100;

  const displayCurrentValue = inflationAdjusted ? realCurrentValue : result.currentValue;
  const displayRoi = inflationAdjusted ? realRoi : result.roiPercentage;

  const fourYearExitYear = startYear + 4;
  const entryPriceUsd = JAN1_PRICES[startYear] ?? result.startPrice;
  const exitPriceUsd = JAN1_PRICES[fourYearExitYear];
  const entryPrice = entryPriceUsd * usdToCur;
  const exitPrice = exitPriceUsd ? exitPriceUsd * usdToCur : undefined;
  const fourYearAvailable = !!exitPrice && fourYearExitYear <= 2026;
  const fourYearRoi = fourYearAvailable ? ((exitPrice! - entryPrice) / entryPrice) * 100 : 0;
  const fourYearCagr = fourYearAvailable
    ? (Math.pow(exitPrice! / entryPrice, 1 / 4) - 1) * 100
    : 0;
  const fourYearValue = fourYearAvailable
    ? result.investmentAmount * (exitPrice! / entryPrice)
    : 0;

  const gain = Math.max(0, result.currentValue - result.investmentAmount);
  const taxOwed = (gain * taxRate) / 100;
  const afterTaxValue = result.currentValue - taxOwed;
  const afterTaxRoi = ((afterTaxValue - result.investmentAmount) / result.investmentAmount) * 100;

  const entryA = CYCLE_ENTRIES.find((e) => e.id === entryAId)!;
  const entryB = CYCLE_ENTRIES.find((e) => e.id === entryBId)!;
  const computeEntry = (e: CycleEntry) => {
    const priceCur = e.price * usdToCur;
    const value = (result.investmentAmount / priceCur) * result.currentPrice;
    const roi = ((value - result.investmentAmount) / result.investmentAmount) * 100;
    return { value, roi, priceCur };
  };
  const aMetrics = computeEntry(entryA);
  const bMetrics = computeEntry(entryB);
  const maxRoi = Math.max(aMetrics.roi, bMetrics.roi, 1);

  return (
    <ResultPanel
      icon={<Sparkles />}
      title={tr ? 'Senaryo Analizleri' : 'Scenario Insights'}
      description={tr
        ? 'Enflasyon, 4 yıllık döngüler, en iyi/en kötü girişler ve vergi sonrası matematik.'
        : 'Inflation, 4-year cycles, best/worst entries, and after-tax math.'}
    >
      <div className="space-y-8">
        {/* Inflation Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-primary" />
              <Label htmlFor="cpi-toggle" className="font-semibold cursor-pointer">
                {tr ? 'Enflasyona Göre Düzeltilmiş (TÜFE)' : 'Inflation-Adjusted (CPI)'}
              </Label>
            </div>
            <Switch id="cpi-toggle" checked={inflationAdjusted} onCheckedChange={setInflationAdjusted} />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div className="calc-surface-card p-4 min-w-0">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                {tr ? 'Güncel Değer' : 'Current Value'}
                {inflationAdjusted && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-medium">
                    {tr ? 'Gerçek' : 'Real'}
                  </span>
                )}
              </div>
              <div className="metric-value text-2xl font-bold text-foreground break-words [overflow-wrap:anywhere] tabular-nums" title={fmtFull(displayCurrentValue)}>{fmtCur(displayCurrentValue)}</div>
            </div>
            <div className="calc-surface-card p-4 min-w-0">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                {tr ? 'Toplam ROI' : 'Total ROI'}
                {inflationAdjusted && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-medium">
                    {tr ? 'TÜFE-düz' : 'CPI-adj'}
                  </span>
                )}
              </div>
              <div className={`metric-value text-2xl font-bold break-words [overflow-wrap:anywhere] tabular-nums ${displayRoi >= 0 ? 'text-success' : 'text-destructive'}`}>
                {fmtPct(displayRoi)}
              </div>
            </div>
          </div>
          {inflationAdjusted && (
            <p className="text-xs text-muted-foreground">
              {tr
                ? `${startYear}'den 2026'ya ABD kümülatif TÜFE ile düzeltilmiştir (toplam enflasyon ${((inflationFactor - 1) * 100).toFixed(1)}%, kaynak: ${cpiSourceLabel}).`
                : `Adjusted with cumulative US CPI from ${startYear} to 2026 (${((inflationFactor - 1) * 100).toFixed(1)}% total inflation, source: ${cpiSourceLabel}).`}
            </p>
          )}
        </div>

        {/* 4-Year Hold Card */}
        <div className="rounded-xl border border-success/20 bg-success/5 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarRange className="w-4 h-4 text-success" />
            <h3 className="font-semibold text-foreground">
              {tr ? '4 Yıllık Tutma Analizi' : '4-Year Hold Analysis'}
            </h3>
          </div>
          {fourYearAvailable ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {tr
                  ? `Tarihte her 4 yıllık Bitcoin tutma pozitif sonuçlanmıştır. ${startYear} girişiniz ${fourYearExitYear} çıkışına göre projeksiyonu.`
                  : `Every 4-year Bitcoin hold in history has been profitable. Here is your ${startYear} entry projected to a ${fourYearExitYear} exit.`}
              </p>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{tr ? `Giriş (${startYear})` : `Entry (${startYear})`}</div>
                  <div className="font-semibold break-words [overflow-wrap:anywhere] tabular-nums" title={fmtFull(entryPrice)}>{fmtCur(entryPrice)}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{tr ? `Çıkış (${fourYearExitYear})` : `Exit (${fourYearExitYear})`}</div>
                  <div className="font-semibold break-words [overflow-wrap:anywhere] tabular-nums" title={fmtFull(exitPrice!)}>{fmtCur(exitPrice!)}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{tr ? '4y ROI' : '4y ROI'}</div>
                  <div className="font-semibold text-success break-words tabular-nums">{fmtPct(fourYearRoi)}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{tr ? '4y YBBO' : '4y CAGR'}</div>
                  <div className="font-semibold text-success break-words tabular-nums">{fmtPct(fourYearCagr)}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {tr
                  ? `${fmtCur(result.investmentAmount)}'ınız 4 yıl tutulsaydı yaklaşık ${fmtCur(fourYearValue)} değerinde olurdu (1 Ocak kapanışları, CoinGecko 2026).`
                  : `Your ${fmtCur(result.investmentAmount)} held 4 years would have been worth approximately ${fmtCur(fourYearValue)} (Jan 1 closes, CoinGecko 2026).`}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {tr
                ? `${startYear} girişiniz henüz tam 4 yıllık pencereyi tamamlamadı. Bitcoin, 2010'dan bu yana tamamlanan her 4 yıllık tutmada tarihsel olarak ödüllendirdi.`
                : `Your ${startYear} entry has not yet completed a full 4-year window. Bitcoin has historically rewarded every 4-year hold completed since 2010.`}
            </p>
          )}
        </div>

        {/* Best vs Worst Entry Table */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">
                {tr ? 'Döngüye Göre En İyi ve En Kötü Giriş' : 'Best vs Worst Entry by Cycle'}
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompareOpen(true)}
              className="min-h-[36px]"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              {tr ? 'Girişleri karşılaştır' : 'Compare entries'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {tr
              ? `${fmtCur(result.investmentAmount)}'ın güncel fiyatta (${fmtCur(result.currentPrice)}) her döngü dibi veya zirvesinden alınmış olsaydı değeri.`
              : `What ${fmtCur(result.investmentAmount)} would be worth at the current price (${fmtCur(result.currentPrice)}) if bought at each cycle low or peak.`}
          </p>
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">{tr ? 'Döngü' : 'Cycle'}</TableHead>
                  <TableHead className="font-semibold">{tr ? 'Dip girişi' : 'Low entry'}</TableHead>
                  <TableHead className="font-semibold">{tr ? 'ZEN girişi' : 'ATH entry'}</TableHead>
                  <TableHead className="font-semibold text-right">{tr ? 'Dipte' : 'At low'}</TableHead>
                  <TableHead className="font-semibold text-right">{tr ? 'ZEN\'de' : 'At ATH'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CYCLE_TABLE.map((c) => {
                  const lowCur = c.low * usdToCur;
                  const athCur = c.ath * usdToCur;
                  const atLow = (result.investmentAmount / lowCur) * result.currentPrice;
                  const atAth = (result.investmentAmount / athCur) * result.currentPrice;
                  return (
                    <TableRow key={c.cycle}>
                      <TableCell className="font-medium">{tr ? c.cycleTr : c.cycle}</TableCell>
                      <TableCell className="text-success text-sm">
                        {tr ? c.lowLabelTr : c.lowLabel} · {fmtCur(lowCur)}
                      </TableCell>
                      <TableCell className="text-warning text-sm">
                        {tr ? c.athLabelTr : c.athLabel} · {fmtCur(athCur)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">{fmtCur(atLow)}</TableCell>
                      <TableCell className="text-right font-semibold">{fmtCur(atAth)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {tr
              ? 'Kaynaklar: CoinGecko döngü zirve ve dipler, 2026 referans.'
              : 'Sources: CoinGecko cycle highs and lows, 2026 reference.'}
          </p>
        </div>

        {/* Tax Toggle */}
        <div className="calc-surface-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <Label htmlFor="tax-toggle" className="font-semibold cursor-pointer">
                {tr ? 'Vergi Tahmini (ABD Sermaye Kazancı)' : 'Tax Estimate (US Capital Gains)'}
              </Label>
            </div>
            <Switch id="tax-toggle" checked={taxOn} onCheckedChange={setTaxOn} />
          </div>
          {taxOn && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {TAX_RATES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setTaxRate(r.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[36px] ${
                      taxRate === r.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border/40 hover:border-primary/40'
                    }`}
                  >
                    {tr ? r.label : r.labelEn}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{tr ? 'Vergi Sonrası Değer' : 'After-Tax Value'}</div>
                  <div className="text-xl font-bold text-foreground break-words [overflow-wrap:anywhere] tabular-nums" title={fmtFull(afterTaxValue)}>{fmtCur(afterTaxValue)}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{tr ? 'Vergi Sonrası ROI' : 'After-Tax ROI'}</div>
                  <div className={`text-xl font-bold break-words [overflow-wrap:anywhere] tabular-nums ${afterTaxRoi >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {fmtPct(afterTaxRoi)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {tr
                  ? `%${taxRate} oranında ödenmesi gereken vergi: ${fmtCur(taxOwed)}. Yalnızca tahmin. Eyalet vergileri, maliyet bazı yöntemi ve elde tutma süresi sonucu değiştirir.`
                  : `Tax owed at ${taxRate}%: ${fmtCur(taxOwed)}. Estimate only. State taxes, cost basis method, and holding period change the result.`}
              </p>
              <Link
                to="/calculators/capital-gains-tax"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-3"
              >
                {tr ? 'Tam Sermaye Kazancı dökümünü gör' : 'See full Capital Gains breakdown'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
          {!taxOn && (
            <p className="text-sm text-muted-foreground">
              {tr
                ? 'Uzun vadeli sermaye kazancı oranlarını (%0, %15, %20, %23,8 NIIT ile) veya %37 kısa vadeli oranı modellemek için açın.'
                : 'Toggle on to model long-term capital gains rates (0%, 15%, 20%, 23.8% with NIIT) or the 37% short-term rate.'}
            </p>
          )}
        </div>
      </div>

      {/* Compare Entries Dialog */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              {tr ? 'İki döngü girişini karşılaştır' : 'Compare two cycle entries'}
            </DialogTitle>
            <DialogDescription>
              {tr
                ? `Güncel ${fmtCur(result.currentPrice)} fiyatında ${fmtCur(result.investmentAmount)}'ı yan yana görmek için iki giriş seçin.`
                : `Pick any two entries to see ${fmtCur(result.investmentAmount)} side by side at the current ${fmtCur(result.currentPrice)} price.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{tr ? 'Giriş A' : 'Entry A'}</Label>
              <Select value={entryAId} onValueChange={setEntryAId}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CYCLE_ENTRIES.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {tr ? e.labelTr : e.label} · {tr ? e.dateTr : e.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{tr ? 'Giriş B' : 'Entry B'}</Label>
              <Select value={entryBId} onValueChange={setEntryBId}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CYCLE_ENTRIES.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {tr ? e.labelTr : e.label} · {tr ? e.dateTr : e.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {[
              { label: tr ? entryA.labelTr : entryA.label, date: tr ? entryA.dateTr : entryA.date, ...aMetrics, color: 'bg-success' },
              { label: tr ? entryB.labelTr : entryB.label, date: tr ? entryB.dateTr : entryB.date, ...bMetrics, color: 'bg-primary' },
            ].map((row, i) => (
              <div key={i} className="calc-surface-card p-3">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <div>
                    <div className="font-semibold text-sm text-foreground">{row.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.date} · {tr ? 'giriş' : 'entry'} {fmtCur(row.priceCur)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base text-foreground">{fmtCur(row.value)}</div>
                    <div
                      className={`text-xs font-semibold ${row.roi >= 0 ? 'text-success' : 'text-destructive'}`}
                    >
                      {fmtPct(row.roi)} ROI
                    </div>
                  </div>
                </div>
                <div
                  className="h-3 w-full rounded-full bg-muted overflow-hidden"
                  role="img"
                  aria-label={`ROI bar for ${row.label}: ${fmtPct(row.roi)}`}
                >
                  <div
                    className={`h-full ${row.color} transition-all duration-500`}
                    style={{ width: `${Math.max(2, Math.min(100, (row.roi / maxRoi) * 100))}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="text-xs text-muted-foreground text-center pt-1">
              {tr ? 'Fark:' : 'Difference:'}{' '}
              <span className="font-semibold text-foreground">
                {fmtCur(Math.abs(aMetrics.value - bMetrics.value))}
              </span>{' '}
              ({fmtPct(aMetrics.roi - bMetrics.roi)} {tr ? 'fark' : 'spread'})
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setCompareOpen(false)} className="min-h-[44px]">
              {tr ? 'Kapat' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResultPanel>
  );
};

export default WhatIfScenarioInsightsPanel;
