import { AccumulationResult } from '@/services/accumulationScoreService';
import { Link } from "@/components/LocalizedLink";
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel } from '@/components/calculator';

interface Props {
  result: AccumulationResult;
  btcPrice: number;
  holdings: number;
}

export const AccumulationScoreResult = ({ result, btcPrice, holdings }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const { grade, targetBtc, gap, phase, ratio } = result;
  const targetUsd = targetBtc * btcPrice;
  const holdingsUsd = holdings * btcPrice;
  const gapUsd = gap * btcPrice;

  return (
    <ResultPanel accentBar="primary" className="text-center"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">
      <div className="space-y-2">
        <div className={`text-7xl md:text-8xl font-black ${grade.color} leading-none`}>{grade.grade}</div>
        <div className="calc-text-h3 text-foreground">{grade.emoji} {grade.label}</div>
        <div className={`calc-text-small font-medium ${phase.color}`}>
          {phase.name} {tr ? 'Aşaması' : 'Phase'} — {phase.description}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <div className="calc-surface-subtle p-4">
          <p className="calc-text-label">{tr ? 'Yığınınız' : 'Your Stack'}</p>
          <p className="calc-text-mono mt-1 text-lg font-bold text-foreground">{holdings.toFixed(4)} BTC</p>
          <p className="calc-text-small text-muted-foreground">${holdingsUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="calc-surface-subtle p-4">
          <p className="calc-text-label">{tr ? 'Yaş Hedefi' : 'Target for Age'}</p>
          <p className="calc-text-mono mt-1 text-lg font-bold text-foreground">{targetBtc.toFixed(4)} BTC</p>
          <p className="calc-text-small text-muted-foreground">${targetUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <div className="flex justify-between calc-text-small text-muted-foreground">
          <span>{tr ? 'İlerleme' : 'Progress'}</span>
          <span className="calc-text-mono">{Math.min(100, Math.round(ratio * 100))}%</span>
        </div>
        <div className="h-3 bg-muted/40 rounded-full overflow-hidden border border-border/30">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              ratio >= 1 ? 'bg-success' : ratio >= 0.75 ? 'bg-blue-500' : ratio >= 0.5 ? 'bg-amber-500' : 'bg-destructive'
            }`}
            style={{ width: `${Math.min(100, ratio * 100)}%` }}
          />
        </div>
      </div>

      {gap > 0 && (
        <div className="calc-surface-subtle p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 calc-text-small text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            {tr ? 'Kapatılacak açık' : 'Gap to close'}
          </div>
          <p className="calc-text-mono text-xl font-bold text-foreground">{gap.toFixed(4)} BTC</p>
          <p className="calc-text-small text-muted-foreground">${gapUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      )}

      <Link
        to={tr ? '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' : '/calculators/retirement'}
        className="inline-flex items-center justify-center gap-2 calc-text-small text-primary hover:text-primary/80 transition-colors mx-auto"
      >
        {tr ? 'Emeklilik mi planlıyorsunuz? Emeklilik Hesaplayıcısını deneyin' : 'Planning for retirement? Try the Retirement Calculator'}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </ResultPanel>
  );
};
