import { Input } from '@/components/ui/input';
import { SupportedCurrency, CURRENCY_SYMBOLS } from '@/services/zakatCalculator';
import { Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  debts: number;
  onChange: (v: number) => void;
  currency: SupportedCurrency;
}

export const ZakatDeductionsPanel = ({ debts, onChange, currency }: Props) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const sym = CURRENCY_SYMBOLS[currency];

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">
        {tr ? 'Adım 4 — Kesintiler' : 'Step 4 — Deductions'}
      </h3>
      <label className="text-sm text-muted-foreground">
        {tr ? `Önümüzdeki 12 ay içinde ödenecek borçlar (${currency})` : `Debts due within 12 months (${currency})`}
      </label>
      <Input
        type="number" inputMode="decimal"
        min="0"
        value={debts || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        placeholder={`${sym}0`}
        className="max-w-[250px]"
      />
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
        <p>
          {tr
            ? `Yalnızca önümüzdeki 12 ay içinde vadesi gelen borçları düşün — toplam ipotek bakiyesini değil. Örneğin, yıllık ipotek ödemeniz ${sym}500.000 ise ${sym}500.000 düşün, toplam kredi tutarını değil.`
            : `Deduct only debts due within the next 12 months — not the full mortgage balance. E.g., if your annual mortgage payment is ${sym}500,000, deduct ${sym}500,000 — not the total loan amount.`}
        </p>
      </div>
    </div>
  );
};
