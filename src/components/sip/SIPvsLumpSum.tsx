import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { SIPvsLumpSumResults } from '@/services/sipCalculatorService';
import { SIPCard } from './SIPCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatSymbolAmount } from '@/utils/numberFormat';

interface SIPvsLumpSumProps {
  results: SIPvsLumpSumResults;
}

const formatCurrency = (val: number) =>
  val.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const SIPvsLumpSum: React.FC<SIPvsLumpSumProps> = ({ results }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <SIPCard data-currency-exempt="true">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        {tr ? 'Düzenli Yatırım vs Toplu Alım Karşılaştırması' : 'SIP vs Lump Sum Comparison'}
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        {tr
          ? `${formatCurrency(results.sipTotalInvested)} tutarını başlangıçta tek seferde yatırsaydınız ne olurdu?`
          : `What if you invested ${formatCurrency(results.sipTotalInvested)} upfront instead?`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className={`p-4 rounded-xl border ${results.winner === 'sip' ? 'border-primary bg-primary/5' : 'border-border/30'}`}>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            {tr ? 'Düzenli Yatırım Getirisi' : 'SIP Returns'}
          </div>
          <div className="text-xl font-bold text-foreground font-mono">{formatCurrency(results.sipCorpus)}</div>
          {results.winner === 'sip' && (
            <span className="inline-block mt-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {tr ? 'Kazanan' : 'Winner'}
            </span>
          )}
        </div>

        <div className={`p-4 rounded-xl border ${results.winner === 'lumpsum' ? 'border-success bg-success/5' : 'border-border/30'}`}>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            {tr ? 'Toplu Alım Getirisi' : 'Lump Sum Returns'}
          </div>
          <div className="text-xl font-bold text-foreground font-mono">{formatCurrency(results.lumpSumCorpus)}</div>
          {results.winner === 'lumpsum' && (
            <span className="inline-block mt-2 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
              {tr ? 'Kazanan' : 'Winner'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowRight className="w-4 h-4" />
        <span>
          {tr
            ? <>{results.winner === 'lumpsum' ? 'Toplu alım' : 'Düzenli yatırım'}{' '}{formatCurrency(results.difference)} ({results.differencePercent.toFixed(1)}%) <span className="font-medium text-foreground">daha iyi performans gösteriyor</span></>
            : <>{results.winner === 'lumpsum' ? 'Lump sum' : 'SIP'} outperforms by{' '}<span className="font-medium text-foreground">{formatCurrency(results.difference)}</span>{' '}({results.differencePercent.toFixed(1)}%)</>}
        </span>
      </div>
    </SIPCard>
  );
};
