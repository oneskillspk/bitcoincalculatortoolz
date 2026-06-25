import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { getScatterDataForAsset } from '@/services/correlationService';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface CorrelationScatterPlotProps {
  btcReturns: number[];
  assetReturns: Record<string, number[]>;
  loading?: boolean;
}

const ASSET_OPTIONS = ['S&P 500', 'Gold', 'Nasdaq', 'US Dollar (DXY)'];

export const CorrelationScatterPlot: React.FC<CorrelationScatterPlotProps> = ({ btcReturns, assetReturns, loading }) => {
  const [selectedAsset, setSelectedAsset] = useState('S&P 500');
  const { language } = useLanguage();
  const isTr = language === 'tr';

  if (loading) {
    return (
      <Card className="glass-morphism-card border-border/20">
        <CardHeader>
          <CardTitle className="text-foreground">
            {isTr ? 'Getiri Dağılım Grafiği' : 'Return Scatter Plot'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const scatterData = getScatterDataForAsset(btcReturns, assetReturns[selectedAsset] ?? []);
  const sampled = scatterData.length > 300
    ? scatterData.filter((_, i) => i % Math.ceil(scatterData.length / 300) === 0)
    : scatterData;

  const assetLabel = selectedAsset === 'US Dollar (DXY)' ? 'DXY' : selectedAsset;

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-foreground">
              {isTr ? 'Getiri Dağılım Grafiği' : 'Return Scatter Plot'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isTr
                ? `Günlük getiriler: Bitcoin ile ${assetLabel}`
                : `Daily returns: Bitcoin vs ${selectedAsset}`}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {ASSET_OPTIONS.map(asset => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedAsset === asset
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {asset === 'US Dollar (DXY)' ? 'DXY' : asset}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 350, minHeight: 300 }}>
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={300}>
            <ScatterChart margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.3)" />
              <XAxis
                type="number" inputMode="decimal"
                dataKey="assetReturn"
                name={selectedAsset}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                label={{
                  value: `${assetLabel} ${isTr ? 'Getiri (%)' : 'Return (%)'}`,
                  position: 'insideBottom',
                  offset: -5,
                  fontSize: 11,
                  fill: 'hsl(var(--muted-foreground))'
                }}
              />
              <YAxis
                type="number" inputMode="decimal"
                dataKey="btcReturn"
                name="Bitcoin"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v: number) => `${v.toFixed(1)}%`}
                label={{
                  value: `BTC ${isTr ? 'Getiri (%)' : 'Return (%)'}`,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 20,
                  fontSize: 11,
                  fill: 'hsl(var(--muted-foreground))'
                }}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number, name: string) => [`${value.toFixed(3)}%`, name]}
              />
              <ReferenceLine x={0} stroke="hsl(var(--muted-foreground) / 0.3)" />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground) / 0.3)" />
              <Scatter data={sampled} fill="hsl(var(--primary))" fillOpacity={0.5} r={3} />
            </ScatterChart>
          </PerformantResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
