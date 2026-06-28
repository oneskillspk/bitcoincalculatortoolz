import { CalendarDays, DollarSign, Target, Timer } from "lucide-react";
import { StackSatsResult } from "@/services/stackSatsCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultPanel, ResultsGrid, ResultCard, EmptyState } from "@/components/calculator";
import { formatCurrencyAmount, formatCurrencyForDisplay } from "@/utils/formatCurrency";

interface StackSatsResultsPanelProps {
  results: StackSatsResult | null;
  currency: string;
}

export const StackSatsResultsPanel = ({ results, currency }: StackSatsResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const fmt = (v: number) => formatCurrencyAmount(v, currency, { locale });
  const disp = (v: number) => formatCurrencyForDisplay(v, currency, { locale });


  if (!results) {
    return (
      <ResultPanel
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
        <EmptyState
          icon={<Target />}
          title={tr ? 'Hesaplamaya hazır' : 'Ready to calculate'}
          description={tr ? 'Hedefinizi belirleyin ve Bitcoin birikim zaman çizelgenizi hesaplayın' : 'Set your goal and calculate your Bitcoin accumulation timeline'}
        />
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-4">
      <ResultPanel icon={<Timer />} title={tr ? 'Hedef Zaman Çizelgeniz' : 'Your Goal Timeline'} accentBar="primary">
        <div className="space-y-2">
          <div className="flex justify-between calc-text-small">
            <span className="text-muted-foreground">{tr ? 'Mevcut İlerleme' : 'Current Progress'}</span>
            <span className="calc-text-mono font-semibold text-foreground">{results.currentProgress.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary transition-all duration-500"
              style={{ width: `${Math.min(results.currentProgress, 100)}%` }} />
          </div>
        </div>

        <ResultsGrid cols={2}>
          <ResultCard
            icon={<Timer />}
            label={tr ? 'Hedefe Kalan Süre' : 'Time to Goal'}
            value={results.yearsToGoal < 1 ? `${results.monthsToGoal} ${tr ? 'ay' : 'mo'}` : `${results.yearsToGoal} ${tr ? 'yıl' : 'yr'}`}
            size="lg"
          />
          {(() => { const d = disp(results.totalFiatInvested); return (
          <ResultCard
            icon={<DollarSign />}
            label={tr ? 'Toplam Yatırım' : 'Total Investment'}
            value={d.display}
            fullValue={d.full}
            size="lg"
          />); })()}
        </ResultsGrid>

        <div className="calc-surface-subtle flex items-center gap-3 p-4">
          <CalendarDays className="w-5 h-5 text-primary" />
          <div>
            <p className="calc-text-small text-muted-foreground">{tr ? 'Tahmini Tamamlanma Tarihi' : 'Projected Completion Date'}</p>
            <p className="font-semibold text-foreground">
              {results.projectedCompletionDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </ResultPanel>

      <ResultsGrid cols={2}>
        {(() => { const d = disp(results.averageBuyPrice); return (
        <ResultCard
          icon={<DollarSign />}
          label={tr ? 'Ort. Alış Fiyatı' : 'Avg Buy Price'}
          value={d.display}
          fullValue={d.full}
          size="lg"
        />); })()}
        <ResultCard
          icon={<Target />}
          label={tr ? 'Hedef Miktar' : 'Target Goal'}
          value={`${results.totalBtcAtGoal.toFixed(4)} BTC`}
          sub={`${(results.totalBtcAtGoal * 100000000).toLocaleString()} sats`}
          size="lg"
        />
      </ResultsGrid>
    </div>
  );
};
