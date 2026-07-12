import { SupportedCurrency, CURRENCY_FLAGS } from '@/services/zakatCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  value: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
}

const PRIMARY_CURRENCIES: SupportedCurrency[] = ['USD', 'PKR', 'INR', 'AED', 'GBP'];
const SECONDARY_CURRENCIES: SupportedCurrency[] = ['BDT', 'MYR', 'IDR', 'SAR', 'NGN', 'EUR', 'CAD', 'AUD', 'TRY'];

export const ZakatCurrencySelector = ({ value, onChange }: Props) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={tr ? 'Para birimi seçici' : 'Currency selector'}>
      {PRIMARY_CURRENCIES.map(c => (
        <button
          key={c}
          type="button"
          aria-pressed={value === c}
          onClick={() => onChange(c)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
            value === c
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground'
          }`}
        >
          {CURRENCY_FLAGS[c]} {c}
        </button>
      ))}
      <select
        aria-label={tr ? 'Daha fazla para birimi' : 'More currencies'}
        value={SECONDARY_CURRENCIES.includes(value as any) ? value : ''}
        onChange={e => e.target.value && onChange(e.target.value as SupportedCurrency)}
        className="px-3 py-2 rounded-lg text-sm font-medium border border-border/40 bg-card text-foreground cursor-pointer"
      >
        <option value="">{tr ? '+ Daha Fazla' : '+ More'}</option>
        {SECONDARY_CURRENCIES.map(c => (
          <option key={c} value={c}>{CURRENCY_FLAGS[c]} {c}</option>
        ))}
      </select>
    </div>
  );
};
