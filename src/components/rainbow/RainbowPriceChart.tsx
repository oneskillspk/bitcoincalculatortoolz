import React, { useMemo, useState, useCallback } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
  ReferenceLine,
  Brush,
  CartesianGrid,
} from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { BANDS, HALVING_DATES, ChartDataPoint } from '@/services/rainbowChartService';
import { localizeBandName } from '@/components/rainbow/bandLabels';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

interface RainbowPriceChartProps {
  chartData: ChartDataPoint[];
  currentPrice: number;
  isLoading: boolean;
}

const Y_TICKS = [50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

const PRESETS = [
  { label: '1Y', days: 365 },
  { label: '3Y', days: 365 * 3 },
  { label: '5Y', days: 365 * 5 },
  { label: '10Y', days: 365 * 10 },
  { label: 'All', days: 0 },
  { label: 'Full', days: -1 },
];

const HalvingLabel = ({ viewBox, value, isMobile }: any) => {
  if (isMobile) return null;
  const { x, y } = viewBox;
  return (
    <text
      x={x + 4}
      y={y + 14}
      fill="hsl(var(--muted-foreground))"
      fillOpacity={0.7}
      fontSize={10}
      fontWeight={600}
      textAnchor="start"
      transform={`rotate(-90, ${x + 4}, ${y + 14})`}
    >
      {value}
    </text>
  );
};

export const RainbowPriceChart: React.FC<RainbowPriceChartProps> = ({
  chartData,
  currentPrice,
  isLoading,
}) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [selectedRange, setSelectedRange] = useState('All');
  const [brushIndices, setBrushIndices] = useState<{ startIndex?: number; endIndex?: number }>({});

  const filteredData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    const range = PRESETS.find(r => r.label === selectedRange);
    if (!range) return chartData;
    if (range.days === -1) return chartData;
    const now = Date.now();
    if (range.days === 0) return chartData.filter(d => d.timestamp <= now);
    const cutoff = now - range.days * 24 * 60 * 60 * 1000;
    return chartData.filter(d => d.timestamp >= cutoff && d.timestamp <= now);
  }, [chartData, selectedRange]);

  const zoomIn = useCallback(() => {
    if (!filteredData.length) return;
    const total = filteredData.length;
    const start = brushIndices.startIndex ?? 0;
    const end = brushIndices.endIndex ?? total - 1;
    const span = end - start;
    const shrink = Math.max(Math.floor(span * 0.15), 1);
    setBrushIndices({ startIndex: Math.min(start + shrink, end - 2), endIndex: Math.max(end - shrink, start + 2) });
  }, [filteredData, brushIndices]);

  const zoomOut = useCallback(() => {
    if (!filteredData.length) return;
    const total = filteredData.length;
    const start = brushIndices.startIndex ?? 0;
    const end = brushIndices.endIndex ?? total - 1;
    const span = end - start;
    const grow = Math.max(Math.floor(span * 0.15), 1);
    setBrushIndices({ startIndex: Math.max(start - grow, 0), endIndex: Math.min(end + grow, total - 1) });
  }, [filteredData, brushIndices]);

  const resetZoom = useCallback(() => setBrushIndices({}), []);

  const lastPricePoint = useMemo(() => {
    if (!filteredData.length) return null;
    for (let i = filteredData.length - 1; i >= 0; i--) {
      if (filteredData[i].price) return filteredData[i];
    }
    return null;
  }, [filteredData]);

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatXAxis = (dateStr: string) => {
    const d = new Date(dateStr);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0]?.payload as ChartDataPoint;
    if (!data) return null;
    const d = new Date(data.date);
    const priceVal = data.price;

    let bandName = isTr ? 'Gelecek projeksiyonu' : 'Future projection';
    let bandColor = '#6366f1';
    if (priceVal) {
      const bandsBottomUp = [...BANDS].reverse();
      for (const band of bandsBottomUp) {
        const bandKey = `band${band.index}` as keyof ChartDataPoint;
        const bandVal = data[bandKey] as number;
        if (priceVal >= bandVal) {
          bandName = localizeBandName(band.name, isTr);
          bandColor = band.color;
        }
      }
    }

    return (
      <div className="bg-popover/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-card max-w-[260px]">
        <p className="text-xs text-muted-foreground mb-1 font-medium">
          {d.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        {priceVal ? (
          <>
            <p className="text-lg font-bold text-foreground mb-1 font-mono tabular-nums">
              ${formatGroupedInt(priceVal, 'en-US')}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full ring-2 ring-border" style={{ backgroundColor: bandColor }} />
              <span className="text-xs font-semibold" style={{ color: bandColor }}>{bandName}</span>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground/70 italic">
            {isTr ? 'Yalnızca bant projeksiyonu' : 'Band projection only'}
          </p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-border/20 bg-card shadow-card">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <span className="text-sm text-muted-foreground">
              {isTr ? 'Grafik verileri yükleniyor...' : 'Loading chart data...'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/20 bg-card shadow-card overflow-hidden relative">
      <div className="px-3 sm:px-5 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
          {[...BANDS].reverse().map(band => (
            <div key={band.index} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: band.color }} />
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap font-medium">
                {localizeBandName(band.name, isTr)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 sm:px-5 pb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <Button
              key={p.label}
              variant={selectedRange === p.label ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectedRange(p.label); resetZoom(); }}
              className="text-xs h-8 px-3 min-w-[40px] rounded-md"
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon-sm" onClick={zoomIn} title={isTr ? 'Yakınlaştır' : 'Zoom In'}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={zoomOut} title={isTr ? 'Uzaklaştır' : 'Zoom Out'}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={resetZoom} title={isTr ? 'Sıfırla' : 'Reset Zoom'}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="px-0 sm:px-2 pb-4 pt-0">
        <div className="h-[360px] sm:h-[500px] lg:h-[600px] w-full min-h-[360px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={360}>
            <ComposedChart data={filteredData} margin={{ top: 10, right: 15, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />

              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 9, fill: 'hsl(var(--chart-axis))' }}
                axisLine={{ stroke: 'hsl(var(--chart-grid))' }}
                tickLine={{ stroke: 'hsl(var(--chart-grid))' }}
                minTickGap={60}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                scale="log"
                domain={['auto', 'auto']}
                ticks={Y_TICKS}
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: 'hsl(var(--chart-axis))' }}
                axisLine={{ stroke: 'hsl(var(--chart-grid))' }}
                tickLine={{ stroke: 'hsl(var(--chart-grid))' }}
                width={60}
                allowDataOverflow
                label={{
                  value: isTr ? 'BTC / USD' : 'BTC in USD',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />

              <Area type="monotone" dataKey="bandTop" stroke="none" fill="hsl(var(--destructive))" fillOpacity={1} isAnimationActive={false} />
              {BANDS.map(band => (
                <Area
                  key={`area-${band.index}`}
                  type="monotone"
                  dataKey={`band${band.index}`}
                  stroke="none"
                  fill={band.color}
                  fillOpacity={1}
                  isAnimationActive={false}
                />
              ))}

              {HALVING_DATES.map(h => (
                <ReferenceLine
                  key={h.number}
                  x={h.date}
                  stroke="hsl(var(--foreground) / 0.35)"
                  strokeDasharray="6 4"
                  strokeWidth={1.2}
                  label={<HalvingLabel value={h.label} isMobile={isMobile} />}
                />
              ))}

              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--foreground))"
                strokeWidth={1.5}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
                style={{ filter: 'drop-shadow(0 0 2px hsl(var(--background) / 0.7))' }}
              />

              {lastPricePoint?.price && (
                <>
                  <ReferenceDot x={lastPricePoint.date} y={lastPricePoint.price} r={10} fill="hsl(var(--foreground) / 0.15)" stroke="none" />
                  <ReferenceDot x={lastPricePoint.date} y={lastPricePoint.price} r={5} fill="hsl(var(--foreground))" stroke="hsl(var(--background))" strokeWidth={1.5} />
                </>
              )}

              <Brush
                dataKey="date"
                height={isMobile ? 20 : 28}
                stroke="hsl(var(--chart-axis))"
                fill="hsl(var(--muted))"
                tickFormatter={() => ''}
                startIndex={brushIndices.startIndex}
                endIndex={brushIndices.endIndex}
                onChange={(range: any) => {
                  if (range) setBrushIndices({ startIndex: range.startIndex, endIndex: range.endIndex });
                }}
              />
            </ComposedChart>
          </PerformantResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
