import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { StackSatsResult } from "@/services/stackSatsCalculator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface StackSatsProgressChartProps {
  results: StackSatsResult | null;
  currentBtcHoldings: number;
}

export const StackSatsProgressChart = ({ results, currentBtcHoldings }: StackSatsProgressChartProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  if (!results) return null;

  const chartData = [];
  let accumulatedBtc = currentBtcHoldings;
  for (let month = 0; month <= results.monthsToGoal; month += Math.max(1, Math.floor(results.monthsToGoal / 20))) {
    if (month < results.monthlySatsPurchased.length) {
      for (let i = chartData.length > 0 ? chartData.length * Math.max(1, Math.floor(results.monthsToGoal / 20)) : 0; i < month; i++) {
        if (i < results.monthlySatsPurchased.length) accumulatedBtc += results.monthlySatsPurchased[i] / 100000000;
      }
    }
    chartData.push({ month, btc: Math.min(accumulatedBtc, results.totalBtcAtGoal), label: month === 0 ? (tr ? 'Şimdi' : 'Now') : `${month}${tr ? 'ay' : 'mo'}` });
  }
  if (chartData[chartData.length - 1].month !== results.monthsToGoal) chartData.push({ month: results.monthsToGoal, btc: results.totalBtcAtGoal, label: `${results.monthsToGoal}${tr ? 'ay' : 'mo'}` });

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg"><BarChart3 className="w-5 h-5 text-primary" /></div>
          {tr ? 'Birikim İlerlemesi' : 'Accumulation Progress'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PerformantResponsiveContainer width="100%" height={300} minHeight={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value.toFixed(2)} BTC`} />
            <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`${value.toFixed(4)} BTC`, tr ? 'Birikmiş' : 'Accumulated']} />
            <ReferenceLine y={results.totalBtcAtGoal} stroke="hsl(var(--primary))" strokeDasharray="5 5" label={{ value: tr ? 'Hedef' : 'Goal', position: 'right', fill: 'hsl(var(--primary))' }} />
            <Line type="monotone" dataKey="btc" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={{ fill: 'hsl(var(--primary))', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </PerformantResponsiveContainer>
      </CardContent>
    </Card>
  );
};