import { Card, CardContent } from "@/components/ui/card";
import { PerformantResponsiveContainer } from "@/components/optimized/PerformantResponsiveContainer";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { historicalDominance } from "@/services/dominanceService";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  axisStyle,
  chartStrokeWidth,
  defaultAnimation,
  defaultMargin,
  gridProps,
  seriesColor,
  tooltipStyle,
} from "@/components/charts/theme";

export const DominanceHistoryChart = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const ember = seriesColor('btc');

  return (
    <Card className="border-[hsl(var(--hairline))] bg-card shadow-[var(--shadow-card)]">
      <CardContent className="p-6">
        <h3 className="font-display text-lg font-semibold text-foreground tracking-[-0.015em] mb-4">
          {isTr ? 'Tarihsel BTC Dominansı (2020–2026)' : 'Historical BTC Dominance (2020–2026)'}
        </h3>
        <PerformantResponsiveContainer height={300}>
          <AreaChart data={historicalDominance} margin={defaultMargin}>
            <defs>
              <linearGradient id="domGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ember} stopOpacity={0.22} />
                <stop offset="95%" stopColor={ember} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="date" {...axisStyle} />
            <YAxis
              {...axisStyle}
              domain={[30, 75]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(v: number) => [`${v.toFixed(1)}%`, isTr ? 'BTC Dominansı' : 'BTC Dominance']}
            />
            <Area
              type="monotone"
              dataKey="dominance"
              stroke={ember}
              fill="url(#domGrad)"
              strokeWidth={chartStrokeWidth}
              {...defaultAnimation}
            />
          </AreaChart>
        </PerformantResponsiveContainer>
      </CardContent>
    </Card>
  );
};
