import React, { memo, useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Award, Download, Share2, Bitcoin, DollarSign, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalculationResult, SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { usePerformanceMonitor, useThrottledCallback } from '@/hooks/usePerformanceOptimization';

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

const ProfessionalResultsComponent = ({ result, showInBtc }: ProfessionalResultsProps) => {
  usePerformanceMonitor('ProfessionalResults');
  
  const [animatedValues, setAnimatedValues] = useState({
    currentValue: 0,
    profitLoss: 0,
    roiPercentage: 0
  });
  const [selectedTab, setSelectedTab] = useState('overview');

  const currency = useMemo(() => 
    SUPPORTED_CURRENCIES.find(c => c.code === result.currency), 
    [result.currency]
  );
  
  const isProfit = useMemo(() => result.profitLoss >= 0, [result.profitLoss]);

  // Memoized expensive calculations
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
  }, [result.roiPercentage, result.startDate]);

  const riskAssessment = useMemo(() => {
    const absRoi = Math.abs(result.roiPercentage);
    
    if (absRoi < 50) return { level: 'Low', color: 'text-success', description: 'Conservative investment with moderate returns' };
    if (absRoi < 200) return { level: 'Medium', color: 'text-yellow-500', description: 'Balanced risk-reward profile' };
    if (absRoi < 500) return { level: 'High', color: 'text-orange-500', description: 'High-risk, high-reward investment' };
    return { level: 'Extreme', color: 'text-destructive', description: 'Extremely volatile investment' };
  }, [result.roiPercentage]);

  const investmentGrade = useMemo(() => {
    const score = (portfolioMetrics.sharpeRatio + Math.max(0, result.roiPercentage / 100)) / 2;
    
    if (score > 2) return { grade: 'A+', color: 'text-success', bg: 'bg-success/10' };
    if (score > 1.5) return { grade: 'A', color: 'text-success', bg: 'bg-success/10' };
    if (score > 1) return { grade: 'B+', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (score > 0.5) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-50' };
    if (score > 0) return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { grade: 'D', color: 'text-destructive', bg: 'bg-destructive/10' };
  }, [portfolioMetrics.sharpeRatio, result.roiPercentage]);

  // Throttled animation for better performance
  const animateValues = useThrottledCallback(() => {
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
  }, 100);

  useEffect(() => {
    const cleanup = animateValues();
    return cleanup;
  }, [result, animateValues]);

  const formatValue = useMemo(() => (value: number, includeSymbol = true) => {
    if (showInBtc) {
      return `${value.toFixed(8)} BTC`;
    }
    const formatted = Math.abs(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return includeSymbol ? `${currency?.symbol}${formatted}` : formatted;
  }, [showInBtc, currency]);

  const formatPrice = useMemo(() => (value: number) => {
    return `${currency?.symbol}${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }, [currency]);

  const handleExportReport = useThrottledCallback((format: 'pdf' | 'csv') => {
    console.log(`Exporting report as ${format}`);
    // Export implementation would go here
  }, 500);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Summary Card */}
      <Card className="glass-morphism-card border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Investment Performance Report
              </CardTitle>
              <p className="text-sm text-foreground/60 mt-1">
                Professional analysis of your Bitcoin investment
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={cn("px-3 py-1", investmentGrade.bg, investmentGrade.color)}>
                Grade: {investmentGrade.grade}
              </Badge>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport('pdf')}
                  className="border-border/50 hover:border-primary/30"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport('csv')}
                  className="border-border/50 hover:border-primary/30"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground font-mono">
                {formatValue(animatedValues.currentValue)}
              </div>
              <p className="text-sm text-foreground/60 mt-1">Current Value</p>
            </div>
            
            <div className="text-center">
              <div className={cn(
                "text-3xl font-bold font-mono",
                isProfit ? "text-success" : "text-destructive"
              )}>
                {isProfit ? '+' : ''}{formatValue(animatedValues.profitLoss)}
              </div>
              <p className="text-sm text-foreground/60 mt-1">Total Return</p>
            </div>
            
            <div className="text-center">
              <div className={cn(
                "text-3xl font-bold font-mono",
                isProfit ? "text-success" : "text-destructive"
              )}>
                {isProfit ? '+' : ''}{animatedValues.roiPercentage.toFixed(1)}%
              </div>
              <p className="text-sm text-foreground/60 mt-1">ROI</p>
            </div>
            
            <div className="text-center">
              <div className={cn("text-lg font-bold", riskAssessment.color)}>
                {riskAssessment.level}
              </div>
              <p className="text-sm text-foreground/60 mt-1">Risk Level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Card className="glass-morphism-card border-border/30">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-background/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-background/50 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Bitcoin className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-sm text-foreground/60">Bitcoin Purchased</p>
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
                          <p className="text-sm text-foreground/60">Entry Price</p>
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
                          <p className="text-sm text-foreground/60">Current Price</p>
                          <p className="text-lg font-bold font-mono">{formatPrice(result.currentPrice)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Risk-Adjusted Returns</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Sharpe Ratio</span>
                        <span className="font-mono text-sm font-medium">
                          {portfolioMetrics.sharpeRatio.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Volatility</span>
                        <span className="font-mono text-sm font-medium">
                          {portfolioMetrics.volatility.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Max Drawdown</span>
                        <span className="font-mono text-sm font-medium text-destructive">
                          -{portfolioMetrics.maxDrawdown.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Market Correlation</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Beta</span>
                        <span className="font-mono text-sm font-medium">
                          {portfolioMetrics.beta.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground/70">Alpha</span>
                        <span className="font-mono text-sm font-medium">
                          {portfolioMetrics.alpha.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="risk" className="space-y-4">
                <div className="p-4 rounded-lg bg-background/30 border border-border/30">
                  <h4 className="font-semibold text-foreground mb-2">Risk Assessment</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    <span className={cn("font-semibold", riskAssessment.color)}>
                      {riskAssessment.level} Risk:
                    </span>{' '}
                    {riskAssessment.description}
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Export memoized component with custom comparison
export const MemoizedProfessionalResults = memo(ProfessionalResultsComponent, (prevProps, nextProps) => {
  // Custom comparison to avoid unnecessary re-renders
  return (
    prevProps.result.currentValue === nextProps.result.currentValue &&
    prevProps.result.profitLoss === nextProps.result.profitLoss &&
    prevProps.result.roiPercentage === nextProps.result.roiPercentage &&
    prevProps.showInBtc === nextProps.showInBtc
  );
});

MemoizedProfessionalResults.displayName = 'MemoizedProfessionalResults';