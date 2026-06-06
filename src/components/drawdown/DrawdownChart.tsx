import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { DrawdownPeriod } from '@/services/drawdownService';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ChartFrame,
  ChartTooltip,
  axisStyle,
  defaultMargin,
  seriesColor,
} from '@/components/charts';

interface Props {
  periods: DrawdownPeriod[];
}

export const DrawdownChart = ({ periods }: Props) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const data = [...periods]
    .sort((a, b) => new Date(a.peakDate).getTime() - new Date(b.peakDate).getTime())
    .map((p) => ({
      label: new Date(p.peakDate + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      drawdown: -p.drawdownPercent,
      recovery: p.recoveryDays || 0,
    }));

  // Colour by severity using semantic tokens.
  const severityColor = (v: number) =>
    v < -70 ? seriesColor('loss') : v < -50 ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-2))';

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {isTr ? 'Düşüş Derinliği Grafiği' : 'Drawdown Depth Chart'}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {isTr
            ? 'Şiddete göre tarihsel %20+ Bitcoin düşüşleri'
            : 'Historical 20%+ Bitcoin drawdowns by severity'}
        </p>
        <ChartFrame
          height={300}
          ariaLabel={isTr ? 'Düşüş grafiği' : 'Drawdown chart'}
          empty={data.length === 0}
        >
          <BarChart data={data} margin={{ ...defaultMargin, left: 10, right: 10 }}>
            <XAxis dataKey="label" {...axisStyle} axisLine={false} tickLine={false} />
            <YAxis
              {...axisStyle}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={['dataMin - 5', 0]}
            />
            <Tooltip
              content={
                <ChartTooltip
                  formatter={(v) => `${Number(v).toFixed(1)}%`}
                />
              }
            />
            <Bar dataKey="drawdown" name={isTr ? 'Düşüş' : 'Drawdown'} radius={[4, 4, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={severityColor(entry.drawdown)} />
              ))}
            </Bar>
          </BarChart>
        </ChartFrame>
      </CardContent>
    </Card>
  );
};
