import { Skull, TrendingUp, CalendarDays, MessageSquareWarning } from "lucide-react";
import { ObituariesResult } from "@/services/bitcoinObituariesService";
import { useNumberCounter } from "@/hooks/useNumberCounter";
import { formatCurrency } from "@/utils/formatters";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultPanel, ResultsGrid, ResultCard, ResultHero, ResultRow, EmptyState } from "@/components/calculator";
import { formatGroupedInt } from "@/utils/numberFormat";

interface ObituariesResultsPanelProps {
  result: ObituariesResult | null;
}

export const ObituariesResultsPanel = ({ result }: ObituariesResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const deathCounter = useNumberCounter({ end: result?.totalCount || 0, duration: 1200, isActive: !!result });
  const avgROICounter = useNumberCounter({ end: result?.avgROI || 0, duration: 1200, isActive: !!result, decimals: 0 });

  if (!result) {
    return (
      <ResultPanel
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}>
        <EmptyState
          icon={<Skull />}
          title={tr ? 'Takibe Hazır' : 'Ready to Track'}
          description={tr ? 'Ölüm sayısını görmek için obituaryları filtreleyin' : 'Filter obituaries to see the death count'}
        />
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-6">
      <ResultPanel
        eyebrow={tr ? 'Ölüm sayısı' : 'Death count'}
        title={tr ? 'Bitcoin Obituaryları' : 'Bitcoin Obituaries'}
        icon={<Skull />}
        accentBar="primary"
      >
        <ResultHero
          label={tr ? '2010’dan bu yana ilan edilen kez' : 'Times declared since 2010'}
          value={formatGroupedInt(deathCounter, tr ? 'tr-TR' : 'en-US')}
        />
      </ResultPanel>

      <ResultsGrid cols={2}>
        <ResultPanel
          eyebrow={tr ? 'YG' : 'ROI'}
          title={tr ? 'Alındıysa YG' : 'ROI If You Bought'}
          icon={<TrendingUp />}
        >
          <ResultRow
            label={tr ? "Obituary'daki Ort. Fiyat" : 'Avg. Price at Obituary'}
            value={formatCurrency(result.avgPriceAtObituary, { symbol: '$', code: 'USD' })}
          />
          <ResultRow
            label={tr ? 'Güncel BTC Fiyatı' : 'Current BTC Price'}
            value={formatCurrency(result.currentBtcPrice, { symbol: '$', code: 'USD' })}
          />
          <ResultRow
            label={tr ? 'Ortalama YG' : 'Average ROI'}
            value={`+${formatGroupedInt(avgROICounter, tr ? 'tr-TR' : 'en-US')}%`}
            tone="primary"
            emphasis
            divider
          />
        </ResultPanel>

        <ResultPanel
          eyebrow={tr ? 'En aktif' : 'Peak'}
          title={tr ? 'En Aktif Yıl' : 'Most Active Year'}
          icon={<CalendarDays />}
        >
          <ResultsGrid cols={2}>
            <ResultCard label={tr ? 'Yıl' : 'Year'} value={result.mostActiveYear.year || 'N/A'} />
            <ResultCard label={tr ? 'İlan Edilen' : 'Declared'} value={result.mostActiveYear.count} />
          </ResultsGrid>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((result.mostActiveYear.count / result.totalCount) * 100, 100)}%` }}
            />
          </div>
        </ResultPanel>
      </ResultsGrid>

      <ResultPanel
        eyebrow={tr ? 'Eleştirmenler' : 'Critics'}
        title={tr ? 'En Çok Eleştiren' : 'Top Critics'}
        icon={<MessageSquareWarning />}
      >
        <div className="space-y-2">
          {result.topSources.slice(0, 5).map((source, index) => (
            <div
              key={source.source}
              className="flex items-center justify-between p-3 rounded-[var(--calc-radius-input)] bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-full bg-muted/40 flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                  {index + 1}
                </div>
                <p className="font-medium text-foreground text-sm truncate">{source.source}</p>
              </div>
              <div className="text-xs text-muted-foreground font-mono tabular-nums">{source.count}</div>
            </div>
          ))}
        </div>
      </ResultPanel>
    </div>
  );
};
