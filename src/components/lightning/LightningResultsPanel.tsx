import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, Clock, TrendingUp, ArrowDown, DollarSign, Layers, Percent, Coins } from "lucide-react";
import {
  LightningFeeEstimate,
  ChannelEconomics,
  formatSats,
  formatPercent,
  LIGHTNING_CONSTANTS,
} from "@/services/lightningFeeCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultPanel, ResultsGrid, ResultCard, ResultRow, EmptyState } from "@/components/calculator";

interface LightningResultsPanelProps {
  feeEstimate: LightningFeeEstimate | null;
  channelEconomics: ChannelEconomics | null;
  amountSats: number;
  btcPriceUsd: number;
  isLoading: boolean;
}

export const LightningResultsPanel = ({
  feeEstimate, channelEconomics, amountSats, btcPriceUsd, isLoading,
}: LightningResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (isLoading) {
    return (
      <ResultPanel>
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="calc-text-small text-muted-foreground">{tr ? 'Ücretler hesaplanıyor...' : 'Calculating fees...'}</p>
        </div>
      </ResultPanel>
    );
  }

  if (!feeEstimate) {
    return (
      <ResultPanel>
        <EmptyState
          icon={<Zap />}
          title={tr ? 'Hesaplamaya hazır' : 'Ready to calculate'}
          description={tr ? 'Ücret tahminlerini görmek için ödeme bilgilerini girin' : 'Enter payment details to see fee estimates'}
        />
      </ResultPanel>
    );
  }

  const amountUsd = (amountSats / LIGHTNING_CONSTANTS.SATS_PER_BTC) * btcPriceUsd;

  return (
    <ResultPanel
      icon={<TrendingUp />}
      title={tr ? 'Ücret Tahmini' : 'Fee Estimate'}
      accentBar="primary"
      action={
        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
          <Clock className="w-3 h-3 mr-1" />
          {feeEstimate.estimatedTime}
        </Badge>
      }
    >
      <ResultsGrid cols={2}>
        <ResultCard
          icon={<Coins />}
          label={tr ? 'Toplam Yönlendirme Ücreti' : 'Total Routing Fee'}
          value={formatSats(feeEstimate.totalFeeSats)}
          sub={`$${feeEstimate.totalFeeUsd.toFixed(4)} USD`}
          size="lg"
        />
        <ResultCard
          icon={<Percent />}
          label={tr ? 'Efektif Oran' : 'Effective Rate'}
          value={formatPercent(feeEstimate.effectiveFeeRate)}
          sub={tr ? 'ödemenin' : 'of payment'}
          size="lg"
          tone="positive"
        />
      </ResultsGrid>

      <div className="calc-surface-subtle p-4">
        <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
          <Layers className="w-4 h-4" />
          {tr ? 'Ücret Dağılımı' : 'Fee Breakdown'}
        </h4>
        <ResultRow label={tr ? 'Taban Ücret Bileşeni' : 'Base Fee Component'} value={formatSats(feeEstimate.baseFeeTotal)} />
        <ResultRow label={tr ? 'Orantılı Ücret' : 'Proportional Fee'} value={formatSats(feeEstimate.proportionalFeeTotal)} divider />
        <ResultRow emphasis divider label={tr ? 'Toplam Ücret' : 'Total Fee'} value={formatSats(feeEstimate.totalFeeSats)} tone="primary" />
      </div>

      <div className="calc-surface-subtle p-4">
        <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
          <ArrowDown className="w-4 h-4 text-success" />
          {tr ? 'Zincir Üstü İşleme Karşı' : 'vs On-Chain Transaction'}
        </h4>
        <ResultRow label={`Lightning ${tr ? 'Ücreti' : 'Fee'}`} value={formatSats(feeEstimate.totalFeeSats)} tone="primary" />
        <ResultRow label={tr ? 'Zincir Üstü (En Hızlı)' : 'On-Chain (Fastest)'} value={formatSats(feeEstimate.onChainComparison.fastestFeeSats)} divider />
        <ResultRow label={tr ? 'Zincir Üstü (30 dk)' : 'On-Chain (30 min)'} value={formatSats(feeEstimate.onChainComparison.halfHourFeeSats)} divider />
        <div className="border-t border-border/30 pt-3 mt-1 flex items-center justify-between">
          <span className="calc-text-small font-medium text-foreground">{tr ? 'Tasarrufunuz' : 'Your Savings'}</span>
          <Badge className="bg-success text-white">
            %{feeEstimate.onChainComparison.savingsPercent.toFixed(0)} {tr ? 'daha ucuz' : 'cheaper'}
          </Badge>
        </div>
      </div>

      {feeEstimate.feeBreakdownByHop.length > 0 && (
        <div className="space-y-3">
          <h4 className="calc-text-label text-foreground">{tr ? 'Atlama Başına Ücret' : 'Fee per Hop'}</h4>
          <div className="overflow-x-auto">
            <div className="min-w-[360px]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs h-8">{tr ? 'Atlama' : 'Hop'}</TableHead>
                    <TableHead className="text-xs h-8">{tr ? 'Taban' : 'Base'}</TableHead>
                    <TableHead className="text-xs h-8">{tr ? 'Oran.' : 'Prop.'}</TableHead>
                    <TableHead className="text-xs h-8">{tr ? 'Toplam' : 'Total'}</TableHead>
                    <TableHead className="text-xs h-8 text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeEstimate.feeBreakdownByHop.map((hop) => (
                    <TableRow key={hop.hop} className="hover:bg-muted/30">
                      <TableCell className="text-xs py-2">#{hop.hop}</TableCell>
                      <TableCell className="text-xs py-2">{hop.baseFee.toFixed(3)}</TableCell>
                      <TableCell className="text-xs py-2">{hop.proportionalFee.toFixed(3)}</TableCell>
                      <TableCell className="text-xs py-2 font-medium">{hop.cumulativeFee.toFixed(3)}</TableCell>
                      <TableCell className="text-xs py-2 text-right text-muted-foreground">{formatPercent(hop.percentOfAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {channelEconomics && channelEconomics.channelSizeSats > 0 && (
        <div className="calc-surface-subtle p-4">
          <h4 className="calc-text-label flex items-center gap-2 text-foreground mb-3">
            <DollarSign className="w-4 h-4 text-violet-500" />
            {tr ? 'Kanal Ekonomisi' : 'Channel Economics'}
          </h4>
          <ResultsGrid cols={2}>
            <ResultCard label={tr ? 'Kanal Boyutu' : 'Channel Size'} value={formatSats(channelEconomics.channelSizeSats)} size="sm" />
            <ResultCard label={tr ? 'Günlük Yönl. Tahmini' : 'Daily Routing Est.'} value={formatSats(channelEconomics.estimatedDailyRoutingVolume)} size="sm" />
            <ResultCard label={tr ? 'Aylık Gelir' : 'Monthly Revenue'} value={formatSats(channelEconomics.estimatedMonthlyRevenue)} tone="positive" size="sm" />
            <ResultCard label={tr ? 'Yıllık ROI' : 'Annual ROI'} value={`${channelEconomics.expectedAnnualRoi.toFixed(2)}%`} tone="primary" size="sm" />
          </ResultsGrid>
          <p className="calc-text-small mt-3 text-muted-foreground">
            {tr ? 'Başabaş Süresi:' : 'Break-even Time:'}{' '}
            <span className="font-medium text-foreground">
              {channelEconomics.breakEvenDays === Infinity ? (tr ? 'Geçerli Değil' : 'N/A') : `~${channelEconomics.breakEvenDays} ${tr ? 'gün' : 'days'}`}
            </span>
          </p>
        </div>
      )}

      <div className="calc-surface-subtle p-3 text-center">
        <p className="calc-text-label text-muted-foreground mb-1">{tr ? 'Ödeme Özeti' : 'Payment Summary'}</p>
        <p className="text-sm">
          {tr ? (
            <>
              Yalnızca <span className="font-bold text-yellow-500">{formatSats(feeEstimate.totalFeeSats)}</span>{' '}ücretle{' '}<span className="font-bold text-foreground">{formatSats(amountSats)}</span><span className="text-muted-foreground"> (${amountUsd.toFixed(2)})</span>{' '}gönderin
            </>
          ) : (
            <>
              Send <span className="font-bold text-foreground">{formatSats(amountSats)}</span>
              <span className="text-muted-foreground"> (${amountUsd.toFixed(2)})</span>
              {' '}for only{' '}
              <span className="font-bold text-yellow-500">{formatSats(feeEstimate.totalFeeSats)}</span>
              {' '}in fees
            </>
          )}
        </p>
      </div>
    </ResultPanel>
  );
};

export default LightningResultsPanel;
