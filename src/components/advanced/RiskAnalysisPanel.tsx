import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskAnalyzer, RiskMetrics, VolatilityAnalysis, DrawdownPeriod } from '@/services/riskAnalyzer';
import { BitcoinPrice } from '@/services/bitcoinApi';
import {
  AlertTriangle, TrendingDown, Shield, Activity,
  Target, BarChart3, Info
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RiskAnalysisPanelProps {
  priceData: BitcoinPrice[];
  currentValue: number;
  initialInvestment: number;
}

export const RiskAnalysisPanel: React.FC<RiskAnalysisPanelProps> = ({
  priceData,
  currentValue,
  initialInvestment
}) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [volatilityAnalysis, setVolatilityAnalysis] = useState<VolatilityAnalysis | null>(null);
  const [drawdownPeriods, setDrawdownPeriods] = useState<DrawdownPeriod[]>([]);

  useEffect(() => {
    if (priceData.length > 30) {
      setRiskMetrics(RiskAnalyzer.calculateRiskMetrics(priceData));
      setVolatilityAnalysis(RiskAnalyzer.calculateVolatilityAnalysis(priceData));
      setDrawdownPeriods(RiskAnalyzer.findDrawdownPeriods(priceData));
    }
  }, [priceData]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'conservative': return 'text-success bg-success/10';
      case 'moderate': return 'text-warning bg-warning/$3';
      case 'aggressive': return 'text-orange-600 bg-orange-500/10';
      case 'speculative': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const translateRiskLevel = (level: string) => {
    if (!isTr) return level.toUpperCase();
    const map: Record<string, string> = {
      conservative: 'MUHAFAZAKÂR',
      moderate: 'ORTA',
      aggressive: 'AGRESIF',
      speculative: 'SPEKÜLATIF',
    };
    return map[level] || level.toUpperCase();
  };

  const translateVolatilityRegime = (regime: string) => {
    if (!isTr) return regime.toUpperCase();
    const map: Record<string, string> = { low: 'DÜŞÜK', normal: 'NORMAL', high: 'YÜKSEK', extreme: 'AŞIRI' };
    return map[regime] || regime.toUpperCase();
  };

  const getVolatilityColor = (regime: string) => {
    switch (regime) {
      case 'low': return 'text-success';
      case 'normal': return 'text-blue-600';
      case 'high': return 'text-orange-600';
      case 'extreme': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const translateSharpe = (ratio: number) => {
    if (ratio > 1) return isTr ? 'Mükemmel' : 'Excellent';
    if (ratio > 0.5) return isTr ? 'İyi' : 'Good';
    if (ratio > 0) return isTr ? 'Orta' : 'Fair';
    return isTr ? 'Zayıf' : 'Poor';
  };

  if (!riskMetrics || !volatilityAnalysis) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              {isTr ? 'Risk metrikleri analiz ediliyor...' : 'Analyzing risk metrics...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {isTr ? 'Risk Analizi & Oynaklık Metrikleri' : 'Risk Analysis & Volatility Metrics'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview">{isTr ? 'Genel Bakış' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="volatility">{isTr ? 'Oynaklık' : 'Volatility'}</TabsTrigger>
            <TabsTrigger value="drawdowns">{isTr ? 'Düşüşler' : 'Drawdowns'}</TabsTrigger>
            <TabsTrigger value="advanced">{isTr ? 'Gelişmiş' : 'Advanced'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{isTr ? 'Risk Seviyesi' : 'Risk Level'}</span>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </div>
                <Badge className={getRiskLevelColor(volatilityAnalysis.riskLevel)}>
                  {translateRiskLevel(volatilityAnalysis.riskLevel)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {isTr
                    ? `Güncel oynaklığa göre: ${(volatilityAnalysis.current * 100).toFixed(1)}%`
                    : `Based on current volatility: ${(volatilityAnalysis.current * 100).toFixed(1)}%`}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{isTr ? 'Sharpe Oranı' : 'Sharpe Ratio'}</span>
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold">{riskMetrics.sharpeRatio.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {translateSharpe(riskMetrics.sharpeRatio)}{' '}
                  {isTr ? 'riske göre düzeltilmiş getiri' : 'risk-adjusted returns'}
                </p>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{isTr ? 'Maks. Düşüş' : 'Max Drawdown'}</span>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </div>
                <div className="text-lg font-semibold text-destructive">
                  -{(riskMetrics.maxDrawdown * 100).toFixed(1)}%
                </div>
                <Progress value={riskMetrics.maxDrawdown * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">{isTr ? 'Riske Maruz Değer (%95)' : 'Value at Risk (95%)'}</span>
                <div className="text-lg font-semibold">{(riskMetrics.valueAtRisk95 * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {isTr ? 'Zamanın %95\'inde aşılmayan günlük kayıp' : 'Daily loss not exceeded 95% of the time'}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">Beta</span>
                <div className="text-lg font-semibold">{riskMetrics.beta.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {riskMetrics.beta > 1
                    ? (isTr ? 'Piyasadan daha oynak' : 'More volatile than market')
                    : (isTr ? 'Piyasadan daha az oynak' : 'Less volatile than market')}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="volatility" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">{isTr ? 'Oynaklık Rejimi' : 'Volatility Regime'}</span>
                  <Badge className={`${getVolatilityColor(volatilityAnalysis.volatilityRegime)} bg-transparent border`}>
                    {translateVolatilityRegime(volatilityAnalysis.volatilityRegime)}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { label: isTr ? 'Güncel' : 'Current', value: `${(volatilityAnalysis.current * 100).toFixed(1)}%` },
                    { label: isTr ? '30 Gün' : '30 Day', value: `${(volatilityAnalysis.historical30d * 100).toFixed(1)}%` },
                    { label: isTr ? '90 Gün' : '90 Day', value: `${(volatilityAnalysis.historical90d * 100).toFixed(1)}%` },
                    { label: isTr ? '1 Yıl' : '1 Year', value: `${(volatilityAnalysis.historical1y * 100).toFixed(1)}%` },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium">{isTr ? 'Risk Göstergeleri' : 'Risk Indicators'}</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: isTr ? 'Yıllık Oynaklık' : 'Annualized Volatility', value: `${(riskMetrics.volatility * 100).toFixed(1)}%` },
                    { label: isTr ? 'Standart Sapma' : 'Standard Deviation', value: `${(riskMetrics.standardDeviation * 100).toFixed(2)}%` },
                    { label: isTr ? 'Calmar Oranı' : 'Calmar Ratio', value: riskMetrics.calmarRatio.toFixed(2) },
                    { label: isTr ? 'Sortino Oranı' : 'Sortino Ratio', value: riskMetrics.sortinoRatio.toFixed(2) },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-sm">{item.label}</span>
                      <Badge variant="outline">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drawdowns" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="font-medium">{isTr ? 'Tarihsel Düşüş Dönemleri' : 'Historical Drawdown Periods'}</span>
            </div>
            {drawdownPeriods.length > 0 ? (
              <div className="space-y-3">
                {drawdownPeriods.slice(0, 5).map((drawdown, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-destructive">
                          -{drawdown.drawdownPercent.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {drawdown.startDate} {isTr ? 'ile' : 'to'} {drawdown.endDate}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {drawdown.recoveryDays} {isTr ? 'günde toparlandı' : 'days to recover'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isTr ? 'Tepe' : 'Peak'}: ${drawdown.peakValue.toLocaleString()} →{' '}
                      {isTr ? 'Dip' : 'Trough'}: ${drawdown.troughValue.toLocaleString()}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isTr ? 'Önemli düşüş dönemi bulunamadı' : 'No significant drawdown periods found'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{isTr ? 'Riske Maruz Değer' : 'Value at Risk'}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">{isTr ? 'RMD %95 (1 gün)' : 'VaR 95% (1 day)'}</span>
                    <span className="font-medium text-destructive">{(riskMetrics.valueAtRisk95 * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{isTr ? 'RMD %99 (1 gün)' : 'VaR 99% (1 day)'}</span>
                    <span className="font-medium text-destructive">{(riskMetrics.valueAtRisk99 * 100).toFixed(2)}%</span>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    {isTr
                      ? 'RMD, belirli bir güven düzeyiyle belirli bir süre içindeki maksimum beklenen kaybı tahmin eder.'
                      : 'VaR estimates the maximum expected loss over a specific time period with a given confidence level.'}
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-success" />
                  <span className="font-medium">{isTr ? 'Riske Göre Düzeltilmiş Getiriler' : 'Risk-Adjusted Returns'}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">{isTr ? 'Sharpe Oranı' : 'Sharpe Ratio'}</span>
                    <Badge variant={riskMetrics.sharpeRatio > 0 ? 'default' : 'destructive'}>
                      {riskMetrics.sharpeRatio.toFixed(3)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{isTr ? 'Calmar Oranı' : 'Calmar Ratio'}</span>
                    <Badge variant="outline">{riskMetrics.calmarRatio.toFixed(3)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">{isTr ? 'Sortino Oranı' : 'Sortino Ratio'}</span>
                    <Badge variant="outline">{riskMetrics.sortinoRatio.toFixed(3)}</Badge>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    {isTr
                      ? 'Daha yüksek oranlar daha iyi riske göre düzeltilmiş performansı gösterir.'
                      : 'Higher ratios indicate better risk-adjusted performance.'}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
