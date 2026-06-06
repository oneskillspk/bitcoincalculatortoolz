import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type StakingResult, formatBTC, formatUSD } from "@/services/stakingCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartLegendStyle } from '@/components/calculator/chartTokens';

interface StakingRewardsChartProps {
  result: StakingResult;
  allResults: StakingResult[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border/30 rounded-xl p-3 shadow-lg text-xs space-y-1.5 min-w-[180px]">
      <p className="font-semibold text-foreground mb-2">Year {label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex justify-between gap-4">
          <span style={{ color: entry.color }} className="font-medium">{entry.name}</span>
          <span className="text-foreground font-semibold">{formatBTC(entry.value)}</span>
        </div>
      ))}
      {payload[0] && (
        <p className="text-muted-foreground pt-1 border-t border-border/20">
          ≈ {formatUSD(payload[0].payload[`${payload[0].dataKey}_usd`])}
        </p>
      )}
    </div>
  );
};

export const StakingRewardsChart = ({ result, allResults }: StakingRewardsChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const maxYears = result.yearlyBreakdown.length;

  const chartData = [
    { year: 0, ...Object.fromEntries(allResults.map(r => [r.protocol.id, r.btcAmount])) },
    ...Array.from({ length: maxYears }, (_, i) => {
      const year = i + 1;
      const entry: Record<string, number> = { year };
      allResults.forEach(r => {
        const row = r.yearlyBreakdown[i];
        if (row) {
          entry[r.protocol.id] = row.btcBalance;
          entry[`${r.protocol.id}_usd`] = row.usdBalance;
        }
      });
      return entry;
    }),
  ];

  const selectedSimpleData = [
    { year: 0, compound: result.btcAmount, simple: result.btcAmount },
    ...Array.from({ length: maxYears }, (_, i) => {
      const year = i + 1;
      const apy = result.protocol.apy;
      const compound = result.btcAmount * Math.pow(1 + apy, year);
      const simple = result.btcAmount + result.btcAmount * apy * year;
      return {
        year,
        compound,
        simple,
        compound_usd: compound * (result.usdFinalValueAtCurrentPrice / result.finalBtcBalance),
        simple_usd: simple * (result.usdFinalValueAtCurrentPrice / result.finalBtcBalance),
      };
    }),
  ];

  return (
    <div className="space-y-6">
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground">
            {isTr
              ? `Bileşik ve Basit — ${result.protocol.name}`
              : `Compound vs Simple — ${result.protocol.name}`}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {isTr
              ? `${maxYears} yıl boyunca BTC bakiye büyümesi`
              : `BTC balance growth over ${maxYears} year${maxYears !== 1 ? 's' : ''}`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedSimpleData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.2)" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={v => `Y${v}`}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={v => `${v.toFixed(3)}`}
                  width={55}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={chartLegendStyle} />
                <Line
                  type="monotone"
                  dataKey="compound"
                  name={isTr ? 'Bileşik' : 'Compound'}
                  stroke={result.protocol.color}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="simple"
                  name={isTr ? 'Basit' : 'Simple'}
                  stroke={result.protocol.color}
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  activeDot={{ r: 4 }}
                  opacity={0.6}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {allResults.length > 1 && (
        <Card className="glass-morphism-card border-border/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              {isTr ? 'Protokol Ödülleri Karşılaştırması' : 'Protocol Rewards Comparison'}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {isTr
                ? 'Tüm staking protokollerinde BTC bakiyesi (bileşik)'
                : 'BTC balance across all staking protocols (compound)'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.2)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={v => `Y${v}`}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={v => `${v.toFixed(3)}`}
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={chartLegendStyle} />
                  {allResults.map(r => (
                    <Line
                      key={r.protocol.id}
                      type="monotone"
                      dataKey={r.protocol.id}
                      name={r.protocol.name}
                      stroke={r.protocol.color}
                      strokeWidth={r.protocol.id === result.protocol.id ? 2.5 : 1.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                      opacity={r.protocol.id === result.protocol.id ? 1 : 0.65}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
