import { Progress } from "@/components/ui/progress";
import { formatCurrencyAmount, formatCurrencyForDisplay } from '@/utils/formatCurrency';
import { FireModeInputs } from "./FireModeInputsPanel";
import { SUPPORTED_CURRENCIES } from "@/services/bitcoinApi";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { Flame, TrendingUp, Coins, Target, Zap, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { ResultPanel, ResultsGrid, ResultCard, ResultHero, ResultRow, ResultBadge } from "@/components/calculator";

export interface FireScenario {
  label: string;
  growthRate: number;
  fireAge: number;
  yearsToFire: number;
  totalBtcAtFire: number;
  btcPriceAtFire: number;
  portfolioValueAtFire: number;
  annualBtcWithdrawal: number;
  monthlyBtcWithdrawal: number;
}

export interface FireModeResultsData {
  scenarios: FireScenario[];
  fireTarget: number;
  currentProgress: number;
}

interface FireModeResultsProps {
  results: FireModeResultsData | null;
  inputs: FireModeInputs;
  currentBtcPrice: number;
  /** When true, hide the wide scenarios panel (rendered separately full-width). */
  summaryOnly?: boolean;
}

interface FireModeScenariosPanelProps {
  results: FireModeResultsData | null;
  inputs: FireModeInputs;
}

export const FireModeResults = ({ results, inputs, currentBtcPrice, summaryOnly }: FireModeResultsProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const scenarioLabel = (label: string) => {
    if (!tr) return label;
    const map: Record<string, string> = { Bear: 'Ayı', Base: 'Temel', Bull: 'Boğa', Hyper: 'Hiper' };
    return map[label] ?? label;
  };
  if (!results) return null;

  const locale = tr ? 'tr-TR' : (inputs.currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, inputs.currency, { locale });
  const disp = (amount: number) => formatCurrencyForDisplay(amount, inputs.currency, { locale });
  const formatBtc = (amount: number) => `₿${amount.toFixed(4)}`;

  const baseScenario = results.scenarios.find(s => s.label === 'Base') || results.scenarios[1];
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <ResultPanel
        eyebrow="FIRE"
        title={tr ? 'FIRE Projeksiyonu' : 'FIRE Projection'}
        description={tr ? 'Finansal Bağımsızlık, Erken Emeklilik' : 'Financial Independence, Retire Early'}
        icon={<Flame />}
        accentBar="primary"
      >
        <ResultHero
          label={tr ? 'Tahmini FIRE tarihi' : 'Projected FIRE Date'}
          value={currentYear + baseScenario.yearsToFire}
          sub={
            <>
              {tr ? 'Yaş' : 'Age'} <span className="font-semibold text-foreground">{baseScenario.fireAge}</span> · {baseScenario.yearsToFire} {tr ? 'yıl sonra' : 'years from now'}
            </>
          }
          badge={
            <ResultBadge tone="warning">
              {inputs.withdrawalRate}% {tr ? 'Güvenli çekim oranı' : 'Safe Withdrawal Rate'}
            </ResultBadge>
          }
        />

        <ResultsGrid cols={3}>
          <ResultCard label={tr ? 'FIRE Hedefi' : 'FIRE Target'} value={disp(results.fireTarget).display} fullValue={formatCurrency(results.fireTarget)} icon={<Target />} />
          <ResultCard label={tr ? "FIRE'da BTC" : 'BTC at FIRE'} value={formatBtc(baseScenario.totalBtcAtFire)} icon={<Coins />} />
          <ResultCard label={tr ? 'BTC Fiyatı' : 'BTC Price'} value={disp(baseScenario.btcPriceAtFire).display} fullValue={formatCurrency(baseScenario.btcPriceAtFire)} icon={<TrendingUp />} />
        </ResultsGrid>

        <div className="calc-surface-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">{tr ? 'FIRE ilerlemesi' : 'Progress to FIRE'}</h3>
              <TooltipInfo content={tr ? 'Mevcut portföyünüzün FIRE hedefinize ne kadar yakın olduğunu gösterir.' : 'How close your current portfolio is to your FIRE target number.'} side="top" />
            </div>
            <ResultBadge tone={results.currentProgress > 50 ? 'primary' : 'neutral'}>
              {results.currentProgress.toFixed(1)}%
            </ResultBadge>
          </div>
          <Progress
            value={Math.min(100, results.currentProgress)}
            className="h-3 mb-3"
            aria-label={tr ? 'FIRE hedefine ilerleme' : 'Progress to FIRE target'}
            aria-valuetext={`${results.currentProgress.toFixed(1)}%`}
          />
          <ResultCard size="sm" label={tr ? 'Mevcut portföy' : 'Current Portfolio'} value={disp(inputs.currentBtcHoldings * currentBtcPrice).display} fullValue={formatCurrency(inputs.currentBtcHoldings * currentBtcPrice)} tone="primary" />
        </div>

        <div className="rounded-[var(--calc-radius-card)] border border-border/30 bg-background/50 p-5">
          <div className="flex items-center space-x-2 mb-4">
            <Coins className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">{tr ? 'BTC ile güvenli çekim (temel senaryo)' : 'Safe Withdrawal in BTC (Base Case)'}</h3>
          </div>
          <ResultsGrid cols={2}>
            <ResultCard
              label={tr ? 'Yıllık çekim' : 'Annual Withdrawal'}
              value={formatBtc(baseScenario.annualBtcWithdrawal)}
              sub={formatCurrency(inputs.annualExpenses)}
            />
            <ResultCard
              label={tr ? 'Aylık çekim' : 'Monthly Withdrawal'}
              value={formatBtc(baseScenario.monthlyBtcWithdrawal)}
              sub={formatCurrency(inputs.annualExpenses / 12)}
            />
          </ResultsGrid>
        </div>
      </ResultPanel>

      {!summaryOnly && (
        <FireModeScenariosPanel results={results} inputs={inputs} />
      )}
    </div>
  );
};

