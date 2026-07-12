import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceDot } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { generateBellCurveData } from '@/services/accumulationScoreService';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface Props {
  userAge: number;
  userHoldings: number;
}

export const AccumulationLifecycleCurve = ({ userAge, userHoldings }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const data = useMemo(() => generateBellCurveData(), []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        {tr ? 'Bitcoin Yaşam Döngüsü Birikim Eğrisi' : 'Bitcoin Lifecycle Accumulation Curve'}
      </h3>
      <p className="text-sm text-muted-foreground">
        {tr
          ? 'Çan eğrisi, bir ömür boyunca ideal BTC birikim yolunu göstermektedir. Konumunuz grafikte işaretlenmiştir.'
          : 'The bell curve shows the ideal BTC accumulation trajectory across a lifetime. Your position is marked on the chart.'}
      </p>
      <div className="h-[260px] sm:h-[320px] w-full min-h-[240px] sm:min-h-[300px]">
        <PerformantResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="accCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              label={{ value: tr ? 'Yaş' : 'Age', position: 'insideBottom', offset: -5, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              label={{ value: tr ? 'BTC Hedefi' : 'BTC Target', angle: -90, position: 'insideLeft', fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value: number) => [`${value.toFixed(4)} BTC`, tr ? 'Hedef' : 'Target']}
              labelFormatter={(label) => tr ? `Yaş ${label}` : `Age ${label}`}
            />
            <Area type="monotone" dataKey="target" stroke="hsl(var(--primary))" fill="url(#accCurveGrad)" strokeWidth={1.5} />
            <ReferenceLine x={userAge} stroke="hsl(var(--primary))" strokeDasharray="4 4" strokeWidth={1.5} />
            <ReferenceDot x={userAge} y={userHoldings} r={6} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={1.5} />
          </AreaChart>
        </PerformantResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {tr
          ? 'Bitcoin Yaşam Döngüsü Modeline dayanmaktadır — Güç Yasası değer artışı × yaşam döngüsü gelir eğrisi. Tepe birikim yaşı: 40.'
          : 'Based on the Bitcoin Lifecycle Model — Power Law appreciation × lifecycle income curve. Peak accumulation at age 40.'}
      </p>
    </div>
  );
};
