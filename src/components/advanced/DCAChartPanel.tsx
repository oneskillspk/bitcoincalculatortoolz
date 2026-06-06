import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { TrendingUp, Bitcoin } from 'lucide-react';
import { DCAResult } from '@/services/dcaCalculator';
import { BitcoinPrice, SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';

interface DCAChartPanelProps {
  dcaResult: DCAResult;
  priceData: BitcoinPrice[];
  currency: string;
}

export const DCAChartPanel = ({ dcaResult, priceData, currency: currencyCode }: DCAChartPanelProps) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);

  const portfolioData = dcaResult.purchases.map((purchase) => ({
    date: purchase.date,
    portfolioValue: purchase.currentValue,
    invested: purchase.totalInvested,
    formattedDate: format(new Date(purchase.date), 'MMM dd, yyyy')
  }));

  const btcStackData = dcaResult.purchases.map((purchase) => ({
    date: purchase.date,
    btcAmount: purchase.totalBitcoin,
    formattedDate: format(new Date(purchase.date), 'MMM dd, yyyy'),
    purchaseAmount: purchase.bitcoinAmount
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={chartTooltipStyle}>
          <p style={chartTooltipLabelStyle}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ ...chartTooltipItemStyle, color: entry.color }}>
              {`${entry.name}: ${
                entry.dataKey.includes('btc') || entry.dataKey.includes('Btc') || entry.dataKey.includes('BTC')
                  ? `${entry.value.toFixed(6)} BTC`
                  : formatCurrency(entry.value, currency)
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {isTr ? 'DCA Performans Grafikleri' : 'DCA Performance Charts'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {isTr ? 'Portföy Değeri' : 'Portfolio Value'}
            </TabsTrigger>
            <TabsTrigger value="btc-stack" className="flex items-center gap-2">
              <Bitcoin className="w-4 h-4" />
              {isTr ? 'BTC Yığını' : 'BTC Stack'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <div className="h-[260px] sm:h-80 min-h-[240px] sm:min-h-[300px]">
              <PerformantResponsiveContainer width="100%" height="100%" minHeight={300}>
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--chart-grid))" strokeOpacity={0.6} vertical={false} />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 11, fill: 'hsl(var(--chart-axis))' }}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--chart-grid))', strokeOpacity: 0.6 }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--chart-axis))' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCurrency(value, currency, false)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="portfolioValue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 5, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
                    name={isTr ? 'Portföy Değeri' : 'Portfolio Value'}
                  />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1.25}
                    strokeDasharray="5 5"
                    dot={false}
                    name={isTr ? 'Toplam Yatırım' : 'Total Invested'}
                  />
                </LineChart>
              </PerformantResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {isTr
                ? 'Düz çizgi portföyünüzün güncel değerini, kesikli çizgi ise toplam yatırımınızı göstermektedir.'
                : "The solid line shows your portfolio's current value, while the dashed line shows your total investment."}
            </div>
          </TabsContent>

          <TabsContent value="btc-stack" className="mt-6">
            <div className="h-[260px] sm:h-80 min-h-[240px] sm:min-h-[300px]">
              <PerformantResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={btcStackData}>
                  <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--chart-grid))" strokeOpacity={0.6} vertical={false} />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 11, fill: 'hsl(var(--chart-axis))' }}
                    tickLine={false}
                    axisLine={{ stroke: 'hsl(var(--chart-grid))', strokeOpacity: 0.6 }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--chart-axis))' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value.toFixed(4)} BTC`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="btcAmount"
                    fill="hsl(var(--primary))"
                    radius={[2, 2, 0, 0]}
                    name={isTr ? 'Toplam BTC' : 'Total BTC'}
                  />
                </BarChart>
              </PerformantResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {isTr
                ? 'Her çubuk, her DCA alımından sonra birikmiş toplam Bitcoin miktarınızı göstermektedir.'
                : 'Each bar shows your total Bitcoin accumulation after each DCA purchase.'}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
