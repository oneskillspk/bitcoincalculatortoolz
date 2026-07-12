import { Coins, TrendingDown, Percent, Clock } from "lucide-react";
import { ResultPanel } from "@/components/calculator/ResultPanel";
import { ResultsGrid } from "@/components/calculator/ResultsGrid";
import { ResultCard } from "@/components/calculator/ResultCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { BitcoinSupplyData } from "@/services/bitcoinSupplyService";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatGroupedInt } from "@/utils/numberFormat";

interface Props {
  data: BitcoinSupplyData | undefined;
  loading: boolean;
  userBtc: number;
}

export const SupplyMetricCards = ({ data, loading, userBtc }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  const title = tr ? 'Bitcoin Arz Durumu' : 'Bitcoin Supply';
  const ariaLabel = tr ? 'Arz sonucu' : 'Supply result';

  if (loading || !data) {
    return (
      <ResultPanel
        icon={<Coins />}
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

  const userPercent = (userBtc / data.currentSupply) * 100;
  const circ = formatGroupedInt(data.currentSupply, locale);
  const remaining = formatGroupedInt(data.remainingToMine, locale);

  return (
    <ResultPanel
      icon={<Coins />}
      title={title}
      accentBar="primary"
      aria-live="polite"
      aria-atomic="true"
      aria-label={ariaLabel}
    >
      <ResultsGrid cols={4}>
        <ResultCard
          label={tr ? 'Dolaşımdaki Arz' : 'Circulating Supply'}
          value={`${circ} BTC`}
          fullValue={`${circ} BTC`}
          icon={<Coins />}
          tone="primary"
          sub={`${data.percentageMined}% ${tr ? '21M\'nin madenciliği yapıldı' : 'of 21M mined'}`}
        />
        <ResultCard
          label={tr ? 'Madenciliği Kalan' : 'Remaining to Mine'}
          value={`${remaining} BTC`}
          fullValue={`${remaining} BTC`}
          icon={<TrendingDown />}
          sub={tr ? '21.000.000 tavanına kadar' : 'Until 21,000,000 cap'}
        />
        <ResultCard
          label={tr ? 'Güncel Enflasyon Oranı' : 'Current Inflation Rate'}
          value={`${data.currentInflationRate}%/${tr ? 'yıl' : 'yr'}`}
          icon={<Percent />}
          sub={tr ? 'Yıllık yeni BTC / arz' : 'New BTC per year / supply'}
        />
        <ResultCard
          label={tr ? "Stack'ınızın %" : 'Your Stack %'}
          value={userBtc > 0 ? `${userPercent.toFixed(8)}%` : (tr ? 'BTC girin' : 'Enter BTC')}
          fullValue={userBtc > 0 ? `${userPercent.toFixed(10)}%` : undefined}
          icon={<Clock />}
          tone={userBtc > 0 ? 'positive' : 'muted'}
          sub={userBtc > 0
            ? `${userBtc} BTC / ${circ}`
            : (tr ? 'toplam arzın' : 'of total supply')}
        />
      </ResultsGrid>
    </ResultPanel>
  );
};
