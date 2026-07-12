import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PerformantResponsiveContainer } from "@/components/optimized/PerformantResponsiveContainer";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { VolatilityData } from "@/services/volatilityService";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface Props {
  data: VolatilityData | undefined;
}

type WindowKey = "30d" | "90d" | "180d" | "1y";

function stddev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const sq = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(sq);
}

export const VolatilityRollingWindow = ({ data }: Props) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const WINDOWS: { key: WindowKey; labelEn: string; labelTr: string; days: number }[] = [
    { key: "30d", labelEn: "30 Day", labelTr: "30 Gün", days: 30 },
    { key: "90d", labelEn: "90 Day", labelTr: "90 Gün", days: 90 },
    { key: "180d", labelEn: "6 Month", labelTr: "6 Ay", days: 180 },
    { key: "1y", labelEn: "1 Year", labelTr: "1 Yıl", days: 365 },
  ];

  const [window, setWindow] = useState<WindowKey>("30d");
  const currentWindow = WINDOWS.find(w => w.key === window)!;

  const { series, currentVol } = useMemo(() => {
    if (!data) return { series: [] as { date: string; vol: number }[], currentVol: 0 };
    const days = currentWindow.days;
    const rets = data.dailyReturns.map(d => d.ret / 100);
    const dates = data.dailyReturns.map(d => d.date);
    const out: { date: string; vol: number }[] = [];
    for (let i = days - 1; i < rets.length; i++) {
      const slice = rets.slice(i - days + 1, i + 1);
      const v = stddev(slice) * Math.sqrt(365) * 100;
      out.push({ date: dates[i], vol: Math.round(v * 100) / 100 });
    }
    return { series: out, currentVol: out[out.length - 1]?.vol ?? 0 };
  }, [data, window]);

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {isTr ? 'Kayan Pencere Oynaklığı' : 'Rolling Window Volatility'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isTr
                ? 'Gerçekleşen oynaklığın geçen yıl boyunca nasıl değiştiğini görmek için bir geriye bakış süresi seçin.'
                : 'Pick a lookback to see how realized vol has tracked over the past year.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {WINDOWS.map(w => (
              <Button key={w.key} size="sm" variant={window === w.key ? "default" : "outline"}
                onClick={() => setWindow(w.key)} className="min-h-11 px-4">
                {isTr ? w.labelTr : w.labelEn}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold text-foreground">{currentVol.toFixed(1)}%</span>
          <span className="text-sm text-muted-foreground">
            {isTr
              ? `yıllıklandırılmış · ${currentWindow.labelTr} geriye bakış`
              : `annualized · ${currentWindow.labelEn} lookback`}
          </span>
        </div>

        <PerformantResponsiveContainer height={260}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(v) => new Date(v).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { month: 'short' })}
              minTickGap={40} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(v: number) => [`${v.toFixed(1)}%`, isTr ? 'Oynaklık' : 'Vol']}
              labelFormatter={(l) => new Date(l).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')} />
            <Line type="monotone" dataKey="vol" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} />
          </LineChart>
        </PerformantResponsiveContainer>
      </CardContent>
    </Card>
  );
};
