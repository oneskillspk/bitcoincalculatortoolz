import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ChartFrame,
  ChartTooltip,
  axisStyle,
  gridProps,
  defaultMargin,
  seriesColor,
} from '@/components/charts';

const supplySchedule = [
  { year: 2009, supply: 0 },
  { year: 2012, supply: 10500000 },
  { year: 2016, supply: 15750000 },
  { year: 2020, supply: 18375000 },
  { year: 2024, supply: 19687500 },
  { year: 2028, supply: 20343750 },
  { year: 2032, supply: 20671875 },
  { year: 2036, supply: 20835937 },
  { year: 2040, supply: 20917969 },
  { year: 2050, supply: 20976562 },
  { year: 2060, supply: 20994140 },
  { year: 2080, supply: 20999023 },
  { year: 2100, supply: 20999756 },
  { year: 2140, supply: 21000000 },
];

export const SupplyScheduleChart = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {isTr ? 'Bitcoin Arz Programı (2009–2140)' : 'Bitcoin Supply Schedule (2009–2140)'}
        </h3>
        <ChartFrame height={350} ariaLabel="Bitcoin supply schedule">
          <AreaChart data={supplySchedule} margin={defaultMargin}>
            <defs>
              <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={seriesColor('btc')} stopOpacity={0.3} />
                <stop offset="95%" stopColor={seriesColor('btc')} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="year" {...axisStyle} />
            <YAxis
              {...axisStyle}
              tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
              domain={[0, 21000000]}
            />
            <Tooltip
              content={
                <ChartTooltip
                  formatter={(v) => `${Number(v).toLocaleString()} BTC`}
                />
              }
            />
            <ReferenceLine
              y={21000000}
              stroke="hsl(var(--destructive))"
              strokeDasharray="5 5"
              label={{
                value: isTr ? '21M Limit' : '21M Cap',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />
            <ReferenceLine
              x={2026}
              stroke={seriesColor('btc')}
              strokeDasharray="2 4"
              label={{
                value: isTr ? 'Şimdi' : 'Now',
                fill: seriesColor('btc'),
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="supply"
              stroke={seriesColor('btc')}
              fill="url(#supplyGrad)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartFrame>
      </CardContent>
    </Card>
  );
};
