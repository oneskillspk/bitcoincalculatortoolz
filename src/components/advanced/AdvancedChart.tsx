import React, { useState, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Area, AreaChart, ReferenceLine, Brush, ScatterChart, Scatter
} from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { Download, TrendingUp, Activity, Maximize2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { BitcoinPrice, SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';

interface AdvancedChartProps {
  priceData: BitcoinPrice[];
  currency: string;
  investmentAmount: number;
  startDate: string;
}

type ChartType = 'line' | 'area' | 'scatter';
type ScaleType = 'linear' | 'log';
type ViewType = 'price' | 'value' | 'percentage';

export const AdvancedChart = ({ priceData, currency, investmentAmount, startDate }: AdvancedChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<ChartType>('area');
  const [scaleType, setScaleType] = useState<ScaleType>('linear');
  const [viewType, setViewType] = useState<ViewType>('value');
  const [showEvents, setShowEvents] = useState(true);
  
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);

  const chartData = useMemo(() => {
    if (!priceData || priceData.length === 0) return [];
    const startPrice = priceData[0]?.price || 1;
    const btcAmount = investmentAmount / startPrice;
    return priceData.map((item) => {
      const currentValue = btcAmount * item.price;
      const percentageGain = ((item.price - startPrice) / startPrice) * 100;
      return {
        date: item.date,
        price: item.price,
        value: currentValue,
        percentageGain,
        originalInvestment: investmentAmount,
        formattedDate: format(new Date(item.date), 'MMM dd'),
        fullDate: format(new Date(item.date), 'MMM dd, yyyy'),
      };
    });
  }, [priceData, investmentAmount]);

  const handleExport = async () => {
    if (!chartRef.current) return;
    try {
      await new Promise(resolve => requestAnimationFrame(resolve));
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff', scale: 2, logging: false,
        useCORS: true, allowTaint: true, foreignObjectRendering: true
      });
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-chart', tr: 'bitcoin-grafik' }, 'png', language);
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };

  const formatCurrency = (value: number) =>
    `${currencyInfo?.symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const getDataKey = () => {
    switch (viewType) {
      case 'price': return 'price';
      case 'value': return 'value';
      case 'percentage': return 'percentageGain';
      default: return 'value';
    }
  };

  if (!chartData.length) {
    return (
      <Card className="glass-morphism-card">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-foreground/60">
            {isTr ? 'Grafik verisi mevcut değil' : 'No chart data available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism-card" ref={chartRef}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {isTr ? 'Gelişmiş Bitcoin Analizi' : 'Advanced Bitcoin Analysis'}
          </CardTitle>
          <p className="text-sm text-foreground/60">
            {isTr ? 'Teknik göstergelerle etkileşimli grafikler' : 'Interactive charts with technical indicators'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}
          className="border-border/50 hover:border-primary/30">
          <Download className="w-4 h-4 mr-1" />
          {isTr ? 'PNG İndir' : 'Export PNG'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2">
            <Label className="text-sm">{isTr ? 'Görünüm:' : 'View:'}</Label>
            <Select value={viewType} onValueChange={(v) => setViewType(v as ViewType)}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">{isTr ? 'Yatırım Değeri' : 'Investment Value'}</SelectItem>
                <SelectItem value="price">{isTr ? 'Bitcoin Fiyatı' : 'Bitcoin Price'}</SelectItem>
                <SelectItem value="percentage">{isTr ? '% Kazanç/Kayıp' : '% Gain/Loss'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-events" checked={showEvents} onCheckedChange={setShowEvents} />
            <Label htmlFor="show-events" className="text-sm">
              {isTr ? 'Piyasa Olayları' : 'Market Events'}
            </Label>
          </div>
        </div>
        <div className="h-[280px] sm:h-96 w-full min-h-[260px] sm:min-h-[360px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={360}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--chart-grid))" strokeOpacity={0.6} vertical={false} />
              <XAxis dataKey="formattedDate" stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false} axisLine={{ stroke: 'hsl(var(--chart-grid))', strokeOpacity: 0.6 }} />
              <YAxis stroke="hsl(var(--chart-axis))" fontSize={11} tickLine={false} axisLine={false}
                tickFormatter={(value) => {
                  if (viewType === 'percentage') return `${value.toFixed(0)}%`;
                  return `${currencyInfo?.symbol}${(value / 1000).toFixed(0)}K`;
                }} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} />
              {viewType === 'value' && (
                <ReferenceLine y={investmentAmount} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" opacity={0.5} />
              )}
              <Area type="monotone" dataKey={getDataKey()} stroke="hsl(var(--primary))" strokeWidth={1.5}
                fill="url(#valueGradient)"
                activeDot={{ r: 5, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }} />
              <Brush dataKey="formattedDate" height={28} stroke="hsl(var(--chart-axis))" fill="hsl(var(--muted))" />
            </AreaChart>
          </PerformantResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
