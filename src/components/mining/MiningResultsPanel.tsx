import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, DollarSign, Bitcoin, Zap, Target, PieChart } from "lucide-react";
import { MiningResult } from "@/services/miningProfitabilityCalculator";
import { useNumberCounter } from "@/hooks/useNumberCounter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { formatMoney } from "@/utils/formatMoney";
import { formatCurrencyForDisplay } from "@/utils/formatCurrency";
import { ResultPanel, ResultsGrid, ResultCard } from "@/components/calculator";

interface MiningResultsPanelProps {
  result: MiningResult;
  currency: string;
}

export const MiningResultsPanel = ({ result, currency }: MiningResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const isProfitable = result.dailyProfit > 0;

  const animatedDailyProfit = useNumberCounter({ end: result.dailyProfit, duration: 1500, decimals: 2 });
  const animatedMonthlyProfit = useNumberCounter({ end: result.monthlyProfit, duration: 1500, decimals: 2 });
  const animatedYearlyProfit = useNumberCounter({ end: result.yearlyProfit, duration: 1500, decimals: 2 });
  const animatedBreakEven = useNumberCounter({ end: result.breakEvenDays, duration: 1500 });
  const animatedROI = useNumberCounter({ end: result.roiPercentage, duration: 1500, decimals: 1 });
  const animatedDailyBtc = useNumberCounter({ end: result.dailyBtcMined * 100000000, duration: 1500 });

  // Card-safe display: compact above 100k, full tooltip on hover.
  const disp = (value: number) => {
    if (tr) {
      const tryValue = value * fxRate;
      return formatCurrencyForDisplay(tryValue, 'TRY', { locale: 'tr-TR' });
    }
    return formatCurrencyForDisplay(value, currency);
  };
  // Full-precision string for tooltips — Turkish path keeps the pretty
  // TRY thousands separators from `formatMoney`; other locales delegate
  // to the single `formatCurrencyForDisplay` path (no bespoke Intl call).
  const formatCurrency = (value: number) =>
    tr ? formatMoney(value, { tr: true, fxRate, decimals: 2 }) : disp(value).full;

  return (
    <ResultPanel
      icon={isProfitable ? <TrendingUp /> : <TrendingDown />}
      title={tr ? 'Madencilik Sonuçları' : 'Mining Results'}
      accentBar={isProfitable ? 'positive' : 'negative'}
      action={
        <Badge variant={isProfitable ? "default" : "destructive"} className={isProfitable ? "bg-success/10 text-success border-success/20" : ""}>
          {isProfitable ? (tr ? 'Kârlı' : 'Profitable') : (tr ? 'Kârsız' : 'Unprofitable')}
        </Badge>
      }
    
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}>
      <ResultsGrid cols={2}>
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Günlük Kâr' : 'Daily Profit'}
          value={disp(animatedDailyProfit).display}
          fullValue={formatCurrency(animatedDailyProfit)}
          tone={result.dailyProfit >= 0 ? 'positive' : 'negative'}
        />
        <ResultCard
          icon={<Bitcoin />}
          label={tr ? 'Günlük BTC' : 'Daily BTC'}
          value={`${Math.round(animatedDailyBtc).toString().replace(/\B(?=(\d{3})+(?!\d))/g, tr ? '.' : ',')} sats`}
          sub={`≈ ${result.dailyBtcMined.toFixed(8)} BTC`}
        />
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Aylık Kâr' : 'Monthly Profit'}
          value={disp(animatedMonthlyProfit).display}
          fullValue={formatCurrency(animatedMonthlyProfit)}
          tone={result.monthlyProfit >= 0 ? 'positive' : 'negative'}
        />
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Yıllık Kâr' : 'Yearly Profit'}
          value={disp(animatedYearlyProfit).display}
          fullValue={formatCurrency(animatedYearlyProfit)}
          tone={result.yearlyProfit >= 0 ? 'positive' : 'negative'}
        />
      </ResultsGrid>

      <ResultsGrid cols={2}>
        <ResultCard
          icon={<Clock />}
          label={tr ? 'Başabaş' : 'Break-Even'}
          value={result.breakEvenDays === Infinity ? (tr ? 'Hiçbir zaman' : 'Never') : `${Math.round(animatedBreakEven)} ${tr ? 'gün' : 'days'}`}
          sub={result.breakEvenDays !== Infinity ? `≈ ${(result.breakEvenDays / 30).toFixed(1)} ${tr ? 'ay' : 'months'}` : undefined}
          tone="primary"
        />
        <ResultCard
          icon={<Target />}
          label={tr ? 'Yıllık ROI' : 'Annual ROI'}
          value={`${animatedROI.toFixed(1)}%`}
          tone={result.roiPercentage >= 0 ? 'positive' : 'negative'}
        />
      </ResultsGrid>

      <div className="calc-surface-subtle p-4 space-y-3">
        <h4 className="calc-text-label flex items-center gap-2 text-foreground">
          <PieChart className="h-3.5 w-3.5 text-primary" />
          {tr ? 'Verimlilik Metrikleri' : 'Efficiency Metrics'}
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="min-w-0">
            <p className="calc-text-small text-muted-foreground">{tr ? 'TH başına maliyet' : 'Cost/TH'}</p>
            <p className="calc-text-mono text-sm font-semibold text-foreground break-words [overflow-wrap:anywhere] tabular-nums" title={formatCurrency(result.hashCostRatio)}>{disp(result.hashCostRatio).display}</p>
          </div>
          <div className="min-w-0">
            <p className="calc-text-small text-muted-foreground">{tr ? 'Verimlilik' : 'Efficiency'}</p>
            <p className="calc-text-mono text-sm font-semibold text-foreground">{result.energyEfficiency.toFixed(1)} J/TH</p>
          </div>
          <div className="min-w-0">
            <p className="calc-text-small text-muted-foreground">{tr ? 'Marj' : 'Margin'}</p>
            <p className={`calc-text-mono text-sm font-semibold ${result.profitMargin >= 0 ? 'text-success' : 'text-destructive'}`}>
              {result.profitMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="calc-surface-subtle border-warning/20 bg-warning/$3 p-4 flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <Zap className="h-4 w-4 text-warning" />
          <span className="calc-text-small text-muted-foreground">{tr ? 'Çıkarılan BTC Başına Maliyet' : 'Cost Per BTC Mined'}</span>
        </div>
        <span className="calc-text-mono text-lg font-bold text-foreground break-words [overflow-wrap:anywhere] text-right tabular-nums" title={formatCurrency(result.costPerBtc)}>{disp(result.costPerBtc).display}</span>
      </div>
    </ResultPanel>
  );
};
