import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RetirementProjection } from "@/pages/BitcoinRetirementCalculator";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { BarChart3, Bitcoin, TrendingUp, Wallet } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RetirementChartProps {
  projections: RetirementProjection[];
}


const chartConfig = {
  fiatValue: {
    label: "Portfolio Value",
    color: "hsl(var(--primary))"
  },
  annualBudget: {
    label: "Annual Budget", 
    color: "hsl(var(--secondary))"
  },
  btcHoldings: {
    label: "Bitcoin Holdings",
    color: "hsl(var(--accent))"
  }
};

export const RetirementChart = ({ projections }: RetirementChartProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  if (!projections || projections.length === 0) {
    return (
      <Card className="calc-surface-card border-0">
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{tr?'Projeksiyonları görmek için emeklilik parametrelerinizi ayarlayın':'Configure your retirement parameters to see projections'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for charts
  const chartData = projections.map(projection => ({
    ...projection,
    year: projection.year.toString(),
    fiatValueM: Math.round(projection.fiatValue / 1000000 * 100) / 100, // Millions
    annualBudgetK: Math.round(projection.annualBudget / 1000 * 100) / 100, // Thousands
    btcHoldingsFormatted: Math.round(projection.btcHoldings * 100) / 100
  }));

  const maxValue = Math.max(...projections.map(p => p.fiatValue));
  const formatCurrency = (value: number) => {
    if (value >= 1) return `$${value.toFixed(0)}M`;
    if (value >= 0.1) return `$${value.toFixed(1)}M`;
    return `$${Math.round(value * 1000)}K`;
  };
  const formatBudget = (value: number) => `$${Math.round(value)}K`;
  const tooltipLabels = {
    fiatValueM: tr?'Portföy Değeri':'Portfolio Value',
    annualBudgetK: tr?'Yıllık Bütçe':'Annual Budget',
    btcHoldingsFormatted: tr?'Bitcoin Varlıkları':'Bitcoin Holdings'
  };

  const SectionHeader = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <CardTitle className="text-base sm:text-lg font-semibold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  );

  const axisTick = { fill: 'hsl(var(--muted-foreground))', fontSize: 11 };

  return (
    <div className="space-y-4">
      {/* Portfolio Value Over Time */}
      <Card className="calc-surface-card border-0">
        <SectionHeader
          icon={TrendingUp}
          title={tr?'Portföy Değeri Projeksiyonu':'Portfolio Value Projection'}
          description={tr?'Emeklilik fonunuzun zamanla nasıl geliştiği':'How your retirement fund evolves over time'}
        />
        <CardContent className="pt-0">
          <ChartContainer config={chartConfig} className="h-60 sm:h-72 w-full">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.04}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.4)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                width={56}
              />
              <ChartTooltip
                content={<ChartTooltipContent
                  formatter={(value, name) => [
                    name === 'fiatValueM' ? formatCurrency(Number(value)) : value,
                    tooltipLabels[name as keyof typeof tooltipLabels] || name
                  ]}
                />}
              />
              <Area
                type="monotone"
                dataKey="fiatValueM"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill="url(#portfolioGradient)"
                name={tr?'Portföy Değeri':'Portfolio Value'}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bitcoin Holdings and Annual Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="calc-surface-card border-0">
          <SectionHeader
            icon={Bitcoin}
            title={tr?'Bitcoin Varlıkları':'Bitcoin Holdings'}
            description={tr?'Emeklilik yıllarındaki BTC bakiyeniz':'Your BTC balance over retirement years'}
          />
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-56 sm:h-60 w-full">
              <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.4)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₿${value}`}
                  width={48}
                />
                <ChartTooltip
                  content={<ChartTooltipContent
                    formatter={(value) => [`₿${Number(value).toFixed(2)}`, tr?'Bitcoin Varlıkları':'Bitcoin Holdings']}
                  />}
                />
                <Line
                  type="monotone"
                  dataKey="btcHoldingsFormatted"
                  stroke="hsl(var(--accent))"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="calc-surface-card border-0">
          <SectionHeader
            icon={Wallet}
            title={tr?'Yıllık Bütçe':'Annual Budget'}
            description={tr?'Yıllık harcama gücünüz (enflasyona göre ayarlanmış)':'Your yearly spending power (inflation-adjusted)'}
          />
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-56 sm:h-60 w-full">
              <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border) / 0.4)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  tick={axisTick}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatBudget}
                  width={48}
                />
                <ChartTooltip
                  content={<ChartTooltipContent
                    formatter={(value) => [formatBudget(Number(value)), tr?'Yıllık Bütçe':'Annual Budget']}
                  />}
                />
                <Bar
                  dataKey="annualBudgetK"
                  fill="hsl(var(--secondary))"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};