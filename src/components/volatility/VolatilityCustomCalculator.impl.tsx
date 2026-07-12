import { formatGroupedInt } from '@/utils/numberFormat';
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PerformantResponsiveContainer } from "@/components/optimized/PerformantResponsiveContainer";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { computeCustomVolatility } from "@/services/volatilityService";
import type { VolatilityData } from "@/services/volatilityService";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface Props {
  data: VolatilityData | undefined;
  loading: boolean;
}

export const VolatilityCustomCalculator = ({ data, loading }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [window, setWindow] = useState("30");

  const windowOptions = [
    { value: "7", label: tr ? "7 gün" : "7 days" },
    { value: "14", label: tr ? "14 gün" : "14 days" },
    { value: "30", label: tr ? "30 gün" : "30 days" },
    { value: "60", label: tr ? "60 gün" : "60 days" },
    { value: "90", label: tr ? "90 gün" : "90 days" },
    { value: "365", label: tr ? "1 yıl" : "1 year" },
  ];

  const result = useMemo(() => {
    if (!data || !startDate || !endDate) return null;
    return computeCustomVolatility(
      data.prices,
      data.dates,
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd"),
      parseInt(window)
    );
  }, [data, startDate, endDate, window]);

  if (loading) {
    return <div className="animate-pulse h-[400px] bg-muted rounded-xl" />;
  }

  const minDate = data?.dates[0] ? new Date(data.dates[0]) : new Date("2013-01-01");
  const maxDate = new Date();

  const metrics = result && result.annualizedVol > 0 ? [
    { label: tr ? "Yıllıklaştırılmış Vol." : "Annualized Vol", value: `${result.annualizedVol.toFixed(1)}%` },
    { label: tr ? "Günlük Vol." : "Daily Vol", value: `${result.dailyVol.toFixed(2)}%` },
    { label: tr ? "Ort. Günlük Aralık" : "Avg Daily Range", value: `$${formatGroupedInt(result.avgDailyRange, 'en-US')}` },
    { label: tr ? "En Büyük Günlük Hareket" : "Max Single Day", value: `${result.maxSingleDayMove.magnitude > 0 ? '+' : ''}${result.maxSingleDayMove.magnitude.toFixed(1)}%` },
    { label: tr ? "Sharpe Oranı" : "Sharpe Ratio", value: result.sharpeRatio.toFixed(2) },
    { label: tr ? "Max Hareket Tarihi" : "Max Move Date", value: result.maxSingleDayMove.date.slice(5) || '—' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {tr ? 'Özel Volatilite Hesaplayıcısı' : 'Custom Volatility Calculator'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{tr ? 'Başlangıç Tarihi' : 'Start Date'}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : (tr ? "Başlangıç tarihi seçin" : "Pick start date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(d) => d > maxDate || d < minDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{tr ? 'Bitiş Tarihi' : 'End Date'}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : (tr ? "Bitiş tarihi seçin" : "Pick end date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(d) => d > maxDate || (startDate ? d < startDate : d < minDate)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{tr ? 'Hareketli Pencere' : 'Rolling Window'}</label>
              <Select value={window} onValueChange={setWindow}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {windowOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && result.annualizedVol > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map(m => (
              <Card key={m.label} className="glass-morphism-card border-border/20">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-lg font-bold text-foreground">{m.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {result.rollingData.length > 5 && (
            <Card className="glass-morphism-card border-border/20 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {tr ? `${window} Günlük Hareketli Volatilite` : `Rolling ${window}-Day Volatility`}
                </h3>
                <PerformantResponsiveContainer height={300}>
                  <LineChart data={result.rollingData.filter((_, i) => i % 2 === 0)}>
                    <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(d) => d.slice(5)} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v.toFixed(1)}%`]} />
                    <Line type="monotone" dataKey="vol" name={tr ? `${window}g Vol.` : `${window}d Vol`} stroke="hsl(var(--primary))" dot={false} strokeWidth={1.5} />
                  </LineChart>
                </PerformantResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!startDate && (
        <div className="text-center py-12 text-muted-foreground">
          <p>
            {tr
              ? 'Özel volatilite metriklerini hesaplamak için başlangıç ve bitiş tarihi seçin.'
              : 'Select a start and end date to calculate custom volatility metrics.'}
          </p>
        </div>
      )}
    </div>
  );
};
