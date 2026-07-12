import { PurchasingPowerResult, PurchasingPowerCalculator } from '@/services/purchasingPowerCalculator';
import { Bitcoin, TrendingUp, ShoppingCart, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultHero, EmptyState, ResultsGrid, ResultCard } from '@/components/calculator';
import { formatGroupedInt } from '@/utils/numberFormat';
import { formatLargeNumber } from '@/utils/formatters';

interface PurchasingPowerResultsPanelProps {
  result: PurchasingPowerResult | null;
  currencySymbol: string;
}

export const PurchasingPowerResultsPanel = ({ result, currencySymbol }: PurchasingPowerResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (!result) {
    return (
      <ResultPanel
        icon={<ShoppingCart />}
        title={tr ? 'Satın Alma Gücü' : 'Purchasing Power'}
        aria-live="polite"
        aria-atomic="true"
        aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
      >
        <EmptyState
          icon={<ShoppingCart />}
          title={tr ? 'Hesaplamaya hazır' : 'Ready to calculate'}
          description={tr ? 'Satın alma gücünü görmek için Bitcoin miktarınızı girin' : 'Enter your Bitcoin amount to see purchasing power'}
        />
      </ResultPanel>
    );
  }

  const topThreeItems = result.topItems.slice(0, 3);
  const locale = tr ? 'tr-TR' : 'en-US';
  // Locale-aware formatting without `toLocaleString` per RESULTS_PANEL_SPEC §6.
  const int = (n: number) => formatGroupedInt(n, locale);
  const price2 = (n: number) => `${int(Math.trunc(n))}${(Math.abs(n) % 1).toFixed(2).slice(1)}`;
  const btc8 = (n: number) => n.toFixed(8);
  const totalFull = `${currencySymbol}${int(result.totalValue)}`;
  const totalDisplay =
    Math.abs(result.totalValue) >= 100_000
      ? `${currencySymbol}${formatLargeNumber(result.totalValue, 2)}`
      : totalFull;
  const categoryEntries = Object.entries(result.categoryBreakdown).slice(0, 4);

  return (
    <ResultPanel
      icon={<ShoppingCart />}
      title={tr ? 'Satın Alma Gücü' : 'Purchasing Power'}
      action={
        <Badge variant="secondary" className="gap-1 text-xs">
          <Sparkles className="h-3 w-3" />
          {tr ? 'Canlı' : 'Live'}
        </Badge>
      }
      accentBar="primary"
    >
      <ResultHero
        label={tr ? 'Toplam Değer' : 'Total Value'}
        value={totalDisplay}
        fullValue={totalFull}
        sub={
          <span className="calc-text-small inline-flex min-w-0 flex-wrap items-center gap-2">
            <Bitcoin className="h-3.5 w-3.5" aria-hidden />
            <span className="calc-text-mono">{btc8(result.btcAmount)} BTC</span>
            <span className="text-muted-foreground">•</span>
            <span title={`${currencySymbol}${price2(result.currentPrice)}/BTC`}>
              {currencySymbol}{int(result.currentPrice)}/BTC
            </span>
          </span>
        }
      />

      <section aria-label={tr ? 'En İyi Alımlar' : 'Top Purchases'} className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" aria-hidden />
          <h3 className="calc-text-label text-foreground">{tr ? 'En İyi Alımlar' : 'Top Purchases'}</h3>
        </div>
        <ResultsGrid cols={3}>
          {topThreeItems.map((item) => {
            const Icon = item.icon;
            const qtyFull = `${item.quantity.toLocaleString(numberLocale, { maximumFractionDigits: 4 })}× ${item.name}`;
            return (
              <ResultCard
                key={item.id}
                icon={<Icon />}
                label={item.name}
                value={`${PurchasingPowerCalculator.formatQuantity(item.quantity)}×`}
                fullValue={qtyFull}
                sub={item.category}
              />
            );
          })}
        </ResultsGrid>
      </section>

      <section aria-label={tr ? 'Kategoriler' : 'Categories'} className="space-y-3">
        <h3 className="calc-text-label text-foreground">{tr ? 'Kategoriler' : 'Categories'}</h3>
        <ResultsGrid cols={Math.min(4, Math.max(2, categoryEntries.length)) as 2 | 3 | 4}>
          {categoryEntries.map(([category, data]) => (
            <ResultCard
              key={category}
              label={category}
              value={data.count.toLocaleString(numberLocale)}
              sub={tr ? 'ürün' : 'items'}
              size="sm"
            />
          ))}
        </ResultsGrid>
      </section>

      <ResultsGrid cols={2}>
        <ResultCard
          icon={<ShoppingCart />}
          label={tr ? 'Toplam Mevcut' : 'Total Available'}
          value={result.items.length.toLocaleString(numberLocale)}
          sub={tr ? 'ürün' : 'items'}
          size="sm"
        />
        <ResultCard
          icon={<Sparkles />}
          label={tr ? 'Kategoriler' : 'Categories'}
          value={Object.keys(result.categoryBreakdown).length.toLocaleString(numberLocale)}
          sub={tr ? 'benzersiz' : 'unique'}
          size="sm"
        />
      </ResultsGrid>
    </ResultPanel>
  );
};
