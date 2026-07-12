import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, DollarSign, Target, Percent, AlertCircle, Coins, BarChart3, GitCompare } from 'lucide-react';
import { ProfitLossResult } from '@/services/profitLossCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultsGrid, ResultCard, EmptyState } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface ProfitLossResultsPanelProps {
  result: ProfitLossResult | null;
  isLoading?: boolean;
  isRealized?: boolean;
}

const disp = (value: number) => formatCurrencyForDisplay(value, 'USD');
// Full-precision USD string for tooltips (delegates to the shared
// `formatCurrencyForDisplay` so we stay on the single formatting path).
const formatCurrency = (value: number): string => disp(value).full;

export const ProfitLossResultsPanel: React.FC<ProfitLossResultsPanelProps> = ({ result, isLoading = false, isRealized = false }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [compareOpen, setCompareOpen] = useState(false);
  const [priceA, setPriceA] = useState<string>('');
  const [priceB, setPriceB] = useState<string>('');

  React.useEffect(() => {
    if (result && !priceA) setPriceA(result.breakevenPrice.toFixed(2));
    if (result && !priceB) setPriceB(result.sellPrice.toFixed(2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.breakevenPrice, result?.sellPrice]);

  const compare = useMemo(() => {
    if (!result) return null;
    const a = parseFloat(priceA);
    const b = parseFloat(priceB);
    if (!isFinite(a) || !isFinite(b) || a <= 0 || b <= 0) return null;
    const sellFeeRate = result.grossProceeds > 0 ? result.sellFee / result.grossProceeds : 0;
    const compute = (price: number) => {
      const gross = result.totalBtcHeld * price;
      const fee = gross * sellFeeRate;
      const net = gross - fee;
      const pl = net - result.totalInvested;
      const roi = result.totalInvested > 0 ? (pl / result.totalInvested) * 100 : 0;
      return { price, gross, fee, net, pl, roi };
    };
    const ra = compute(a);
    const rb = compute(b);
    const maxAbsRoi = Math.max(Math.abs(ra.roi), Math.abs(rb.roi), 1);
    const maxPrice = Math.max(a, b, result.breakevenPrice, 1);
    const breakevenPct = (result.breakevenPrice / maxPrice) * 100;
    return { a: ra, b: rb, maxAbsRoi, maxPrice, breakevenPct, diffPl: rb.pl - ra.pl, diffRoi: rb.roi - ra.roi };
  }, [result, priceA, priceB]);

  if (isLoading) {
    return (
      <ResultPanel
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </ResultPanel>
    );
  }

  if (!result) {
    return (
      <ResultPanel>
        <EmptyState
          icon={<AlertCircle />}
          title={tr ? 'Hesaplamaya hazır' : 'Ready to calculate'}
          description={tr ? 'Kâr/zarar analizini görmek için alım bilgilerinizi girin' : 'Enter your purchase details to see profit/loss analysis'}
        />
      </ResultPanel>
    );
  }

  const isProfit = result.netProfitLoss >= 0;

  return (
    <div className="space-y-4">
      <ResultPanel
        accentBar={isProfit ? 'positive' : 'negative'}
        eyebrow={tr
          ? `${isRealized ? 'Gerçekleşmiş' : 'Gerçekleşmemiş'} ${isProfit ? 'Kâr' : 'Zarar'}`
          : `${isRealized ? 'Realized' : 'Unrealized'} ${isProfit ? 'Profit' : 'Loss'}`}
        title={
          <span className={cn('calc-text-mono', isProfit ? 'text-success' : 'text-destructive')}>
            {isProfit ? '+' : ''}{formatCurrency(result.netProfitLoss)}
          </span>
        }
        action={
          <Badge variant="outline" className={cn('font-mono', isProfit ? 'border-success/30 text-success' : 'border-destructive/30 text-destructive')}>
            {isProfit ? '+' : ''}{result.roiPercent.toFixed(2)}% ROI
          </Badge>
        }
        icon={isProfit ? <TrendingUp /> : <TrendingDown />}
      >
        <ResultsGrid cols={2}>
          {(() => { const d = disp(result.totalInvested); return (
            <ResultCard icon={<DollarSign />} label={tr ? 'Toplam Yatırım' : 'Total Invested'} value={d.display} fullValue={d.full} />
          ); })()}
          <ResultCard icon={<Coins />} label={tr ? 'Tutulan BTC' : 'BTC Held'} value={result.totalBtcHeld.toFixed(8)} />
          {(() => { const d = disp(result.weightedAvgCostBasis); return (
            <ResultCard icon={<BarChart3 />} label={tr ? 'Ort. Maliyet Bazı' : 'Avg Cost Basis'} value={d.display} fullValue={d.full} sub={tr ? 'BTC başına' : 'per BTC'} />
          ); })()}
          {(() => { const d = disp(result.breakevenPrice); return (
            <ResultCard
              icon={<Target />}
              label={tr ? 'Başabaş Fiyatı' : 'Breakeven Price'}
              value={d.display}
              fullValue={d.full}
              sub={
                <button
                  type="button"
                  onClick={() => setCompareOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <GitCompare className="h-3 w-3" />
                  {tr ? 'Fiyat karşılaştır' : 'Compare prices'}
                </button>
              }
              tone="primary"
            />
          ); })()}
        </ResultsGrid>

        <div className="calc-surface-subtle p-4">
          <div className="mb-2 flex items-center gap-2 calc-text-label">
            <Percent className="h-3 w-3" />
            {tr ? 'Ücret Dağılımı' : 'Fee Breakdown'}
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="min-w-0">
              <div className="calc-text-small text-muted-foreground">{tr ? 'Alım Ücretleri' : 'Buy Fees'}</div>
              <div className="calc-text-mono text-foreground break-words [overflow-wrap:anywhere] tabular-nums" title={formatCurrency(result.totalBuyFees)}>{disp(result.totalBuyFees).display}</div>
            </div>
            <div className="min-w-0">
              <div className="calc-text-small text-muted-foreground">{tr ? 'Satım Ücreti' : 'Sell Fee'}</div>
              <div className="calc-text-mono text-foreground break-words [overflow-wrap:anywhere] tabular-nums" title={formatCurrency(result.sellFee)}>{disp(result.sellFee).display}</div>
            </div>
            <div className="min-w-0">
              <div className="calc-text-small text-muted-foreground">{tr ? 'Toplam Ücretler' : 'Total Fees'}</div>
              <div className="calc-text-mono font-semibold text-destructive break-words [overflow-wrap:anywhere] tabular-nums" title={formatCurrency(result.totalFeesPaid)}>{disp(result.totalFeesPaid).display}</div>
            </div>
          </div>
        </div>

        <ResultsGrid cols={2}>
          {(() => { const d = disp(result.grossProfitLoss); return (
            <ResultCard
              label={tr ? 'Brüt K/Z' : 'Gross P/L'}
              value={`${result.grossProfitLoss >= 0 ? '+' : ''}${d.display}`}
              fullValue={`${result.grossProfitLoss >= 0 ? '+' : ''}${d.full}`}
              tone={result.grossProfitLoss >= 0 ? 'positive' : 'negative'}
            />
          ); })()}
          {(() => { const d = disp(result.netProfitLoss); return (
            <ResultCard
              label={tr ? 'Net K/Z (ücretler sonrası)' : 'Net P/L (after fees)'}
              value={`${isProfit ? '+' : ''}${d.display}`}
              fullValue={`${isProfit ? '+' : ''}${d.full}`}
              tone={isProfit ? 'positive' : 'negative'}
            />
          ); })()}
        </ResultsGrid>
      </ResultPanel>

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              {tr ? 'İki satış fiyatını karşılaştır' : 'Compare two sell prices'}
            </DialogTitle>
            <DialogDescription>
              {tr
                ? `${result.totalBtcHeld.toFixed(8)} BTC için iki varsayımsal çıkış fiyatında K/Z ve ROI karşılaştırması.`
                : `Side-by-side P/L and ROI for ${result.totalBtcHeld.toFixed(8)} BTC at two hypothetical exit prices.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="cmp-price-a" className="text-xs uppercase tracking-wide text-muted-foreground">{tr ? 'Fiyat A' : 'Price A'}</Label>
              <Input id="cmp-price-a" type="number" inputMode="decimal" min={0} value={priceA}
                onChange={(e) => setPriceA(e.target.value)} className="min-h-[44px] font-mono" placeholder="e.g. 95000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cmp-price-b" className="text-xs uppercase tracking-wide text-muted-foreground">{tr ? 'Fiyat B' : 'Price B'}</Label>
              <Input id="cmp-price-b" type="number" inputMode="decimal" min={0} value={priceB}
                onChange={(e) => setPriceB(e.target.value)} className="min-h-[44px] font-mono" placeholder="e.g. 150000" />
            </div>
          </div>
          {compare ? (
            <div className="space-y-4 mt-2">
              <div className="space-y-3">
                {(['a', 'b'] as const).map((key) => {
                  const m = compare[key];
                  const positive = m.roi >= 0;
                  const priceWidthPct = (m.price / compare.maxPrice) * 100;
                  const clearsBreakeven = m.price >= result.breakevenPrice;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{key.toUpperCase()} · {formatCurrency(m.price)}/BTC</span>
                        <span className={cn('font-mono font-semibold', positive ? 'text-success' : 'text-destructive')}>
                          {positive ? '+' : ''}{m.roi.toFixed(2)}% · {positive ? '+' : ''}{formatCurrency(m.pl)}
                        </span>
                      </div>
                      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', positive ? 'bg-success' : 'bg-destructive')}
                          style={{ width: `${Math.max(priceWidthPct, 2)}%` }} />
                        <div className="absolute top-0 bottom-0 w-px bg-primary/80 pointer-events-none"
                          style={{ left: `${compare.breakevenPct}%` }} aria-hidden="true" />
                        <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-primary ring-2 ring-background pointer-events-none"
                          style={{ left: `${compare.breakevenPct}%` }} aria-hidden="true" />
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-muted-foreground">
                          {tr ? 'Net' : 'Net'} {formatCurrency(m.net)} · {tr ? 'Ücret' : 'Fee'} {formatCurrency(m.fee)}
                        </span>
                        <span className={cn(clearsBreakeven ? 'text-success' : 'text-destructive')}>
                          {clearsBreakeven
                            ? (tr ? '✓ başabaşı aştı' : '✓ clears breakeven')
                            : (tr ? '✗ başabaşın altında' : '✗ below breakeven')}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                  {tr ? `Başabaş fiyatı ${formatCurrency(result.breakevenPrice)} (tüm ücretler sonrası)` : `Breakeven price ${formatCurrency(result.breakevenPrice)} (after all fees)`}
                </div>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/20 p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{tr ? 'Fark (B − A)' : 'Difference (B − A)'}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <div className={cn('font-mono text-lg font-bold', compare.diffPl >= 0 ? 'text-success' : 'text-destructive')}>
                    {compare.diffPl >= 0 ? '+' : ''}{formatCurrency(compare.diffPl)}
                  </div>
                  <div className={cn('font-mono text-sm font-semibold', compare.diffRoi >= 0 ? 'text-success' : 'text-destructive')}>
                    {compare.diffRoi >= 0 ? '+' : ''}{compare.diffRoi.toFixed(2)} pp ROI
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {tr
                  ? `Satım ücreti oranı (%${((compare.a.fee / compare.a.gross) * 100).toFixed(2)}) aktif senaryodan alınmıştır. Alım ücretleri ve maliyet bazı sabit tutulmaktadır.`
                  : `Sell-fee rate (${((compare.a.fee / compare.a.gross) * 100).toFixed(2)}%) inferred from the active scenario. Buy fees and cost basis are held constant.`}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              {tr ? 'Yan yana karşılaştırmayı görmek için iki pozitif fiyat girin.' : 'Enter two positive prices to see the side-by-side comparison.'}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
