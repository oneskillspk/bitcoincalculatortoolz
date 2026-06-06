import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { Download, TrendingUp } from 'lucide-react';
import html2canvas from 'html2canvas';
import { BitcoinPrice, SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';

interface InvestmentChartProps {
  priceData: BitcoinPrice[];
  currency: string;
  investmentAmount: number;
  startDate: string;
}

export const InvestmentChart = ({ priceData, currency, investmentAmount, startDate }: InvestmentChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const chartRef = useRef<HTMLDivElement>(null);
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);

  const chartData = priceData.map((item) => {
    const startPrice = priceData[0]?.price || item.price;
    const btcAmount = investmentAmount / startPrice;
    const currentValue = btcAmount * item.price;
    return {
      date: item.date, price: item.price, value: currentValue,
      formattedDate: format(new Date(item.date), 'MMM dd'),
      originalInvestment: investmentAmount
    };
  });

  const exportChart = async () => {
    if (!chartRef.current) return;
    try {
      await new Promise(resolve => requestAnimationFrame(resolve));
      const bodyBg = getComputedStyle(document.body).backgroundColor || '#f5f3ee';
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: bodyBg, scale: 2, logging: false,
        useCORS: true, allowTaint: true, foreignObjectRendering: true
      });
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-investment-chart', tr: 'bitcoin-yatirim-grafigi' }, 'png', language);
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };

  const formatCurrencyVal = (value: number) =>
    `${currencyInfo?.symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const profit = data.value - data.originalInvestment;
      const roi = ((profit / data.originalInvestment) * 100);
      return (
        <div style={chartTooltipStyle}>
          <p style={chartTooltipLabelStyle}>{format(new Date(data.date), 'MMM dd, yyyy')}</p>
          <div className="space-y-1">
            <p style={chartTooltipItemStyle}>
              {isTr ? 'Yatırım Değeri' : 'Investment Value'}: <span className="font-mono">{formatCurrencyVal(data.value)}</span>
            </p>
            <p style={chartTooltipItemStyle}>
              {isTr ? 'Bitcoin Fiyatı' : 'Bitcoin Price'}: <span className="font-mono">{formatCurrencyVal(data.price)}</span>
            </p>
            <p className={profit >= 0 ? 'text-success font-semibold' : 'text-destructive font-semibold'} style={{ fontSize: 12 }}>
              K/Z: <span className="font-mono">{profit >= 0 ? '+' : ''}{formatCurrencyVal(profit)}</span>
            </p>
            <p className={roi >= 0 ? 'text-success font-semibold' : 'text-destructive font-semibold'} style={{ fontSize: 12 }}>
              ROI: <span className="font-mono">{roi >= 0 ? '+' : ''}{roi.toFixed(2)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!priceData || priceData.length === 0) {
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

  const finalValue = chartData[chartData.length - 1]?.value || 0;
  const totalReturn = finalValue - investmentAmount;
  const isPositive = totalReturn >= 0;

  return (
    <Card className="glass-morphism-card" ref={chartRef}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {isTr ? 'Yatırım Performansı' : 'Investment Performance'}
          </CardTitle>
          <p className="text-sm text-foreground/60">
            {isTr
              ? `${format(new Date(startDate), 'dd MMM yyyy')} tarihinden Bugüne`
              : `From ${format(new Date(startDate), 'MMM dd, yyyy')} to Today`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportChart}
          className="flex items-center gap-2 border-border/50 hover:border-primary/30">
          <Download className="w-4 h-4" />
          {isTr ? 'PNG İndir' : 'Export PNG'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 calc-surface-card">
          {[
            { label: isTr ? 'Başlangıç' : 'Initial', value: formatCurrencyVal(investmentAmount), cls: 'text-foreground' },
            { label: isTr ? 'Güncel' : 'Current', value: formatCurrencyVal(finalValue), cls: 'text-foreground' },
            { label: isTr ? 'Kâr/Zarar' : 'Profit/Loss', value: `${isPositive ? '+' : ''}${formatCurrencyVal(totalReturn)}`, cls: isPositive ? 'text-success' : 'text-destructive' },
            { label: 'ROI', value: `${isPositive ? '+' : ''}${((totalReturn / investmentAmount) * 100).toFixed(1)}%`, cls: isPositive ? 'text-success' : 'text-destructive' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-xs text-foreground/60 mb-1">{item.label}</p>
              <p className={`text-sm font-bold font-mono ${item.cls}`}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="h-[260px] sm:h-80 w-full min-h-[240px] sm:min-h-[320px]">
          <PerformantResponsiveContainer width="100%" height="100%" minHeight={320}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="formattedDate" stroke="hsl(var(--foreground))" fontSize={12} opacity={0.7} interval="preserveStartEnd" />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} opacity={0.7}
                tickFormatter={(value) => `${currencyInfo?.symbol}${(value / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="originalInvestment" stroke="hsl(var(--foreground))"
                strokeWidth={1} strokeDasharray="5 5" opacity={0.5} dot={false} activeDot={false} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={1.5}
                fill="url(#valueGradient)"
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }} />
            </AreaChart>
          </PerformantResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-foreground/70">{isTr ? 'Yatırım Değeri' : 'Investment Value'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-foreground/50 border-dashed"></div>
            <span className="text-foreground/70">{isTr ? 'Başlangıç Yatırımı' : 'Initial Investment'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
