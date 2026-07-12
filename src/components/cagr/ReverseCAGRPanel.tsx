import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Calculator, Clock } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedDecimal } from '@/utils/numberFormat';
import { InputPanel, ResultPanel, ResultHero, ResultsGrid, ResultCard, EmptyState } from '@/components/calculator';

export const ReverseCAGRPanel: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';
  const pct = (n: number, digits: number) => formatGroupedDecimal(n, digits, locale);
  const { price: liveBtcPrice } = useLiveBitcoinPrice();
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('500000');
  const [years, setYears] = useState<string>('5');

  const effectiveCurrentPrice = parseFloat(currentPrice) || liveBtcPrice;

  const result = useMemo(() => {
    const cp = effectiveCurrentPrice;
    const tp = parseFloat(targetPrice) || 0;
    const y = parseFloat(years) || 0;
    if (cp <= 0 || tp <= 0 || y <= 0) return null;

    const cagr = Math.pow(tp / cp, 1 / y) - 1;
    const monthlyRate = Math.pow(1 + cagr, 1 / 12) - 1;
    const doublingTime = cagr > 0 ? Math.log(2) / Math.log(1 + cagr) : Infinity;

    return { cagr, monthlyRate, doublingTime };
  }, [effectiveCurrentPrice, targetPrice, years]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InputPanel
          title={
            <span className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" aria-hidden />
              {tr ? 'Ters BYBÜ Girdileri' : 'Reverse CAGR Inputs'}
            </span>
          }
          description={tr
            ? "Bitcoin'in hedefinize ulaşması için gereken yıllık büyüme oranını bulun."
            : 'Find the annual growth rate Bitcoin needs to reach your target.'}
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Güncel Bitcoin Fiyatı (USD)' : 'Current Bitcoin Price (USD)'}
              </Label>
              <Input
                type="number" inputMode="decimal"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder={liveBtcPrice > 0 ? `${pct(liveBtcPrice, 0)} (${tr ? 'canlı' : 'live'})` : '85000'}
                className="font-mono text-base"
              />
              {!currentPrice && liveBtcPrice > 0 && (
                <p className="text-xs text-muted-foreground">
                  {tr ? `Canlı fiyat kullanılıyor: $${pct(liveBtcPrice, 0)}` : `Using live price: $${pct(liveBtcPrice, 0)}`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Hedef Bitcoin Fiyatı (USD)' : 'Target Bitcoin Price (USD)'}
              </Label>
              <Input
                type="number" inputMode="decimal"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="500000"
                className="font-mono text-base"
              />
              <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label={tr ? 'Hedef fiyat ön ayarları' : 'Target price presets'}>
                {[200_000, 500_000, 1_000_000, 2_000_000, 5_000_000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={targetPrice === v.toString()}
                    onClick={() => setTargetPrice(v.toString())}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      targetPrice === v.toString()
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/50'
                    }`}
                  >
                    ${v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1_000}K`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {tr ? 'Zaman Ufku (Yıl)' : 'Time Horizon (Years)'}
              </Label>
              <Input
                type="number" inputMode="decimal"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="5"
                className="font-mono text-base"
                min="1"
                max="30"
              />
              <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label={tr ? 'Yıl ön ayarları' : 'Year presets'}>
                {[2, 3, 5, 10, 15].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={years === v.toString()}
                    onClick={() => setYears(v.toString())}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      years === v.toString()
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/50'
                    }`}
                  >
                    {v}{tr ? 'y' : 'y'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </InputPanel>

        {result ? (
          <ResultPanel
            icon={<TrendingUp />}
            title={tr ? 'Gerekli Yıllık Büyüme Oranı' : 'Required Annual Growth Rate'}
            accentBar="primary"
            footer={
              <p className="calc-text-small text-muted-foreground">
                {tr
                  ? `Karşılaştırma olarak, Bitcoin'in 2013'ten bu yana tarihsel BYBÜ'sü yılda yaklaşık %60'tır. ${result.cagr > 0.6 ? "Gerekli büyüme oranı, Bitcoin'in tarihsel ortalamasını aşıyor." : "Gerekli büyüme oranı, Bitcoin'in tarihsel aralığı içindedir."}`
                  : (
                    <>
                      For comparison, Bitcoin's historical CAGR since 2013 is approximately{' '}
                      <span className="font-semibold text-foreground">60% per year</span>.{' '}
                      {result.cagr > 0.6
                        ? "The required growth rate exceeds Bitcoin's historical average."
                        : "The required growth rate is within Bitcoin's historical range."}
                    </>
                  )}
              </p>
            }
          >
            <ResultHero
              label={tr ? 'yıllık (BYBÜ)' : 'per year (CAGR)'}
              value={<span className="text-primary">{pct(result.cagr * 100, 1)}%</span>}
            />
            <ResultsGrid cols={2}>
              <ResultCard
                icon={<TrendingUp />}
                label={tr ? 'Aylık Büyüme Oranı' : 'Monthly Growth Rate'}
                value={`${pct(result.monthlyRate * 100, 2)}%`}
                sub={tr ? 'aylık' : 'per month'}
              />
              <ResultCard
                icon={<Clock />}
                label={tr ? 'İkiye Katlanma Süresi' : 'Doubling Time'}
                value={result.doublingTime === Infinity ? '∞' : `${pct(result.doublingTime, 1)} ${tr ? 'yıl' : 'yr'}`}
                sub={tr ? "Bitcoin her bu sürede ikiye katlanıyor" : 'Bitcoin doubles every'}
              />
            </ResultsGrid>
          </ResultPanel>
        ) : (
          <ResultPanel>
            <EmptyState
              icon={<TrendingUp />}
              title={tr ? 'Ters BYBÜ Hesaplayıcı' : 'Reverse CAGR Calculator'}
              description={tr
                ? 'Gerekli büyüme oranını görmek için bir hedef fiyat ve süre girin'
                : 'Enter a target price and timeframe to see the required growth rate'}
            />
          </ResultPanel>
        )}
      </div>
    </div>
  );
};
