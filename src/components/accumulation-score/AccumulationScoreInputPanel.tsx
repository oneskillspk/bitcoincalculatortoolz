import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Bitcoin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  age: number;
  holdings: number;
  onAgeChange: (age: number) => void;
  onHoldingsChange: (btc: number) => void;
}

const AGE_MILESTONES = [
  { age: 18, label: '18' },
  { age: 25, label: '25' },
  { age: 30, label: '30' },
  { age: 40, label: '40' },
  { age: 50, label: '50' },
  { age: 65, label: '65' },
];

export const AccumulationScoreInputPanel = ({ age, holdings, onAgeChange, onHoldingsChange }: Props) => {
  const { language, t } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-base font-semibold">
          <User className="w-4 h-4 text-primary" aria-hidden />
          {tr ? 'Yaşınız' : 'Your Age'}
        </Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              value={[age]}
              onValueChange={(v) => onAgeChange(v[0])}
              min={13}
              max={83}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2">
              {AGE_MILESTONES.map((m) => (
                <button
                  key={m.age}
                  type="button"
                  aria-pressed={age === m.age}
                  aria-label={tr ? `Yaş ${m.age}` : `Age ${m.age}`}
                  onClick={() => onAgeChange(m.age)}
                  className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                    age === m.age
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-20">
            <Input
              type="number" inputMode="decimal"
              value={age}
              aria-label={t('aria.age')}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && v >= 13 && v <= 83) onAgeChange(v);
              }}
              className="text-center font-bold text-lg"
              min={13}
              max={83}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-semibold">
          <Bitcoin className="w-4 h-4 text-primary" />
          {tr ? 'Bitcoin Varlıklarınız (BTC)' : 'Your Bitcoin Holdings (BTC)'}
        </Label>
        <Input
          type="number" inputMode="decimal"
          value={holdings || ''}
          onChange={(e) => onHoldingsChange(parseFloat(e.target.value) || 0)}
          placeholder={tr ? 'ör. 0.5' : 'e.g. 0.5'}
          step="0.0001"
          min={0}
          className="text-lg font-mono"
        />
        <p className="text-xs text-muted-foreground">
          {tr
            ? 'Tüm cüzdan ve borsalardaki toplam BTC miktarınızı girin. Verileriniz tarayıcınızda kalır — biz asla görmeyiz.'
            : 'Enter your total BTC across all wallets and exchanges. Your data stays in your browser — we never see it.'}
        </p>
      </div>
    </div>
  );
};
