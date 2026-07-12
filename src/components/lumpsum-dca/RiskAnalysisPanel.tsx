import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ComparisonResult } from '@/services/lumpSumDcaComparator';
import { Shield, AlertTriangle, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';
import { ResultPanel } from '@/components/calculator';

interface RiskAnalysisPanelProps {
  result: ComparisonResult;
}

export const RiskAnalysisPanel = ({ result }: RiskAnalysisPanelProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const fmtInt = (v: number) => formatGroupedInt(v, locale);
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getRiskLevel = (risk: string) => {
    switch (risk) {
      case 'low': return { color: 'text-success', bg: 'bg-success/10', progress: 25 };
      case 'medium': return { color: 'text-warning', bg: 'bg-warning/$3', progress: 60 };
      case 'high': return { color: 'text-destructive', bg: 'bg-destructive/10', progress: 90 };
      default: return { color: 'text-muted-foreground', bg: 'bg-muted', progress: 50 };
    }
  };

  const lumpSumRisk = getRiskLevel(result.summary.riskAnalysis.lumpSumRisk);
  const dcaRisk = getRiskLevel(result.summary.riskAnalysis.dcaRisk);
  const dvaRisk = result.summary.riskAnalysis.dvaRisk ? getRiskLevel(result.summary.riskAnalysis.dvaRisk) : null;
  const hasDva = !!result.dva;

  const renderRiskColumn = (
    label: string,
    riskLevel: ReturnType<typeof getRiskLevel>,
    riskName: string,
    metrics: typeof result.lumpSum.performanceMetrics
  ) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{label}</h3>
        <Badge className={`${riskLevel.color} border-current`} variant="outline">
          {riskName.toUpperCase()}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Risk Level</span>
            <span className={riskLevel.color}>{riskLevel.progress}%</span>
          </div>
          <Progress value={riskLevel.progress} className="h-2" />
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Drawdown:</span>
            <span className="font-medium text-foreground">
              {formatPercentage(metrics.maxDrawdown)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volatility:</span>
            <span className="font-medium text-foreground">
              {formatPercentage(metrics.volatility)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sharpe Ratio:</span>
            <span className="font-medium text-foreground">
              {metrics.sharpeRatio.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ResultPanel
      icon={<Shield />}
      title={tr ? 'Risk Analizi' : 'Risk Analysis'}
      description={tr ? 'Stratejiler arasında risk metriklerini ve oynaklığı karşılaştırın' : 'Compare risk metrics and volatility between strategies'}
    >
      {/* Risk Level Comparison */}
      <div className={`grid grid-cols-1 ${hasDva ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {renderRiskColumn(tr ? 'Toplu Yatırım Riski' : 'Lump Sum Risk', lumpSumRisk, result.summary.riskAnalysis.lumpSumRisk, result.lumpSum.performanceMetrics)}
        {renderRiskColumn(tr ? 'DCA Riski' : 'DCA Risk', dcaRisk, result.summary.riskAnalysis.dcaRisk, result.dca.performanceMetrics)}
        {hasDva && dvaRisk && result.dva && (
          renderRiskColumn(tr ? 'DVA Riski' : 'DVA Risk', dvaRisk, result.summary.riskAnalysis.dvaRisk!, result.dva.performanceMetrics)
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
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="text-muted-foreground">{tr ? 'Zamanlama riski - piyasa zirvesinde alım yapabilirsiniz' : 'Timing risk - could buy at market peak'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="text-muted-foreground">{tr ? 'Ani piyasa düşüşlerine tam maruz kalma' : 'Full exposure to immediate market downturns'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3 h-3 text-destructive" />
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
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-muted-foreground">{tr ? 'Piyasa zamanlamasının etkisini azaltır' : 'Reduces impact of market timing'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-muted-foreground">{tr ? 'Fiyat oynaklığını zamana yayarak yumuşatır' : 'Smooths out price volatility over time'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-muted-foreground">{tr ? 'Disiplin kazandırır ve duygusal kararları azaltır' : 'Builds discipline and reduces emotional decisions'}</span>
            </div>
          </div>
        </div>

        {hasDva && (
          <div className="calc-surface-subtle p-4">
            <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
              <Target className="w-4 h-4 text-purple-500" />
              {tr ? 'DVA Özellikleri' : 'DVA Characteristics'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-purple-500" />
                <span className="text-muted-foreground">{tr ? 'Fiyatlar düştüğünde daha fazla yatırım yapar (düşükten alır)' : 'Invests more when prices drop (buy low)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-purple-500" />
                <span className="text-muted-foreground">{tr ? 'İstikrarlı portföy değeri büyümesini hedefler' : 'Targets steady portfolio value growth'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-3 h-3 text-warning" />
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
            {tr ? 'En İyi Performans' : 'Best Performance'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr ? 'Toplu Yatırım En İyi:' : 'Lump Sum Best:'}</span>
              <span className="font-medium text-foreground">
                ${fmtInt(result.lumpSum.performanceMetrics.bestDay.value)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr ? 'DCA En İyi:' : 'DCA Best:'}</span>
              <span className="font-medium text-foreground">
                ${fmtInt(result.dca.performanceMetrics.bestDay.value)}
              </span>
            </div>
            {result.dva && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tr ? 'DVA En İyi:' : 'DVA Best:'}</span>
                <span className="font-medium text-foreground">
                  ${fmtInt(result.dva.performanceMetrics.bestDay.value)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="calc-surface-subtle p-4">
          <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
            <TrendingDown className="w-4 h-4 text-destructive" />
            {tr ? 'En Kötü Performans' : 'Worst Performance'}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr ? 'Toplu Yatırım En Kötü:' : 'Lump Sum Worst:'}</span>
              <span className="font-medium text-foreground">
                ${fmtInt(result.lumpSum.performanceMetrics.worstDay.value)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr ? 'DCA En Kötü:' : 'DCA Worst:'}</span>
              <span className="font-medium text-foreground">
                ${fmtInt(result.dca.performanceMetrics.worstDay.value)}
              </span>
            </div>
            {result.dva && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{tr ? 'DVA En Kötü:' : 'DVA Worst:'}</span>
                <span className="font-medium text-foreground">
                  ${fmtInt(result.dva.performanceMetrics.worstDay.value)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Recommendation */}
      <div className="calc-surface-subtle p-6 bg-gradient-to-r from-primary/5 to-primary/10">
        <h4 className="font-semibold text-foreground mb-3 text-center">
          {tr ? 'Risk Değerlendirme Özeti' : 'Risk Assessment Summary'}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed text-center">
          {result.summary.riskAnalysis.recommendation}
        </p>
      </div>
    </ResultPanel>
  );
};
