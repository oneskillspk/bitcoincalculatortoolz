import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";
import { generateHistoricalCurve, PowerLawChartPoint } from "@/services/powerLawCalculator";
import { LineChart as LineChartIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { formatMoneyCompact } from "@/utils/formatMoney";
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';
import { axisStyle, chartStrokeWidth, gridProps, seriesColor } from '@/components/charts/theme';

interface PowerLawChartProps {
  targetYear?: number;
  currentPrice?: number;
}

const makeFormatPrice = (tr: boolean, fxRate: number) => (v: number) =>
  formatMoneyCompact(v, { tr, fxRate });

const CustomTooltip = ({ active, payload, label, formatPrice }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={chartTooltipStyle}>
      <p style={chartTooltipLabelStyle}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ ...chartTooltipItemStyle, color: entry.color }}>
          {entry.name}: {formatPrice(entry.value)}
        </p>
      ))}
    </div>
  );
};

export const PowerLawChart = ({ targetYear = 2036, currentPrice }: PowerLawChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const formatPrice = makeFormatPrice(isTr, fxRate);

  const data = useMemo(() => {
    const endYear = Math.max(2036, targetYear + 1);
    return generateHistoricalCurve(2010, endYear);
  }, [targetYear]);

  const logTicks = [0.01, 0.1, 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-primary mb-6">
          <LineChartIcon className="w-5 h-5" />
          <h3 className="font-semibold text-foreground">
            {isTr ? 'Güç Yasası Güven Koridoru' : 'Power Law Confidence Corridor'}
          </h3>
        </div>

        <div className="h-[280px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="supportGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fairGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="resistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid {...gridProps} />
              <XAxis
                dataKey="date"
                {...axisStyle}
                tickFormatter={(v) => v.substring(0, 4)}
                interval={Math.floor(data.length / 8)}
              />
              <YAxis
                scale="log"
                domain={['auto', 'auto']}
                ticks={logTicks}
                {...axisStyle}
                tickFormatter={formatPrice}
                width={60}
              />
              <Tooltip content={<CustomTooltip formatPrice={formatPrice} />} />

              <Area
                type="monotone"
                dataKey="resistance"
                name={isTr ? 'Direnç' : 'Resistance'}
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={chartStrokeWidth}
                fill="url(#resistGrad)"
                strokeDasharray="4 2"
              />
              <Area
                type="monotone"
                dataKey="fairValue"
                name={isTr ? 'Adil Değer' : 'Fair Value'}
                stroke={seriesColor('btc')}
                strokeWidth={chartStrokeWidth}
                fill="url(#fairGrad)"
              />
              <Area
                type="monotone"
                dataKey="support"
                name={isTr ? 'Destek' : 'Support'}
                stroke="hsl(var(--primary))"
                strokeWidth={chartStrokeWidth}
                fill="url(#supportGrad)"
                strokeDasharray="4 2"
                strokeOpacity={0.6}
              />


              {currentPrice && (
                <ReferenceLine
                  y={currentPrice}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  label={{
                    value: `${isTr ? 'Canlı' : 'Live'}: ${formatPrice(currentPrice)}`,
                    position: 'right',
                    fill: 'hsl(var(--destructive))',
                    fontSize: 11
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-primary rounded" />
            <span>{isTr ? 'Adil Değer' : 'Fair Value'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-primary/50 rounded" style={{ borderBottom: '1px dashed' }} />
            <span>{isTr ? 'Destek (÷3)' : 'Support (÷3)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded" style={{ backgroundColor: 'hsl(142, 71%, 45%)' }} />
            <span>{isTr ? 'Direnç (×3)' : 'Resistance (×3)'}</span>
          </div>
          {currentPrice && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-destructive rounded" />
              <span>{isTr ? 'Güncel Fiyat' : 'Current Price'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
