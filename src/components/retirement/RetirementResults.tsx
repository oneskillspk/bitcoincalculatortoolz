import { Progress } from "@/components/ui/progress";
import { RetirementInputs } from "@/pages/BitcoinRetirementCalculator";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { PiggyBank, Calendar, DollarSign, Target, Coins, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultPanel, ResultsGrid, ResultCard, ResultHero, ResultRow, ResultBadge } from "@/components/calculator";
import { formatCurrencyAmount, formatCurrencyForDisplay } from "@/utils/formatCurrency";

interface RetirementResultsProps {
  metrics: { totalBtcAtRetirement: number; btcPriceAtRetirement: number; totalFiatValueAtRetirement: number; yearsUntilRetirement: number; projectedYearsOfRetirement: number; totalContributions: number; roi: number; } | null;
  inputs: RetirementInputs;
  currentBtcPrice: number;
}

export const RetirementResults = ({ metrics, inputs, currentBtcPrice }: RetirementResultsProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  if (!metrics) return null;
  const locale = tr ? 'tr-TR' : (inputs.currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, inputs.currency, { locale });
  const disp = (amount: number) => formatCurrencyForDisplay(amount, inputs.currency, { locale });
  const formatBtc = (amount: number) => `₿${amount.toFixed(4)}`;

  const currentPortfolioValue = inputs.currentBtcHoldings * currentBtcPrice;
  const retirementProgress = Math.min(100, (currentPortfolioValue / metrics.totalFiatValueAtRetirement) * 100);
  const retirementDate = new Date().getFullYear() + metrics.yearsUntilRetirement;
  const annualBudget = metrics.totalFiatValueAtRetirement * 0.04;

  return (
    <ResultPanel
      eyebrow={tr ? 'Sonuç panosu' : 'Results dashboard'}
      title={tr ? 'Emeklilik Sonuç Panosu' : 'Retirement Results Dashboard'}
      description={tr ? 'Kişiselleştirilmiş Bitcoin emeklilik projeksiyonunuz' : 'Your personalized Bitcoin retirement projection'}
      icon={<PiggyBank />}
      accentBar="primary"
    >
      <ResultHero
        label={tr ? 'Toplam Emeklilik Fonu' : 'Total Retirement Fund'}
        value={disp(metrics.totalFiatValueAtRetirement).display}
        fullValue={formatCurrency(metrics.totalFiatValueAtRetirement)}
        badge={
          <ResultBadge tone="positive">
            +{metrics.roi.toFixed(0)}% {tr ? 'Toplam ROI' : 'Total ROI'}
          </ResultBadge>
        }
      />

      <ResultsGrid cols={3}>
        <ResultCard label={tr ? 'Emeklilikte BTC' : 'BTC at Retirement'} value={formatBtc(metrics.totalBtcAtRetirement)} icon={<Coins />} />
        <ResultCard label={tr ? 'Emeklilik Tarihi' : 'Retirement Date'} value={retirementDate} icon={<Calendar />} />
        <ResultCard label={tr ? 'Yıllık Bütçe' : 'Annual Budget'} value={disp(annualBudget).display} fullValue={formatCurrency(annualBudget)} icon={<DollarSign />} />
      </ResultsGrid>

      <div className="calc-surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">{tr ? 'Mevcut Varlık vs. Hedef' : 'Current Holdings vs. Target'}</h3>
            <TooltipInfo content={tr ? "Bugün zaten elinizde tuttuğunuz Bitcoin'in, nihai emeklilik fonunuzun yüzde kaçına denk geldiği." : 'What percentage of your final retirement fund you already hold in Bitcoin today.'} side="top" />
          </div>
          <ResultBadge tone={retirementProgress > 50 ? 'primary' : 'neutral'}>
            {retirementProgress.toFixed(1)}%
          </ResultBadge>
        </div>
        <Progress
          value={retirementProgress}
          className="h-3 mb-2"
          aria-label={tr ? 'Emeklilik hedefine ilerleme' : 'Progress to retirement target'}
          aria-valuetext={`${retirementProgress.toFixed(1)}%`}
        />
        {retirementProgress < 5 && (
          <p className="calc-text-small text-muted-foreground mb-4">
            {tr
              ? 'Erken aşamadayken bu oran düşük görünür — bu normaldir. DCA katkıları ve birikim ilerledikçe yüzde büyür.'
              : 'A small percentage is expected this early — DCA contributions and compounding grow this share over time.'}
          </p>
        )}
        {retirementProgress >= 5 && <div className="mb-4" />}
        <ResultsGrid cols={4}>
          <ResultCard size="sm" label={tr ? 'Mevcut Portföy' : 'Current Portfolio'} value={disp(currentPortfolioValue).display} fullValue={formatCurrency(currentPortfolioValue)} tone="primary" />
          <ResultCard size="sm" label={tr ? 'Aylık DMA' : 'Monthly DCA'} value={disp(inputs.monthlyContribution).display} fullValue={formatCurrency(inputs.monthlyContribution)} tone="primary" />
          <ResultCard size="sm" label={tr ? 'Kalan Yıl' : 'Years to Go'} value={metrics.yearsUntilRetirement} tone="primary" />
          <ResultCard size="sm" label={tr ? 'Toplam Katkı' : 'Total Contributions'} value={disp(metrics.totalContributions).display} fullValue={formatCurrency(metrics.totalContributions)} tone="primary" />
        </ResultsGrid>
      </div>

      <div className="calc-surface-card p-5">
        <div className="flex items-center space-x-2 mb-3">
          <Trophy className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-foreground">{tr ? 'Yatırım Stratejisi' : 'Investment Strategy'}</h4>
        </div>
        <ResultRow label={tr ? 'Yatırım Modu' : 'Investment Mode'} value={(() => {
          const labels: Record<string, { en: string; tr: string }> = {
            conservative: { en: 'Conservative', tr: 'Temkinli' },
            optimized: { en: 'Optimized', tr: 'Optimize' },
          };
          const m = labels[inputs.mode] ?? { en: inputs.mode, tr: inputs.mode };
          return <span>{tr ? m.tr : m.en}</span>;
        })()} />
        <ResultRow label={tr ? 'Emeklilik Süresi' : 'Retirement Duration'} value={`${metrics.projectedYearsOfRetirement} ${tr ? 'yıl' : 'years'}`} divider />
        <ResultRow label={tr ? 'Hedef Yaş' : 'Target Age'} value={`${inputs.retirementAge} ${tr ? 'yaş' : 'yrs'}`} divider />
        <ResultRow
          label={tr ? 'Tahmini Getiri' : 'Projected Returns'}
          value={`+${disp(metrics.totalFiatValueAtRetirement - metrics.totalContributions - currentPortfolioValue).display}`}
          fullValue={`+${formatCurrency(metrics.totalFiatValueAtRetirement - metrics.totalContributions - currentPortfolioValue)}`}
          tone="positive"
          divider
        />
      </div>
    </ResultPanel>
  );
};
