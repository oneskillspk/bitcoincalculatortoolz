import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedTaxCalculatorService, TaxTransaction, TaxConfiguration, EnhancedTaxCalculation } from '@/services/enhancedTaxCalculator';
import { BarChart3, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CostBasisComparisonProps {
  transactions: TaxTransaction[];
  config: TaxConfiguration;
}

const METHOD_LABELS: Record<TaxConfiguration['costBasisMethod'], string> = {
  FIFO: 'FIFO',
  LIFO: 'LIFO',
  SPECIFIC_ID: 'HIFO',
  AVERAGE_COST: 'Average Cost',
};

const METHOD_DESCRIPTIONS_EN: Record<TaxConfiguration['costBasisMethod'], string> = {
  FIFO: 'First In, First Out',
  LIFO: 'Last In, First Out',
  SPECIFIC_ID: 'Highest In, First Out',
  AVERAGE_COST: 'Average Cost Basis',
};

const METHOD_DESCRIPTIONS_TR: Record<TaxConfiguration['costBasisMethod'], string> = {
  FIFO: 'İlk Giren İlk Çıkar',
  LIFO: 'Son Giren İlk Çıkar',
  SPECIFIC_ID: 'En Yüksek Maliyetli İlk Çıkar',
  AVERAGE_COST: 'Ortalama Maliyet Esası',
};

const METHODS: TaxConfiguration['costBasisMethod'][] = ['FIFO', 'LIFO', 'SPECIFIC_ID', 'AVERAGE_COST'];

export const CostBasisComparison: React.FC<CostBasisComparisonProps> = ({ transactions, config }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const results = useMemo(() => {
    return METHODS.map(method => {
      const calc = EnhancedTaxCalculatorService.calculateTaxes(transactions, { ...config, costBasisMethod: method });
      return { method, calc };
    });
  }, [transactions, config]);

  const bestMethod = results.reduce((best, curr) =>
    curr.calc.totalTaxLiability < best.calc.totalTaxLiability ? curr : best
  );

  const worstMethod = results.reduce((worst, curr) =>
    curr.calc.totalTaxLiability > worst.calc.totalTaxLiability ? curr : worst
  );

  const maxSavings = worstMethod.calc.totalTaxLiability - bestMethod.calc.totalTaxLiability;

  const methodDescriptions = tr ? METHOD_DESCRIPTIONS_TR : METHOD_DESCRIPTIONS_EN;

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          {tr ? 'Maliyet Esası Yöntemi Karşılaştırması' : 'Cost Basis Method Comparison'}
        </CardTitle>
        {maxSavings > 0 && (
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-success" />
            <span>
              <span className="font-semibold text-success">
                {METHOD_LABELS[bestMethod.method]}
              </span>
              {tr ? ' yöntemi ' : ' saves '}
              <span className="font-semibold text-success">
                {EnhancedTaxCalculatorService.formatCurrency(maxSavings)}
              </span>
              {tr ? ' tasarruf sağlar — ' : ' vs '}
              {METHOD_LABELS[worstMethod.method]}
              {tr ? ' yöntemine kıyasla' : ''}
            </span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {results.map(({ method, calc }) => {
            const isBest = method === bestMethod.method;
            return (
              <div
                key={method}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isBest
                    ? 'border-success/30 bg-success/5'
                    : 'border-border/20 bg-muted/20'
                } ${method === config.costBasisMethod ? 'ring-1 ring-primary/30' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{METHOD_LABELS[method]}</span>
                      {isBest && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-success hover:bg-success">
                          {tr ? 'En Az Vergi' : 'Lowest Tax'}
                        </Badge>
                      )}
                      {method === config.costBasisMethod && !isBest && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {tr ? 'Seçili' : 'Selected'}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{methodDescriptions[method]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right shrink-0">
                  <div>
                    <div className="text-xs text-muted-foreground">{tr ? 'Net Kazanç' : 'Net Gains'}</div>
                    <div className={`text-sm font-medium ${calc.federalTax.netCapitalGains >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {EnhancedTaxCalculatorService.formatCurrency(calc.federalTax.netCapitalGains)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{tr ? 'Toplam Vergi' : 'Total Tax'}</div>
                    <div className="text-sm font-semibold text-foreground">
                      {EnhancedTaxCalculatorService.formatCurrency(calc.totalTaxLiability)}
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-muted-foreground">{tr ? 'Eff. Oran' : 'Eff. Rate'}</div>
                    <div className="text-sm text-foreground">
                      {EnhancedTaxCalculatorService.formatPercentage(calc.federalTax.effectiveTaxRate)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
