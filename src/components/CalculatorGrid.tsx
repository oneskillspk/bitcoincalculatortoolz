import { useState } from "react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "@/components/LocalizedLink";
import { getLocalizedPath } from "@/utils/localizedRoutes";
import { 
  Calculator, TrendingUp, Target, PiggyBank, Pickaxe, DollarSign, BarChart3, Clock,
  Zap, TrendingDown, ArrowRight, GitCompare, Receipt, ShoppingCart, Activity, Wifi,
  Skull, Hourglass, ArrowUpDown, LineChart, Wallet, Gauge, Rainbow, Crown, Landmark,
  Percent, Coins, Search, Scale, Home, Ruler, Moon, Briefcase
} from "lucide-react";

type Category = 'All' | 'Investment' | 'Strategy' | 'Tax & Fees' | 'Market Analysis' | 'Mining & Network' | 'Historical';

const categories: Category[] = ['All', 'Investment', 'Strategy', 'Tax & Fees', 'Market Analysis', 'Mining & Network', 'Historical'];

const TR_CATEGORY_LABELS: Record<Category, string> = {
  'All': 'Tümü',
  'Investment': 'Yatırım',
  'Strategy': 'Strateji',
  'Tax & Fees': 'Vergi ve Ücretler',
  'Market Analysis': 'Piyasa Analizi',
  'Mining & Network': 'Madencilik ve Ağ',
  'Historical': 'Tarihsel',
};

