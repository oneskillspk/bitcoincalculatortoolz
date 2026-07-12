import { AccumulationResult } from '@/services/accumulationScoreService';
import { Link } from '@/components/LocalizedLink';
import { ArrowRight, TrendingUp, Target, Bitcoin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultsGrid, ResultCard, ResultHero } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface Props {
  result: AccumulationResult;
  btcPrice: number;
  holdings: number;
}

export const AccumulationScoreResult = ({ result, btcPrice, holdings }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const disp = (v: number) => formatCurrencyForDisplay(v, 'USD', { locale });

  const { grade, targetBtc, gap, phase, ratio } = result;
  const targetUsd = targetBtc * btcPrice;
  const holdingsUsd = holdings * btcPrice;
  const gapUsd = gap * btcPrice;
  const progressPct = Math.min(100, Math.round(ratio * 100));
  const holdingsDisp = disp(holdingsUsd);
  const targetDisp = disp(targetUsd);
  const gapDisp = disp(gapUsd);

  return (
    <ResultPanel
      icon={<Target />}
      eyebrow={tr ? 'Birikim Skoru' : 'Accumulation Score'}
      title={`${grade.grade} — ${grade.label}`}
      description={`${phase.name} ${tr ? 'Aşaması' : 'Phase'} · ${phase.description}`}
      accentBar="primary"
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
    >
      <ResultHero
        label={tr ? 'İlerleme' : 'Progress'}
        value={<span className={grade.color}>{progressPct}%</span>}
        sub={
          <div
            className="mt-3 h-2.5 w-full overflow-hidden rounded-full border border-border/30 bg-muted/40"
            role="progressbar"
            aria-label={tr ? 'Birikim ilerlemesi' : 'Accumulation progress'}
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                ratio >= 1 ? 'bg-success' : ratio >= 0.75 ? 'bg-primary' : ratio >= 0.5 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${Math.min(100, ratio * 100)}%` }}
            />
          </div>
        }
      />

      <ResultsGrid cols={gap > 0 ? 3 : 2}>
        <ResultCard
          icon={<Bitcoin />}
          label={tr ? 'Yığınınız' : 'Your Stack'}
          value={`${holdings.toFixed(4)} BTC`}
          sub={holdingsDisp.display}
          fullValue={holdingsDisp.full}
        />
        <ResultCard
          icon={<Target />}
          label={tr ? 'Yaş Hedefi' : 'Target for Age'}
          value={`${targetBtc.toFixed(4)} BTC`}
          sub={targetDisp.display}
          fullValue={targetDisp.full}
          tone="primary"
        />
        {gap > 0 && (
          <ResultCard
            icon={<TrendingUp />}
            label={tr ? 'Kapatılacak Açık' : 'Gap to Close'}
            value={`${gap.toFixed(4)} BTC`}
            sub={gapDisp.display}
            fullValue={gapDisp.full}
            tone="negative"
          />
        )}
      </ResultsGrid>

      <Link
        to={tr ? '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' : '/calculators/retirement'}
        className="calc-text-small mx-auto inline-flex items-center justify-center gap-2 text-primary transition-colors hover:text-primary/80"
      >
        {tr ? 'Emeklilik mi planlıyorsunuz? Emeklilik Hesaplayıcısını deneyin' : 'Planning for retirement? Try the Retirement Calculator'}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </ResultPanel>
  );
};
