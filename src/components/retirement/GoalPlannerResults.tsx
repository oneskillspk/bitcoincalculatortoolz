import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { formatCurrencyAmount, formatCurrencyForDisplay } from '@/utils/formatCurrency';
import { GoalPlannerInputs } from "./GoalPlannerInputsPanel";
import {
  Target,
  Calendar,
  DollarSign,
  Coins,
  AlertTriangle,
  CheckCircle,
  Info,
  Trophy,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultPanel, ResultsGrid, ResultCard, ResultHero, ResultRow, ResultBadge } from "@/components/calculator";

interface GoalPlannerResultsProps {
  results: {
    requiredMonthlyInvestment: number;
    totalBtcNeededAtRetirement: number;
    totalInvestmentRequired: number;
    feasible: boolean;
    alternativeSuggestions?: {
      retireOneYearLater?: number;
      retireTwoYearsLater?: number;
      reduceBudgetBy10Percent?: number;
      reduceBudgetBy20Percent?: number;
    };
  } | null;
  inputs: GoalPlannerInputs;
  currentBtcPrice: number;
}

/**
 * Goal Planner results — mirrors the Forecaster RetirementResults rhythm exactly:
 *   ResultPanel
 *     → ResultHero
 *     → ResultsGrid cols=3
 *     → calc-surface-card (progress + cols=4 stats)
 *     → calc-surface-card (strategy rows)
 *   When goal is not feasible, a second ResultPanel renders below with
 *   space-y-6 between them (matches Forecaster section spacing).
 */
