import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { PurchasingPowerResult, PurchasingPowerCalculator } from "@/services/purchasingPowerCalculator";
import { Bitcoin, TrendingUp, ShoppingCart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultPanel, ResultHero, EmptyState } from "@/components/calculator";

interface PurchasingPowerResultsPanelProps {
  result: PurchasingPowerResult | null;
  currencySymbol: string;
}

export const PurchasingPowerResultsPanel = ({ result, currencySymbol }: PurchasingPowerResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (!result) {
    return (
      <ResultPanel icon={<ShoppingCart /
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">} title={tr ? 'Satın Alma Gücü' : 'Purchasing Power'}>
        <EmptyState
          icon={<ShoppingCart />}
          title={tr ? 'Hesaplamaya hazır' : 'Ready to calculate'}
          description={tr ? 'Satın alma gücünü görmek için Bitcoin miktarınızı girin' : 'Enter your Bitcoin amount to see purchasing power'}
        />
      </ResultPanel>
    );
  }

  const topThreeItems = result.topItems.slice(0, 3);

  return (
    <ResultPanel
      icon={<ShoppingCart />}
      title={tr ? 'Satın Alma Gücü' : 'Purchasing Power'}
      action={
        <Badge variant="secondary" className="gap-1 text-xs">
          <Sparkles className="w-3 h-3" />
          {tr ? 'Canlı' : 'Live'}
        </Badge>
      }
      accentBar="primary"
    >
      <ResultHero
        label={tr ? 'Toplam Değer' : 'Total Value'}
        value={
          Math.abs(result.totalValue) >= 100_000
            ? `${currencySymbol}${(result.totalValue / (result.totalValue >= 1_000_000_000 ? 1_000_000_000 : 1_000_000)).toLocaleString(getCurrentIntlLocale(), { maximumFractionDigits: 2 })}${result.totalValue >= 1_000_000_000 ? 'B' : 'M'}`
            : `${currencySymbol}${result.totalValue.toLocaleString(getCurrentIntlLocale(), { maximumFractionDigits: 0 })}`
        }
        fullValue={`${currencySymbol}${result.totalValue.toLocaleString(getCurrentIntlLocale(), { maximumFractionDigits: 0 })}`}
        sub={
          <span className="inline-flex items-center gap-2 calc-text-small flex-wrap min-w-0">
            <Bitcoin className="h-3.5 w-3.5" />
            <span className="calc-text-mono">{result.btcAmount.toFixed(8)} BTC</span>
            <span className="text-muted-foreground">•</span>
            <span>{currencySymbol}{result.currentPrice.toLocaleString(getCurrentIntlLocale())}/BTC</span>
          </span>
        }
      />

      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="calc-text-label text-foreground">{tr ? 'En İyi Alımlar' : 'Top Purchases'}</h3>
        </div>
        <div className="space-y-2">
          {topThreeItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="calc-surface-subtle flex items-center justify-between p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="calc-text-small text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <p className="calc-text-mono text-lg font-bold text-foreground shrink-0 ml-2">
                  {PurchasingPowerCalculator.formatQuantity(item.quantity)}×
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 calc-text-label text-foreground">{tr ? 'Kategoriler' : 'Categories'}</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(result.categoryBreakdown).slice(0, 4).map(([category, data]) => (
            <div key={category} className="calc-surface-subtle p-3">
              <p className="calc-text-small text-muted-foreground">{category}</p>
              <p className="text-sm font-semibold text-foreground">{data.count} {tr ? 'ürün' : 'items'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="calc-surface-subtle border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
        <div>
          <p className="calc-text-small text-muted-foreground">{tr ? 'Toplam Mevcut' : 'Total Available'}</p>
          <p className="text-xl font-bold text-foreground">{result.items.length} {tr ? 'ürün' : 'items'}</p>
        </div>
        <ShoppingCart className="w-7 h-7 text-primary/70" />
      </div>
    </ResultPanel>
  );
};
