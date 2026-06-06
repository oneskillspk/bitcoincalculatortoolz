import React, { useState, useEffect } from 'react';
import { TrendingUp, Calculator, DollarSign, Bitcoin, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollScene } from '@/components/cinematic/ScrollScene';


export const LiveCalculationDemo = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTurkish = language === 'tr';
  const { price: livePrice, isLoading } = useLiveBitcoinPrice();
  const [investment, setInvestment] = useState(1000);

  const currentPrice = livePrice > 0 ? livePrice : 0;
  const hasLivePrice = currentPrice > 0;

  const referencePrice = 94000;
  const referenceLabel = 'Jan 2025';

  useEffect(() => {
    const interval = setInterval(() => {
      setInvestment(prev => {
        const amounts = [500, 1000, 2500, 5000, 10000];
        const currentIndex = amounts.indexOf(prev);
        return amounts[(currentIndex + 1) % amounts.length];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const btcAmount = hasLivePrice ? investment / referencePrice : 0;
  const profit = hasLivePrice ? (currentPrice - referencePrice) * btcAmount : 0;

  const whatIfPath = isTurkish ? '/tr/hesaplayicilar/bitcoin-ya-olsaydi' : '/calculators/what-if';
  const dcaPath = isTurkish ? '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : '/calculators/dca';

  return (
    <section
      id="live-calculations"
      className="section-tight surface-muted rule-top rule-bottom relative overflow-hidden"
    >
      <ScrollScene as="div" reveal="fade-up" className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <span className="eyebrow eyebrow--primary justify-center">
            {isTurkish ? '01 — Canlı demo' : '01 — Live demo'}
          </span>
          <h2 className="t-h2 text-foreground mt-3 mb-3">
            {isTurkish ? 'Canlı Bitcoin Hesaplamaları' : 'Live Bitcoin Calculations'}
          </h2>
          <p className="t-lede max-w-xl mx-auto">
            {isTurkish ? 'Canlı Bitcoin verileriyle gerçek zamanlı hesaplamalar' : 'Real-time calculations with live Bitcoin data'}
          </p>
          {isLoading && (
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {isTurkish ? 'Canlı veri yükleniyor...' : 'Loading live data...'}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card-editorial p-5 sm:p-7 md:p-8 relative">

            {!hasLivePrice && !isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
                <div className="flex items-center gap-3 text-center px-4">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">
                    {isTurkish
                      ? 'Canlı fiyat verisi alınamadı. Bağlantınızı kontrol edin.'
                      : 'Unable to fetch live price data. Please check your connection.'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-2 min-h-[44px]"
                >
                  {isTurkish ? 'Tekrar Dene' : 'Retry'}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4 md:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
                  {/* Live Price */}
                  <div className="text-center pt-4 sm:pt-0 first:pt-0 sm:px-2">
                    <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
                      <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {isTurkish ? 'Canlı Fiyat' : 'Live Price'}
                      </span>
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-sm shadow-green-500/50" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-foreground motion-safe:animate-counter-up break-words" key={currentPrice}>
                      {hasLivePrice ? `$${currentPrice.toLocaleString()}` : '...'}
                    </div>
                  </div>

                  {/* Investment Amount */}
                  <div className="text-center pt-4 sm:pt-0 sm:px-2">
                    <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {isTurkish ? 'Yatırım' : 'Investment'}
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-foreground motion-safe:animate-counter-up" key={investment}>
                      ${investment.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                      {hasLivePrice ? `≈ ${(investment / currentPrice).toFixed(6)} BTC` : '...'}
                    </div>
                  </div>

                  {/* Profit/Loss */}
                  <div className="text-center pt-4 sm:pt-0 sm:px-2">
                    <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {isTurkish ? `${referenceLabel} K/Z` : `P&L since ${referenceLabel}`}
                      </span>
                    </div>
                    <div
                      className={`text-xl sm:text-2xl md:text-3xl font-bold font-mono motion-safe:animate-counter-up ${
                        profit >= 0 ? 'text-success' : 'text-destructive'
                      }`}
                      key={profit}
                    >
                      {hasLivePrice ? `${profit >= 0 ? '+' : ''}$${Math.abs(profit).toFixed(0)}` : '...'}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                      {hasLivePrice ? `${((profit / investment) * 100).toFixed(1)}% ROI` : '...'}
                    </div>
                  </div>
                </div>

                {/* Calculation Flow */}
                <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-primary/10 rounded-full px-2.5 sm:px-3 py-1 motion-safe:animate-counter-up">
                    <span className="text-xs sm:text-sm font-mono">${investment}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/40 animate-pulse" />
                  <div className="flex items-center gap-2 bg-success/10 rounded-full px-2.5 sm:px-3 py-1 motion-safe:animate-counter-up motion-safe:animate-stagger-2">
                    <span className="text-xs sm:text-sm font-mono">÷ ${(referencePrice / 1000).toFixed(0)}k ({referenceLabel})</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/40 animate-pulse" />
                  <div className="flex items-center gap-2 bg-muted rounded-full px-2.5 sm:px-3 py-1 motion-safe:animate-counter-up motion-safe:animate-stagger-4">
                    <span className="text-xs sm:text-sm font-mono">× ${hasLivePrice ? currentPrice.toLocaleString() : '...'}</span>
                  </div>
                </div>
              </>
            )}

            {/* Compact Call to Action */}
            <div className="mt-6 sm:mt-8 text-center">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate(whatIfPath)}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 font-medium rounded-lg"
                >
                  {isTurkish ? 'Ya Olsaydı Hesaplayıcısı' : 'What-If Calculator'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(dcaPath)}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 font-medium rounded-lg"
                >
                  {isTurkish ? 'DCA Hesaplayıcısı' : 'DCA Calculator'}
                  <Calculator className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollScene>
    </section>
  );
};
