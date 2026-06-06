import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrencyAmount, formatCurrencyForDisplay } from '@/utils/formatCurrency';
import { GoalPlannerInputs } from "./GoalPlannerInputsPanel";
import { SUPPORTED_CURRENCIES } from "@/services/bitcoinApi";
import {
  Target,
  Calendar,
  DollarSign,
  Coins,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
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

  return (
    <div className="w-full space-y-6">
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
      </ResultPanel>

      {!results.feasible && results.alternativeSuggestions && (
        <ResultPanel
          eyebrow={tr ? 'Öneriler' : 'Suggestions'}
          title={tr ? 'Hedefi iyileştirme önerileri' : 'Goal Optimization Suggestions'}
          description={tr ? 'Mevcut hedefiniz zorlayıcı olabilir. İşte değerlendirebileceğiniz alternatifler:' : 'Your current goal may be challenging. Here are some alternatives to consider:'}
          icon={<AlertTriangle />}
          accentBar="negative"
        >
          <div className="space-y-3">
            {results.alternativeSuggestions.retireOneYearLater && (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>{tr ? '1 yıl sonra emekli olun:' : 'Retire 1 year later:'}</strong> {tr ? 'Aylık gereksinimi azaltır:' : 'Reduce monthly requirement to'} {formatCurrency(results.alternativeSuggestions.retireOneYearLater)}
                </AlertDescription>
              </Alert>
            )}
            {results.alternativeSuggestions.retireTwoYearsLater && (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>{tr ? '2 yıl sonra emekli olun:' : 'Retire 2 years later:'}</strong> {tr ? 'Aylık gereksinimi azaltır:' : 'Reduce monthly requirement to'} {formatCurrency(results.alternativeSuggestions.retireTwoYearsLater)}
                </AlertDescription>
              </Alert>
            )}
            {results.alternativeSuggestions.reduceBudgetBy10Percent && (
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>{tr ? 'Bütçeyi %10 azaltın:' : 'Reduce budget by 10%:'}</strong> {tr ? 'Aylık gereksinim olur:' : 'Monthly requirement becomes'} {formatCurrency(results.alternativeSuggestions.reduceBudgetBy10Percent)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </ResultPanel>
      )}

      <ResultPanel
        eyebrow={tr ? 'Strateji' : 'Strategy'}
        title={tr ? 'Yatırım Stratejisi Özeti' : 'Investment Strategy Summary'}
        icon={<Calculator />}
      >
        <ResultRow label={tr ? 'Mevcut portföy' : 'Current Portfolio'} value={disp(currentPortfolioValue).display} fullValue={formatCurrency(currentPortfolioValue)} />
        <ResultRow label={tr ? 'Gerekli aylık' : 'Required Monthly'} value={disp(results.requiredMonthlyInvestment).display} fullValue={formatCurrency(results.requiredMonthlyInvestment)} divider />
        <ResultRow label={tr ? 'Toplam yatırım' : 'Total Investment'} value={disp(results.totalInvestmentRequired).display} fullValue={formatCurrency(results.totalInvestmentRequired)} divider emphasis />
        <ResultRow label={tr ? 'Beklenen büyüme' : 'Expected Growth'} value={`${inputs.expectedGrowthRate}% ${tr ? 'yıllık' : 'annually'}`} divider />
        <ResultRow label={tr ? 'Hedef emeklilik yaşı' : 'Target Retirement Age'} value={`${inputs.desiredRetirementAge} ${tr ? 'yaşında' : 'years old'}`} divider />
        <ResultRow label={tr ? 'Enflasyona göre ayarlı' : 'Inflation Adjusted'} value={`${inputs.inflationRate}% ${tr ? 'yıllık' : 'annually'}`} divider />
      </ResultPanel>

      {results.feasible && (
        <ResultPanel
          eyebrow={tr ? 'Tebrikler' : 'Success'}
          title={tr ? 'Hedefiniz ulaşılabilir' : 'Your Goal is Achievable'}
          icon={<CheckCircle />}
          accentBar="positive"
          footer={
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">{tr ? 'Sonraki adımlar:' : 'Next Steps:'}</strong>{' '}
              {tr ? 'Aylık Bitcoin alımlarınızı otomatikleştirmek için Dolar Maliyet Ortalaması (DMA/DCA) planı kurmayı düşünün.' : 'Consider setting up a Dollar Cost Averaging (DCA) plan to automate your monthly Bitcoin purchases.'}
            </p>
          }
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tr ? (
              <>
                <strong className="text-foreground">{formatCurrency(results.requiredMonthlyInvestment)}</strong> tutarında aylık Bitcoin yatırımı yaparak önümüzdeki <strong className="text-foreground">{yearsToRetirement} yıl</strong> boyunca emeklilikte <strong className="text-foreground">{formatCurrency(monthlyBudgetGoal)} aylık</strong> yaşam standardınızı koruyabilirsiniz.
              </>
            ) : (
              <>
                By investing <strong className="text-foreground">{formatCurrency(results.requiredMonthlyInvestment)}</strong> per month in Bitcoin for the next <strong className="text-foreground">{yearsToRetirement} years</strong>, you'll be able to maintain your desired lifestyle of <strong className="text-foreground">{formatCurrency(monthlyBudgetGoal)} per month</strong> throughout retirement.
              </>
            )}
          </p>
        </ResultPanel>
      )}
    </div>
  );
};
