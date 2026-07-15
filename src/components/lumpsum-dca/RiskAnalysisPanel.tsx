import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ComparisonResult } from '@/services/lumpSumDcaComparator';
import { Shield, AlertTriangle, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';
import { ResultPanel, ResultBadge } from '@/components/calculator';

interface RiskAnalysisPanelProps {
  result: ComparisonResult;
  currency?: string;
}

type RiskKey = 'low' | 'medium' | 'high' | string;

interface RiskMeta {
  tone: 'positive' | 'warning' | 'negative' | 'neutral';
  color: string;
  progress: number;
}

const RISK_META: Record<'low' | 'medium' | 'high', RiskMeta> = {
  low:    { tone: 'positive', color: 'text-success',     progress: 25 },
  medium: { tone: 'warning',  color: 'text-warning',     progress: 60 },
  high:   { tone: 'negative', color: 'text-destructive', progress: 90 },
};

const getRiskMeta = (risk: RiskKey): RiskMeta =>
  RISK_META[risk as 'low' | 'medium' | 'high'] ?? { tone: 'neutral', color: 'text-muted-foreground', progress: 50 };

export const RiskAnalysisPanel = ({ result, currency = 'USD' }: RiskAnalysisPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const fmtMoney = (v: number) => {
    if (!Number.isFinite(v)) return '—';
    return formatCurrencyForDisplay(v, currency, { locale, compactAbove: 100_000 }).display;
  };
  const fmtMoneyFull = (v: number) => {
    if (!Number.isFinite(v)) return undefined;
    return formatCurrencyForDisplay(v, currency, { locale, compactAbove: 100_000 }).full;
  };
  const fmtPct = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : '—');
  const fmtRatio = (v: number) => (Number.isFinite(v) ? v.toFixed(2) : '—');

  const hasDva = !!result.dva;

  const L = {
    riskLevel:    tr ? 'Risk Seviyesi' : 'Risk Level',
    maxDrawdown:  tr ? 'Maksimum Düşüş' : 'Max Drawdown',
    volatility:   tr ? 'Oynaklık' : 'Volatility',
    sharpe:       tr ? 'Sharpe Oranı' : 'Sharpe Ratio',
    best:         tr ? 'En İyi Performans' : 'Best Performance',
    worst:        tr ? 'En Kötü Performans' : 'Worst Performance',
    lumpBest:     tr ? 'Toplu Yatırım En İyi' : 'Lump Sum Best',
    dcaBest:      tr ? 'DCA En İyi' : 'DCA Best',
    dvaBest:      tr ? 'DVA En İyi' : 'DVA Best',
    lumpWorst:    tr ? 'Toplu Yatırım En Kötü' : 'Lump Sum Worst',
    dcaWorst:     tr ? 'DCA En Kötü' : 'DCA Worst',
    dvaWorst:     tr ? 'DVA En Kötü' : 'DVA Worst',
    summary:      tr ? 'Risk Değerlendirme Özeti' : 'Risk Assessment Summary',
  };

  const renderRiskColumn = (
    label: string,
    riskKey: RiskKey,
    metrics: typeof result.lumpSum.performanceMetrics,
  ) => {
    const meta = getRiskMeta(riskKey);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{label}</h3>
          <ResultBadge tone={meta.tone}>{String(riskKey).toUpperCase()}</ResultBadge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{L.riskLevel}</span>
              <span className="font-medium text-foreground tabular-nums">{meta.progress}%</span>
            </div>
            <Progress value={meta.progress} className="h-2" aria-label={`${label} ${L.riskLevel}: ${meta.progress}%`} />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{L.maxDrawdown}:</span>
              <span className="font-medium text-foreground tabular-nums">{fmtPct(metrics.maxDrawdown)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{L.volatility}:</span>
              <span className="font-medium text-foreground tabular-nums">{fmtPct(metrics.volatility)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{L.sharpe}:</span>
              <span className="font-medium text-foreground tabular-nums">{fmtRatio(metrics.sharpeRatio)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const perfRow = (label: string, value: number) => (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span
        className="font-medium text-foreground tabular-nums"
        title={fmtMoneyFull(value)}
      >
        {fmtMoney(value)}
      </span>
    </div>
  );

  return (
    <ResultPanel
      icon={<Shield />}
      title={tr ? 'Risk Analizi' : 'Risk Analysis'}
      description={tr ? 'Stratejiler arasında risk metriklerini ve oynaklığı karşılaştırın' : 'Compare risk metrics and volatility between strategies'}
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? 'Risk analizi sonucu' : 'Risk analysis result'}
    >
      {/* Risk Level Comparison */}
      <div className={`grid grid-cols-1 ${hasDva ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {renderRiskColumn(tr ? 'Toplu Yatırım Riski' : 'Lump Sum Risk', result.summary.riskAnalysis.lumpSumRisk, result.lumpSum.performanceMetrics)}
        {renderRiskColumn(tr ? 'DCA Riski' : 'DCA Risk', result.summary.riskAnalysis.dcaRisk, result.dca.performanceMetrics)}
        {hasDva && result.dva && result.summary.riskAnalysis.dvaRisk && (
          renderRiskColumn(tr ? 'DVA Riski' : 'DVA Risk', result.summary.riskAnalysis.dvaRisk, result.dva.performanceMetrics)
        )}
      </div>

      {/* Risk Factors */}
      <div className={`grid grid-cols-1 ${hasDva ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        <div className="calc-surface-subtle p-4">
          <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            {tr ? 'Toplu Yatırım Riskleri' : 'Lump Sum Risks'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-destructive shrink-0" />
              <span className="text-muted-foreground">{tr ? 'Zamanlama riski - piyasa zirvesinde alım yapabilirsiniz' : 'Timing risk - could buy at market peak'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-destructive shrink-0" />
              <span className="text-muted-foreground">{tr ? 'Ani piyasa düşüşlerine tam maruz kalma' : 'Full exposure to immediate market downturns'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-destructive shrink-0" />
              <span className="text-muted-foreground">{tr ? 'Büyük tek seferlik yatırımın psikolojik baskısı' : 'Psychological pressure from large single investment'}</span>
            </div>
          </div>
        </div>

        <div className="calc-surface-subtle p-4">
          <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
            <Shield className="w-4 h-4 text-success" />
            {tr ? 'DCA Avantajları' : 'DCA Advantages'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-success shrink-0" />
              <span className="text-muted-foreground">{tr ? 'Piyasa zamanlamasının etkisini azaltır' : 'Reduces impact of market timing'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-success shrink-0" />
              <span className="text-muted-foreground">{tr ? 'Fiyat oynaklığını zamana yayarak yumuşatır' : 'Smooths out price volatility over time'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-success shrink-0" />
              <span className="text-muted-foreground">{tr ? 'Disiplin kazandırır ve duygusal kararları azaltır' : 'Builds discipline and reduces emotional decisions'}</span>
            </div>
          </div>
        </div>

        {hasDva && (
          <div className="calc-surface-subtle p-4">
            <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
              <Target className="w-4 h-4 text-primary" />
              {tr ? 'DVA Özellikleri' : 'DVA Characteristics'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-primary shrink-0" />
                <span className="text-muted-foreground">{tr ? 'Fiyatlar düştüğünde daha fazla yatırım yapar (düşükten alır)' : 'Invests more when prices drop (buy low)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-primary shrink-0" />
                <span className="text-muted-foreground">{tr ? 'İstikrarlı portföy değeri büyümesini hedefler' : 'Targets steady portfolio value growth'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-3 h-3 text-warning shrink-0" />
                <span className="text-muted-foreground">{tr ? 'Dönem başına değişken yatırım tutarları' : 'Variable investment amounts per period'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Best and Worst Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="calc-surface-subtle p-4">
          <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
            <TrendingUp className="w-4 h-4 text-success" />
            {L.best}
          </h4>
          <div className="space-y-2 text-sm">
            {perfRow(L.lumpBest, result.lumpSum.performanceMetrics.bestDay.value)}
            {perfRow(L.dcaBest, result.dca.performanceMetrics.bestDay.value)}
            {result.dva && perfRow(L.dvaBest, result.dva.performanceMetrics.bestDay.value)}
          </div>
        </div>

        <div className="calc-surface-subtle p-4">
          <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
            <TrendingDown className="w-4 h-4 text-destructive" />
            {L.worst}
          </h4>
          <div className="space-y-2 text-sm">
            {perfRow(L.lumpWorst, result.lumpSum.performanceMetrics.worstDay.value)}
            {perfRow(L.dcaWorst, result.dca.performanceMetrics.worstDay.value)}
            {result.dva && perfRow(L.dvaWorst, result.dva.performanceMetrics.worstDay.value)}
          </div>
        </div>
      </div>

      {/* Risk Recommendation */}
      <div className="calc-surface-subtle p-6">
        <h4 className="font-semibold text-foreground mb-3 text-center">{L.summary}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
          {result.summary.riskAnalysis.recommendation}
        </p>
      </div>
    </ResultPanel>
  );
};
