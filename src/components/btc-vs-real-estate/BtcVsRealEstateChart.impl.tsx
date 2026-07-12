import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { YearlyBreakdown } from "@/services/btcVsRealEstateCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { formatMoney, formatMoneyCompact } from "@/utils/formatMoney";
import { chartTooltipStyle, chartLegendStyle } from '@/components/calculator/chartTokens';

interface Props {
  data: YearlyBreakdown[];
}

export const BtcVsRealEstateChart = ({ data }: Props) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const fmt = (v: number) => formatMoneyCompact(v, { tr: isTr, fxRate });
  const fmtFull = (v: number) => formatMoney(v, { tr: isTr, fxRate, decimals: 0 });

  const chartData = data.map(d => ({
    year: isTr ? `Yıl ${d.year}` : `Year ${d.year}`,
    Bitcoin: Math.round(d.btcValue),
    [isTr ? 'Gayrimenkul' : 'Real Estate']: Math.round(d.reNetValue),
  }));

  return (
    <Card className="border-border/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          {isTr ? 'Zaman İçinde Kümülatif Değer' : 'Cumulative Value Over Time'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                formatter={(value: number) => fmtFull(value)}
                contentStyle={chartTooltipStyle}
              />
              <Legend wrapperStyle={chartLegendStyle} />
              <Area type="monotone" dataKey="Bitcoin" stroke="hsl(var(--primary))" fill="url(#btcGrad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey={isTr ? 'Gayrimenkul' : 'Real Estate'} stroke="hsl(217, 91%, 60%)" fill="url(#reGrad)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
