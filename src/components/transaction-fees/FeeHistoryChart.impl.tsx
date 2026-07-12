import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useMemo } from "react";
import { transactionFeeCalculator, type HistoricalFeePoint, type FeeRecommendation } from "@/services/transactionFeeCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { chartTooltipStyle, chartLegendStyle } from '@/components/calculator/chartTokens';

interface FeeHistoryChartProps {
  currentFees: FeeRecommendation | null;
  isLoading: boolean;
}

export const FeeHistoryChart = ({ currentFees, isLoading }: FeeHistoryChartProps) => {
  const [historicalData, setHistoricalData] = useState<HistoricalFeePoint[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const isMobile = useIsMobile();

  // Fetch real historical data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setDataLoading(true);
      setDataError(false);
      try {
        const data = await transactionFeeCalculator.getHistoricalFeeRates();
        if (data.length > 0) {
          setHistoricalData(data);
        } else {
          setDataError(true);
        }
      } catch (error) {
        console.error('Failed to fetch historical fee data:', error);
        setDataError(true);
      } finally {
        setDataLoading(false);
      }
    };

    fetchHistoricalData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchHistoricalData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Format data for chart
  const chartData = useMemo(() => {
    if (historicalData.length === 0) return [];
    
    // Sample data points for performance (every Nth point based on mobile)
    const sampleRate = isMobile ? 8 : 4;
    const sampledData = historicalData.filter((_, index) => index % sampleRate === 0);
    
    return sampledData.map((point) => {
      const date = new Date(point.timestamp);
      return {
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: point.timestamp,
        fastest: Math.round(point.avgFee_90),
        halfHour: Math.round(point.avgFee_50),
        economy: Math.round(point.avgFee_10)
      };
    });
  }, [historicalData, isMobile]);

  // Find optimal timing recommendation
  const optimalTime = useMemo(() => {
    if (chartData.length === 0) return null;
    
    let minFee = Infinity;
    let optimalIndex = 0;
    
    chartData.forEach((point, index) => {
      if (point.fastest < minFee) {
        minFee = point.fastest;
        optimalIndex = index;
      }
    });
    
    const optimalPoint = chartData[optimalIndex];
    return {
      time: optimalPoint.time,
      fee: optimalPoint.fastest
    };
  }, [chartData]);

  if (isLoading || dataLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 sm:h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Show error state with current fees fallback
  if (dataError || chartData.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">24-Hour Fee Trends</span>
            <span className="sm:hidden">Fee Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-center gap-3 bg-muted/20 rounded-lg">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Historical data temporarily unavailable
            </p>
            {currentFees && (
              <div className="text-xs text-muted-foreground">
                Current fees: {currentFees.fastestFee} sat/vB (fast) • {currentFees.economyFee} sat/vB (eco)
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">24-Hour Fee Trends</span>
            <span className="sm:hidden">Fee Trends</span>
          </CardTitle>
          {optimalTime && (
            <div className="flex items-center gap-2 text-xs sm:text-sm bg-success/10 text-success px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-success/20 w-fit">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>
                <span className="hidden sm:inline">Best: </span>
                {optimalTime.time} ({optimalTime.fee} sat/vB)
              </span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          <span className="hidden sm:inline">Real historical fee rates to help you find the best time to transact</span>
          <span className="sm:hidden">Find the best time to transact</span>
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border)/0.3)" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: isMobile ? 9 : 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border)/0.5)' }}
                interval={isMobile ? 'preserveStartEnd' : 4}
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 9 : 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border)/0.5)' }}
                width={isMobile ? 30 : 40}
                label={isMobile ? undefined : { 
                  value: 'sat/vB', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 10, fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    fastest: 'Fast',
                    halfHour: '30m',
                    economy: 'Eco'
                  };
                  return [`${value} sat/vB`, labels[name] || name];
                }}
              />
              <Legend 
                wrapperStyle={chartLegendStyle}
                iconSize={isMobile ? 8 : 14}
                formatter={(value: string) => {
                  const labels: Record<string, string> = {
                    fastest: isMobile ? 'F' : 'Fastest',
                    halfHour: isMobile ? 'M' : '30 min',
                    economy: isMobile ? 'E' : 'Economy'
                  };
                  return labels[value] || value;
                }}
              />
              <Line
                type="monotone"
                dataKey="fastest"
                stroke="hsl(var(--primary))"
                strokeWidth={isMobile ? 1.5 : 2}
                dot={false}
                activeDot={{ r: isMobile ? 3 : 4, fill: 'hsl(var(--primary))' }}
              />
              <Line
                type="monotone"
                dataKey="halfHour"
                stroke="hsl(var(--chart-2))"
                strokeWidth={isMobile ? 1.5 : 2}
                dot={false}
                activeDot={{ r: isMobile ? 3 : 4, fill: 'hsl(var(--chart-2))' }}
              />
              <Line
                type="monotone"
                dataKey="economy"
                stroke="hsl(var(--success))"
                strokeWidth={isMobile ? 1.5 : 2}
                dot={false}
                activeDot={{ r: isMobile ? 3 : 4, fill: 'hsl(var(--success))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insight */}
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-muted/30 rounded-lg border border-border/30">
          <p className="text-xs sm:text-xs text-muted-foreground">
            <strong className="text-foreground">💡</strong>
            <span className="hidden sm:inline"> Insight: Bitcoin fees are often lowest during early morning (UTC) and weekends when trading volume decreases.</span>
            <span className="sm:hidden"> Fees are lower during off-peak hours (early morning UTC).</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
