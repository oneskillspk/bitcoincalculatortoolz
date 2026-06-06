import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComparisonResult } from '@/services/lumpSumDcaComparator';
import { TrendingUp, TrendingDown, Shield, Zap, Target, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StrategyComparisonProps {
  result: ComparisonResult;
}

export const StrategyComparison = ({ result }: StrategyComparisonProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const hasDva = !!result.dva;

  const strategies = [
    {
      key: 'lump-sum' as const,
      label: tr ? 'Toplu Yatırım Stratejisi' : 'Lump Sum Strategy',
      icon: Zap,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500/10',
      data: result.lumpSum,
      advantages: [
        { icon: Zap, text: tr ? 'Anında tam piyasa maruziyeti' : 'Immediate full market exposure', color: "text-blue-600" },
        { icon: Target, text: tr ? 'Boğa piyasalarında maksimum kazanç potansiyeli' : 'Potential for maximum gains in bull markets', color: "text-blue-600" },
        { icon: Clock, text: tr ? 'Daha basit uygulama - tek işlem' : 'Simpler execution - one transaction', color: "text-blue-600" }
      ],
      considerations: [
        tr ? 'Yüksek zamanlama riski - zirveden alabilirsiniz' : 'High timing risk - could buy at peak',
        tr ? 'Peşin büyük sermaye gerektirir' : 'Requires large capital upfront',
        tr ? 'Piyasa düşüşlerine maksimum maruziyet' : 'Maximum exposure to market downturns'
      ]
    },
    {
      key: 'dca' as const,
      label: tr ? 'DCA Stratejisi' : 'DCA Strategy',
      icon: TrendingUp,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      data: result.dca,
      advantages: [
        { icon: Shield, text: tr ? 'Ortalamayla zamanlama riskini azaltır' : 'Reduces timing risk through averaging', color: "text-success" },
        { icon: TrendingUp, text: tr ? 'Piyasa oynaklığını yumuşatır' : 'Smooths out market volatility', color: "text-success" },
        { icon: Target, text: tr ? 'Disiplinli yatırım yaklaşımı' : 'Disciplined investment approach', color: "text-success" }
      ],
      considerations: [
        tr ? 'Erken kazançları kaçırabilir' : 'May miss out on early gains',
        tr ? 'İşlem maliyetleri birikebilir' : 'Transaction costs can accumulate',
        tr ? 'Tutarlı uygulama gerektirir' : 'Requires consistent execution'
      ]
    },
    ...(hasDva && result.dva ? [{
      key: 'dva' as const,
      label: tr ? 'DVA Stratejisi' : 'DVA Strategy',
      icon: Target,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-500/10',
      data: result.dva,
      advantages: [
        { icon: Target, text: tr ? 'Tutarlı portföy büyümesini hedefler' : 'Targets consistent portfolio growth', color: "text-purple-600" },
        { icon: TrendingUp, text: tr ? 'Fiyatlar düşükken daha fazla alır' : 'Buys more when prices are low', color: "text-purple-600" },
        { icon: Shield, text: tr ? 'Sistematik yeniden dengeleme yaklaşımı' : 'Systematic rebalancing approach', color: "text-purple-600" }
      ],
      considerations: [
        tr ? 'Değişken nakit akışı gerektirir' : 'Variable cash flow requirements',
        tr ? 'Manuel uygulaması daha karmaşıktır' : 'More complex to execute manually',
        tr ? 'Boğa koşularında çok az yatırım yapabilir' : 'May invest very little in bull runs'
      ]
    }] : [])
  ];

  return (
    <div className="space-y-6">
      {/* Strategy Breakdown */}
      <div className={`grid grid-cols-1 ${hasDva ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        {strategies.map((strategy) => (
          <Card key={strategy.key} className="glass-morphism-card border-border/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${strategy.iconBg} flex items-center justify-center`}>
                    <strategy.icon className={`w-4 h-4 ${strategy.iconColor}`} />
                  </div>
                  {strategy.label}
                </CardTitle>
                {result.winner === strategy.key && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {tr ? '🏆 Kazanan' : '🏆 Winner'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-background/30">
                  <div className="text-lg font-bold text-foreground">
                    {formatCurrency(strategy.data.currentValue)}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{tr ? 'Nihai Değer' : 'Final Value'}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/30">
                  <div className={`text-lg font-bold ${
                    strategy.data.roiPercentage >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {strategy.data.roiPercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">ROI</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-sm">{tr ? 'Avantajlar' : 'Advantages'}</h4>
                <div className="space-y-2">
                  {strategy.advantages.map((advantage, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <advantage.icon className={`w-3 h-3 ${advantage.color}`} />
                      <span className="text-sm text-muted-foreground leading-relaxed">{advantage.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-sm">{tr ? 'Dikkat Edilecekler' : 'Considerations'}</h4>
                <div className="space-y-1">
                  {strategy.considerations.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                      <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background/20 border border-border/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {strategy.key === 'lump-sum' ? (tr ? 'Maksimum Düşüş:' : 'Max Drawdown:') : (tr ? 'Toplam Alım:' : 'Total Purchases:')}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {strategy.key === 'lump-sum' 
                      ? formatPercentage(strategy.data.performanceMetrics.maxDrawdown)
                      : strategy.data.purchases.length
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Insights */}
      <Card className="glass-morphism-card border-border/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-foreground">
            {tr ? 'Temel İçgörüler' : 'Key Insights'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center justify-center mb-2">
                {result.winner === 'lump-sum' ? (
                  <TrendingUp className="w-6 h-6 text-primary" />
                ) : result.winner === 'dca' ? (
                  <Shield className="w-6 h-6 text-primary" />
                ) : result.winner === 'dva' ? (
                  <Target className="w-6 h-6 text-primary" />
                ) : (
                  <Target className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">
                {result.winner === 'tie' ? (tr ? 'Eşit Performans' : 'Equal Performance') : (tr ? 'Daha İyi Strateji' : 'Better Strategy')}
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {result.winner === 'tie' 
                  ? (tr ? 'Tüm stratejiler benzer sonuçlar verdi' : 'All strategies delivered similar results')
                  : `${result.summary.betterStrategy} ${tr ? '%' : ''}${tr ? ' oranında daha iyi performans gösterdi' : `outperformed by ${result.summary.winMargin.toFixed(1)}%`}`
                }
              </div>
            </div>

            <div className="text-center p-4 rounded-lg bg-background/30">
              <div className="text-lg font-bold text-foreground mb-1">
                {formatCurrency(result.difference.absoluteValue)}
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {tr ? 'Mutlak Fark' : 'Absolute Difference'}
              </div>
            </div>

            <div className="text-center p-4 rounded-lg bg-background/30">
              <div className="text-lg font-bold text-foreground mb-1">
                {result.difference.percentageDifference.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {tr ? 'Performans Farkı' : 'Performance Gap'}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10 border border-border/10">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              {result.summary.riskAnalysis.recommendation}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
