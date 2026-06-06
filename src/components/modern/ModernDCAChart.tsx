import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, ComposedChart, Bar } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DCAResult } from '@/services/dcaCalculator';
import { BitcoinPrice } from '@/services/bitcoinApi';
import { format } from 'date-fns';
import { TrendingUp, BarChart3, Target, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocale } from '@/hooks/useLocale';
import { chartLegendStyle } from '@/components/calculator/chartTokens';
import { formatCurrencyAmount, formatCurrencyCompact } from '@/utils/formatCurrency';

interface ModernDCAChartProps {
  dcaResult: DCAResult;
  priceData: BitcoinPrice[];
  currency: string;
}

export const ModernDCAChart: React.FC<ModernDCAChartProps> = ({ dcaResult, priceData, currency }) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const { intlLocale } = useLocale();
  const locale = isTr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
  const fmt = (v: number) => formatCurrencyAmount(v, currency, { locale });
  const fmtSigned = (v: number) => formatCurrencyAmount(v, currency, { locale, signed: true });
  const fmtAxis = (v: number) => formatCurrencyCompact(v, currency, locale);

  const chartData = React.useMemo(() => {
    const data: Array<{
      date: string; btcPrice: number; investment?: number;
      totalInvested: number; totalValue: number; btcHoldings: number;
      profitLoss: number; isPurchase: boolean;
    }> = [];
    const purchaseMap = new Map(dcaResult.purchases.map(p => [p.date, p]));
    priceData.forEach((pricePoint) => {
      const purchase = purchaseMap.get(pricePoint.date);
      const isPurchase = !!purchase;
      const lastPurchase = dcaResult.purchases
        .filter(p => new Date(p.date) <= new Date(pricePoint.date))
        .pop();
      if (lastPurchase) {
        const currentValue = lastPurchase.totalBitcoin * pricePoint.price;
        data.push({
          date: pricePoint.date, btcPrice: pricePoint.price,
          investment: isPurchase ? purchase!.amount : undefined,
          totalInvested: lastPurchase.totalInvested, totalValue: currentValue,
          btcHoldings: lastPurchase.totalBitcoin,
          profitLoss: currentValue - lastPurchase.totalInvested, isPurchase
        });
      }
    });
    return data;
  }, [dcaResult, priceData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{format(new Date(label), 'MMM dd, yyyy')}</p>
          <div className="space-y-1 text-sm">
            <p className="text-orange-500">
              {isTr ? 'Bitcoin Fiyatı' : 'Bitcoin Price'}: {fmt(data.btcPrice)}
            </p>
            <p className="text-blue-500">
              {isTr ? 'Toplam Yatırım' : 'Total Invested'}: {fmt(data.totalInvested)}
            </p>
            <p className="text-success">
              {isTr ? 'Portföy Değeri' : 'Portfolio Value'}: {fmt(data.totalValue)}
            </p>
            <p className="text-purple-500">
              {isTr ? 'Bitcoin Varlığı' : 'Bitcoin Holdings'}: {data.btcHoldings.toFixed(8)} BTC
            </p>
            <p className={`font-medium ${data.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              K/Z: {fmtSigned(data.profitLoss)}
            </p>
            {data.isPurchase && (
              <Badge variant="secondary" className="mt-2">
                {isTr ? 'Alım' : 'Purchase'}: {fmt(data.investment ?? 0)}
              </Badge>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {isTr ? 'DCA Performans Analizi' : 'DCA Performance Analysis'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {dcaResult.purchases.length} {isTr ? 'Alım' : 'Purchases'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isTr ? 'Performans' : 'Performance'}
            </TabsTrigger>
            <TabsTrigger value="accumulation" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {isTr ? 'Birikim' : 'Accumulation'}
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {isTr ? 'Alımlar' : 'Purchases'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="h-80">
              <PerformantResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--chart-grid))" strokeOpacity={0.6} vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false}
                    tickFormatter={(value) => format(new Date(value), 'MMM yy')} />
                  <YAxis stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(value) => fmtAxis(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="totalInvested" stackId="1"
                    stroke="hsl(var(--primary))" strokeWidth={1.5} fill="hsl(var(--primary)/0.16)"
                    name={isTr ? 'Toplam Yatırım' : 'Total Invested'} />
                  <Area type="monotone" dataKey="totalValue" stackId="2"
                    stroke="hsl(var(--chart-2))" strokeWidth={1.5} fill="hsl(var(--chart-2)/0.16)"
                    name={isTr ? 'Portföy Değeri' : 'Portfolio Value'} />
                </ComposedChart>
              </PerformantResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="accumulation" className="space-y-4">
            <div className="h-80">
              <PerformantResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--chart-grid))" strokeOpacity={0.6} vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false}
                    tickFormatter={(value) => format(new Date(value), 'MMM yy')} />
                  <YAxis yAxisId="btc" orientation="left" stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(value) => `${value.toFixed(2)} BTC`} />
                  <YAxis yAxisId="price" orientation="right" stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(value) => fmtAxis(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area yAxisId="btc" type="monotone" dataKey="btcHoldings"
                    stroke="hsl(var(--chart-3))" strokeWidth={1.5} fill="hsl(var(--chart-3)/0.16)"
                    name={isTr ? 'BTC Varlığı' : 'BTC Holdings'} />
                  <Line yAxisId="price" type="monotone" dataKey="btcPrice"
                    stroke="hsl(var(--chart-4))" strokeWidth={1.5} dot={false}
                    name={isTr ? 'BTC Fiyatı' : 'BTC Price'} />
                </ComposedChart>
              </PerformantResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            <div className="h-80">
              <PerformantResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--chart-grid))" strokeOpacity={0.6} vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false}
                    tickFormatter={(value) => format(new Date(value), 'MMM yy')} />
                  <YAxis yAxisId="price" orientation="left" stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(value) => fmtAxis(value)} />
                  <YAxis yAxisId="investment" orientation="right" stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={(value) => fmt(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="price" type="monotone" dataKey="btcPrice"
                    stroke="hsl(var(--chart-1))" strokeWidth={1.5} dot={false}
                    name={isTr ? 'Bitcoin Fiyatı' : 'Bitcoin Price'} />
                  <Bar yAxisId="investment" dataKey="investment" fill="hsl(var(--primary)/0.6)"
                    name={isTr ? 'DCA Alımları' : 'DCA Purchases'} />
                </ComposedChart>
              </PerformantResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
