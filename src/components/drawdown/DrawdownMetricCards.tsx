import { TrendingDown, ArrowDown, Clock, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { tr as trLocale } from "date-fns/locale";
import { ResultPanel } from "@/components/calculator/ResultPanel";
import { ResultsGrid } from "@/components/calculator/ResultsGrid";
import { ResultCard } from "@/components/calculator/ResultCard";
import type { DrawdownSummary } from "@/services/drawdownService";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyDisplay } from "@/utils/numberFormat";

interface Props {
  summary: DrawdownSummary;
}

export const DrawdownMetricCards = ({ summary }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  const currentDrawdown = summary.currentDrawdown;
  const inDrawdown = currentDrawdown > 0;
  const currentTone: 'negative' | 'positive' = inDrawdown ? 'negative' : 'positive';
  const ath = formatCurrencyDisplay(summary.athPrice, "$", { locale });

  const sourceLabel = summary.dataSource === 'coingecko' ? 'CoinGecko'
    : summary.dataSource === 'cryptocompare' ? 'CryptoCompare'
    : (tr ? 'Yerel anlık görüntü' : 'Local snapshot');
  const asOfStr = summary.asOf
    ? format(new Date(summary.asOf + 'T00:00:00'), 'PP', { locale: tr ? trLocale : undefined })
    : '';

  return (
    <ResultPanel
      icon={<TrendingDown />}
      title={tr ? 'Düşüş Özeti' : 'Drawdown Summary'}
      accentBar={inDrawdown ? 'negative' : 'positive'}
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? 'Düşüş sonucu' : 'Drawdown result'}
      footer={
        <p className="calc-text-small text-muted-foreground">
          {tr ? 'Veri kaynağı' : 'Data source'}: <span className="font-medium text-foreground">{sourceLabel}</span>
          {asOfStr && <> · {tr ? 'son güncelleme' : 'as of'} {asOfStr}</>}
        </p>
      }
    >
      <ResultsGrid cols={4}>
        <ResultCard
          label={tr ? 'Güncel Düşüş' : 'Current Drawdown'}
          value={inDrawdown ? `-${currentDrawdown.toFixed(1)}%` : (tr ? "ATH'de" : 'At ATH')}
          fullValue={inDrawdown ? `-${currentDrawdown.toFixed(4)}%` : undefined}
          icon={<TrendingDown />}
          tone={currentTone}
          sub={`ATH: ${ath.display}`}
        />
        <ResultCard
          label={tr ? 'En Kötü Çöküş' : 'Worst Crash Ever'}
          value={`-${summary.maxDrawdown.toFixed(1)}%`}
          fullValue={`-${summary.maxDrawdown.toFixed(4)}%`}
          icon={<ArrowDown />}
          tone="negative"
          sub={tr ? `${summary.totalCrashes} büyük çöküş boyunca` : `Across ${summary.totalCrashes} major crashes`}
        />
        <ResultCard
          label={tr ? 'Ortalama Düşüş' : 'Average Drawdown'}
          value={`-${summary.avgDrawdown.toFixed(1)}%`}
          fullValue={`-${summary.avgDrawdown.toFixed(4)}%`}
          icon={<BarChart3 />}
          tone="negative"
          sub={tr ? '%20+ düzeltmelerden' : 'Of 20%+ corrections'}
        />
        <ResultCard
          label={tr ? 'Ort. Toparlanma Süresi' : 'Avg Recovery Time'}
          value={tr ? `${summary.avgRecoveryDays} gün` : `${summary.avgRecoveryDays} days`}
          icon={<Clock />}
          sub={tr ? `~${(summary.avgRecoveryDays / 30).toFixed(0)} ay` : `~${(summary.avgRecoveryDays / 30).toFixed(0)} months`}
        />
      </ResultsGrid>
    </ResultPanel>
  );
};
