import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { PurchasingPowerResult, PurchasingPowerCalculator } from '@/services/purchasingPowerCalculator';
import { Bitcoin, TrendingUp, ShoppingCart, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultHero, EmptyState, ResultsGrid, ResultCard } from '@/components/calculator';

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
  const numberLocale = getCurrentIntlLocale();
  const compactNum = new Intl.NumberFormat(numberLocale, { notation: 'compact', maximumFractionDigits: 2 });
  const totalFull = `${currencySymbol}${result.totalValue.toLocaleString(numberLocale, { maximumFractionDigits: 0 })}`;
  const totalDisplay =
    Math.abs(result.totalValue) >= 100_000
      ? `${currencySymbol}${compactNum.format(result.totalValue)}`
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
            <Bitcoin className="h-3.5 w-3.5" />
            <span className="calc-text-mono">{result.btcAmount.toLocaleString(numberLocale, { minimumFractionDigits: 8, maximumFractionDigits: 8 })} BTC</span>
            <span className="text-muted-foreground">•</span>
            <span title={`${currencySymbol}${result.currentPrice.toLocaleString(numberLocale, { maximumFractionDigits: 2 })}/BTC`}>
              {currencySymbol}{result.currentPrice.toLocaleString(numberLocale, { maximumFractionDigits: 0 })}/BTC
            </span>
          </span>
        }
      />

      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="calc-text-label text-foreground">{tr ? 'En İyi Alımlar' : 'Top Purchases'}</h3>
        </div>
        <ul className="list-none space-y-2 p-0">
          {topThreeItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="calc-surface-subtle flex items-center justify-between gap-3 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`shrink-0 rounded-lg bg-gradient-to-br p-2 ${item.color}`}>
                    <Icon className="h-4 w-4 text-primary-foreground" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="calc-text-body truncate font-medium text-foreground">{item.name}</p>
                    <p className="calc-text-small text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <p
                  className="calc-text-mono ml-2 shrink-0 text-lg font-bold text-foreground"
                  title={`${item.quantity.toLocaleString(numberLocale, { maximumFractionDigits: 4 })}× ${item.name}`}
                >
                  {PurchasingPowerCalculator.formatQuantity(item.quantity)}×
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="calc-text-label mb-3 text-foreground">{tr ? 'Kategoriler' : 'Categories'}</h3>
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
      </div>

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
