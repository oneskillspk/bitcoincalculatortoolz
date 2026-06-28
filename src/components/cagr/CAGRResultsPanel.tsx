import { TrendingUp, Shield } from 'lucide-react';
import { type CAGRResult, formatCurrency, formatPercentage, getHistoricalAssets } from '@/services/cagrCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultBadge } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface CAGRResultsPanelProps {
  result: CAGRResult;
}

export const CAGRResultsPanel = ({ result }: CAGRResultsPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const allAssets = getHistoricalAssets();
  const disp = (v: number) => formatCurrencyForDisplay(v, 'USD', { locale: tr ? 'tr-TR' : 'en-US' });

  return (
    <ResultPanel
      icon={<TrendingUp /
      aria-live="polite"
      aria-atomic="true"
      aria-label="Calculator result">}
      eyebrow={tr ? 'Tarihsel Projeksiyon' : 'Historical Projection'}
      title={tr ? `${result.years} Yıllık Projeksiyon` : `${result.years}-Year Projection`}
      description={tr ? '2016–2026 tarihsel BYBÜ verilerine dayalı' : 'Based on 2016–2026 historical CAGR'}
      accentBar="primary"
      footer={
        <div className="flex items-start gap-2">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="calc-text-small text-muted-foreground">
            {tr
              ? 'BYBÜ, Ocak 2016 ile Ocak 2026 arasındaki gerçek tarihsel fiyatlara dayanmaktadır. Geçmiş performans gelecekteki sonuçları garanti etmez.'
              : 'CAGR based on real historical prices from January 2016 to January 2026. Past performance does not guarantee future results.'}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {result.projectedValues.map(pv => {
          const assetData = allAssets.find(a => a.name === pv.asset);
          if (!assetData) return null;

          return (
            <div
              key={pv.asset}
              className="calc-surface-subtle space-y-3 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg" aria-hidden>{assetData.icon}</span>
                  <span className="calc-text-body font-semibold text-foreground truncate">{pv.asset}</span>
                </div>
                <ResultBadge
                  tone="primary"
                  className="border-transparent"
                  // inline color override keeps per-asset accent
                >
                  <span style={{ color: assetData.color }}>{formatPercentage(assetData.cagr)} {tr ? 'BYBÜ' : 'CAGR'}</span>
                </ResultBadge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <p className="calc-text-label text-muted-foreground">{tr ? 'Tahmini Değer' : 'Projected Value'}</p>
                  <p className="calc-text-mono text-base font-bold sm:text-lg [overflow-wrap:anywhere]" style={{ color: assetData.color }} title={formatCurrency(pv.finalValue)}>
                    {disp(pv.finalValue).display}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="calc-text-label text-muted-foreground">{tr ? 'Toplam Kazanç' : 'Total Gain'}</p>
                  <p className={`calc-text-mono text-base font-bold sm:text-lg [overflow-wrap:anywhere] ${pv.totalGain >= 0 ? 'text-success' : 'text-destructive'}`} title={`${pv.totalGain >= 0 ? '+' : '-'}${formatCurrency(Math.abs(pv.totalGain))}`}>
                    {pv.totalGain >= 0 ? '+' : '-'}{disp(Math.abs(pv.totalGain)).display}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-border/30 pt-3">
                <div className="text-center">
                  <p className="calc-text-label text-muted-foreground">{tr ? '10Y Getiri' : '10Y Return'}</p>
                  <p className="calc-text-mono text-xs font-semibold text-foreground">{formatPercentage(assetData.totalReturn)}</p>
                </div>
                <div className="text-center">
                  <p className="calc-text-label text-muted-foreground">{tr ? 'Oynaklık' : 'Volatility'}</p>
                  <p className="calc-text-mono text-xs font-semibold text-foreground">{assetData.volatility}%</p>
                </div>
                <div className="text-center">
                  <p className="calc-text-label text-muted-foreground">{tr ? 'Maks. Düşüş' : 'Max DD'}</p>
                  <p className="calc-text-mono text-xs font-semibold text-destructive">{assetData.maxDrawdown}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ResultPanel>
  );
};
