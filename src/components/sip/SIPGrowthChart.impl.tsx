import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SIPGrowthDataPoint } from '@/services/sipCalculatorService';
import { SIPCard } from './SIPCard';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ChartFrame,
  ChartTooltip,
  axisStyle,
  gridProps,
  legendStyle,
  seriesColor,
  defaultMargin,
} from '@/components/charts';

interface SIPGrowthChartProps {
  data: SIPGrowthDataPoint[];
  showRealValue: boolean;
}

export const SIPGrowthChart: React.FC<SIPGrowthChartProps> = ({ data, showRealValue }) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  return (
    <SIPCard>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {isTr ? 'DDA Büyüme Projeksiyonu' : 'SIP Growth Projection'}
      </h3>
      <ChartFrame
        height={350}
        ariaLabel={isTr ? 'SIP büyüme grafiği' : 'SIP growth chart'}
        empty={!data || data.length === 0}
        emptyMessage={isTr ? 'Veri yok' : 'No projection data'}
      >
        <AreaChart data={data} margin={{ ...defaultMargin, left: 0, right: 10 }}>
          <defs>
            <linearGradient id="sipPortfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={seriesColor('btc')} stopOpacity={0.3} />
              <stop offset="95%" stopColor={seriesColor('btc')} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sipInvestedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={seriesColor('fiat')} stopOpacity={0.15} />
              <stop offset="95%" stopColor={seriesColor('fiat')} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisStyle} tickLine={false} axisLine={false} />
          <YAxis
            {...axisStyle}
            tickLine={false}
            axisLine={false}
            width={60}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `$${(v / 1_000_000).toFixed(1)}M`
                : v >= 1_000
                  ? `$${(v / 1_000).toFixed(0)}K`
                  : `$${Number(v).toFixed(0)}`
            }
          />
          <Tooltip content={<ChartTooltip formatter="usd" />} />
          <Legend {...legendStyle} />
          <Area
            type="monotone"
            dataKey="invested"
            name={isTr ? 'Yatırılan Miktar' : 'Amount Invested'}
            stroke={seriesColor('fiat')}
            fill="url(#sipInvestedGradient)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="portfolioValue"
            name={isTr ? 'Portföy Değeri' : 'Portfolio Value'}
            stroke={seriesColor('btc')}
            fill="url(#sipPortfolioGradient)"
            strokeWidth={1.5}
            dot={false}
          />
          {showRealValue && (
            <Area
              type="monotone"
              dataKey="realValue"
              name={
                isTr
                  ? 'Gerçek Değer (Enflasyona Göre Düzeltilmiş)'
                  : 'Real Value (Inflation-Adjusted)'
              }
              stroke={seriesColor('accent')}
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="2 4"
              dot={false}
            />
          )}
        </AreaChart>
      </ChartFrame>
    </SIPCard>
  );
};
