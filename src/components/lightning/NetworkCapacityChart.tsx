import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, TrendingUp, Calendar } from "lucide-react";
import { HistoricalNetworkData } from "@/services/lightningFeeCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle, chartSeries } from '@/components/calculator/chartTokens';

interface NetworkCapacityChartProps {
  data: HistoricalNetworkData[];
  isLoading: boolean;
}

export const NetworkCapacityChart = ({ data, isLoading }: NetworkCapacityChartProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [activeMetric, setActiveMetric] = useState<'capacity' | 'channels' | 'nodes'>('capacity');

  const metricLabels = {
    capacity: isTr ? 'Kapasite' : 'Capacity',
    channels: isTr ? 'Kanallar' : 'Channels',
    nodes: isTr ? 'Düğümler' : 'Nodes',
  };

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const sampleRate = isMobile ? 7 : 3;
    return data.filter((_, index) => index % sampleRate === 0).map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: isMobile ? undefined : 'numeric' }),
      fullDate: item.date,
      capacity: item.totalCapacityBtc,
      channels: item.channelCount / 1000,
      nodes: item.nodeCount / 1000,
    }));
  }, [data, isMobile]);

  const growthMetrics = useMemo(() => {
    if (!data || data.length < 2) return null;
    const first = data[0], last = data[data.length - 1];
    return {
      capacityGrowth: ((last.totalCapacityBtc - first.totalCapacityBtc) / first.totalCapacityBtc) * 100,
      channelGrowth: ((last.channelCount - first.channelCount) / first.channelCount) * 100,
      nodeGrowth: ((last.nodeCount - first.nodeCount) / first.nodeCount) * 100,
      currentCapacity: last.totalCapacityBtc,
      currentChannels: last.channelCount,
      currentNodes: last.nodeCount,
    };
  }, [data]);

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">
              {isTr ? 'Ağ verisi yükleniyor...' : 'Loading network data...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">
              {isTr ? 'Tarihsel veri mevcut değil' : 'No historical data available'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors: Record<string, { start: string; end: string }> = {
    capacity: { start: chartSeries.warning, end: chartSeries.primary },
    channels: { start: chartSeries.quinary, end: chartSeries.tertiary },
    nodes: { start: chartSeries.success, end: chartSeries.secondary },
  };
  const c = colors[activeMetric];

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            {isTr ? 'Ağ Büyümesi (1 Yıl)' : 'Network Growth (1 Year)'}
          </CardTitle>
          <div className="flex gap-1.5">
            {(['capacity', 'channels', 'nodes'] as const).map((metric) => (
              <button key={metric} onClick={() => setActiveMetric(metric)}
                className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                  activeMetric === metric ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}>
                {metricLabels[metric]}
              </button>
            ))}
          </div>
        </div>

        {growthMetrics && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { key: 'capacity', label: metricLabels.capacity, value: `${growthMetrics.currentCapacity.toFixed(0)} BTC`, growth: growthMetrics.capacityGrowth },
              { key: 'channels', label: metricLabels.channels, value: `${(growthMetrics.currentChannels / 1000).toFixed(1)}K`, growth: growthMetrics.channelGrowth },
              { key: 'nodes', label: metricLabels.nodes, value: `${(growthMetrics.currentNodes / 1000).toFixed(1)}K`, growth: growthMetrics.nodeGrowth },
            ].map(item => (
              <div key={item.key} className={`text-center p-2 rounded-lg ${activeMetric === item.key ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-muted/30'}`}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-bold">{item.value}</p>
                <Badge variant="secondary" className="text-[9px] mt-1 bg-success/10 text-success">
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  {item.growth > 0 ? '+' : ''}{item.growth.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: isMobile ? 10 : 20, left: isMobile ? -15 : 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.start} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={c.end} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: isMobile ? 9 : 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false} axisLine={{ stroke: 'hsl(var(--border))' }}
                interval={isMobile ? 'preserveStartEnd' : 'preserveEnd'} />
              <YAxis tick={{ fontSize: isMobile ? 9 : 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false} axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => activeMetric === 'capacity' ? `${value.toFixed(0)}` : `${value.toFixed(1)}K`} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number) => {
                  if (activeMetric === 'capacity') return [`${value.toFixed(2)} BTC`, isTr ? 'Ağ Kapasitesi' : 'Network Capacity'];
                  return [`${(value * 1000).toLocaleString()}`, activeMetric === 'channels' ? metricLabels.channels : metricLabels.nodes];
                }}
                labelFormatter={(label) => `${isTr ? 'Tarih' : 'Date'}: ${label}`} />
              <Area type="monotone" dataKey={activeMetric} stroke={c.start} strokeWidth={1.5} fillOpacity={1} fill="url(#colorMetric)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{isTr ? 'mempool.space Lightning API\'den veri' : 'Data from mempool.space Lightning API'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkCapacityChart;