export const GoalPlannerResults = ({ results, inputs, currentBtcPrice }: GoalPlannerResultsProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  if (!results) return null;

  const locale = tr ? 'tr-TR' : (inputs.currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, inputs.currency, { locale });
  const disp = (amount: number) => formatCurrencyForDisplay(amount, inputs.currency, { locale });
  const formatBtc = (amount: number) => `₿${amount.toFixed(4)}`;

  const yearsToRetirement = inputs.desiredRetirementAge - inputs.currentAge;
  const currentPortfolioValue = inputs.currentBtcHoldings * currentBtcPrice;
  const monthlyBudgetGoal = inputs.desiredAnnualBudget / 12;
  const targetFiatValue = results.totalBtcNeededAtRetirement * currentBtcPrice;
  const goalProgress = targetFiatValue > 0
    ? Math.min(100, (currentPortfolioValue / targetFiatValue) * 100)
    : 0;

  const showSuggestions = !results.feasible && !!results.alternativeSuggestions;

  const mainPanel = (
    <ResultPanel
      eyebrow={tr ? 'Plan' : 'Plan'}
      title={tr ? 'Hedefe Ulaşma Planınız' : 'Your Goal Achievement Plan'}
      description={tr ? 'Tam olarak yapmanız gerekenler' : "Here's exactly what you need to do"}
      icon={<Target />}
      accentBar={results.feasible ? 'positive' : 'negative'}
    >
      <ResultHero
        label={tr ? 'Yatırmanız gereken tutar' : 'You Need to Invest'}
        value={disp(results.requiredMonthlyInvestment).display}
        sub={tr ? 'hedefine ulaşmak için aylık' : 'per month to reach your goal'}
        fullValue={formatCurrency(results.requiredMonthlyInvestment)}
        badge={
          results.feasible ? (
            <ResultBadge tone="positive" icon={<CheckCircle />}>
              {tr ? 'Hedef ulaşılabilir' : 'Goal is Achievable'}
            </ResultBadge>
          ) : (
            <ResultBadge tone="negative" icon={<AlertTriangle />}>
              {tr ? 'Zorlayıcı hedef' : 'Challenging Goal'}
            </ResultBadge>
          )
        }
      />

      <ResultsGrid cols={3}>
        <ResultCard label={tr ? 'Gerekli BTC' : 'BTC Needed'} value={formatBtc(results.totalBtcNeededAtRetirement)} icon={<Coins />} />
        <ResultCard label={tr ? 'Kalan Yıl' : 'Years to Goal'} value={String(yearsToRetirement)} icon={<Calendar />} />
        <ResultCard label={tr ? 'Aylık Bütçe' : 'Monthly Budget'} value={disp(monthlyBudgetGoal).display} icon={<DollarSign />} fullValue={formatCurrency(monthlyBudgetGoal)} />
      </ResultsGrid>

      <div className="calc-surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              {tr ? 'Mevcut Varlık vs. Hedef' : 'Current Holdings vs. Target'}
            </h3>
            <TooltipInfo
              content={tr
                ? 'Bugünkü Bitcoin portföyünüzün hedef tutarın yüzde kaçına denk geldiği.'
                : 'What percentage of your goal target your current Bitcoin holdings already cover.'}
              side="top"
            />
          </div>
          <ResultBadge tone={goalProgress > 50 ? 'primary' : 'neutral'}>
            {goalProgress.toFixed(1)}%
          </ResultBadge>
        </div>
        <Progress
          value={goalProgress}
          className="h-3 mb-2"
          aria-label={tr ? 'Hedefe ilerleme' : 'Progress to goal target'}
          aria-valuetext={`${goalProgress.toFixed(1)}%`}
        />
        {goalProgress < 5 ? (
          <p className="calc-text-small text-muted-foreground mb-4">
            {tr
              ? 'Erken aşamadayken bu oran düşük görünür — bu normaldir. Aylık katkılar ve birikim büyüdükçe yüzde artar.'
              : 'A small percentage is expected this early — monthly contributions and compounding grow this share over time.'}
          </p>
        ) : <div className="mb-4" />}
        <ResultsGrid cols={4}>
          <ResultCard size="sm" label={tr ? 'Mevcut portföy' : 'Current Portfolio'} value={disp(currentPortfolioValue).display} fullValue={formatCurrency(currentPortfolioValue)} tone="primary" />
          <ResultCard size="sm" label={tr ? 'Hedef tutar' : 'Target Amount'} value={disp(targetFiatValue).display} fullValue={formatCurrency(targetFiatValue)} tone="primary" />
          <ResultCard size="sm" label={tr ? 'Gerekli aylık' : 'Required Monthly'} value={disp(results.requiredMonthlyInvestment).display} fullValue={formatCurrency(results.requiredMonthlyInvestment)} tone="primary" />
          <ResultCard size="sm" label={tr ? 'Toplam yatırım' : 'Total Investment'} value={disp(results.totalInvestmentRequired).display} fullValue={formatCurrency(results.totalInvestmentRequired)} tone="primary" />
        </ResultsGrid>
      </div>

      <div className="calc-surface-card p-5">
        <div className="flex items-center space-x-2 mb-3">
          <Trophy className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-foreground">{tr ? 'Yatırım Stratejisi' : 'Investment Strategy'}</h4>
        </div>
        <ResultRow label={tr ? 'Hedef emeklilik yaşı' : 'Target Retirement Age'} value={`${inputs.desiredRetirementAge} ${tr ? 'yaş' : 'yrs'}`} />
        <ResultRow label={tr ? 'Beklenen büyüme' : 'Expected Growth'} value={`${inputs.expectedGrowthRate}% ${tr ? 'yıllık' : 'annually'}`} divider />
        <ResultRow label={tr ? 'Enflasyona göre ayarlı' : 'Inflation Adjusted'} value={`${inputs.inflationRate}% ${tr ? 'yıllık' : 'annually'}`} divider />
        <ResultRow
          label={tr ? 'Aylık bütçe hedefi' : 'Monthly Budget Goal'}
          value={disp(monthlyBudgetGoal).display}
          fullValue={formatCurrency(monthlyBudgetGoal)}
          tone="positive"
          divider
        />
      </div>
    </ResultPanel>
  );

  if (!showSuggestions) return mainPanel;

  return (
    <div className="w-full space-y-6">
      {mainPanel}
      <ResultPanel
        eyebrow={tr ? 'Öneriler' : 'Suggestions'}
        title={tr ? 'Hedefi iyileştirme önerileri' : 'Goal Optimization Suggestions'}
        description={tr ? 'Mevcut hedefiniz zorlayıcı olabilir. İşte değerlendirebileceğiniz alternatifler:' : 'Your current goal may be challenging. Here are some alternatives to consider:'}
        icon={<AlertTriangle />}
        accentBar="negative"
      >
        <div className="space-y-3">
          {results.alternativeSuggestions?.retireOneYearLater !== undefined && (
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                <strong>{tr ? '1 yıl sonra emekli olun:' : 'Retire 1 year later:'}</strong>{' '}
                {tr ? 'Aylık gereksinimi azaltır:' : 'Reduce monthly requirement to'}{' '}
                {formatCurrency(results.alternativeSuggestions.retireOneYearLater)}
              </AlertDescription>
            </Alert>
          )}
          {results.alternativeSuggestions?.retireTwoYearsLater !== undefined && (
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                <strong>{tr ? '2 yıl sonra emekli olun:' : 'Retire 2 years later:'}</strong>{' '}
                {tr ? 'Aylık gereksinimi azaltır:' : 'Reduce monthly requirement to'}{' '}
                {formatCurrency(results.alternativeSuggestions.retireTwoYearsLater)}
              </AlertDescription>
            </Alert>
          )}
          {results.alternativeSuggestions?.reduceBudgetBy10Percent !== undefined && (
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                <strong>{tr ? 'Bütçeyi %10 azaltın:' : 'Reduce budget by 10%:'}</strong>{' '}
                {tr ? 'Aylık gereksinim olur:' : 'Monthly requirement becomes'}{' '}
                {formatCurrency(results.alternativeSuggestions.reduceBudgetBy10Percent)}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </ResultPanel>
    </div>
  );
};
