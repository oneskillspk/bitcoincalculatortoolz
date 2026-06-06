import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StrategyResult, ComparisonInsights } from '@/services/hodlStrategyCalculator';
import { Shield, TrendingDown, Target, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PerformanceMetricsProps {
  strategies: StrategyResult[];
  insights: ComparisonInsights;
}

export const PerformanceMetrics = ({ strategies, insights }: PerformanceMetricsProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (strategies.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Risk-Adjusted Returns */}
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <CardTitle className="text-lg">{tr ? 'Riske Göre Düzeltilmiş Getiriler' : 'Risk-Adjusted Returns'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {strategies.map((strategy) => (
            <div key={strategy.type} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{strategy.name}</span>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Sharpe</p>
                  <p className="text-sm font-semibold text-foreground">{strategy.sharpeRatio.toFixed(2)}</p>
                </div>
                <div className="h-2 w-20 bg-muted/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, (strategy.sharpeRatio / 3) * 100)}%` }} />
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
            {tr ? 'En İyi:' : 'Best:'} {insights.bestRiskAdjusted}
          </p>
        </CardContent>
      </Card>

      {/* Drawdown Analysis */}
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            <CardTitle className="text-lg">{tr ? 'Maksimum Düşüş' : 'Maximum Drawdown'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {strategies.map((strategy) => (
            <div key={strategy.type} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{strategy.name}</span>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-destructive">-{strategy.maxDrawdown.toFixed(1)}%</p>
                </div>
                <div className="h-2 w-20 bg-muted/30 rounded-full overflow-hidden">
                  <div className="h-full bg-destructive" style={{ width: `${Math.min(100, strategy.maxDrawdown)}%` }} />
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
            {tr ? 'En Kararlı:' : 'Most Stable:'} {insights.mostStable}
          </p>
        </CardContent>
      </Card>

      {/* Volatility Comparison */}
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <CardTitle className="text-lg">{tr ? 'Volatilite Analizi' : 'Volatility Analysis'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {strategies.map((strategy) => (
            <div key={strategy.type} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{strategy.name}</span>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{(strategy.volatility * 100).toFixed(1)}%</p>
                </div>
                <div className="h-2 w-20 bg-muted/30 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, strategy.volatility * 200)}%` }} />
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
            {tr ? 'En Değişken:' : 'Most Volatile:'} {insights.mostVolatile}
          </p>
        </CardContent>
      </Card>

      {/* Efficiency Score */}
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <CardTitle className="text-lg">{tr ? 'Strateji Verimliliği' : 'Strategy Efficiency'}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {strategies.map((strategy) => {
            const efficiency = strategy.roiPercentage / strategy.numberOfPurchases;
            const maxEfficiency = Math.max(...strategies.map(s => s.roiPercentage / s.numberOfPurchases));
            return (
              <div key={strategy.type} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{strategy.name}</span>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{tr ? 'Alım' : 'Purchases'}</p>
                    <p className="text-sm font-semibold text-foreground">{strategy.numberOfPurchases}</p>
                  </div>
                  <div className="h-2 w-20 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: `${Math.min(100, (efficiency / maxEfficiency) * 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
            {tr ? 'Daha az alım, daha düşük işlem maliyeti anlamına gelebilir' : 'Fewer purchases can mean lower transaction costs'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
