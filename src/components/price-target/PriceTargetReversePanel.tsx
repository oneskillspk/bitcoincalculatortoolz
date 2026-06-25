import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  targetNetWorth: number;
  setTargetNetWorth: (v: number) => void;
  targetPrice: number;
  setTargetPrice: (v: number) => void;
  currentHolding: number;
  setCurrentHolding: (v: number) => void;
}

const WORTH_PRESETS = [500_000, 1_000_000, 5_000_000, 10_000_000];

const formatUsd = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  return `$${(v / 1_000).toFixed(0)}k`;
};

export const PriceTargetReversePanel: React.FC<Props> = ({
  targetNetWorth, setTargetNetWorth, targetPrice, setTargetPrice, currentHolding, setCurrentHolding
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <Card className="border-border/30 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          {tr ? 'Ne Kadar BTC\'ye İhtiyacım Var?' : 'How Much BTC Do I Need?'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {tr ? 'Hedef Net Servet (USD)' : 'Target Net Worth (USD)'}
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {WORTH_PRESETS.map(p => (
              <button
                key={p}
                onClick={() => setTargetNetWorth(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  targetNetWorth === p
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border/40 hover:border-primary/40'
                }`}
              >
                {formatUsd(p)}
              </button>
            ))}
          </div>
          <Input
            type="number" inputMode="decimal"
            min={0}
            value={targetNetWorth || ''}
            onChange={e => setTargetNetWorth(parseFloat(e.target.value) || 0)}
            placeholder="1,000,000"
            className="font-mono text-lg h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {tr ? 'Hedef BTC Fiyatı (USD)' : 'Target BTC Price (USD)'}
          </Label>
          <Input
            type="number" inputMode="decimal"
            min={0}
            value={targetPrice || ''}
            onChange={e => setTargetPrice(parseFloat(e.target.value) || 0)}
            placeholder="1,000,000"
            className="font-mono text-lg h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {tr ? 'Mevcut BTC Varlığınız' : 'Current BTC Holdings'}{' '}
            <span className="text-muted-foreground">({tr ? 'isteğe bağlı' : 'optional'})</span>
          </Label>
          <Input
            type="number" inputMode="decimal"
            step="0.001"
            min={0}
            value={currentHolding || ''}
            onChange={e => setCurrentHolding(parseFloat(e.target.value) || 0)}
            placeholder="0.0"
            className="font-mono text-lg h-12"
          />
        </div>
      </CardContent>
    </Card>
  );
};
