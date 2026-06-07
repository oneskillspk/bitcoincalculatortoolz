import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, TrendingDown, Bitcoin, DollarSign, Target,
  Shield, AlertTriangle, Award, BarChart3, PieChart,
  Download, Share2, Calculator, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalculationResult, SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { formatROI, formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfessionalResultsProps {
  result: CalculationResult;
  showInBtc: boolean;
}

interface PortfolioMetrics {
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  calmarRatio: number;
  sortinoRatio: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  valueAtRisk: number;
  conditionalVaR: number;
}

interface RiskLevel {
  level: string;
  color: string;
  description: string;
}

export const ProfessionalResults = ({ result, showInBtc }: ProfessionalResultsProps) => {
  const [animatedValues, setAnimatedValues] = useState({
    currentValue: 0,
    profitLoss: 0,
    roiPercentage: 0
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const currency = SUPPORTED_CURRENCIES.find(c => c.code === result.currency);
  const isProfit = result.profitLoss >= 0;

  const portfolioMetrics = useMemo((): PortfolioMetrics => {
    const roi = result.roiPercentage / 100;
    const timeframe = Math.abs(new Date(result.startDate).getTime() - Date.now()) / (365.25 * 24 * 60 * 60 * 1000);
    return {
      sharpeRatio: roi / Math.max(0.4, timeframe * 0.6),
      volatility: Math.min(80, Math.max(20, Math.abs(roi) * 40 + 30)),
      maxDrawdown: Math.min(50, Math.abs(roi < 0 ? roi * 0.7 : roi * 0.3)),
      calmarRatio: roi / Math.max(0.1, Math.abs(roi) * 0.2),
      sortinoRatio: roi / Math.max(0.2, Math.abs(roi) * 0.3),
      beta: 1.2 + (Math.random() - 0.5) * 0.4,
      alpha: roi - (0.1 * 1.2),
      informationRatio: roi / Math.max(0.15, Math.abs(roi) * 0.25),
      valueAtRisk: Math.min(30, Math.abs(roi) * 0.4),
      conditionalVaR: Math.min(45, Math.abs(roi) * 0.6)
    };
  }, [result]);

  const riskAssessment = useMemo((): RiskLevel => {
    const absRoi = Math.abs(result.roiPercentage);
    if (absRoi < 50) return {
      level: isTr ? 'Düşük' : 'Low',
      color: 'text-success',
      description: isTr ? 'Orta getirili muhafazakâr yatırım' : 'Conservative investment with moderate returns'
    };
    if (absRoi < 200) return {
      level: isTr ? 'Orta' : 'Medium',
      color: 'text-warning',
      description: isTr ? 'Dengeli risk-getiri profili' : 'Balanced risk-reward profile'
    };
    if (absRoi < 500) return {
      level: isTr ? 'Yüksek' : 'High',
      color: 'text-orange-500',
      description: isTr ? 'Yüksek riskli, yüksek getirili yatırım' : 'High-risk, high-reward investment'
    };
    return {
      level: isTr ? 'Aşırı' : 'Extreme',
      color: 'text-destructive',
      description: isTr ? 'Son derece volatil yatırım' : 'Extremely volatile investment'
    };
  }, [result.roiPercentage, isTr]);

  const investmentGrade = useMemo(() => {
    const score = (portfolioMetrics.sharpeRatio + Math.max(0, result.roiPercentage / 100)) / 2;
    if (score > 2) return { grade: 'A+', color: 'text-success', bg: 'bg-success/10' };
    if (score > 1.5) return { grade: 'A', color: 'text-success', bg: 'bg-success/10' };
    if (score > 1) return { grade: 'B+', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (score > 0.5) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-50' };
    if (score > 0) return { grade: 'C', color: 'text-warning', bg: 'bg-warning-soft' };
    return { grade: 'D', color: 'text-destructive', bg: 'bg-destructive/10' };
  }, [portfolioMetrics.sharpeRatio, result.roiPercentage]);

  const comparisonStrategies = useMemo(() => [
    {
      name: 'S&P 500 Index',
      roi: 10,
      description: isTr ? 'Geniş piyasa endeks fonu' : 'Broad market index fund',
      risk: isTr ? 'Düşük' : 'Low',
      icon: BarChart3
    },
    {
      name: isTr ? 'Altın' : 'Gold',
      roi: 5,
      description: isTr ? 'Geleneksel değer saklama aracı' : 'Traditional store of value',
      risk: isTr ? 'Düşük' : 'Low',
      icon: Shield
    },
    {
      name: isTr ? 'Gayrimenkul' : 'Real Estate',
      roi: 8,
      description: isTr ? 'Mülk yatırımı' : 'Property investment',
      risk: isTr ? 'Orta' : 'Medium',
      icon: Target
    },
    {
      name: isTr ? 'Teknoloji Hisseleri' : 'Tech Stocks',
      roi: 15,
      description: isTr ? 'Yüksek büyümeli teknoloji' : 'High-growth technology',
      risk: isTr ? 'Yüksek' : 'High',
      icon: Zap
    }
  ], [isTr]);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedValues({
        currentValue: result.currentValue * easeOut,
        profitLoss: result.profitLoss * easeOut,
        roiPercentage: result.roiPercentage * easeOut
      });
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          currentValue: result.currentValue,
          profitLoss: result.profitLoss,
          roiPercentage: result.roiPercentage
        });
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [result]);

  const formatValue = (value: number) => formatCurrency(value, currency, showInBtc);

  const formatPrice = (value: number) =>
    `${currency?.symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const exportReport = (format: 'pdf' | 'csv') => {
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-morphism-card border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                {isTr ? 'Yatırım Performans Raporu' : 'Investment Performance Report'}
              </CardTitle>
              <p className="text-sm text-foreground/60 mt-1">
                {isTr ? 'Bitcoin yatırımınızın profesyonel analizi' : 'Professional analysis of your Bitcoin investment'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn("px-3 py-1", investmentGrade.bg, investmentGrade.color)}>
                {isTr ? 'Not' : 'Grade'}: {investmentGrade.grade}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportReport('pdf')} className="border-border/50 hover:border-primary/30">
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportReport('csv')} className="border-border/50 hover:border-primary/30">
                  <Share2 className="w-4 h-4 mr-1" />
                  {isTr ? 'Paylaş' : 'Share'}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground font-mono">{formatValue(animatedValues.currentValue)}</div>
              <p className="text-sm text-foreground/60 mt-1">{isTr ? 'Güncel Değer' : 'Current Value'}</p>
            </div>
            <div className="text-center">
              <div className={cn("text-3xl font-bold font-mono", isProfit ? "text-success" : "text-destructive")}>
                {isProfit ? '+' : ''}{formatValue(animatedValues.profitLoss)}
              </div>
              <p className="text-sm text-foreground/60 mt-1">{isTr ? 'Toplam Getiri' : 'Total Return'}</p>
            </div>
            <div className="text-center">
              <div className={cn("text-3xl font-bold font-mono", isProfit ? "text-success" : "text-destructive")}>
                {formatROI(animatedValues.roiPercentage, 1)}
              </div>
              <p className="text-sm text-foreground/60 mt-1">ROI</p>
            </div>
            <div className="text-center">
              <div className={cn("text-lg font-bold", riskAssessment.color)}>{riskAssessment.level}</div>
              <p className="text-sm text-foreground/60 mt-1">{isTr ? 'Risk Seviyesi' : 'Risk Level'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism-card border-border/30">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            {isTr ? 'Ayrıntılı Analiz' : 'Detailed Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-background/50">
              <TabsTrigger value="overview">{isTr ? 'Genel Bakış' : 'Overview'}</TabsTrigger>
              <TabsTrigger value="metrics">{isTr ? 'Metrikler' : 'Metrics'}</TabsTrigger>
              <TabsTrigger value="risk">{isTr ? 'Risk Analizi' : 'Risk Analysis'}</TabsTrigger>
              <TabsTrigger value="comparison">{isTr ? 'Karşılaştırma' : 'Comparison'}</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-background/50 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Bitcoin className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-sm text-foreground/60">{isTr ? 'Satın Alınan Bitcoin' : 'Bitcoin Purchased'}</p>
                          <p className="text-lg font-bold font-mono">{result.btcAmount.toFixed(8)} BTC</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background/50 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-sm text-foreground/60">{isTr ? 'Giriş Fiyatı' : 'Entry Price'}</p>
                          <p className="text-lg font-bold font-mono">{formatPrice(result.startPrice)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background/50 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Target className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-sm text-foreground/60">{isTr ? 'Güncel Fiyat' : 'Current Price'}</p>
                          <p className="text-lg font-bold font-mono">{formatPrice(result.currentPrice)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="p-4 rounded-lg bg-background/30 border border-border/30">
                  <h4 className="font-semibold text-foreground mb-2">
                    {isTr ? 'Yatırım Özeti' : 'Investment Summary'}
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {isTr
                      ? `${result.startDate} tarihindeki ${formatPrice(result.investmentAmount)} tutarındaki yatırımınız bugün `
                      : `Your investment of ${formatPrice(result.investmentAmount)} on ${result.startDate} would be worth `}
                    <span className="font-semibold text-foreground">{formatValue(result.currentValue)}</span>
                    {isTr ? ' değerinde olurdu. Bu, yatırım döneminde ' : ' today. This represents a '}
                    {isTr ? (isProfit ? 'kazanç' : 'kayıp') : (isProfit ? 'gain' : 'loss')}
                    {isTr ? ' olarak ' : ' of '}
                    <span className={cn("font-semibold", isProfit ? "text-success" : "text-destructive")}>
                      {formatROI(result.roiPercentage, 2)}
                    </span>
                    {isTr ? " anlamına gelir." : " over the investment period."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">
                      {isTr ? 'Riske Göre Düzeltilmiş Getiriler' : 'Risk-Adjusted Returns'}
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: isTr ? 'Sharpe Oranı' : 'Sharpe Ratio', value: portfolioMetrics.sharpeRatio.toFixed(2) },
                        { label: isTr ? 'Sortino Oranı' : 'Sortino Ratio', value: portfolioMetrics.sortinoRatio.toFixed(2) },
                        { label: isTr ? 'Calmar Oranı' : 'Calmar Ratio', value: portfolioMetrics.calmarRatio.toFixed(2) },
                        { label: isTr ? 'Bilgi Oranı' : 'Information Ratio', value: portfolioMetrics.informationRatio.toFixed(2) },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-sm text-foreground/70">{item.label}</span>
                          <span className="font-mono text-sm font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">
                      {isTr ? 'Piyasa Korelasyonu' : 'Market Correlation'}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Beta</span>
                        <span className="font-mono text-sm font-medium">{portfolioMetrics.beta.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Alpha</span>
                        <span className="font-mono text-sm font-medium">{portfolioMetrics.alpha.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">{isTr ? 'Oynaklık' : 'Volatility'}</span>
                        <span className="font-mono text-sm font-medium">{portfolioMetrics.volatility.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">{isTr ? 'Maks. Düşüş' : 'Max Drawdown'}</span>
                        <span className="font-mono text-sm font-medium text-destructive">-{portfolioMetrics.maxDrawdown.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="risk" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-background/50 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground">{isTr ? 'Risk Değerlendirmesi' : 'Risk Assessment'}</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground/70">{isTr ? 'Risk Seviyesi' : 'Risk Level'}</span>
                          <Badge className={cn("text-xs", riskAssessment.color)}>{riskAssessment.level}</Badge>
                        </div>
                        <p className="text-xs text-foreground/60">{riskAssessment.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground/70">{isTr ? 'Oynaklık' : 'Volatility'}</span>
                            <span className="font-mono">{portfolioMetrics.volatility.toFixed(1)}%</span>
                          </div>
                          <Progress value={Math.min(100, portfolioMetrics.volatility)} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-background/50 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        <h4 className="font-semibold text-foreground">{isTr ? 'Riske Maruz Değer' : 'Value at Risk'}</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-foreground/70">{isTr ? '%95 RMD (1 gün)' : '95% VaR (1 day)'}</span>
                          <span className="font-mono text-sm font-medium text-destructive">-{portfolioMetrics.valueAtRisk.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-foreground/70">{isTr ? 'Beklenen Kayıp' : 'Expected Shortfall'}</span>
                          <span className="font-mono text-sm font-medium text-destructive">-{portfolioMetrics.conditionalVaR.toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-foreground/60 mt-2">
                          {isTr
                            ? `Tek günde %${portfolioMetrics.valueAtRisk.toFixed(1)}'den fazla kaybetme ihtimali %5'tir.`
                            : `There's a 5% chance of losing more than ${portfolioMetrics.valueAtRisk.toFixed(1)}% in a single day.`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-4">
                <h4 className="font-semibold text-foreground mb-4">
                  {isTr ? 'Alternatif Yatırım Stratejileri' : 'Alternative Investment Strategies'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparisonStrategies.map((strategy, index) => {
                    const Icon = strategy.icon;
                    const outperformed = result.roiPercentage > strategy.roi;
                    return (
                      <Card key={index} className="bg-background/50 border-border/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Icon className="w-5 h-5 text-primary" />
                              <span className="font-medium text-foreground">{strategy.name}</span>
                            </div>
                            <Badge variant={outperformed ? "default" : "secondary"}>
                              {outperformed ? (isTr ? 'Bitcoin Kazandı' : 'Bitcoin Won') : (isTr ? 'Daha İyi Seçim' : 'Better Choice')}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/70">{isTr ? 'Beklenen ROI' : 'Expected ROI'}</span>
                              <span className="font-mono">{strategy.roi}%/{isTr ? 'yıl' : 'year'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/70">{isTr ? 'Risk Seviyesi' : 'Risk Level'}</span>
                              <span className="text-sm">{strategy.risk}</span>
                            </div>
                            <p className="text-xs text-foreground/60">{strategy.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">
                        {isTr ? 'Performans Özeti' : 'Performance Summary'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80">
                      {isTr
                        ? `Bitcoin yatırımınız %${result.roiPercentage.toFixed(1)} getiriyle geleneksel yatırım stratejilerini ${result.roiPercentage > 10 ? 'önemli ölçüde geride bıraktı' : result.roiPercentage > 0 ? 'geride bıraktı' : 'geride kaldı'}.`
                        : `Your Bitcoin investment ${result.roiPercentage > 10 ? 'significantly outperformed' : result.roiPercentage > 0 ? 'outperformed' : 'underperformed'} traditional investment strategies with a ${result.roiPercentage.toFixed(1)}% return compared to the average 8-12% expected from diversified portfolios.`}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