export const FireModeScenariosPanel = ({ results, inputs }: FireModeScenariosPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const scenarioLabel = (label: string) => {
    if (!tr) return label;
    const map: Record<string, string> = { Bear: 'Ayı', Base: 'Temel', Bull: 'Boğa', Hyper: 'Hiper' };
    return map[label] ?? label;
  };
  if (!results) return null;

  const locale = tr ? 'tr-TR' : (inputs.currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, inputs.currency, { locale });
  const disp = (amount: number) => formatCurrencyForDisplay(amount, inputs.currency, { locale });
  const formatBtc = (amount: number) => `₿${amount.toFixed(4)}`;
  const baseScenario = results.scenarios.find(s => s.label === 'Base') || results.scenarios[1];
  const currentYear = new Date().getFullYear();

  return (
    <ResultPanel
      eyebrow={tr ? 'Senaryolar' : 'Scenarios'}
      title={tr ? 'Büyüme senaryoları' : 'Growth Scenarios'}
      description={tr ? 'Farklı yıllık büyüme oranı varsayımları altında FIRE projeksiyonları.' : 'FIRE projections under different annual growth rate assumptions.'}
      icon={<BarChart3 />}
    >
      <ScrollableTable ariaLabel={tr ? 'FIRE senaryo karşılaştırması' : 'FIRE scenario comparison'}>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-2 px-2 text-muted-foreground font-medium">{tr ? 'Senaryo' : 'Scenario'}</th>
              <th className="text-center py-2 px-2 text-muted-foreground font-medium">{tr ? 'Büyüme' : 'Growth'}</th>
              <th className="text-center py-2 px-2 text-muted-foreground font-medium">{tr ? 'FIRE yaşı' : 'FIRE Age'}</th>
              <th className="text-center py-2 px-2 text-muted-foreground font-medium">{tr ? 'Yıl' : 'Years'}</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-medium">{tr ? 'Portföy' : 'Portfolio'}</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-medium">BTC/{tr ? 'ay' : 'mo'}</th>
            </tr>
          </thead>
          <tbody>
            {results.scenarios.map((scenario) => (
              <tr
                key={scenario.label}
                className={`border-b border-border/20 ${scenario.label === 'Base' ? 'bg-primary/5' : ''}`}
              >
                <td className="py-3 px-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      scenario.label === 'Bear' ? 'border-destructive/30 text-destructive' :
                      scenario.label === 'Base' ? 'border-primary/30 text-primary' :
                      scenario.label === 'Bull' ? 'border-success/30 text-success' :
                      'border-warning/40 text-warning bg-warning/10'
                    }`}
                  >
                    {scenarioLabel(scenario.label)}
                  </Badge>
                </td>
                <td className="text-center py-3 px-2 font-mono">{scenario.growthRate}%</td>
                <td className="text-center py-3 px-2 font-mono font-semibold">{scenario.fireAge}</td>
                <td className="text-center py-3 px-2 font-mono">{scenario.yearsToFire}y</td>
                <td className="text-right py-3 px-2 font-mono text-xs" title={formatCurrency(scenario.portfolioValueAtFire)}>{disp(scenario.portfolioValueAtFire).display}</td>
                <td className="text-right py-3 px-2 font-mono text-xs">{formatBtc(scenario.monthlyBtcWithdrawal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>

      <ResultRow
        label={tr ? 'Temel senaryo özet' : 'Base scenario summary'}
        value={`${currentYear + baseScenario.yearsToFire} · ${disp(baseScenario.portfolioValueAtFire).display}`}
        fullValue={`${currentYear + baseScenario.yearsToFire} · ${formatCurrency(baseScenario.portfolioValueAtFire)}`}
        tone="primary"
        emphasis
        divider
      />
    </ResultPanel>
  );
};
