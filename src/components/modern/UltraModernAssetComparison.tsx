import { useState, useEffect, type RefObject } from 'react';
import { TrendingUp, DollarSign, BarChart3, Home, ArrowUpRight } from 'lucide-react';
import { Link } from "@/components/LocalizedLink";
import { assetComparisonService } from '@/services/assetComparisonService';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import { useNumberCounter } from '@/hooks/useNumberCounter';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionTerminalStrip } from '@/components/cinematic/SectionTerminalStrip';
import { SectionHeading } from '@/components/calculator/SectionHeading';

interface HistoricalAssetMetrics {
  name: string;
  symbol: string;
  annualizedReturn: number;
  totalReturn: number;
  bestYear: { year: string; return: number };
  worstYear: { year: string; return: number };
  volatility: number;
  period: string;
}

interface HistoricalAveragesData {
  bitcoin: HistoricalAssetMetrics;
  sp500: HistoricalAssetMetrics;
  gold: HistoricalAssetMetrics;
  realestate: HistoricalAssetMetrics;
}

interface AssetRowProps {
  asset: HistoricalAssetMetrics;
  index: number;
  isBitcoin?: boolean;
  annualLabel: string;
  totalLabel: string;
  bestLabel: string;
  volLabel: string;
}

const iconFor = (symbol: string, isBitcoin: boolean) => {
  if (isBitcoin) return <TrendingUp className="w-[18px] h-[18px]" strokeWidth={1.5} />;
  if (symbol === 'SPX') return <BarChart3 className="w-[18px] h-[18px]" strokeWidth={1.5} />;
  if (symbol === 'GLD') return <DollarSign className="w-[18px] h-[18px]" strokeWidth={1.5} />;
  return <Home className="w-[18px] h-[18px]" strokeWidth={1.5} />;
};

const prefersStatic = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (document.documentElement.getAttribute('data-perf') === 'low') return true;
  return false;
};

