import React, { useState, useEffect } from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { ArrowUpRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollScene } from '@/components/cinematic/ScrollScene';
import { SectionTerminalStrip } from '@/components/cinematic/SectionTerminalStrip';
import { SectionHeading } from '@/components/calculator/SectionHeading';

/**
 * Instrument Panel skin — matches PremiumCalculatorCards language.
 * Mono metadata rails, hairline borders, single ember accent.
 */
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
      className="relative py-12 md:py-20 border-y border-border/60"
    >
      <ScrollScene as="div" reveal="fade-up" className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow={isTurkish ? 'CANLI VERİ' : 'LIVE FEED'}
            title={isTurkish ? 'Canlı Bitcoin Hesaplamaları' : 'Live Bitcoin Calculations'}
            description={isTurkish ? 'Canlı Bitcoin verileriyle gerçek zamanlı hesaplamalar.' : 'Real-time calculations powered by live Bitcoin data.'}
            className="mb-8"
          />

          <article className="bg-card border border-border/70 rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
            <SectionTerminalStrip
              moduleId="LIVE"
              context="BTC/USD"
              status={isTurkish ? (isLoading ? 'YÜKLENİYOR' : 'CANLI') : (isLoading ? 'LOADING' : 'LIVE')}
              pulse
              className="border-t-0"
            />

            <div className="p-5 sm:p-7 md:p-8">
              {!hasLivePrice && !isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
                  <div className="flex items-center gap-3 text-center px-4">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm">
                      {isTurkish ? 'Canlı fiyat verisi alınamadı.' : 'Unable to fetch live price data.'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-2 min-h-[44px]">
                    {isTurkish ? 'Tekrar Dene' : 'Retry'}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                    {/* Live Price */}
                    <div className="px-0 sm:px-5 py-5 sm:py-0 first:pt-0">
                      <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
                        {isTurkish ? 'CANLI · BTC' : 'LIVE · BTC'}
                      </div>
                      <div className="text-2xl md:text-3xl font-semibold font-mono text-foreground tracking-[-0.02em]" key={currentPrice}>
                        {hasLivePrice ? `$${formatGroupedInt(currentPrice)}` : '...'}
                      </div>
                      <div className="text-[12px] text-muted-foreground mt-1.5">
                        {isTurkish ? 'gerçek zamanlı' : 'real-time price'}
                      </div>
                    </div>

                    {/* Investment */}
                    <div className="px-0 sm:px-5 py-5 sm:py-0">
                      <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
                        {isTurkish ? 'YATIRIM' : 'INVESTMENT'}
                      </div>
                      <div className="text-2xl md:text-3xl font-semibold font-mono text-foreground tracking-[-0.02em]" key={investment}>
                        ${formatGroupedInt(investment)}
                      </div>
                      <div className="text-[12px] text-muted-foreground mt-1.5 font-mono">
                        {hasLivePrice ? `≈ ${(investment / currentPrice).toFixed(6)} BTC` : '...'}
                      </div>
                    </div>

                    {/* P&L */}
                    <div className="px-0 sm:px-5 py-5 sm:py-0">
                      <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
                        {isTurkish ? `K/Z · ${referenceLabel}` : `P&L · ${referenceLabel}`}
                      </div>
                      <div
                        className={`text-2xl md:text-3xl font-semibold font-mono tracking-[-0.02em] ${profit >= 0 ? 'text-foreground' : 'text-destructive'}`}
                        key={profit}
                      >
                        {hasLivePrice ? `${profit >= 0 ? '+' : ''}$${Math.abs(profit).toFixed(0)}` : '...'}
                      </div>
                      <div className="text-[12px] text-muted-foreground mt-1.5 font-mono">
                        {hasLivePrice ? `${((profit / investment) * 100).toFixed(1)}% ROI` : '...'}
                      </div>
                    </div>
                  </div>

                  {/* Calc trace */}
                  <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[11px] sm:text-[12px] text-muted-foreground">
                    <span className="text-foreground">${investment}</span>
                    <span aria-hidden="true" className="text-muted-foreground">÷</span>
                    <span>${(referencePrice / 1000).toFixed(0)}k <span className="text-muted-foreground">({referenceLabel})</span></span>
                    <span aria-hidden="true" className="text-muted-foreground">×</span>
                    <span className="text-foreground">${hasLivePrice ? formatGroupedInt(currentPrice) : '...'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer rail */}
            <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-5 py-3 border-t border-border/60 bg-background/30">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground">
                {isTurkish ? 'AKIŞ · 30s yenileme' : 'STREAM · 30s refresh'}
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <button
                  onClick={() => navigate(whatIfPath)}
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] sm:min-h-0"
                >
                  {isTurkish ? 'YA OLSAYDI' : 'WHAT-IF'}
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => navigate(dcaPath)}
                  className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] sm:min-h-0"
                >
                  DCA
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
                </button>
              </div>
            </footer>
          </article>
        </div>
      </ScrollScene>
    </section>
  );
};
