import { BtcVsRealEstateResult } from "@/services/btcVsRealEstateCalculator";
import { Bitcoin, Home, Trophy, ArrowUpRight, ArrowDownRight, Scale, Receipt, CalendarRange } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { formatMoney, formatMoneyCompact } from "@/utils/formatMoney";
import { ResultPanel, ResultsGrid, ResultCard, ResultRow, ResultBadge } from "@/components/calculator";

interface Props {
  result: BtcVsRealEstateResult;
}

const pct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

export const BtcVsRealEstateResultsPanel = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const fmt = (v: number) => formatMoney(v, { tr, fxRate, decimals: 0 });
  const fmtCard = (v: number) =>
    Math.abs(tr ? v * fxRate : v) >= 100_000
      ? formatMoneyCompact(v, { tr, fxRate })
      : formatMoney(v, { tr, fxRate, decimals: 0 });
  const { btcFinalValue, reFinalNetValue, btcROI, reROI, difference, winner, btcInvestment, reInvestment, costBreakdown, breakEvenYear } = result;

  return (
    <div className="space-y-6"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
      <ResultPanel
        eyebrow={tr ? 'Karşılaştırma' : 'Comparison'}
        title={tr ? 'Bitcoin vs Gayrimenkul' : 'Bitcoin vs Real Estate'}
        icon={<Scale />}
        accentBar={winner === 'btc' ? 'primary' : winner === 'real-estate' ? 'positive' : 'none'}
        action={
          <ResultBadge tone={winner === 'btc' ? 'primary' : winner === 'real-estate' ? 'positive' : 'neutral'} icon={<Trophy />}>
            {winner === 'btc' ? (tr ? 'BTC' : 'BTC') : winner === 'real-estate' ? (tr ? 'GE' : 'RE') : (tr ? 'Berabere' : 'Tie')}
          </ResultBadge>
        }
      >
        <ResultsGrid cols={3}>
          <ResultCard
            label="Bitcoin"
            value={fmtCard(btcFinalValue)}
            fullValue={fmt(btcFinalValue)}
            icon={<Bitcoin />}
            tone={winner === 'btc' ? 'primary' : 'default'}
            sub={
              <span className="flex items-center gap-1 min-w-0 [overflow-wrap:anywhere]">
                {btcROI >= 0 ? <ArrowUpRight className="w-3 h-3 text-success" /> : <ArrowDownRight className="w-3 h-3 text-destructive" />}
                <span className={btcROI >= 0 ? 'text-success' : 'text-destructive'}>{pct(btcROI)} {tr ? 'YG' : 'ROI'}</span>
                <span className="text-muted-foreground" title={fmt(btcInvestment)}>· {fmtCard(btcInvestment)}</span>
              </span>
            }
          />
          <ResultCard
            label={tr ? 'Gayrimenkul' : 'Real Estate'}
            value={fmtCard(reFinalNetValue)}
            fullValue={fmt(reFinalNetValue)}
            icon={<Home />}
            tone={winner === 'real-estate' ? 'positive' : 'default'}
            sub={
              <span className="flex items-center gap-1 min-w-0 [overflow-wrap:anywhere]">
                {reROI >= 0 ? <ArrowUpRight className="w-3 h-3 text-success" /> : <ArrowDownRight className="w-3 h-3 text-destructive" />}
                <span className={reROI >= 0 ? 'text-success' : 'text-destructive'}>{pct(reROI)} {tr ? 'YG' : 'ROI'}</span>
                <span className="text-muted-foreground" title={fmt(reInvestment)}>· {fmtCard(reInvestment)}</span>
              </span>
            }
          />
          <ResultCard
            label={tr ? 'Fark' : 'Difference'}
            value={`${difference >= 0 ? '+' : ''}${fmtCard(difference)}`}
            fullValue={`${difference >= 0 ? '+' : ''}${fmt(difference)}`}
            tone={difference >= 0 ? 'primary' : 'default'}
            sub={
              <span className="flex items-center gap-1">
                {breakEvenYear ? <CalendarRange className="w-3 h-3" /> : null}
                {winner === 'btc' ? (tr ? 'BTC kazanıyor' : 'BTC wins') : winner === 'real-estate' ? (tr ? 'Gayrimenkul kazanıyor' : 'Real estate wins') : (tr ? 'Berabere' : 'Tie')}
                {breakEvenYear ? (tr ? ` · GE öncede yıl ${breakEvenYear}` : ` · RE leads until yr ${breakEvenYear}`) : null}
              </span>
            }
          />
        </ResultsGrid>
      </ResultPanel>

      <ResultPanel
        eyebrow={tr ? 'Maliyet' : 'Costs'}
        title={tr ? 'Gayrimenkul Maliyet Dökümü' : 'Real Estate Cost Breakdown'}
        icon={<Receipt />}
      >
        <ResultsGrid cols={3}>
          {[
            [tr ? 'Mortgage Faizi' : 'Mortgage Interest', costBreakdown.totalMortgageInterest],
            [tr ? 'Bakım & Sigorta' : 'Maintenance & Insurance', costBreakdown.totalMaintenance],
            [tr ? 'Mülk Vergisi' : 'Property Tax', costBreakdown.totalPropertyTax],
            [tr ? 'Alım Kapanış' : 'Buy Closing Costs', costBreakdown.buyClosingCosts],
            [tr ? 'Satım Kapanış' : 'Sell Closing Costs', costBreakdown.sellClosingCosts],
          ].map(([label, value]) => (
            <ResultCard key={label as string} label={label as string} value={fmtCard(value as number)} fullValue={fmt(value as number)} size="sm" />
          ))}
        </ResultsGrid>
        <ResultRow
          label={tr ? 'Toplam Maliyet' : 'Total Costs'}
          value={fmtCard(costBreakdown.totalCosts)}
          fullValue={fmt(costBreakdown.totalCosts)}
          emphasis
          divider
        />
      </ResultPanel>

      <ResultPanel
        eyebrow={tr ? 'Detay' : 'Detail'}
        title={tr ? 'Yıllık Karşılaştırma' : 'Year-by-Year Comparison'}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-2 text-muted-foreground font-medium">{tr ? 'Yıl' : 'Year'}</th>
                <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'BTC Değeri' : 'BTC Value'}</th>
                <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'GE Net Değeri' : 'RE Net Value'}</th>
                <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'GE Özkaynak' : 'RE Equity'}</th>
                <th className="text-right py-2 text-muted-foreground font-medium">{tr ? 'Önde' : 'Leader'}</th>
              </tr>
            </thead>
            <tbody>
              {result.yearlyBreakdown.map(row => (
                <tr key={row.year} className="border-b border-border/20">
                  <td className="py-1.5 text-foreground">{row.year}</td>
                  <td className="py-1.5 text-right text-foreground font-mono">{fmt(row.btcValue)}</td>
                  <td className="py-1.5 text-right text-foreground font-mono">{fmt(row.reNetValue)}</td>
                  <td className="py-1.5 text-right text-muted-foreground font-mono">{fmt(row.reEquity)}</td>
                  <td className="py-1.5 text-right">
                    <span className={`text-xs font-medium ${row.btcValue > row.reNetValue ? 'text-primary' : 'text-info'}`}>
                      {row.btcValue > row.reNetValue ? '₿ BTC' : (tr ? '🏠 GE' : '🏠 RE')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultPanel>
    </div>
  );
};
