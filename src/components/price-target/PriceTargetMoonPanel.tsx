import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, TrendingUp, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedDecimal } from '@/utils/numberFormat';
import { InputPanel, ResultPanel, ResultHero, ResultsGrid, ResultCard, EmptyState } from '@/components/calculator';

interface PriceTargetMoonPanelProps {
  liveBtcPrice: number;
}

const fmt = (v: number, dec = 2, locale = 'en-US') => formatGroupedDecimal(v, dec, locale);

const GOLD_MARKET_CAP = 18_000_000_000_000;
const APPLE_MARKET_CAP = 3_500_000_000_000;
const BTC_CIRCULATING = 19_800_000;

export const PriceTargetMoonPanel: React.FC<PriceTargetMoonPanelProps> = ({ liveBtcPrice }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  const [btcHoldings, setBtcHoldings] = useState(0.5);
  const [wealthGoal, setWealthGoal] = useState(500_000);

  const result = useMemo(() => {
    if (btcHoldings <= 0 || wealthGoal <= 0) return null;
    const moonPrice = wealthGoal / btcHoldings;
    const multiplier = liveBtcPrice > 0 ? moonPrice / liveBtcPrice : 0;
    const marketCap = moonPrice * BTC_CIRCULATING;
    const vsGold = marketCap / GOLD_MARKET_CAP;
    const vsApple = marketCap / APPLE_MARKET_CAP;
    return { moonPrice, multiplier, marketCap, vsGold, vsApple };
  }, [btcHoldings, wealthGoal, liveBtcPrice]);

  const getMarketCapContext = () => {
    if (!result) return '';
    if (result.marketCap < APPLE_MARKET_CAP) {
      return tr
        ? `Bu, Apple'ın güncel piyasa değerinin (~3,5T$) ${result.vsApple.toFixed(1)}×'i`
        : `That is ${result.vsApple.toFixed(1)}× Apple's current market cap (~$3.5T)`;
    }
    if (result.marketCap < GOLD_MARKET_CAP) {
      return tr
        ? `Bu, güncel altın piyasa değerinin (~18T$) ${result.vsGold.toFixed(2)}×'i`
        : `That is ${result.vsGold.toFixed(2)}× the current gold market cap (~$18T)`;
    }
    return tr
      ? `Bu, güncel altın piyasa değerinin (~18T$) ${result.vsGold.toFixed(1)}×'i`
      : `That is ${result.vsGold.toFixed(1)}× the current gold market cap (~$18T)`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <InputPanel
        title={
          <span className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            {tr ? 'Ay Hesaplayıcı' : 'Moon Calculator'}
          </span>
        }
        description={tr
          ? "Stack'inizin servet hedefinize ulaşmasını sağlayan BTC fiyatını bulun."
          : 'Find the BTC price that makes your stack hit your wealth goal.'}
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {tr ? 'Bitcoin Varlığım (BTC)' : 'My Bitcoin Holdings (BTC)'}
            </Label>
            <Input
              type="number" inputMode="decimal"
              value={btcHoldings || ''}
              onChange={(e) => setBtcHoldings(parseFloat(e.target.value) || 0)}
              placeholder="0.5"
              className="font-mono text-base"
              step="0.01"
              min="0.00000001"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {tr ? 'Servet Hedefim (USD)' : 'My Wealth Goal (USD)'}
            </Label>
            <Input
              type="number" inputMode="decimal"
              value={wealthGoal || ''}
              onChange={(e) => setWealthGoal(parseFloat(e.target.value) || 0)}
              placeholder="500000"
              className="font-mono text-base"
              step="1000"
              min="1"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {[100_000, 500_000, 1_000_000, 5_000_000, 10_000_000].map((v) => (
                <button
                  key={v}
                  onClick={() => setWealthGoal(v)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    wealthGoal === v
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/50'
                  }`}
                >
                  ${v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1_000}K`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </InputPanel>

      {result ? (
        <ResultPanel
          icon={<Moon />}
          title={tr ? 'Ay Fiyatınız' : 'Your Moon Price'}
          accentBar="primary"
        >
          <ResultHero
            label={tr ? 'BTC başına' : 'per BTC'}
            value={<span className="text-primary">${fmt(result.moonPrice, 0, locale)}</span>}
          />
          <ResultsGrid cols={2}>
            <ResultCard
              icon={<TrendingUp />}
              label={tr ? 'Gerekli Çarpan' : 'Required Multiplier'}
              value={`${result.multiplier.toFixed(1)}×`}
              sub={tr ? 'güncel fiyattan' : 'from current price'}
              tone="primary"
            />
            <ResultCard
              icon={<Globe />}
              label={tr ? 'Gerekli Piyasa Değeri' : 'Required Market Cap'}
              value={`$${result.marketCap >= 1e12 ? `${(result.marketCap / 1e12).toFixed(1)}T` : `${(result.marketCap / 1e9).toFixed(0)}B`}`}
              sub={getMarketCapContext()}
              tone="primary"
            />
          </ResultsGrid>
        </ResultPanel>
      ) : (
        <ResultPanel>
          <EmptyState
            icon={<Moon />}
            title={tr ? 'Ay Fiyatınızı Bulun' : 'Find Your Moon Price'}
            description={tr
              ? 'Hesaplamak için BTC varlığınızı ve servet hedefinizi girin'
              : 'Enter your BTC holdings and wealth goal to calculate'}
          />
        </ResultPanel>
      )}
    </div>
  );
};
