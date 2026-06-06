import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { SupplyGrowthData } from "@/services/inflationComparisonCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface SupplyGrowthChartProps {
  data: SupplyGrowthData[];
  currencySymbol: string;
}

export const SupplyGrowthChart = ({ data, currencySymbol }: SupplyGrowthChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const formatSupply = (value: number) => {
    if (value >= 1_000_000_000_000) {
      return `${currencySymbol}${(value / 1_000_000_000_000).toFixed(1)}T`;
    }
    return `${(value / 1_000_000).toFixed(0)}M BTC`;
  };

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-lg">
            {isTr ? 'Arz Büyümesi Karşılaştırması' : 'Supply Growth Comparison'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(value) => new Date(value).getFullYear().toString()}
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tickFormatter={(value) => `${currencySymbol}${(value / 1_000_000_000_000).toFixed(0)}T`}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number, name: string) => {
                  if (name === (isTr ? 'Bitcoin Arzı' : 'Bitcoin Supply')) {
                    return [`${(value / 1_000_000).toFixed(2)}M BTC`, name];
                  }
                  return [`${currencySymbol}${(value / 1_000_000_000_000).toFixed(2)}T`, name];
                }}
                labelFormatter={(label) => new Date(label).getFullYear()}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="bitcoinSupply"
                name={isTr ? 'Bitcoin Arzı' : 'Bitcoin Supply'}
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                dot={{ fill: 'hsl(var(--primary))', r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="fiatSupply"
                name={isTr ? 'Fiat M2 Arzı' : 'Fiat M2 Supply'}
                stroke="hsl(var(--destructive))"
                strokeWidth={1.5}
                dot={{ fill: 'hsl(var(--destructive))', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-xs text-muted-foreground">
            {isTr
              ? "Bitcoin'in arzı öngörülebilir biçimde büyür ve sabit bir limite yaklaşırken fiat para arzı sınırsız biçimde genişler."
              : "Bitcoin's supply grows predictably and approaches a fixed limit, while fiat money supply expands indefinitely."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