const AssetRow = ({ asset, index, isBitcoin = false, annualLabel, totalLabel, bestLabel, volLabel }: AssetRowProps) => {
  const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.2 });
  const staticMode = prefersStatic();
  const active = staticMode ? true : isVisible;
  const annualizedCounter = useNumberCounter({ end: asset.annualizedReturn, duration: 1200, isActive: active, decimals: 2 });
  const totalCounter = useNumberCounter({ end: asset.totalReturn, duration: 1200, isActive: active, decimals: 0 });

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`grid grid-cols-12 gap-3 items-center px-4 sm:px-5 py-4 transition-opacity duration-300 ${
        isBitcoin ? 'bg-primary/[0.04]' : ''
      }`}
      style={{
        opacity: active ? 1 : 0,
        transitionDelay: staticMode ? '0ms' : `${index * 60}ms`,
      }}
    >

      {/* Symbol + name */}
      <div className="col-span-12 sm:col-span-4 flex items-center gap-3 min-w-0">
        {isBitcoin && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden />
        )}
        <div className="w-9 h-9 rounded-lg border border-border/60 bg-background flex items-center justify-center text-foreground/80 shrink-0">
          {iconFor(asset.symbol, isBitcoin)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[14.5px] text-foreground tracking-[-0.01em] truncate">
            {asset.name}
          </div>
          <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-muted-foreground">
            {asset.symbol}
          </div>
        </div>
      </div>

      {/* Annual return */}
      <div className="col-span-6 sm:col-span-3 sm:text-right">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground sm:hidden mb-0.5">{annualLabel}</div>
        <div className={`font-mono text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] ${isBitcoin ? 'text-primary' : 'text-foreground'}`}>
          {annualizedCounter > 0 ? '+' : ''}{annualizedCounter.toFixed(2)}%
        </div>
        <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground mt-0.5 hidden sm:block">{annualLabel}</div>
      </div>

      {/* Total return */}
      <div className="col-span-6 sm:col-span-3 sm:text-right">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground sm:hidden mb-0.5">{totalLabel}</div>
        <div className="font-mono text-[15px] sm:text-[16px] font-semibold text-foreground tracking-[-0.01em]">
          {totalCounter > 0 ? '+' : ''}{totalCounter.toFixed(0)}%
        </div>
        <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground mt-0.5 hidden sm:block">{totalLabel}</div>
      </div>

      {/* Best year + vol */}
      <div className="col-span-12 sm:col-span-2 grid grid-cols-2 sm:flex sm:flex-col sm:items-end gap-2 sm:gap-0.5 pt-3 sm:pt-0 border-t sm:border-0 border-border/40">
        <div className="sm:text-right">
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">{bestLabel} </span>
          <span className="font-mono text-[12px] font-semibold text-foreground">+{asset.bestYear.return.toFixed(0)}%</span>
        </div>
        <div className="sm:text-right">
          <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">{volLabel} </span>
          <span className="font-mono text-[12px] font-semibold text-foreground">{asset.volatility.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export const UltraModernAssetComparison = () => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<HistoricalAveragesData | null>(null);
  const [loading, setLoading] = useState(true);

  const isTurkish = language === 'tr';
  const whatIfPath = isTurkish ? '/tr/hesaplayicilar/bitcoin-ya-olsaydi' : '/calculators/what-if';

  useEffect(() => {
    const loadData = async () => {
      try {
        const historicalData = await assetComparisonService.getHistoricalAverages();
        setData(historicalData);
      } catch (error) {
        console.error('Failed to load asset comparison data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-10 md:py-14 border-t border-border/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto animate-pulse">
            <div className="h-8 bg-muted/30 rounded max-w-md mb-3" />
            <div className="h-4 bg-muted/20 rounded max-w-2xl mb-8" />
            <div className="h-[380px] bg-muted/20 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const outperformanceVsSP500 = data.bitcoin.annualizedReturn > 0 && data.sp500.annualizedReturn > 0
    ? (data.bitcoin.annualizedReturn / data.sp500.annualizedReturn).toFixed(1)
    : '0';

  const rowProps = {
    annualLabel: t('comparison.annualReturn'),
    totalLabel: t('comparison.totalReturn'),
    bestLabel: t('comparison.bestYear'),
    volLabel: t('comparison.volatility'),
  };

  return (
    <section className="relative py-10 md:py-14 border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow={isTurkish ? 'SEC-05 · KARŞILAŞTIRMA' : 'SEC-05 · COMPARISON'}
            title={t('comparison.title')}
            description={t('comparison.subtitle')}
            className="mb-8"
          />

          <article className="bg-card border border-border/70 rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
            <SectionTerminalStrip
              moduleId="COMP-01"
              context={isTurkish ? 'VARLIK vs BTC' : 'ASSET vs BTC'}
              status={data.bitcoin.period || (isTurkish ? '10 YIL' : '10Y')}
              className="border-t-0"
            />

            {/* Column header — desktop only */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-4 sm:px-5 py-2.5 border-b border-border/60 bg-background/30 font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              <div className="col-span-4">{isTurkish ? 'VARLIK' : 'ASSET'}</div>
              <div className="col-span-3 text-right">{t('comparison.annualReturn')}</div>
              <div className="col-span-3 text-right">{t('comparison.totalReturn')}</div>
              <div className="col-span-2 text-right">{isTurkish ? 'EN İYİ · VOL' : 'BEST · VOL'}</div>
            </div>

            <div className="divide-y divide-border/60">
              <AssetRow asset={data.bitcoin} index={0} isBitcoin {...rowProps} />
              <AssetRow asset={data.sp500} index={1} {...rowProps} />
              <AssetRow asset={data.gold} index={2} {...rowProps} />
              <AssetRow asset={data.realestate} index={3} {...rowProps} />
            </div>

            {/* Metrics rail */}
            <div className="grid grid-cols-3 divide-x divide-border/60 border-t border-border/60 bg-background/30">
              <div className="px-4 py-4 text-center">
                <div className="font-mono text-[20px] sm:text-[22px] font-semibold text-foreground tracking-[-0.02em]">{outperformanceVsSP500}×</div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mt-1">{t('comparison.vsSP500')}</div>
              </div>
              <div className="px-4 py-4 text-center">
                <div className="font-mono text-[20px] sm:text-[22px] font-semibold text-foreground tracking-[-0.02em]">10</div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mt-1">{t('comparison.yearsData')}</div>
              </div>
              <div className="px-4 py-4 text-center">
                <div className="font-mono text-[20px] sm:text-[22px] font-semibold text-foreground tracking-[-0.02em]">100%</div>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mt-1">{t('comparison.realData')}</div>
              </div>
            </div>

            <footer className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border/60 bg-background/30">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground">
                {t('comparison.period')} {data.bitcoin.period}
              </span>
              <Link
                to={whatIfPath}
                className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] sm:min-h-0"
              >
                {t('comparison.cta')}
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
              </Link>
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
};
