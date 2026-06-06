import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonteCarloSimulator, MonteCarloParams, SimulationResult } from '@/services/monteCarloSimulator';
import { BitcoinPrice } from '@/services/bitcoinApi';
import {
  Play, Pause, RotateCcw, TrendingUp, TrendingDown,
  Target, BarChart3, Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { PerformantResponsiveContainer } from '@/components/optimized/PerformantResponsiveContainer';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  chartTooltipStyle, chartTooltipLabelStyle, chartTooltipItemStyle,
  chartSeries,
} from '@/components/calculator/chartTokens';

interface MonteCarloPanelProps {
  currentPrice: number;
  historicalData: BitcoinPrice[];
  initialInvestment: number;
}

export const MonteCarloPanel: React.FC<MonteCarloPanelProps> = ({
  currentPrice,
  historicalData,
  initialInvestment
}) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const [params, setParams] = useState<MonteCarloParams>({
    initialPrice: currentPrice,
    projectionDays: 365,
    simulationCount: 1000,
    volatility: 0.8,
    drift: 0.15
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 100);
    try {
      const simulationResult = MonteCarloSimulator.runSimulation(params, historicalData);
      setResult(simulationResult);
      setProgress(100);
    } catch (error) {
      console.error('Monte Carlo simulation failed:', error);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => { setIsRunning(false); setProgress(0); }, 500);
    }
  };

  const resetSimulation = () => { setResult(null); setProgress(0); };

  const getChartData = () => {
    if (!result) return [];
    const samplePaths = result.paths.slice(0, 20);
    const chartData: Record<string, any>[] = [];
    const maxLength = Math.max(...samplePaths.map(path => path.prices.length));
    for (let i = 0; i < maxLength; i++) {
      const dataPoint: Record<string, any> = { day: i };
      samplePaths.forEach((path, pathIndex) => {
        if (path.prices[i]) dataPoint[`path${pathIndex}`] = path.prices[i].price;
      });
      chartData.push(dataPoint);
    }
    return chartData;
  };

  const getConfidenceData = () => {
    if (!result) return [];
    return Object.entries(result.confidence).map(([key, value]) => ({
      period: key.replace('days', '') + (isTr ? ' gün' : ' days'),
      low: value.low,
      mean: value.mean,
      high: value.high
    }));
  };

  const getProbabilityColor = (p: number) => {
    if (p >= 70) return 'text-success';
    if (p >= 50) return 'text-yellow-600';
    return 'text-destructive';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          {isTr ? 'Monte Carlo Simülasyonu' : 'Monte Carlo Simulation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectionDays">{isTr ? 'Projeksiyon Günleri' : 'Projection Days'}</Label>
            <Input id="projectionDays" type="number" value={params.projectionDays}
              onChange={(e) => setParams(prev => ({ ...prev, projectionDays: Number(e.target.value) }))}
              min={30} max={1825} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="simulationCount">{isTr ? 'Simülasyon Sayısı' : 'Number of Simulations'}</Label>
            <Input id="simulationCount" type="number" value={params.simulationCount}
              onChange={(e) => setParams(prev => ({ ...prev, simulationCount: Number(e.target.value) }))}
              min={100} max={10000} step={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volatility">{isTr ? 'Yıllık Oynaklık (%)' : 'Annual Volatility (%)'}</Label>
            <Input id="volatility" type="number" value={(params.volatility * 100).toFixed(0)}
              onChange={(e) => setParams(prev => ({ ...prev, volatility: Number(e.target.value) / 100 }))}
              min={10} max={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="drift">{isTr ? 'Beklenen Yıllık Getiri (%)' : 'Expected Annual Return (%)'}</Label>
            <Input id="drift" type="number" value={(params.drift * 100).toFixed(0)}
              onChange={(e) => setParams(prev => ({ ...prev, drift: Number(e.target.value) / 100 }))}
              min={-50} max={100} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={runSimulation} disabled={isRunning} className="flex items-center gap-2">
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? (isTr ? 'Çalışıyor...' : 'Running...') : (isTr ? 'Simülasyonu Çalıştır' : 'Run Simulation')}
          </Button>
          <Button variant="outline" onClick={resetSimulation} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            {isTr ? 'Sıfırla' : 'Reset'}
          </Button>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{isTr ? `${params.simulationCount} simülasyon çalışıyor...` : `Running ${params.simulationCount} simulations...`}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {result && !isRunning && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="summary">{isTr ? 'Özet' : 'Summary'}</TabsTrigger>
              <TabsTrigger value="paths">{isTr ? 'Fiyat Yolları' : 'Price Paths'}</TabsTrigger>
              <TabsTrigger value="confidence">{isTr ? 'Güven' : 'Confidence'}</TabsTrigger>
              <TabsTrigger value="statistics">{isTr ? 'İstatistik' : 'Statistics'}</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{isTr ? 'Beklenen Fiyat' : 'Expected Price'}</span>
                  </div>
                  <div className="text-2xl font-bold">${result.statistics.mean.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">
                    {isTr ? `${params.projectionDays} gün içinde` : `In ${params.projectionDays} days`}
                  </p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">{isTr ? 'Kâr Olasılığı' : 'Probability of Profit'}</span>
                  </div>
                  <div className={`text-2xl font-bold ${getProbabilityColor(result.statistics.probabilityOfProfit)}`}>
                    {result.statistics.probabilityOfProfit.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isTr ? 'Pozitif getiri şansı' : 'Chance of positive return'}
                  </p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{isTr ? 'Oynaklık Aralığı' : 'Volatility Range'}</span>
                  </div>
                  <div className="text-lg font-bold">
                    ${result.statistics.percentile5.toLocaleString()} - ${result.statistics.percentile95.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isTr ? '%90 güven aralığı' : '90% confidence interval'}
                  </p>
                </Card>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: isTr ? 'Medyan Fiyat' : 'Median Price', value: `$${result.statistics.median.toLocaleString()}` },
                  { label: isTr ? '25. Yüzdelik' : '25th Percentile', value: `$${result.statistics.percentile25.toLocaleString()}` },
                  { label: isTr ? '75. Yüzdelik' : '75th Percentile', value: `$${result.statistics.percentile75.toLocaleString()}` },
                  { label: isTr ? 'Std. Sapma' : 'Std. Deviation', value: `$${result.statistics.standardDeviation.toLocaleString()}` },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                    <div className="text-lg font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="paths" className="space-y-4">
              <div className="h-[280px] sm:h-96 min-h-[260px] sm:min-h-[300px]">
                <PerformantResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      labelStyle={chartTooltipLabelStyle}
                      itemStyle={chartTooltipItemStyle}
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, isTr ? 'Fiyat' : 'Price']}
                      labelFormatter={(label) => `${isTr ? 'Gün' : 'Day'} ${label}`}
                    />
                    {Array.from({ length: 20 }, (_, i) => (
                      <Line key={i} type="monotone" dataKey={`path${i}`}
                        stroke={`hsl(${i * 18}, 70%, 50%)`} strokeWidth={1} dot={false} strokeOpacity={0.6} />
                    ))}
                  </LineChart>
                </PerformantResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {isTr
                  ? `${params.simulationCount} simülasyondan 20 örnek fiyat yolu gösteriliyor`
                  : `Showing 20 sample price paths from ${params.simulationCount} simulations`}
              </p>
            </TabsContent>

            <TabsContent value="confidence" className="space-y-4">
              <div className="h-64 min-h-[256px]">
                <PerformantResponsiveContainer width="100%" height="100%" minHeight={256}>
                  <AreaChart data={getConfidenceData()}>
                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                    <Area type="monotone" dataKey="high" stackId="1" stroke={chartSeries.success} fill={chartSeries.success} fillOpacity={0.3} />
                    <Area type="monotone" dataKey="mean" stackId="2" stroke={chartSeries.secondary} fill={chartSeries.secondary} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="low" stackId="3" stroke={chartSeries.destructive} fill={chartSeries.destructive} fillOpacity={0.3} />
                  </AreaChart>
                </PerformantResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getConfidenceData().map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="font-medium mb-2">{item.period}</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isTr ? 'Düşük (%5)' : 'Low (5%)'}</span>
                        <span>${item.low.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isTr ? 'Ortalama' : 'Mean'}</span>
                        <span className="font-medium">${item.mean.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isTr ? 'Yüksek (%95)' : 'High (95%)'}</span>
                        <span>${item.high.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">{isTr ? 'Dağılım İstatistikleri' : 'Distribution Statistics'}</h4>
                  <div className="space-y-2">
                    {[
                      { label: isTr ? 'Ortalama' : 'Mean', value: `$${result.statistics.mean.toLocaleString()}` },
                      { label: isTr ? 'Medyan' : 'Median', value: `$${result.statistics.median.toLocaleString()}` },
                      { label: isTr ? 'Standart Sapma' : 'Standard Deviation', value: `$${result.statistics.standardDeviation.toLocaleString()}` },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">{isTr ? 'Yüzdelikler' : 'Percentiles'}</h4>
                  <div className="space-y-2">
                    {[
                      { label: isTr ? '5. Yüzdelik' : '5th Percentile', value: `$${result.statistics.percentile5.toLocaleString()}` },
                      { label: isTr ? '25. Yüzdelik' : '25th Percentile', value: `$${result.statistics.percentile25.toLocaleString()}` },
                      { label: isTr ? '75. Yüzdelik' : '75th Percentile', value: `$${result.statistics.percentile75.toLocaleString()}` },
                      { label: isTr ? '95. Yüzdelik' : '95th Percentile', value: `$${result.statistics.percentile95.toLocaleString()}` },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
