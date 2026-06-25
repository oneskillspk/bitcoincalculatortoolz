import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Layers, Zap, ArrowRight } from "lucide-react";
import { LightningFeeEstimate, formatSats, formatPercent } from "@/services/lightningFeeCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle, chartLegendStyle, chartSeries } from '@/components/calculator/chartTokens';

interface FeeEconomicsVisualizationProps {
  feeEstimate: LightningFeeEstimate | null;
  amountSats: number;
}

export const FeeEconomicsVisualization = ({ feeEstimate, amountSats }: FeeEconomicsVisualizationProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const comparisonData = useMemo(() => {
    if (!feeEstimate) return [];
    return [
      { name: 'Lightning', nametr: 'Lightning', fee: feeEstimate.totalFeeSats, time: isTr ? '~2 sn' : '~2 sec', color: chartSeries.warning },
      { name: 'On-Chain Fast', nametr: 'Zincir Üzeri Hızlı', fee: feeEstimate.onChainComparison.fastestFeeSats, time: isTr ? '~10 dk' : '~10 min', color: chartSeries.primary },
      { name: 'On-Chain 30m', nametr: 'Zincir Üzeri 30dk', fee: feeEstimate.onChainComparison.halfHourFeeSats, time: isTr ? '~30 dk' : '~30 min', color: chartSeries.quinary },
      { name: 'On-Chain Eco', nametr: 'Zincir Üzeri Ekonomik', fee: feeEstimate.onChainComparison.economyFeeSats, time: isTr ? '~1+ sa' : '~1+ hr', color: chartSeries.success },
    ];
  }, [feeEstimate, isTr]);

  const breakdownData = useMemo(() => {
    if (!feeEstimate) return [];
    return feeEstimate.feeBreakdownByHop.map((hop) => ({
      hop: isTr ? `Atlama ${hop.hop}` : `Hop ${hop.hop}`,
      baseFee: hop.baseFee, proportionalFee: hop.proportionalFee, total: hop.totalFee,
    }));
  }, [feeEstimate, isTr]);

  if (!feeEstimate) {
    return (
      <Card className="bg-card border-border/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <Layers className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">
              {isTr ? 'Görselleştirme için ücretleri hesaplayın' : 'Calculate fees to see visualization'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-violet-500" />
          </div>
          {isTr ? 'Ücret Ekonomisi Karşılaştırması' : 'Fee Economics Comparison'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            {isTr ? 'Lightning ve Zincir Üzeri Ücretler' : 'Lightning vs On-Chain Fees'}
          </h4>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical"
                margin={{ top: 5, right: isMobile ? 50 : 80, left: isMobile ? 70 : 90, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis type="number" inputMode="decimal" tick={{ fontSize: isMobile ? 9 : 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${value.toFixed(0)}`} />
                <YAxis type="category" dataKey={isTr ? 'nametr' : 'name'}
                  tick={{ fontSize: isMobile ? 9 : 11, fill: 'hsl(var(--muted-foreground))' }}
                  width={isMobile ? 65 : 85} />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value: number, name: string, props: any) => [
                    `${formatSats(value)} (${props.payload.time})`,
                    isTr ? 'Ücret' : 'Fee'
                  ]} />
                <Bar dataKey="fee" radius={[0, 4, 4, 0]}>
                  {comparisonData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 bg-gradient-to-r from-success/10 to-teal-500/10 rounded-lg p-3 border border-success/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">{isTr ? 'Lightning Avantajı' : 'Lightning Advantage'}</span>
              </div>
              <Badge className="bg-success text-white">
                {isTr ? `%${feeEstimate.onChainComparison.savingsPercent.toFixed(0)} Tasarruf` : `Save ${feeEstimate.onChainComparison.savingsPercent.toFixed(0)}%`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isTr
                ? `Anlık ödeme için ${formatSats(feeEstimate.onChainComparison.fastestFeeSats)} yerine ${formatSats(feeEstimate.totalFeeSats)} ödeyin`
                : `Pay ${formatSats(feeEstimate.totalFeeSats)} instead of ${formatSats(feeEstimate.onChainComparison.fastestFeeSats)} for instant settlement`}
            </p>
          </div>
        </div>

        {breakdownData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-primary" />
              {isTr ? 'Atlamaya Göre Ücret Birikimi' : 'Fee Accumulation by Hop'}
            </h4>
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} margin={{ top: 10, right: isMobile ? 10 : 20, left: isMobile ? -10 : 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="hop" tick={{ fontSize: isMobile ? 9 : 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: isMobile ? 9 : 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => value.toFixed(2)} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(4)} sats`,
                      name === 'baseFee' ? (isTr ? 'Taban Ücret' : 'Base Fee') : (isTr ? 'Oransal Ücret' : 'Proportional Fee')
                    ]} />
                  <Legend wrapperStyle={chartLegendStyle}
                    formatter={(value) => value === 'baseFee'
                      ? (isMobile ? (isTr ? 'Taban' : 'Base') : (isTr ? 'Taban Ücret' : 'Base Fee'))
                      : (isMobile ? (isTr ? 'Oran.' : 'Prop') : (isTr ? 'Oransal' : 'Proportional'))} />
                  <Bar dataKey="baseFee" stackId="a" fill={chartSeries.warning} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="proportionalFee" stackId="a" fill={chartSeries.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span className="text-muted-foreground">{isTr ? 'Taban Ücret (sabit)' : 'Base Fee (fixed)'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-orange-500" />
                <span className="text-muted-foreground">{isTr ? 'Oransal Ücret (miktarın %)' : 'Proportional Fee (% of amount)'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
          <h4 className="text-sm font-medium mb-3">
            {isTr ? 'Ödeme Akışı' : 'Payment Flow'}
          </h4>
          <div className="overflow-x-auto -mx-2 px-2">
            <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 py-2 min-w-max">
              <div className="flex-shrink-0 bg-primary/10 rounded-lg px-2 py-1.5 text-center w-[52px] sm:w-[60px]">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground">{isTr ? 'Gönderen' : 'Sender'}</div>
                <div className="text-[10px] sm:text-xs font-medium">{isTr ? 'Siz' : 'You'}</div>
              </div>
              {feeEstimate.feeBreakdownByHop.map((hop) => (
                <div key={hop.hop} className="flex items-center">
                  <ArrowRight className="w-3 h-3 text-muted-foreground mx-0.5 flex-shrink-0" />
                  <div className="flex-shrink-0 bg-yellow-500/10 rounded-lg px-2 py-1.5 text-center border border-yellow-500/20 w-[48px] sm:w-[56px]">
                    <div className="text-[9px] sm:text-[10px] text-muted-foreground">
                      {isTr ? `Atlama ${hop.hop}` : `Hop ${hop.hop}`}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-medium text-yellow-600">
                      +{hop.totalFee.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
              <ArrowRight className="w-3 h-3 text-muted-foreground mx-0.5 flex-shrink-0" />
              <div className="flex-shrink-0 bg-success/10 rounded-lg px-2 py-1.5 text-center border border-success/20 w-[52px] sm:w-[60px]">
                <div className="text-[9px] sm:text-[10px] text-muted-foreground">{isTr ? 'Alıcı' : 'Receiver'}</div>
                <div className="text-[10px] sm:text-xs font-medium text-success truncate">{formatSats(amountSats)}</div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {isTr ? 'Toplam ücret' : 'Total fees'}: {formatSats(feeEstimate.totalFeeSats)} ({formatPercent(feeEstimate.effectiveFeeRate)} {isTr ? 'ödemenin' : 'of payment'})
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeEconomicsVisualization;
