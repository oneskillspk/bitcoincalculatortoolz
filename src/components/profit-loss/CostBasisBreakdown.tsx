import React from 'react';
import { Purchase } from '@/services/profitLossCalculator';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle, chartSeriesOrdered } from '@/components/calculator/chartTokens';
import { ResultPanel } from '@/components/calculator';
import { formatSymbolAmount } from '@/utils/numberFormat';

interface CostBasisBreakdownProps {
  purchases: Purchase[];
  sellPrice: number;
}

const formatCurrency = (value: number): string =>
  formatSymbolAmount(value, '$', 2, 'en-US');

export const CostBasisBreakdown: React.FC<CostBasisBreakdownProps> = ({ purchases, sellPrice }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const validPurchases = purchases.filter(p => p.amount > 0 && p.pricePerBtc > 0);
  if (validPurchases.length <= 1) return null;

  const palette = chartSeriesOrdered;
  const chartData = validPurchases.map((p, i) => ({
    name: tr ? `Alım #${i + 1}` : `Purchase #${i + 1}`,
    value: p.amount,
    btc: p.btcAmount,
    price: p.pricePerBtc,
    currentValue: p.btcAmount * sellPrice,
    pl: (p.btcAmount * sellPrice) - p.amount,
  }));

  return (
    <ResultPanel
      title={tr ? 'Maliyet Bazı Dağılımı' : 'Cost Basis Breakdown'}
      eyebrow={tr ? 'Her alımın toplam pozisyonunuza katkısı' : 'How each purchase contributes to your total position'}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-[200px] min-h-[200px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number) => [formatCurrency(value), tr ? 'Yatırılan' : 'Invested']}
              />
            </PieChart>
          </PerformantResponsiveContainer>
        </div>

        <div className="space-y-2">
          {chartData.map((entry, i) => (
            <div
              key={i}
              className="calc-surface-subtle flex items-center gap-2 p-2 text-xs"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: palette[i % palette.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">{entry.name}</div>
                <div className="text-muted-foreground">
                  {formatCurrency(entry.value)} @ {formatCurrency(entry.price)}
                </div>
              </div>
              <div className={`text-right font-mono ${entry.pl >= 0 ? 'text-success' : 'text-destructive'}`}>
                {entry.pl >= 0 ? '+' : ''}{formatCurrency(entry.pl)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResultPanel>
  );
};