const calculators = [
  { id: 'what-if', titleKey: 'calculators.whatif.title', descKey: 'calculators.whatif.desc', icon: Calculator, available: true, featured: true, category: 'Investment' as Category },
  { id: 'retirement', titleKey: 'calculators.retirement.title', descKey: 'calculators.retirement.desc', icon: PiggyBank, available: true, featured: true, category: 'Investment' as Category },
  { id: 'dca', titleKey: 'calculators.dca.title', descKey: 'calculators.dca.desc', icon: TrendingUp, available: true, featured: true, category: 'Investment' as Category },
  { id: 'lump-sum-vs-dca', titleKey: 'calculators.lumpSumVsDca.title', descKey: 'calculators.lumpSumVsDca.desc', icon: GitCompare, available: true, featured: true, category: 'Investment' as Category },
  { id: 'capital-gains-tax', titleKey: 'calculators.taxCalculator.title', descKey: 'calculators.taxCalculator.desc', icon: Receipt, available: true, featured: true, category: 'Tax & Fees' as Category },
  { id: 'stack-sats', titleKey: 'calculators.stackSats.title', descKey: 'calculators.stackSats.desc', icon: Target, available: true, featured: true, category: 'Strategy' as Category },
  { id: 'purchasing-power', titleKey: 'calculators.purchasingPower.title', descKey: 'calculators.purchasingPower.desc', icon: ShoppingCart, available: true, featured: false, category: 'Strategy' as Category },
  { id: 'transaction-fees', titleKey: 'calculators.transactionFees.title', descKey: 'calculators.transactionFees.desc', icon: Wifi, available: true, featured: false, category: 'Tax & Fees' as Category },
  { id: 'inflation-dashboard', titleKey: 'calculators.inflationDashboard.title', descKey: 'calculators.inflationDashboard.desc', icon: Activity, available: true, featured: false, category: 'Historical' as Category },
  { id: 'obituaries-tracker', titleKey: 'calculators.obituariesTracker.title', descKey: 'calculators.obituariesTracker.desc', icon: Skull, available: true, featured: false, category: 'Historical' as Category },
  { id: 'leverage-liquidation', titleKey: 'calculators.leverageLiquidation.title', descKey: 'calculators.leverageLiquidation.desc', icon: TrendingDown, available: true, featured: false, category: 'Strategy' as Category },
  { id: 'hodl-strategy', titleKey: 'calculators.hodl.title', descKey: 'calculators.hodl.desc', icon: Hourglass, available: true, featured: true, category: 'Strategy' as Category },
  { id: 'mining-profitability', titleKey: 'calculators.mining.title', descKey: 'calculators.mining.desc', icon: Pickaxe, available: true, featured: true, category: 'Mining & Network' as Category },
  { id: 'lightning', titleKey: 'calculators.lightning.title', descKey: 'calculators.lightning.desc', icon: Zap, available: true, featured: true, category: 'Mining & Network' as Category },
  { id: 'profit-loss', titleKey: 'calculators.profitLoss.title', descKey: 'calculators.profitLoss.desc', icon: BarChart3, available: true, featured: true, category: 'Strategy' as Category },
  { id: 'bitcoin-converter', titleKey: 'calculators.converter.title', descKey: 'calculators.converter.desc', icon: ArrowUpDown, available: true, featured: true, category: 'Historical' as Category },
  { id: 'investment', titleKey: 'calculators.investment.title', descKey: 'calculators.investment.desc', icon: LineChart, available: true, featured: true, category: 'Investment' as Category },
  { id: 'halving-countdown', titleKey: 'calculators.halvingCountdown.title', descKey: 'calculators.halvingCountdown.desc', icon: Clock, available: true, featured: true, category: 'Mining & Network' as Category },
  { id: 'bitcoin-savings', titleKey: 'calculators.savings.title', descKey: 'calculators.savings.desc', icon: Wallet, available: true, featured: true, category: 'Investment' as Category },
  { id: 'fear-greed-index', titleKey: 'calculators.fearGreed.title', descKey: 'calculators.fearGreed.desc', icon: Gauge, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'rainbow-chart', titleKey: 'calculators.rainbowChart.title', descKey: 'calculators.rainbowChart.desc', icon: Rainbow, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'wealth-percentile', titleKey: 'calculators.wealthPercentile.title', descKey: 'calculators.wealthPercentile.desc', icon: Crown, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'etf', titleKey: 'calculators.etf.title', descKey: 'calculators.etf.desc', icon: Landmark, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'power-law', titleKey: 'calculators.powerLaw.title', descKey: 'calculators.powerLaw.desc', icon: TrendingUp, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'cagr', titleKey: 'calculators.cagr.title', descKey: 'calculators.cagr.desc', icon: BarChart3, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'staking', titleKey: 'calculators.staking.title', descKey: 'calculators.staking.desc', icon: Percent, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'on-chain', titleKey: 'calculators.onChain.title', descKey: 'calculators.onChain.desc', icon: Activity, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'volatility', titleKey: 'calculators.volatility.title', descKey: 'calculators.volatility.desc', icon: Activity, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'supply', titleKey: 'calculators.supply.title', descKey: 'calculators.supply.desc', icon: Coins, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'dominance', titleKey: 'calculators.dominance.title', descKey: 'calculators.dominance.desc', icon: Crown, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'time-machine', titleKey: 'calculators.timeMachine.title', descKey: 'calculators.timeMachine.desc', icon: Clock, available: true, featured: true, category: 'Historical' as Category },
  { id: 'drawdown', titleKey: 'calculators.drawdown.title', descKey: 'calculators.drawdown.desc', icon: TrendingDown, available: true, featured: true, category: 'Historical' as Category },
  { id: 'sip', titleKey: 'calculators.sip.title', descKey: 'calculators.sip.desc', icon: TrendingUp, available: true, featured: true, category: 'Investment' as Category },
  { id: 'pizza-day', titleKey: 'calculators.pizzaDay.title', descKey: 'calculators.pizzaDay.desc', icon: Clock, available: true, featured: true, category: 'Historical' as Category },
  { id: 'average-buy-price', titleKey: 'calculators.avgBuyPrice.title', descKey: 'calculators.avgBuyPrice.desc', icon: Scale, available: true, featured: true, category: 'Investment' as Category },
  { id: 'price-target', titleKey: 'calculators.priceTarget.title', descKey: 'calculators.priceTarget.desc', icon: Target, available: true, featured: true, category: 'Investment' as Category },
  { id: 'inheritance-tax', titleKey: 'calculators.inheritanceTax.title', descKey: 'calculators.inheritanceTax.desc', icon: Scale, available: true, featured: true, category: 'Tax & Fees' as Category },
  { id: 'bitcoin-loan', titleKey: 'calculators.bitcoinLoan.title', descKey: 'calculators.bitcoinLoan.desc', icon: Landmark, available: true, featured: true, category: 'Strategy' as Category },
  { id: 'correlation', titleKey: 'calculators.correlation.title', descKey: 'calculators.correlation.desc', icon: GitCompare, available: true, featured: true, category: 'Market Analysis' as Category },
  { id: 'btc-vs-real-estate', titleKey: 'calculators.btcVsRealEstate.title', descKey: 'calculators.btcVsRealEstate.desc', icon: Home, available: true, featured: true, category: 'Investment' as Category },
  { id: 'bitcoin-lot-size', titleKey: 'calculators.lotSize.title', descKey: 'calculators.lotSize.desc', icon: Ruler, available: true, featured: true, category: 'Strategy' as Category },
  { id: 'bitcoin-zakat', titleKey: 'calculators.bitcoinZakat.title', descKey: 'calculators.bitcoinZakat.desc', icon: Moon, available: true, featured: true, category: 'Tax & Fees' as Category },
  { id: 'bitcoin-arbitrage', titleKey: 'calculators.arbitrage.title', descKey: 'calculators.arbitrage.desc', icon: ArrowUpDown, available: true, featured: true, category: 'Strategy' as Category },
  { id: 'pi-to-bitcoin', titleKey: 'calculators.piToBitcoin.title', descKey: 'calculators.piToBitcoin.desc', icon: Coins, available: true, featured: true, category: 'Historical' as Category },
  { id: 'portfolio-tracker', titleKey: 'calculators.portfolioTracker.title', descKey: 'calculators.portfolioTracker.desc', icon: Briefcase, available: true, featured: true, category: 'Investment' as Category },
  { id: 'bitcoin-accumulation-score', titleKey: 'calculators.accumulationScore.title', descKey: 'calculators.accumulationScore.desc', icon: Target, available: true, featured: true, category: 'Investment' as Category },
  { id: 'bitcoin-tax-india', titleKey: 'calculators.indiaTax.title', descKey: 'calculators.indiaTax.desc', icon: Receipt, available: true, featured: false, category: 'Tax & Fees' as Category },
  { id: 'bitcoin-tax-uk-cgt', titleKey: 'calculators.ukCgtTax.title', descKey: 'calculators.ukCgtTax.desc', icon: Receipt, available: true, featured: false, category: 'Tax & Fees' as Category },
  { id: 'bitcoin-tax-germany', titleKey: 'calculators.germanyTax.title', descKey: 'calculators.germanyTax.desc', icon: Receipt, available: true, featured: false, category: 'Tax & Fees' as Category },
];

