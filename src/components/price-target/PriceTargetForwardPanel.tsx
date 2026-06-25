import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  btcAmount: number;
  setBtcAmount: (v: number) => void;
  targetPrice: number;
  setTargetPrice: (v: number) => void;
}

const PRESETS = [250_000, 500_000, 1_000_000, 5_000_000];

const formatPrice = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  return `$${(v / 1_000).toFixed(0)}k`;
};

export const PriceTargetForwardPanel: React.FC<Props> = ({ btcAmount, setBtcAmount, targetPrice, setTargetPrice }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <Card className="border-border/30 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          {tr ? 'Stack\'im Ne Kadar Edecek?' : 'What Will My Stack Be Worth?'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="btc-amount" className="text-sm font-medium">
            {tr ? 'Sahip Olduğunuz BTC' : 'BTC You Own'}
          </Label>
          <Input
            id="btc-amount"
            type="number" inputMode="decimal"
            step="0.001"
            min={0}
            value={btcAmount || ''}
            onChange={e => setBtcAmount(parseFloat(e.target.value) || 0)}
            placeholder="0.5"
            className="font-mono text-lg h-12"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{tr ? 'Hedef BTC Fiyatı' : 'Target BTC Price'}</Label>
            <span className="text-lg font-bold text-primary font-mono">{formatPrice(targetPrice)}</span>
          </div>
          <Slider
            value={[targetPrice]}
            onValueChange={([v]) => setTargetPrice(v)}
            min={100_000}
            max={10_000_000}
            step={50_000}
            className="py-2"
          />
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => setTargetPrice(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  targetPrice === p
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border/40 hover:border-primary/40'
                }`}
              >
                {formatPrice(p)}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
