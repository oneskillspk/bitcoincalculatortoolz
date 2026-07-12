import { TrendingUp, Shield } from 'lucide-react';
import { type CAGRResult, formatCurrency, formatPercentage, getHistoricalAssets } from '@/services/cagrCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultBadge, ResultsGrid, ResultCard } from '@/components/calculator';
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
      icon={<TrendingUp />}
      eyebrow={tr ? 'Tarihsel Projeksiyon' : 'Historical Projection'}
      title={tr ? `${result.years} Yıllık Projeksiyon` : `${result.years}-Year Projection`}
      description={tr ? '2016–2026 tarihsel BYBÜ verilerine dayalı' : 'Based on 2016–2026 historical CAGR'}
      accentBar="primary"
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? 'Hesaplama sonucu' : 'Calculator result'}
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
      {result.projectedValues.map((pv) => {
        const assetData = allAssets.find((a) => a.name === pv.asset);
        if (!assetData) return null;
        const finalDisp = disp(pv.finalValue);
        const gainDisp = disp(Math.abs(pv.totalGain));
        const gainSign = pv.totalGain >= 0 ? '+' : '−';

        return (
          <div key={pv.asset} className="calc-surface-subtle space-y-4 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-lg" aria-hidden>{assetData.icon}</span>
                <span className="calc-text-body truncate font-semibold text-foreground">{pv.asset}</span>
              </div>
              <ResultBadge tone="primary" className="border-transparent">
                <span style={{ color: assetData.color }}>{formatPercentage(assetData.cagr)} {tr ? 'BYBÜ' : 'CAGR'}</span>
              </ResultBadge>
            </div>

            <ResultsGrid cols={2}>
              <ResultCard
                label={tr ? 'Tahmini Değer' : 'Projected Value'}
                value={finalDisp.display}
                fullValue={formatCurrency(pv.finalValue)}
                tone="primary"
              />
              <ResultCard
                label={tr ? 'Toplam Kazanç' : 'Total Gain'}
                value={`${gainSign}${gainDisp.display}`}
                fullValue={`${gainSign}${formatCurrency(Math.abs(pv.totalGain))}`}
                tone={pv.totalGain >= 0 ? 'positive' : 'negative'}
              />
            </ResultsGrid>

            <ResultsGrid cols={3}>
              <ResultCard label={tr ? '10Y Getiri' : '10Y Return'} value={formatPercentage(assetData.totalReturn)} size="sm" />
              <ResultCard label={tr ? 'Oynaklık' : 'Volatility'} value={`${assetData.volatility}%`} size="sm" />
              <ResultCard label={tr ? 'Maks. Düşüş' : 'Max DD'} value={`${assetData.maxDrawdown}%`} tone="negative" size="sm" />
            </ResultsGrid>
          </div>
        );
      })}
    </ResultPanel>
  );
};
