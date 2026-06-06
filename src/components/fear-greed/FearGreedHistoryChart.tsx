import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { getClassification, getColor, type FGDataPoint } from '@/services/fearGreedService';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';

interface ChartDataPoint {
  date: string;
  value: number;
  price?: number;
  color: string;
}

interface FearGreedHistoryChartProps {
  fgData: FGDataPoint[];
  priceData?: { date: string; price: number }[];
}

const TIME_RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
  { label: 'All', days: 0 },
];

export const FearGreedHistoryChart: React.FC<FearGreedHistoryChartProps> = ({ fgData, priceData }) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [selectedRange, setSelectedRange] = useState(30);

  const priceMap = new Map<string, number>();
  priceData?.forEach((p) => priceMap.set(p.date, p.price));

  const filteredData = selectedRange === 0 ? fgData : fgData.slice(0, selectedRange);

  const chartData: ChartDataPoint[] = filteredData
    .map((d) => ({ date: d.date, value: d.value, price: priceMap.get(d.date), color: getColor(d.value) }))
    .reverse();

  const hasPriceData = chartData.some(d => d.price !== undefined);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload as ChartDataPoint;
    return (
      <div style={chartTooltipStyle}>
        <p style={{ ...chartTooltipLabelStyle, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>
          {new Date(d.date).toLocaleDateString(isTr ? 'tr-TR' : undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-3 h-3 rounded-full ring-2 ring-white/20" style={{ backgroundColor: d.color }} />
          <span className="text-foreground font-bold text-lg">{d.value}</span>
          <span className="text-muted-foreground text-xs">— {getClassification(d.value)}</span>
        </div>
        {d.price && (
          <div className="pt-1.5 border-t border-border/30">
            <span style={chartTooltipLabelStyle}>{isTr ? 'BTC Fiyatı: ' : 'BTC Price: '}</span>
            <span style={chartTooltipItemStyle}>${d.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-border/20 bg-card shadow-lg" data-currency-exempt="true">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            {isTr ? 'Tarihsel Korku & Açgözlülük Endeksi' : 'Historical Fear & Greed Index'}
          </CardTitle>
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            {TIME_RANGES.map((r) => (
              <Button key={r.label} variant={selectedRange === r.days ? 'default' : 'ghost'} size="sm"
                className={`h-7 px-3 text-xs font-medium ${selectedRange === r.days ? '' : 'hover:bg-muted'}`}
                onClick={() => setSelectedRange(r.days)}>
                {r.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="w-full h-[280px] sm:h-[380px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={280}>
            <ComposedChart data={chartData} margin={{ top: 10, right: hasPriceData ? 10 : 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <ReferenceArea y1={0} y2={25} fill="hsl(var(--destructive))" fillOpacity={0.04} yAxisId="fg" />
              <ReferenceArea y1={25} y2={45} fill="hsl(var(--warning))" fillOpacity={0.03} yAxisId="fg" />
              <ReferenceArea y1={45} y2={55} fill="hsl(var(--warning))" fillOpacity={0.02} yAxisId="fg" />
              <ReferenceArea y1={55} y2={75} fill="hsl(var(--success))" fillOpacity={0.03} yAxisId="fg" />
              <ReferenceArea y1={75} y2={100} fill="hsl(var(--success))" fillOpacity={0.04} yAxisId="fg" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return selectedRange <= 30
                    ? `${d.getMonth() + 1}/${d.getDate()}`
                    : d.toLocaleDateString(undefined, { month: 'short' });
                }}
                interval="preserveStartEnd" className="fill-muted-foreground" axisLine={false} tickLine={false} />
              <YAxis yAxisId="fg" domain={[0, 100]} tick={{ fontSize: 10 }} className="fill-muted-foreground"
                width={30} axisLine={false} tickLine={false} />
              {hasPriceData && (
                <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  className="fill-muted-foreground" width={48} axisLine={false} tickLine={false} />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="fg" type="monotone" dataKey="value"
                stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={1.5} />
              {hasPriceData && (
                <Line yAxisId="price" type="monotone" dataKey="price"
                  stroke="hsl(var(--warning))" strokeWidth={1.5} dot={false} opacity={0.7} />
              )}
            </ComposedChart>
          </PerformantResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded-full bg-primary" />
            <span>{isTr ? 'Korku & Açgözlülük Endeksi' : 'Fear & Greed Index'}</span>
          </div>
          {hasPriceData && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded-full bg-amber-500" />
              <span>{isTr ? 'BTC Fiyatı (USD)' : 'BTC Price (USD)'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
