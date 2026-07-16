import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Target } from 'lucide-react';
import { LotSizeResult } from '@/services/lotSizeCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { ResultPanel, ResultHero, ResultsGrid, ResultCard, ResultBadge, EmptyState } from '@/components/calculator';
import { formatCurrencyForDisplay } from '@/utils/formatCurrency';

interface LotSizeResultsPanelProps {
  result: LotSizeResult | null;
}

export const LotSizeResultsPanel: React.FC<LotSizeResultsPanelProps> = ({ result }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (!result) {
    return (
      <ResultPanel title={tr ? 'Sonuçlar' : 'Results'}
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}>
        <EmptyState
          icon={<Target />}
          title={tr ? 'Sonuç henüz yok' : 'No result yet'}
          description={tr ? 'Önerilen lot büyüklüğünü hesaplamak için pozisyon parametrelerinizi girin.' : 'Enter your position parameters to calculate the recommended lot size.'}
        />
      </ResultPanel>
    );
  }

  const riskMap = {
    safe: { tone: 'positive' as const, icon: <CheckCircle />, label: tr ? 'Muhafazakâr Risk' : 'Conservative Risk' },
    warning: { tone: 'warning' as const, icon: <AlertTriangle />, label: tr ? 'Orta Risk' : 'Moderate Risk' },
    danger: { tone: 'negative' as const, icon: <ShieldAlert />, label: tr ? 'Yüksek Risk' : 'High Risk' },
  };
  const risk = riskMap[result.riskLevel];

  const disp = (v: number) => formatCurrencyForDisplay(v, 'USD', { locale: tr ? 'tr-TR' : 'en-US' });
  const posVal = disp(result.positionValueUsd);
  const dollarRisk = disp(result.dollarRisk);
  const margin = disp(result.marginRequired);

  return (
    <ResultPanel
      title={tr ? 'Sonuçlar' : 'Results'}
      action={<ResultBadge tone={risk.tone} icon={risk.icon}>{risk.label}</ResultBadge>}
      accentBar={risk.tone === 'positive' ? 'positive' : risk.tone === 'negative' ? 'negative' : 'primary'}
    >
      <ResultHero
        label={tr ? 'Önerilen Lot Büyüklüğü' : 'Recommended Lot Size'}
        value={result.recommendedLotSize}
        sub={tr ? 'lot' : 'lots'}
      />

      <ResultsGrid cols={2}>
        <ResultCard
          label={tr ? 'Pozisyon Büyüklüğü (BTC)' : 'Position Size (BTC)'}
          value={`${result.positionSizeBtc.toFixed(6)} BTC`}
        />
        <ResultCard
          label={tr ? 'Pozisyon Değeri (USD)' : 'Position Value (USD)'}
          value={posVal.display}
          fullValue={posVal.full}
        />
        <ResultCard
          label={tr ? 'Dolar Riski' : 'Dollar Risk'}
          value={dollarRisk.display}
          fullValue={dollarRisk.full}
          tone="negative"
        />
        <ResultCard
          label={tr ? 'Gereken Marj' : 'Margin Required'}
          value={margin.display}
          fullValue={margin.full}
        />
        {result.riskRewardRatio && (
          <ResultCard
            className="sm:col-span-2"
            label={tr ? 'Risk/Ödül Oranı' : 'Risk/Reward Ratio'}
            value={`1:${result.riskRewardRatio}`}
            tone="primary"
          />
        )}
      </ResultsGrid>

      <section
        className="border-t border-border/30 pt-4"
        aria-labelledby="lot-breakdown-heading"
      >
        <h3
          id="lot-breakdown-heading"
          className="calc-text-label text-muted-foreground mb-3 text-xs sm:text-sm font-semibold uppercase tracking-wide"
        >
          {tr ? 'Lot Dökümü' : 'Lot Breakdown'}
        </h3>
        <ul
          className="grid grid-cols-4 gap-1.5 sm:gap-2 list-none p-0 m-0"
          aria-label={tr ? 'Lot türüne göre döküm' : 'Breakdown by lot type'}
        >
          {[
            { key: 'standard', label: tr ? 'Standart' : 'Standard', value: result.lotBreakdown.standard, sub: '1.0 lot', unitLabel: tr ? '1,0 lot' : '1.0 lot' },
            { key: 'mini',     label: 'Mini',                        value: result.lotBreakdown.mini,     sub: '0.1 lot',  unitLabel: tr ? '0,1 lot' : '0.1 lot' },
            { key: 'micro',    label: tr ? 'Mikro' : 'Micro',        value: result.lotBreakdown.micro,    sub: '0.01 lot', unitLabel: tr ? '0,01 lot' : '0.01 lot' },
            { key: 'nano',     label: 'Nano',                        value: result.lotBreakdown.nano,     sub: '0.001 lot', unitLabel: tr ? '0,001 lot' : '0.001 lot' },
          ].map(item => (
            <li
              key={item.key}
              className="calc-surface-subtle p-1.5 sm:p-2 text-center min-w-0 overflow-hidden rounded-md"
              aria-label={tr
                ? `${item.value} ${item.label} lot, birim ${item.unitLabel}`
                : `${item.value} ${item.label} lots, unit size ${item.unitLabel}`}
            >
              <span
                aria-hidden="true"
                className="calc-text-mono block text-base sm:text-lg font-bold text-foreground leading-tight tabular-nums"
              >
                {item.value}
              </span>
              <span
                aria-hidden="true"
                className="calc-text-label block text-muted-foreground text-[11px] sm:text-xs leading-tight font-medium break-words hyphens-auto"
              >
                {item.label}
              </span>
              <span
                aria-hidden="true"
                className="block text-[11px] sm:text-xs text-muted-foreground/70 leading-tight whitespace-nowrap tabular-nums"
              >
                {item.sub}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </ResultPanel>
  );
};
