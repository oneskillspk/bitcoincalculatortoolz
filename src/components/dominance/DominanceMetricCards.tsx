import { Crown, DollarSign, BarChart3, Coins } from "lucide-react";
import { ResultPanel } from "@/components/calculator/ResultPanel";
import { ResultsGrid } from "@/components/calculator/ResultsGrid";
import { ResultCard } from "@/components/calculator/ResultCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { DominanceData } from "@/services/dominanceService";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyDisplay, formatPercent, formatGroupedInt } from "@/utils/numberFormat";

interface Props {
  data: DominanceData | undefined;
  loading: boolean;
}

function compactUsd(n: number, locale: string): { display: string; full: string } {
  if (n >= 1e12) return { display: `$${(n / 1e12).toFixed(2)}T`, full: `$${formatGroupedInt(n, locale)}` };
  if (n >= 1e9) return { display: `$${(n / 1e9).toFixed(2)}B`, full: `$${formatGroupedInt(n, locale)}` };
  return formatCurrencyDisplay(n, "$", { locale });
}

export const DominanceMetricCards = ({ data, loading }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  const title = tr ? 'Piyasa Dominansı' : 'Market Dominance';
  const ariaLabel = tr ? 'Piyasa dominansı sonucu' : 'Market dominance result';

  if (loading || !data) {
    return (
      <ResultPanel
        icon={<BarChart3 />}
        title={title}
        accentBar="primary"
        aria-live="polite"
        aria-atomic="true"
        aria-label={ariaLabel}
      >
        <ResultsGrid cols={4}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </ResultsGrid>
      </ResultPanel>
    );
  }

  const btcCap = compactUsd(data.btcMarketCap, locale);
  const totalCap = compactUsd(data.totalMarketCap, locale);
  const btcPrice = formatCurrencyDisplay(data.btcPrice, "$", { locale });
  const dom = formatPercent(data.btcDominance, 1);

  return (
    <ResultPanel
      icon={<BarChart3 />}
      title={title}
      accentBar="primary"
      aria-live="polite"
      aria-atomic="true"
      aria-label={ariaLabel}
    >
      <ResultsGrid cols={4}>
        <ResultCard
          label={tr ? 'BTC Dominansı' : 'BTC Dominance'}
          value={`${data.btcDominance.toFixed(1)}%`}
          fullValue={dom.full.replace('+', '')}
          icon={<Crown />}
          tone="primary"
          sub={tr ? 'toplam kripto piyasasının' : 'of total crypto market'}
        />
        <ResultCard
          label={tr ? 'BTC Piyasa Değeri' : 'BTC Market Cap'}
          value={btcCap.display}
          fullValue={btcCap.full}
          icon={<DollarSign />}
          sub={tr ? 'Güncel değerleme' : 'Current valuation'}
        />
        <ResultCard
          label={tr ? 'Toplam Kripto Piyasası' : 'Total Crypto Market'}
          value={totalCap.display}
          fullValue={totalCap.full}
          icon={<BarChart3 />}
          sub={tr ? 'Tüm kripto paralar' : 'All cryptocurrencies'}
        />
        <ResultCard
          label={tr ? 'BTC Fiyatı' : 'BTC Price'}
          value={btcPrice.display}
          fullValue={btcPrice.full}
          icon={<Coins />}
          sub={tr ? 'Canlı fiyat' : 'Live price'}
        />
      </ResultsGrid>
    </ResultPanel>
  );
};