interface CalculatorGridProps {
  showOnlyFeatured?: boolean;
  showExploreSection?: boolean;
  showSearch?: boolean;
}

export const CalculatorGrid = ({ showOnlyFeatured = false, showExploreSection = true, showSearch = false }: CalculatorGridProps) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const filteredCalculators = (() => {
    if (showOnlyFeatured) {
      // Instrument Panel grid: 4 cols × 4 rows on xl, 3 cols × ~5 rows on lg,
      // 2 cols × 8 rows on sm — always ≥ 3 rows on every breakpoint.
      return calculators.filter(c => c.featured && c.available).slice(0, 16);
    }
    return calculators.filter(calc => {
      const matchesCategory = selectedCategory === 'All' || calc.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = t(calc.titleKey).toLowerCase();
      const desc = t(calc.descKey).toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  })();

  return (
    <section
      id="calculators"
      className="py-16 sm:py-20 md:py-24 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {!showSearch && (
          <div className="text-center mb-10 sm:mb-14 motion-safe:animate-fade-in">
            <h2 className="text-h2 font-semibold mb-4 text-foreground tracking-[-0.025em] leading-[1.1] px-2">
              {t('calculators.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              {t('calculators.subtitle')}
            </p>
          </div>
        )}

        {/* Search & Category Filters — only on /calculators page */}
        {showSearch && (
          <div className="max-w-2xl mx-auto mb-10 space-y-5">
            {/* Page Heading */}
            <div className="text-center">
              <h1 className="text-h1 font-bold mb-3 text-foreground">
                {language === 'tr' ? <>Bitcoin <span className="text-gradient-premium">Hesaplayıcıları</span></> : <>Bitcoin <span className="text-gradient-premium">Calculators</span></>}
              </h1>
              <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                {language === 'tr' ? 'DCA, emeklilik planlaması, vergi tahmini ve portföy optimizasyonu için 49+ ücretsiz araç.' : 'Explore 49+ free tools for DCA, retirement planning, tax estimation, and portfolio optimization'}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder={language === 'tr' ? 'Hesaplayıcı ara...' : 'Search calculators...'}
                aria-label={language === 'tr' ? 'Hesaplayıcı ara' : 'Search calculators'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 md:pl-12 pr-4 md:pr-4 h-12 rounded-full border border-border/40 bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 text-base shadow-sm"
              />
            </div>

            {/* Category Chips */}
            <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible scrollbar-hide">
              <div className="flex sm:flex-wrap sm:justify-center gap-2 w-max sm:w-auto pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border touch-manipulation active:scale-[0.97] ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground'
                    }`}
                  >
                    {language === 'tr' ? TR_CATEGORY_LABELS[cat] : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            {(searchQuery || selectedCategory !== 'All') && (
              <p className="text-center text-sm text-muted-foreground">
                {language === 'tr' ? `${filteredCalculators.length} hesaplayıcı bulundu` : `${filteredCalculators.length} calculator${filteredCalculators.length !== 1 ? 's' : ''} found`}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        {filteredCalculators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
            {filteredCalculators.map((calc, idx) => {
              const IconComponent = calc.icon;
              const isComingSoon = !calc.available;
              const catLabel = language === 'tr' ? TR_CATEGORY_LABELS[calc.category] : calc.category;

              const Inner = (
                <article className="group relative bg-card border border-border/70 rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] hover:border-border transition-all duration-300 ease-out flex flex-col h-full touch-manipulation">
                  {/* Terminal header */}
                  <header className="flex items-center justify-between px-3.5 sm:px-4 py-2 border-b border-border/60 bg-background/40">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${isComingSoon ? 'bg-muted-foreground/40' : 'bg-success'}`}
                        aria-hidden
                      />
                      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground truncate">
                        {isComingSoon ? (language === 'tr' ? 'YAKINDA' : 'SOON') : (language === 'tr' ? 'AKTİF' : 'LIVE')}
                      </span>
                    </div>
                    <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-muted-foreground truncate max-w-[60%] text-right">
                      {catLabel}
                    </span>
                  </header>

                  {/* Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <div className="flex items-start gap-2.5 mb-3">
                      <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border border-border/60 bg-background/60">
                        <IconComponent className="w-4 h-4 text-foreground/80" strokeWidth={1.5} />
                      </div>
                      <CardTitle className="text-[14.5px] sm:text-[15px] font-semibold text-foreground leading-snug tracking-[-0.01em] break-words hyphens-auto mt-0.5">
                        {t(calc.titleKey)}
                      </CardTitle>
                    </div>

                    <CardDescription className="text-[12.5px] sm:text-[13px] text-muted-foreground leading-relaxed break-words hyphens-auto flex-grow line-clamp-3">
                      {t(calc.descKey)}
                    </CardDescription>
                  </div>

                  {/* Footer rail */}
                  <footer className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 border-t border-border/60 bg-background/30 min-h-[44px]">
                    {!isComingSoon ? (
                      <>
                        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                          {language === 'tr' ? 'AKTİF' : 'LIVE'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.12em] uppercase text-foreground group-hover:text-primary transition-colors">
                          {language === 'tr' ? 'AÇ' : 'OPEN'}
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground w-full text-center">
                        {language === 'tr' ? 'YAKINDA' : 'COMING SOON'}
                      </span>
                    )}
                  </footer>
                </article>
              );

              return !isComingSoon ? (
                <Link
                  key={calc.id}
                  to={language === 'tr' ? getLocalizedPath(`/calculators/${calc.id}`, 'tr') : `/calculators/${calc.id}`}
                  className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`${t(calc.titleKey)} — ${t(calc.descKey)}`}
                >
                  {Inner}
                </Link>
              ) : (
                <div key={calc.id} className="rounded-xl opacity-80">
                  {Inner}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 max-w-md mx-auto">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{language === 'tr' ? 'Hesaplayıcı bulunamadı' : 'No calculators found'}</h3>
            <p className="text-sm text-muted-foreground">{language === 'tr' ? 'Farklı bir arama terimi veya kategori deneyin.' : 'Try a different search term or category.'}</p>
          </div>
        )}

        {showExploreSection && (
          <div className="text-center mt-8 motion-safe:animate-fade-in">
            <Button asChild size="sm" variant="outline" className="font-medium px-4 py-2 group/nav">
              <Link to={language === 'tr' ? '/tr/hesaplayicilar' : '/calculators'}>
                {language === 'tr' ? 'Tüm Hesaplayıcıları Gör' : 'View All Calculators'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover/nav:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
