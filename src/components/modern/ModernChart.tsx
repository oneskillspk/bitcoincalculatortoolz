import React, { useEffect, useState } from 'react';
import { formatGroupedDecimal } from '@/utils/numberFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { BitcoinPrice, SUPPORTED_CURRENCIES, bitcoinApi } from '@/services/bitcoinApi';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle } from '@/components/calculator/chartTokens';

interface ModernChartProps {
  priceData: BitcoinPrice[];
  currency: string;
  investmentAmount: number;
  startDate: string;
}

export const ModernChart = ({ priceData, currency, investmentAmount, startDate }: ModernChartProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currency);
  const [currentLivePrice, setCurrentLivePrice] = useState<number>(0);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const livePrice = await bitcoinApi.getCurrentPrice(currency);
        setCurrentLivePrice(livePrice);
      } catch {
        setCurrentLivePrice(priceData[priceData.length - 1]?.price || 0);
      }
    };
    fetchCurrentPrice();
    const interval = setInterval(fetchCurrentPrice, 30000);
    return () => clearInterval(interval);
  }, [currency, priceData]);

  const chartData = React.useMemo(() => {
    const historicalData = priceData.map(item => ({
      date: item.date,
      price: item.price,
      value: (investmentAmount / priceData[0]?.price) * item.price,
      formattedDate: format(new Date(item.date), 'MMM dd, yyyy'),
      isLive: false
    }));
    if (currentLivePrice > 0) {
      const today = new Date().toISOString().split('T')[0];
      const lastHistoricalDate = historicalData[historicalData.length - 1]?.date;
      if (lastHistoricalDate !== today) {
        historicalData.push({ date: today, price: currentLivePrice, value: (investmentAmount / priceData[0]?.price) * currentLivePrice, formattedDate: format(new Date(), 'MMM dd, yyyy'), isLive: true });
      } else {
        historicalData[historicalData.length - 1] = { ...historicalData[historicalData.length - 1], price: currentLivePrice, value: (investmentAmount / priceData[0]?.price) * currentLivePrice, isLive: true };
      }
    }
    return historicalData;
  }, [priceData, currentLivePrice, investmentAmount]);

  const startPrice = chartData[0]?.price || 0;
  const currentPrice = currentLivePrice || chartData[chartData.length - 1]?.price || 0;
  const isProfit = currentPrice > startPrice;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      const price = dataPoint?.price || payload[0]?.value;
      const portfolioValue = dataPoint?.value;
      const isLive = dataPoint?.isLive;
      return (
        <div style={chartTooltipStyle}>
          <div className="flex items-center gap-2 mb-2">
            <p style={chartTooltipLabelStyle}>{format(new Date(label), 'MMM dd, yyyy')}</p>
            {isLive && (
              <span className="bg-success text-success-foreground px-2 py-0.5 rounded-full text-xs font-medium animate-pulse">
                LIVE
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p style={chartTooltipItemStyle}>
              {isTr ? 'Fiyat' : 'Price'}: <span className="font-mono">
                {selectedCurrency?.symbol}{price != null ? formatGroupedDecimal(price, price < 10 ? 4 : 2) : ''}
              </span>
            </p>
            {portfolioValue && (
              <p style={chartTooltipItemStyle}>
                {isTr ? 'Portföy' : 'Portfolio'}: <span className={`font-mono ${portfolioValue >= investmentAmount ? 'text-success' : 'text-destructive'}`}>
                  {selectedCurrency?.symbol}{formatGroupedDecimal(portfolioValue, 2)}
                </span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const gradientId = isProfit ? "profitGradient" : "lossGradient";
  const strokeColor = isProfit ? "hsl(142 76% 36%)" : "hsl(0 84% 60%)";

  return (
    <Card className="glass-morphism-card border-border/20 shadow-lg backdrop-blur-sm bg-gradient-to-br from-background/80 to-background/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {isTr ? 'Bitcoin Fiyat Geçmişi Grafiği' : 'Bitcoin Price History Chart'}
          {currentLivePrice > 0 && (
            <span className="text-xs bg-success text-success-foreground px-2 sm:px-3 py-1 rounded-full font-medium animate-pulse">
              🔴 LIVE
            </span>
          )}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-chart-3"></span>
            {isTr ? 'Başlangıç' : 'Start'}: <span className="font-mono text-foreground">{selectedCurrency?.symbol}{formatGroupedDecimal(startPrice, 2, 'en-US')}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isProfit ? 'bg-success' : 'bg-destructive'}`}></span>
            {isTr ? 'Güncel' : 'Current'}: <span className="font-mono text-foreground">{selectedCurrency?.symbol}{formatGroupedDecimal(currentPrice, 2, 'en-US')}</span>
          </span>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isProfit
              ? "bg-gradient-to-r from-success/20 to-success/20 text-success border border-success/30"
              : "bg-gradient-to-r from-destructive/20 to-rose-500/20 text-destructive border border-destructive/30"
          }`}>
            {isProfit ? "+" : ""}{(((currentPrice - startPrice) / startPrice) * 100).toFixed(1)}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <PerformantResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}
              role="img"
              aria-label={`Bitcoin price chart showing price movement from ${format(new Date(startDate), 'MMMM yyyy')} to present`}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity={0.6} />
                  <stop offset="25%" stopColor="hsl(142 76% 36%)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="hsl(142 76% 36%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0 84% 60%)" stopOpacity={0.6} />
                  <stop offset="25%" stopColor="hsl(0 84% 60%)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="hsl(0 84% 60%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(0 84% 60%)" stopOpacity={0.03} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--chart-axis))' }}
                tickFormatter={(value) => format(new Date(value), 'MMM yy')} height={40} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--chart-axis))' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${selectedCurrency?.symbol}${(value/1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${selectedCurrency?.symbol}${(value/1000).toFixed(0)}K`;
                  return `${selectedCurrency?.symbol}${Math.round(value)}`;
                }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                dot={(props: any) => {
                  const dotKey = props.key ?? `dot-${props.index ?? `${props.cx}-${props.cy}`}`;
                  if (props.payload?.isLive) {
                    return <circle key={dotKey} cx={props.cx} cy={props.cy} r="6" fill={strokeColor} stroke="white" strokeWidth="3" filter="url(#glow)" className="animate-pulse" />;
                  }
                  return <circle key={dotKey} cx={props.cx} cy={props.cy} r={0} fill="transparent" />;
                }}
                activeDot={{ r: 6, fill: strokeColor, stroke: 'hsl(var(--background))', strokeWidth: 3, filter: 'url(#glow)' }} />
            </AreaChart>
          </PerformantResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-border/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isTr
                ? `${format(new Date(startDate), 'dd MMM yyyy')} tarihinden bugüne Bitcoin fiyat gelişimi`
                : `Bitcoin price evolution from ${format(new Date(startDate), 'MMM dd, yyyy')} to today`}
              {currentLivePrice > 0 && (
                <span className="ml-2 text-xs text-primary">
                  • {isTr ? 'Canlı piyasa verisi' : 'Live market data'}
                </span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
