import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { getNormalizedGrowth, YEAR_LABELS, getHistoricalAssets } from "@/services/cagrCalculator";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle, chartLegendStyle } from '@/components/calculator/chartTokens';

interface CAGRHistoricalChartProps {
  selectedAssets: string[];
}

export const CAGRHistoricalChart = ({ selectedAssets }: CAGRHistoricalChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const allAssets = getHistoricalAssets();

  const chartData = useMemo(() => {
    const data: Record<string, any>[] = [];
    YEAR_LABELS.forEach((year, i) => {
      const point: Record<string, any> = { year: year.toString() };
      selectedAssets.forEach(ticker => {
        const growth = getNormalizedGrowth(ticker);
        if (growth[i]) point[ticker] = growth[i].value;
      });
      data.push(point);
    });
    return data;
  }, [selectedAssets]);

  const getAssetColor = (ticker: string) => allAssets.find(a => a.ticker === ticker)?.color || '#888';
  const getAssetName = (ticker: string) => allAssets.find(a => a.ticker === ticker)?.name || ticker;

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {isTr ? 'Tarihsel Büyüme (2016–2026)' : 'Historical Growth (2016–2026)'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isTr
                ? 'Ocak 2016\'da yatırılan $1 — normalleştirilmiş büyüme'
                : '$1 invested in January 2016 — normalized growth'}
            </p>
          </div>
        </div>
        <div className="w-full h-[280px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} />
              <YAxis tickFormatter={(v: number) => `$${v.toFixed(0)}`} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }} width={60} scale="log" domain={['auto', 'auto']} allowDataOverflow />
              <Tooltip
                formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, getAssetName(name)]}
                contentStyle={chartTooltipStyle}
              />
              <Legend formatter={(value: string) => getAssetName(value)} wrapperStyle={chartLegendStyle} />
              {selectedAssets.map(ticker => (
                <Line key={ticker} type="monotone" dataKey={ticker} stroke={getAssetColor(ticker)}
                  strokeWidth={1.5} dot={false} activeDot={{ r: 5 }} name={ticker} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
