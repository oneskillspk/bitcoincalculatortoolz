import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { MonthlyProjection } from "@/services/miningProfitabilityCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { formatMoney, formatMoneyCompact } from "@/utils/formatMoney";
import { chartLegendStyle } from '@/components/calculator/chartTokens';

interface MiningProfitChartProps {
  projections: MonthlyProjection[];
  currency: string;
}

export const MiningProfitChart = ({ projections, currency }: MiningProfitChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const fxRate = useUsdToTryRate();

  const chartData = projections.map(p => ({
    month: isTr ? `Ay ${p.month}` : `Month ${p.month}`,
    revenue: p.revenue,
    costs: p.electricityCost,
    profit: p.profit,
    cumulativeProfit: p.cumulativeProfit,
  }));

  const formatCurrencyVal = (value: number) => {
    if (isTr) return formatMoney(value, { tr: true, fxRate, decimals: 0 });
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  const formatAxis = (value: number) => formatMoneyCompact(value, { tr: isTr, fxRate });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">{formatCurrencyVal(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          {isTr ? '12 Aylık Kâr Projeksiyonu' : '12-Month Profit Projection'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={chartLegendStyle}
                formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name={isTr ? 'Gelir' : 'Revenue'}
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                name={isTr ? 'Aylık Kâr' : 'Monthly Profit'}
                stroke="hsl(var(--success))"
                strokeWidth={1.5}
                fill="url(#colorProfit)"
              />
              <Area
                type="monotone"
                dataKey="cumulativeProfit"
                name={isTr ? 'Kümülatif Kâr' : 'Cumulative Profit'}
                stroke="hsl(var(--chart-3))"
                strokeWidth={1.5}
                fill="url(#colorCumulative)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
