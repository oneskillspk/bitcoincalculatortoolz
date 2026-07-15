import React, { useMemo, useState } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { formatROI } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { CalculationResult, BitcoinPrice } from '@/services/bitcoinApi';
import { DCACalculator, DCAParams } from '@/services/dcaCalculator';
import {
  Calendar, TrendingUp, TrendingDown, BarChart3,
  Target, DollarSign, Clock, Zap
} from 'lucide-react';
import { format, subDays, addDays, differenceInDays, subMonths } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';


interface HistoricalAnalysisProps {
  result: CalculationResult;
  investmentAmount: number;
}

export const HistoricalAnalysis = React.memo(({ result, investmentAmount }: HistoricalAnalysisProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [selectedPeriodDays, setSelectedPeriodDays] = useState([30]);

  const periodDays = selectedPeriodDays[0];
  const totalDays = differenceInDays(new Date(), new Date(result.startDate));

  const analysisData = useMemo(() => {
    if (!result.priceData || result.priceData.length < 2) {
      return {
        scenarios: [],
        bestDate: { date: new Date(), roi: 0, currentValue: investmentAmount, startPrice: result.startPrice },
        worstDate: { date: new Date(), roi: 0, currentValue: investmentAmount, startPrice: result.startPrice },
        averageROI: 0
      };
    }
    const scenarios = [];
    const currentPrice = result.currentPrice;
    const step = Math.max(1, Math.floor(result.priceData.length / 50));
    for (let i = 0; i < result.priceData.length; i += step) {
      const dataPoint = result.priceData[i];
      const testDate = new Date(dataPoint.date);
      const startPrice = dataPoint.price;
      if (startPrice > 0) {
        const currentValue = investmentAmount * (currentPrice / startPrice);
        const roi = ((currentValue - investmentAmount) / investmentAmount) * 100;
        scenarios.push({ date: testDate, startPrice, currentValue, roi, daysHeld: differenceInDays(new Date(), testDate) });
      }
    }
    const sortedByROI = [...scenarios].sort((a, b) => b.roi - a.roi);
    return {
      scenarios,
      bestDate: sortedByROI[0] || { date: new Date(result.startDate), roi: result.roiPercentage, currentValue: result.currentValue, startPrice: result.startPrice },
      worstDate: sortedByROI[sortedByROI.length - 1] || { date: new Date(result.startDate), roi: result.roiPercentage, currentValue: result.currentValue, startPrice: result.startPrice },
      averageROI: scenarios.length > 0 ? scenarios.reduce((sum, s) => sum + s.roi, 0) / scenarios.length : result.roiPercentage
    };
  }, [result, investmentAmount]);

  const dcaAnalysis = useMemo(() => {
    if (!result.priceData || result.priceData.length < 2) {
      return { totalInvested: investmentAmount, totalBitcoin: investmentAmount / result.startPrice, currentValue: result.currentValue, roi: result.roiPercentage, monthlyAmount: investmentAmount, months: 1 };
    }
    const dcaParams: DCAParams = {
      totalAmount: investmentAmount,
      frequency: 'monthly',
      startDate: new Date(result.startDate),
      endDate: new Date(),
      currency: result.currency
    };
    try {
      const dcaResult = DCACalculator.calculateDCA(dcaParams, result.priceData);
      return {
        totalInvested: dcaResult.totalInvested,
        totalBitcoin: dcaResult.totalBitcoin,
        currentValue: dcaResult.currentValue,
        roi: dcaResult.roiPercentage,
        monthlyAmount: dcaResult.totalInvested / dcaResult.purchases.length,
        months: dcaResult.purchases.length
      };
    } catch {
      const months = Math.max(1, Math.floor(totalDays / 30));
      return { totalInvested: investmentAmount, totalBitcoin: investmentAmount / result.startPrice, currentValue: result.currentValue, roi: result.roiPercentage, monthlyAmount: investmentAmount / months, months };
    }
  }, [result, investmentAmount, totalDays]);

  const formatCurrencyVal = (amount: number) =>
    Number.isFinite(amount)
      ? `${result.currency}${formatGroupedInt(amount, 'en-US')}`
      : '—';


  return (
    <Card className="glass-morphism-card border-border/30">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {isTr ? 'Tarihsel Analiz' : 'Historical Analysis'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isTr ? 'Farklı yatırım senaryolarını ve zamanlamalarını keşfedin' : 'Explore different investment scenarios and timing'}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <h4 className="font-semibold text-foreground">
                {isTr ? 'En İyi Giriş Tarihi' : 'Best Entry Date'}
              </h4>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-foreground/80">
                {format(analysisData.bestDate.date, 'MMM d, yyyy')}
              </p>
              <p className="font-bold text-success">{formatROI(analysisData.bestDate.roi, 1)} ROI</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrencyVal(analysisData.bestDate.currentValue)} {isTr ? 'güncel değer' : 'current value'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <h4 className="font-semibold text-foreground">
                {isTr ? 'En Kötü Giriş Tarihi' : 'Worst Entry Date'}
              </h4>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-foreground/80">
                {format(analysisData.worstDate.date, 'MMM d, yyyy')}
              </p>
              <p className="font-bold text-destructive">
                {formatROI(analysisData.worstDate.roi, 1)} ROI
              </p>

              <p className="text-xs text-muted-foreground">
                {formatCurrencyVal(analysisData.worstDate.currentValue)} {isTr ? 'güncel değer' : 'current value'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {isTr ? 'Dolar Maliyet Ortalama (DCA) Analizi' : 'Dollar-Cost Averaging (DCA) Analysis'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <h5 className="font-medium text-foreground">
                  {isTr ? 'Tek Seferlik Yatırım' : 'Lump Sum Investment'}
                </h5>
              </div>
              <div className="calc-surface-card p-4 space-y-2">
                {[
                  { label: isTr ? 'Yatırılan:' : 'Invested:', value: formatCurrencyVal(investmentAmount) },
                  { label: isTr ? 'Güncel Değer:' : 'Current Value:', value: formatCurrencyVal(result.currentValue) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ROI:</span>
                  <span className={`font-bold ${result.roiPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatROI(result.roiPercentage, 1)}
                  </span>

                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-accent" />
                <h5 className="font-medium text-foreground">
                  {isTr ? 'DCA Stratejisi' : 'DCA Strategy'}
                </h5>
              </div>
              <div className="calc-surface-card p-4 space-y-2">
                {[
                  { label: isTr ? 'Aylık:' : 'Monthly:', value: formatCurrencyVal(dcaAnalysis.monthlyAmount) },
                  { label: isTr ? 'Toplam Bitcoin:' : 'Total Bitcoin:', value: Number.isFinite(dcaAnalysis.totalBitcoin) ? `₿${dcaAnalysis.totalBitcoin.toFixed(6)}` : '—' },
                  { label: isTr ? 'Güncel Değer:' : 'Current Value:', value: formatCurrencyVal(dcaAnalysis.currentValue) },

                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ROI:</span>
                  <span className={`font-bold ${dcaAnalysis.roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatROI(dcaAnalysis.roi, 1)}
                  </span>

                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 calc-surface-featured">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isTr ? 'DCA — Tek Seferlik Performans Karşılaştırması' : 'DCA Performance vs Lump Sum'}
                </p>
              </div>
              <div className={`text-lg font-bold ${dcaAnalysis.roi > result.roiPercentage ? 'text-success' : dcaAnalysis.roi < result.roiPercentage ? 'text-destructive' : 'text-foreground'}`}>
                {formatROI(dcaAnalysis.roi - result.roiPercentage, 1)}{' '}
                {isTr ? 'fark' : 'difference'}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {dcaAnalysis.roi > result.roiPercentage
                  ? (isTr ? 'DCA daha iyi performans gösterirdi' : 'DCA would have performed better')
                  : dcaAnalysis.roi < result.roiPercentage
                    ? (isTr ? 'Tek seferlik daha iyi performans gösterdi' : 'Lump sum performed better')
                    : (isTr ? 'Benzer performans' : 'Similar performance')}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {isTr ? 'Yatırım İstatistikleri' : 'Investment Statistics'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: isTr ? 'Ort. ROI' : 'Avg ROI', value: formatROI(analysisData.averageROI, 1), color: '' },
              { label: isTr ? 'En İyi ROI' : 'Best ROI', value: formatROI(analysisData.scenarios.length > 0 ? Math.max(...analysisData.scenarios.map(s => s.roi)) : analysisData.bestDate.roi, 1), color: 'text-success' },
              { label: isTr ? 'En Kötü ROI' : 'Worst ROI', value: formatROI(analysisData.scenarios.length > 0 ? Math.min(...analysisData.scenarios.map(s => s.roi)) : analysisData.worstDate.roi, 1), color: 'text-destructive' },

              { label: isTr ? 'Veri Noktası' : 'Data Points', value: String(analysisData.scenarios.length), color: '' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 calc-surface-card">
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className={`font-bold text-foreground ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

HistoricalAnalysis.displayName = 'HistoricalAnalysis';
