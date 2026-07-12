import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { formatGroupedInt } from '@/utils/numberFormat';
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { DISTRIBUTION_TIERS, PercentileResult, TOTAL_ADDRESSES_WITH_BALANCE } from '@/services/wealthPercentileService';
import { cn } from '@/lib/utils';
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';

interface WealthDistributionChartProps {
  result: PercentileResult;
}

export const WealthDistributionChart: React.FC<WealthDistributionChartProps> = ({ result }) => {
  const chartData = useMemo(() => {
    return DISTRIBUTION_TIERS.map((tier) => ({
      name: tier.tierName,
      emoji: tier.tierEmoji,
      addresses: tier.addresses,
      percentage: (tier.addresses / TOTAL_ADDRESSES_WITH_BALANCE) * 100,
      btcRange: `${tier.minBtc}–${tier.maxBtc >= 21_000_000 ? '∞' : tier.minBtc >= 1000 ? formatGroupedInt(tier.maxBtc, getCurrentIntlLocale()) : tier.maxBtc}`,
      color: tier.color,
      isUserTier: tier.tierName === result.tier.tierName,
    }));
  }, [result.tier.tierName]);

  // Log-scale the addresses for better visualization (the distribution is extremely skewed)
  const logData = useMemo(() => {
    return chartData.map((d) => ({
      ...d,
      logAddresses: Math.log10(Math.max(d.addresses, 1)),
    }));
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const data = payload[0].payload;
    return (
      <div style={chartTooltipStyle}>
        <p style={chartTooltipLabelStyle}>
          {data.emoji} {data.name}
        </p>
        <p style={chartTooltipItemStyle}>
          Range: {data.btcRange} BTC
        </p>
        <p style={chartTooltipItemStyle}>
          Addresses: {formatGroupedInt(data.addresses, getCurrentIntlLocale())}
        </p>
        <p style={chartTooltipItemStyle}>
          {data.percentage.toFixed(2)}% of all addresses
        </p>
        {data.isUserTier && (
          <p className="text-primary font-medium text-xs mt-1">← You are here</p>
        )}
      </div>
    );
  };

  return (
    <Card className="border-border/30 bg-card">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-semibold text-foreground text-base">Bitcoin Address Distribution</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Addresses by balance tier (logarithmic scale)
            </p>
          </div>
          <Badge variant="outline" className="text-xs" style={{ borderColor: result.tier.color, color: result.tier.color }}>
            {result.tier.tierEmoji} You: {result.tier.tierName}
          </Badge>
        </div>

        <div className="w-full h-[280px] sm:h-[320px] min-h-[280px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={280}>
            <BarChart
              data={logData}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={50}
              />
              <YAxis
                dataKey="logAddresses"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v: number) => {
                  const actual = Math.pow(10, v);
                  if (actual >= 1_000_000) return `${(actual / 1_000_000).toFixed(0)}M`;
                  if (actual >= 1_000) return `${(actual / 1_000).toFixed(0)}K`;
                  return `${actual.toFixed(0)}`;
                }}
                label={{ value: 'Addresses', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
              <Bar dataKey="logAddresses" radius={[4, 4, 0, 0]} maxBarSize={50}>
                {logData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    fillOpacity={entry.isUserTier ? 1 : 0.6}
                    stroke={entry.isUserTier ? entry.color : 'none'}
                    strokeWidth={entry.isUserTier ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </PerformantResponsiveContainer>
        </div>

        {/* Tier legend */}
        <div className="flex flex-wrap gap-2 justify-center">
          {DISTRIBUTION_TIERS.map((tier) => (
            <div
              key={tier.tierName}
              className={cn(
                'flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border border-border/20 transition-all',
                tier.tierName === result.tier.tierName
                  ? 'bg-primary/10 border-primary/40 font-semibold'
                  : 'bg-muted/20'
              )}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: tier.color }}
              />
              <span className="text-muted-foreground">{tier.tierEmoji} {tier.tierName}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
