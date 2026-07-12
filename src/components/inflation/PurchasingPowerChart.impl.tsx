import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown } from "lucide-react";
import { PurchasingPowerComparison } from "@/services/inflationComparisonCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface PurchasingPowerChartProps {
  data: PurchasingPowerComparison[];
}

export const PurchasingPowerChart = ({ data }: PurchasingPowerChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingDown className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-lg">
            {isTr ? 'Zaman İçinde Satın Alma Gücü' : 'Purchasing Power Over Time'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorBitcoin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFiat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} className="stroke-muted" />
              <XAxis dataKey="year" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `${value}%`} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number, name: string) => [`${value.toFixed(0)}%`, name]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="bitcoinPurchasingPower"
                name="Bitcoin"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill="url(#colorBitcoin)"
              />
              <Area
                type="monotone"
                dataKey="fiatPurchasingPower"
                name={isTr ? 'Fiat Para' : 'Fiat Currency'}
                stroke="hsl(var(--destructive))"
                strokeWidth={1.5}
                fill="url(#colorFiat)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">
              {isTr ? 'Bitcoin Kazancı' : 'Bitcoin Gains'}
            </p>
            <p className="text-lg font-bold text-primary">
              {data.length > 0 ? `+${(data[data.length - 1].bitcoinPurchasingPower - 100).toFixed(0)}%` : '-'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-muted-foreground mb-1">
              {isTr ? 'Fiat Kaybı' : 'Fiat Loses'}
            </p>
            <p className="text-lg font-bold text-destructive">
              {data.length > 0 ? `${(data[data.length - 1].fiatPurchasingPower - 100).toFixed(0)}%` : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
