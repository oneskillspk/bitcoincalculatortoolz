import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ObituariesResult } from "@/services/bitcoinObituariesService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle, chartLegendStyle } from '@/components/calculator/chartTokens';

interface ObituariesChartProps {
  result: ObituariesResult;
}

const COLORS = {
  media: 'hsl(var(--chart-2))',
  expert: 'hsl(var(--chart-3))',
  institution: 'hsl(var(--primary))',
  government: 'hsl(var(--destructive))'
};

export const ObituariesChart = ({ result }: ObituariesChartProps) => {
  // Prepare category data for pie chart
  const categoryData = Object.entries(
    result.filteredObituaries.reduce((acc, obit) => {
      acc[obit.sourceType] = (acc[obit.sourceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: COLORS[name as keyof typeof COLORS] || 'hsl(var(--muted-foreground))'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={chartTooltipStyle}>
          <p style={chartTooltipLabelStyle}>{payload[0].payload.year}</p>
          <p style={chartTooltipItemStyle}>
            Obituaries: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={chartTooltipStyle}>
          <p style={chartTooltipLabelStyle}>{payload[0].name}</p>
          <p style={chartTooltipItemStyle}>
            Count: {payload[0].value} ({((payload[0].value / result.totalCount) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-16 md:py-20" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-border/50 bg-card shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Obituaries Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.yearlyBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
