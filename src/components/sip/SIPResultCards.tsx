import React from 'react';
import { DollarSign, TrendingUp, Wallet, Percent } from 'lucide-react';
import { SIPResults } from '@/services/sipCalculatorService';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultsGrid, ResultCard } from '@/components/calculator';
import { formatCurrencyAmount, formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface SIPResultCardsProps {
  results: SIPResults;
}

export const SIPResultCards: React.FC<SIPResultCardsProps> = ({ results }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const disp = (v: number) => formatCurrencyForDisplay(v, 'USD', { locale });
  const full = (v: number) => formatCurrencyAmount(v, 'USD', { locale });

  const totalInvested = disp(results.totalInvested);
  const corpus = disp(results.estimatedCorpus);
  const wealth = disp(results.wealthGained);

  return (
    <ResultsGrid cols={2}>
      <ResultCard
        icon={<Wallet />}
        label={tr ? 'Toplam Yatırılan' : 'Total Invested'}
        value={totalInvested.display}
        fullValue={totalInvested.full}
      />
      <ResultCard
        icon={<TrendingUp />}
        label={tr ? 'Tahmini Birikim' : 'Estimated Corpus'}
        value={corpus.display}
        fullValue={corpus.full}
        sub={results.realCorpus !== null ? `${tr ? 'Reel:' : 'Real:'} ${disp(results.realCorpus).display}` : undefined}
        tone="positive"
      />
      <ResultCard
        icon={<DollarSign />}
        label={tr ? 'Kazanılan Servet' : 'Wealth Gained'}
        value={wealth.display}
        fullValue={wealth.full}
        sub={results.realWealthGained !== null ? `${tr ? 'Reel:' : 'Real:'} ${disp(results.realWealthGained).display}` : undefined}
        tone="primary"
      />
      <ResultCard
        icon={<Percent />}
        label={tr ? 'Efektif BYBÜ' : 'Effective CAGR'}
        value={`${(results.effectiveCAGR * 100).toFixed(1)}%`}
        tooltip={tr
          ? 'Toplam yatırımı tek seferlik yatırım olarak ele alan basitleştirilmiş BYBÜ. Gerçek zamana göre ağırlıklı getiri (XIRR) daha yüksek olur.'
          : 'Simplified CAGR treating total invested as a lump sum. Actual time-weighted return (XIRR) would be higher since money was invested gradually.'}
      />
    </ResultsGrid>
  );
};
