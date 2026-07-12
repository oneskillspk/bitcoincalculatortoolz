import { Card, CardContent } from "@/components/ui/card";
import { PerformantResponsiveContainer } from "@/components/optimized/PerformantResponsiveContainer";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import type { VolatilityData } from "@/services/volatilityService";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface Props {
  data: VolatilityData | undefined;
  loading: boolean;
}

export const VolatilityChart = ({ data, loading }: Props) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  if (loading || !data) {
    return (
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse h-[350px] bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.rollingVol.filter((_, i) => i % 3 === 0);

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {isTr ? 'Kayan Yıllıklandırılmış Oynaklık' : 'Rolling Annualized Volatility'}
        </h3>
        <PerformantResponsiveContainer height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(d) => d.slice(5)} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(v: number) => [`${v.toFixed(1)}%`]} />
            <Legend />
            <Line type="monotone" dataKey="vol30" name={isTr ? '30 Günlük' : '30-Day'} stroke="hsl(var(--primary))" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="vol60" name={isTr ? '60 Günlük' : '60-Day'} stroke="hsl(var(--chart-3))" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="vol90" name={isTr ? '90 Günlük' : '90-Day'} stroke="hsl(var(--chart-2))" dot={false} strokeWidth={1.5} />
          </LineChart>
        </PerformantResponsiveContainer>
      </CardContent>
    </Card>
  );
};
