import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { Holding } from './usePortfolioStorage';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle, chartSeriesOrdered, chartSeries } from '@/components/calculator/chartTokens';

interface PortfolioAllocationChartProps {
  holdings: Holding[];
  livePrice: number | null;
  currencySymbol?: string;
  exchangeRate?: number;
}

const COLORS = [
  ...chartSeriesOrdered,
  chartSeries.success,
  chartSeries.warning,
  chartSeries.destructive,
];

export const PortfolioAllocationChart = ({ holdings, livePrice, currencySymbol = '$', exchangeRate = 1 }: PortfolioAllocationChartProps) => {
  const { language } = useLanguage();
  if (holdings.length === 0 || !livePrice) return null;

  const fmt = (val: number) => `${currencySymbol}${(val * exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const totalValue = holdings.reduce((s, h) => s + h.btcAmount * livePrice, 0);
  const data = holdings.map(h => ({
    name: h.label,
    value: h.btcAmount * livePrice,
    btc: h.btcAmount,
    pct: totalValue > 0 ? ((h.btcAmount * livePrice) / totalValue) * 100 : 0,
  }));

  const largest = data.reduce((a, b) => a.pct > b.pct ? a : b);

  return (
    <Card className="border-border/40">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-4">{language === 'tr' ? 'Portföy Dağılımı' : 'Portfolio Allocation'}</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 h-64 min-h-[256px]">
            <PerformantResponsiveContainer minHeight={256}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} formatter={(value: number) => fmt(value)} />
              </PieChart>
            </PerformantResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 space-y-2">
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-foreground truncate">{d.name}</span>
                <span className="text-muted-foreground ml-auto">{d.pct.toFixed(1)}%</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">
              {language === 'tr'
                ? `Yoğunlaşma: ${holdings.length} pozisyon, en büyüğü portföyün %${largest.pct.toFixed(1)}'i`
                : `Concentration: ${holdings.length} ${holdings.length === 1 ? 'holding' : 'holdings'}, largest is ${largest.pct.toFixed(1)}% of portfolio`}
            </p>
            {holdings.length === 1 && (
              <p className="text-xs text-warning dark:text-warning">
                {language === 'tr'
                  ? 'Tek bir pozisyonda %100 yoğunlaşma — zamanlama riskini azaltmak için DCA stratejisini değerlendirin'
                  : '100% concentrated in single entry — consider DCA strategy to reduce timing risk'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
