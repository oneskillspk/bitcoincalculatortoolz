import { NisabStandard, NisabData, SupportedCurrency, convertUsd, formatCurrency } from '@/services/zakatCalculator';
import { Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  value: NisabStandard;
  onChange: (v: NisabStandard) => void;
  nisab: NisabData;
  currency: SupportedCurrency;
}

export const ZakatNisabStandardSelector = ({ value, onChange, nisab, currency }: Props) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const silverVal = convertUsd(nisab.silverNisabUsd, currency, nisab.exchangeRates);
  const goldVal = convertUsd(nisab.goldNisabUsd, currency, nisab.exchangeRates);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">
        {tr ? 'Adım 2 — Nisab Standardı' : 'Step 2 — Nisab Standard'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => onChange('silver')}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            value === 'silver' ? 'border-primary bg-primary/5' : 'border-border/30 hover:border-primary/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 rounded-full border-2 ${value === 'silver' ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
            <span className="font-medium text-foreground">
              {tr ? 'Gümüş Nisabı — Önerilen' : 'Silver Nisab — Recommended'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground ml-5">{tr ? '612,36g gümüş' : '612.36g silver'}</p>
          <p className="text-lg font-bold text-foreground ml-5">{formatCurrency(silverVal, currency)}</p>
        </button>

        <button
          onClick={() => onChange('gold')}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            value === 'gold' ? 'border-primary bg-primary/5' : 'border-border/30 hover:border-primary/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 rounded-full border-2 ${value === 'gold' ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
            <span className="font-medium text-foreground">
              {tr ? 'Altın Nisabı' : 'Gold Nisab'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground ml-5">{tr ? '87,48g altın' : '87.48g gold'}</p>
          <p className="text-lg font-bold text-foreground ml-5">{formatCurrency(goldVal, currency)}</p>
        </button>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
        <p>
          {tr
            ? 'Çoğu âlim daha düşük eşiği nedeniyle Gümüş Nisabını önermektedir; bu daha fazla Zekât alıcısına fayda sağlar. Altın Nisabını yalnızca servetinizin tamamı altından oluşuyorsa kullanın.'
            : 'Most scholars recommend Silver Nisab as it has a lower threshold and benefits more Zakat recipients. Use Gold Nisab only if your wealth consists entirely of gold.'}
        </p>
      </div>
    </div>
  );
};
