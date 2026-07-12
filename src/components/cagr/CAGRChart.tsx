import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { formatGroupedInt } from '@/utils/numberFormat';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { type CAGRResult } from "@/services/cagrCalculator";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle, chartLegendStyle } from '@/components/calculator/chartTokens';

interface CAGRChartProps {
  result: CAGRResult;
}

export const CAGRChart = ({ result }: CAGRChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const chartData = useMemo(() => {
    if (!result.projectedValues.length) return [];
    const maxYears = result.years;
    const data: Record<string, any>[] = [];
    for (let y = 0; y <= maxYears; y++) {
      const point: Record<string, any> = { year: isTr ? `${y}. Yıl` : `Year ${y}` };
      result.projectedValues.forEach(pv => {
        const entry = pv.yearlyData.find(d => d.year === y);
        if (entry) point[pv.asset] = entry.value;
      });
      data.push(point);
    }
    return data;
  }, [result, isTr]);

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatTooltip = (value: number) =>
    `$${formatGroupedInt(value, getCurrentIntlLocale())}`;

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {isTr ? 'Büyüme Projeksiyon Grafiği' : 'Growth Projection Chart'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isTr
                ? `$${formatGroupedInt(result.investmentAmount, getCurrentIntlLocale())} yatırım, ${result.years} yıl boyunca`
                : `$${formatGroupedInt(result.investmentAmount, getCurrentIntlLocale())} invested over ${result.years} years`}
            </p>
          </div>
        </div>
        <div className="w-full h-[280px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} width={70} />
              <Tooltip
                formatter={(value: number, name: string) => [formatTooltip(value), name]}
                contentStyle={chartTooltipStyle}
              />
              <Legend wrapperStyle={chartLegendStyle} />
              {result.projectedValues.map(pv => (
                <Line key={pv.asset} type="monotone" dataKey={pv.asset} stroke={pv.color} strokeWidth={1.5} dot={false} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
