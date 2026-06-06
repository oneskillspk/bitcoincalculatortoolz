import { useState, useEffect, type RefObject } from 'react';
import { TrendingUp, DollarSign, BarChart3, Home, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from "@/components/LocalizedLink";
import { assetComparisonService } from '@/services/assetComparisonService';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';
import { useNumberCounter } from '@/hooks/useNumberCounter';
import { useLanguage } from '@/contexts/LanguageContext';


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

interface AssetCardProps {
  asset: HistoricalAssetMetrics;
  index: number;
  isBitcoin?: boolean;
  topBadgeLabel: string;
  annualReturnLabel: string;
  totalReturnLabel: string;
  bestYearLabel: string;
  volatilityLabel: string;
  annualLabel: string;
}

const AssetCard = ({
  asset,
  index,
  isBitcoin = false,
  topBadgeLabel,
  annualReturnLabel,
  totalReturnLabel,
  bestYearLabel,
  volatilityLabel,
  annualLabel,
}: AssetCardProps) => {
  const { ref, isVisible } = useIntersectionAnimation({ threshold: 0.2 });
  const annualizedCounter = useNumberCounter({ end: asset.annualizedReturn, duration: 1200, isActive: isVisible, decimals: 2 });
  const totalCounter = useNumberCounter({ end: asset.totalReturn, duration: 1200, isActive: isVisible, decimals: 2 });

  const getIcon = () => {
    if (isBitcoin) return <TrendingUp className="w-6 h-6" />;
    if (asset.symbol === 'SPX') return <BarChart3 className="w-6 h-6" />;
    if (asset.symbol === 'GLD') return <DollarSign className="w-6 h-6" />;
    return <Home className="w-6 h-6" />;
  };

  const getGradient = () => {
    if (isBitcoin) return 'from-primary via-primary to-primary';
    if (asset.symbol === 'SPX') return 'from-blue-500 via-cyan-500 to-blue-600';
    if (asset.symbol === 'GLD') return 'from-primary via-primary to-primary';
    return 'from-purple-500 via-pink-500 to-purple-600';
  };

  const volatilityColor = () => {
    if (asset.volatility > 50) return 'text-primary';
    if (asset.volatility > 20) return 'text-blue-600';
    return 'text-success';
  };

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className="group relative bg-card border border-border/40 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-primary/30 hover:border-primary/40 transition-colors duration-200"
      style={{
        animationDelay: `${index * 100}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getGradient()} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />

      {isBitcoin && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-primary text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-md">
          <Rocket className="w-2.5 h-2.5 md:w-3 md:h-3" />
          {topBadgeLabel}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-5">
          <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300`}>
            {getIcon()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-h3 text-foreground truncate">{asset.name}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{asset.symbol}</p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 mb-4 md:mb-5">
          <div>
            <div className="text-xs md:text-sm text-muted-foreground/80 mb-1">{annualReturnLabel}</div>
            <div className={`font-bold text-2xl md:text-3xl bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent leading-tight`}>
              {annualizedCounter > 0 ? '+' : ''}{annualizedCounter.toFixed(2)}%
            </div>
          </div>

          <div className="pt-3 border-t border-border/30">
            <div className="text-xs md:text-sm text-muted-foreground/80 mb-1">{totalReturnLabel}</div>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              {totalCounter > 0 ? '+' : ''}{totalCounter.toFixed(0)}%
            </div>
            {asset.period && (
              <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{asset.period}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:gap-3 pt-3 md:pt-4 border-t border-border/30">
          <div>
            <div className="text-[10px] md:text-xs text-muted-foreground/70 mb-0.5">{bestYearLabel}</div>
            <div className="text-xs md:text-sm font-semibold text-success">
              +{asset.bestYear.return.toFixed(0)}%
            </div>
            {asset.bestYear.year && (
              <div className="text-[9px] md:text-[10px] text-muted-foreground">{asset.bestYear.year}</div>
            )}
          </div>
          <div>
            <div className="text-[10px] md:text-xs text-muted-foreground/70 mb-0.5">{volatilityLabel}</div>
            <div className={`text-xs md:text-sm font-semibold ${volatilityColor()}`}>
              {asset.volatility.toFixed(0)}%
            </div>
            <div className="text-[9px] md:text-[10px] text-muted-foreground">{annualLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UltraModernAssetComparison = () => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<HistoricalAveragesData | null>(null);
  const [loading, setLoading] = useState(true);
  const { ref: headerRef, isVisible: _headerVisible } = useIntersectionAnimation({ threshold: 0.1 });

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
      <section className="py-12 md:py-16 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="animate-pulse space-y-8">
            <div className="text-center mb-10">
              <div className="h-10 bg-muted/20 rounded-lg max-w-md mx-auto mb-4" />
              <div className="h-6 bg-muted/20 rounded-lg max-w-2xl mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 max-w-6xl mx-auto">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-72 bg-muted/20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const outperformanceVsSP500 = data.bitcoin.annualizedReturn > 0 && data.sp500.annualizedReturn > 0
    ? (data.bitcoin.annualizedReturn / data.sp500.annualizedReturn).toFixed(1)
    : '0';

  const cardProps = {
    topBadgeLabel: t('comparison.topBadge'),
    annualReturnLabel: t('comparison.annualReturn'),
    totalReturnLabel: t('comparison.totalReturn'),
    bestYearLabel: t('comparison.bestYear'),
    volatilityLabel: t('comparison.volatility'),
    annualLabel: t('comparison.annual'),
  };

  return (
    <>
      <section className="py-8 md:py-12 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary-rgb),0.03)_0%,transparent_50%)]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header */}
          <div ref={headerRef as RefObject<HTMLDivElement>} className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <h2 className="text-h2 font-bold text-foreground mb-3 md:mb-4">
              {t('comparison.title')}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground/80 mb-2">
              {t('comparison.subtitle')}
            </p>
            {data.bitcoin.period && (
              <p className="text-xs md:text-sm text-muted-foreground">
                {t('comparison.period')} {data.bitcoin.period}
              </p>
            )}
          </div>

          {/* Asset Grid */}
          <div className="max-w-6xl mx-auto mb-8 md:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              <AssetCard asset={data.bitcoin} index={0} isBitcoin {...cardProps} />
              <AssetCard asset={data.sp500} index={1} {...cardProps} />
              <AssetCard asset={data.gold} index={2} {...cardProps} />
              <AssetCard asset={data.realestate} index={3} {...cardProps} />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="max-w-2xl mx-auto mb-10 md:mb-12">
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{outperformanceVsSP500}×</div>
                <div className="text-[10px] md:text-xs text-muted-foreground">{t('comparison.vsSP500')}</div>
              </div>
              <div className="text-center border-x border-border/40">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">10</div>
                <div className="text-[10px] md:text-xs text-muted-foreground">{t('comparison.yearsData')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">100%</div>
                <div className="text-[10px] md:text-xs text-muted-foreground">{t('comparison.realData')}</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mb-8 md:mb-10">
            <Button asChild size="lg" className="rounded-md px-6 md:px-8 h-11 md:h-12 font-medium">
              <Link to={whatIfPath}>{t('comparison.cta')}</Link>
            </Button>
          </div>

        </div>
      </section>
    </>
  );
};
