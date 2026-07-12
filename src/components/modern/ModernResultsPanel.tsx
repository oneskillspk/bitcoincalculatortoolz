import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Bitcoin,
  Calendar,
  Timer,
  Target,
  Wallet,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalculationResult, SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { formatROI, formatCurrency, formatLargeNumber } from '@/utils/formatters';
import { formatGroupedInt } from '@/utils/numberFormat';
import { format, differenceInDays } from 'date-fns';
import { ResultPanel, ResultCard, ResultHero, ResultsGrid } from '@/components/calculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocale } from '@/hooks/useLocale';

interface ModernResultsPanelProps {
  result: CalculationResult;
  showInBtc: boolean;
}

/**
 * Format a fiat value for the *abbreviated* tile display ($12.4K, $2.3M).
 * The full precision string is always provided as the hover/tap tooltip
 * so users can read the exact figure on demand.
 */
function abbreviatedCurrency(value: number, currency?: { symbol: string; code: string }, locale: string = 'en-US'): string {
  if (!isFinite(value)) return `${currency?.symbol ?? '$'}∞`;
  const abs = Math.abs(value);
  if (abs < 10_000) {
    // Small numbers stay readable in full.
    return `${value < 0 ? '-' : ''}${currency?.symbol ?? '$'}${abs.toLocaleString(locale, {
      maximumFractionDigits: 2,
    })}`;
  }
  return `${value < 0 ? '-' : ''}${currency?.symbol ?? '$'}${formatLargeNumber(abs, 2)}`;
}

function abbreviatedBtc(value: number, locale: string = 'en-US'): string {
  if (!isFinite(value)) return '₿∞';
  if (value === 0) return '₿0';
  if (value >= 1000) return `₿${formatLargeNumber(value, 2)}`;
  if (value >= 1) return `₿${value.toLocaleString(locale, { maximumFractionDigits: 4 })}`;
  // Sub-1 BTC: keep up to 6 sig figs but trim trailing zeros for tile.
  return `₿${parseFloat(value.toFixed(6))}`;
}


export const ModernResultsPanel: React.FC<ModernResultsPanelProps> = ({ result, showInBtc }) => {
  const { language } = useLanguage();
  const tr = language === "tr";
  const isTr = language === 'tr';
  const { intlLocale } = useLocale();

  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === result.currency);
  const isProfit = result.profitLoss >= 0;
  const daysHeld = differenceInDays(new Date(), new Date(result.startDate));
  const annualized =
    (Math.pow(1 + result.roiPercentage / 100, 365 / Math.max(daysHeld, 1)) - 1) * 100;

  // Full-precision strings (used as hover/tap tooltips on every numeric tile).
  const currentValueFull = formatCurrency(result.currentValue, currency, showInBtc, intlLocale);
  const profitFull = formatCurrency(result.profitLoss, currency, showInBtc, intlLocale);
  const initialFull = formatCurrency(result.investmentAmount, currency, false, intlLocale);
  const btcFull = `₿${result.btcAmount.toFixed(8)}`;

  // Abbreviated tile values (avoid overflow on 360px screens).
  const currentValueShort = showInBtc
    ? abbreviatedBtc(result.currentValue, intlLocale)
    : abbreviatedCurrency(result.currentValue, currency, intlLocale);
  const profitShort = showInBtc
    ? abbreviatedBtc(result.profitLoss, intlLocale)
    : abbreviatedCurrency(result.profitLoss, currency, intlLocale);
  const initialShort = abbreviatedCurrency(result.investmentAmount, currency, intlLocale);
  const btcShort = abbreviatedBtc(result.btcAmount, intlLocale);

  return (
    <ResultPanel
      icon={<BarChart3 />}
      title={isTr ? 'Yatırım Sonuçları' : 'Investment Results'}
      description={`${format(new Date(result.startDate), 'PP')} → ${format(new Date(), 'PP')}`}
      accentBar={isProfit ? 'positive' : 'negative'}
      action={
        <Badge
          variant={isProfit ? 'default' : 'destructive'}
          className={cn('text-xs', isProfit && 'bg-success/10 text-success border border-success/20')}
        >
          {isProfit ? (isTr ? 'Kâr' : 'Profit') : (isTr ? 'Zarar' : 'Loss')}
        </Badge>
      }
      footer={
        <p className="calc-text-small text-foreground">
          {isTr
            ? `Yatırımınız ${format(new Date(result.startDate), 'MMM yyyy')} tarihinden bu yana %${Math.abs(result.roiPercentage).toFixed(1)} ${isProfit ? 'kazandı' : 'kaybetti'}.`
            : `Your investment ${isProfit ? 'gained' : 'lost'} ${Math.abs(result.roiPercentage).toFixed(1)}% since ${format(new Date(result.startDate), 'MMM yyyy')}.`}
        </p>
      }
    
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}>
      <ResultHero
        label={isTr ? 'Güncel Yatırım Değeri' : 'Current Investment Value'}
        value={currentValueShort}
        fullValue={currentValueFull}
        sub={currentValueFull}
      />

      <ResultsGrid cols={2}>
        <ResultCard
          label={isTr ? 'Başlangıç Yatırımı' : 'Initial Investment'}
          icon={<Wallet />}
          value={initialShort}
          fullValue={initialFull}
          size="lg"
        />
        <ResultCard
          label={isTr ? 'Net Kâr / Zarar' : 'Net Profit / Loss'}
          icon={isProfit ? <TrendingUp /> : <TrendingDown />}
          value={`${isProfit ? '+' : ''}${profitShort}`}
          fullValue={`${isProfit ? '+' : ''}${profitFull}`}
          tone={isProfit ? 'positive' : 'negative'}
          size="lg"
        />
      </ResultsGrid>

      <ResultsGrid cols={4}>
        <ResultCard
          label={isTr ? 'Elde Tutma' : 'Days Held'}
          icon={<Calendar />}
          value={`${daysHeld.toLocaleString(intlLocale)}${isTr ? ' gün' : ''}`}
          fullValue={`${daysHeld} ${isTr ? 'gün' : 'days'}`}
        />
        <ResultCard
          label="ROI"
          icon={<Target />}
          value={formatROI(result.roiPercentage, 1)}
          fullValue={formatROI(result.roiPercentage, 4)}
          tone={isProfit ? 'positive' : 'negative'}
          tooltip={
            isTr
              ? 'Yatırım Getirisi: başlangıç yatırımınızdaki yüzde kazanç veya kayıp.'
              : 'Return on Investment: percentage gain or loss on your initial investment.'
          }
        />
        <ResultCard
          label={isTr ? 'BTC Miktarı' : 'BTC Amount'}
          icon={<Bitcoin />}
          value={btcShort}
          fullValue={btcFull}
        />
        <ResultCard
          label={isTr ? 'Yıllık Getiri' : 'Annualized'}
          icon={<Timer />}
          value={formatROI(annualized, 1)}
          fullValue={formatROI(annualized, 4)}
          tone={annualized >= 0 ? 'positive' : 'negative'}
          tooltip={
            isTr
              ? 'Yıllık ortalama getiri (CAGR), bu performans her yıl tutarlı sürmüş gibi.'
              : 'Compound Annual Growth Rate — average yearly return if performance held steady.'
          }
        />
      </ResultsGrid>
    </ResultPanel>
  );
};

export default ModernResultsPanel;
