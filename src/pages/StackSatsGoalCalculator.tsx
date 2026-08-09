import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from "@/components/Footer";
import { useSmartZones } from "@/hooks/useSmartZones";
import { PlacementProvider } from "@/contexts/PlacementProvider";
import { useSafeLanguage } from "@/hooks/useSafeLanguage";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { PageBackground } from '@/components/modern/PageBackground';
import { StackSatsInputPanel } from '@/components/stack-sats/StackSatsInputPanel';
import { StackSatsResultsPanel } from '@/components/stack-sats/StackSatsResultsPanel';
import { StackSatsProgressChart } from '@/components/stack-sats/StackSatsProgressChart';
import { MilestoneTracker } from '@/components/stack-sats/MilestoneTracker';
import { AlternativeScenarios } from '@/components/stack-sats/AlternativeScenarios';
import { StackSatsHowItWorksSection } from '@/components/stack-sats/StackSatsHowItWorksSection';
import { StackSatsFAQSection } from '@/components/stack-sats/StackSatsFAQSection';
import { StackSatsContentSections } from '@/components/stack-sats/StackSatsContentSections';
import { StackSatsExportReport } from '@/components/stack-sats/StackSatsExportReport';
import RelatedCalculators from '@/components/RelatedCalculatorsLazy';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StackSatsCalculator, StackSatsResult } from '@/services/stackSatsCalculator';
import { Target, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { EnhancedErrorDisplay } from '@/components/EnhancedErrorDisplay';
import { useLanguage } from '@/contexts/LanguageContext';

import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { QuickShareLinkPanel } from '@/components/share-export';
import { PageQuickAnswer } from "@/components/calculator/PageQuickAnswer";
const StackSatsGoalCalculator = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [currentBtcHoldings, setCurrentBtcHoldings] = useState(0);
  const [targetBtcGoal, setTargetBtcGoal] = useState(1.0);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [currency, setCurrency] = useState('USD');
  const [expectedGrowthRate, setExpectedGrowthRate] = useState(15);
  const [results, setResults] = useState<StackSatsResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lang = useSafeLanguage();
  const handleCalculate = async () => {
    if (targetBtcGoal <= currentBtcHoldings) {
      toast({ title: t('stack.toast.invalidGoalTitle'), description: t('stack.toast.invalidGoalDesc'), variant: 'destructive' });
      return;
    }
    if (monthlyContribution <= 0) {
      toast({ title: t('stack.toast.invalidContribTitle'), description: t('stack.toast.invalidContribDesc'), variant: 'destructive' });
      return;
    }

    setIsCalculating(true);
    setError(null);
    try {
      const calculationResults = await StackSatsCalculator.calculateGoal({ currentBtcHoldings, targetBtcGoal, monthlyContribution, currency, expectedGrowthRate, startDate: new Date() });
      setResults(calculationResults);
      toast({ title: t('stack.toast.calculatedTitle'), description: t('stack.toast.calculatedDesc', { years: calculationResults.yearsToGoal }) });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('stack.toast.errorFallback');
      setError(errorMessage);
      toast({ title: t('stack.toast.errorTitle'), description: errorMessage, variant: 'destructive' });
    } finally {
      setIsCalculating(false);
    }
  };

  const sz = useSmartZones({
    pageSlug: "stack-sats",
    hasResultSignal: !!results,
    lang,
    resultSignals: ["accumulation", "goal"],
  });

  const handleRetry = () => {
    setError(null);
    handleCalculate();
  };

  return (
    <PlacementProvider value={sz}>
      <ErrorBoundary>
      <Helmet>
        <title>{t('stack.meta.title')}</title>
        <meta name="description" content={t('stack.meta.description')} />
        <link rel="canonical" href={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/satoshi-biriktirme' : 'https://bitcoincalculator.tools/calculators/stack-sats'} />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/satoshi-biriktirme" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/stack-sats" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/stack-sats" />
        <meta property="og:title" content={t('stack.meta.title')} />
        <meta property="og:description" content={t('stack.meta.ogDescription')} />
        <meta property="og:url" content={language === 'tr' ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/satoshi-biriktirme' : 'https://bitcoincalculator.tools/calculators/stack-sats'} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('stack.meta.title')} />
        <meta name="twitter:description" content={t('stack.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
      </Helmet>
        <HelmetOgImage slug="stack-sats-goal-calculator" enAlt={`Bitcoin Stack Sats Calculator | bitcoincalculator.tools`} />
      <BreadcrumbSchema language={language} items={[{ name: 'Home', url: 'https://bitcoincalculator.tools/' }, { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' }, { name: 'Stack Sats Goal', url: 'https://bitcoincalculator.tools/calculators/stack-sats' }]} />
      <PageBackground variant="clean">
        <Header />
        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: t('stack.crumb.calculators'), href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' }, { label: t('stack.crumb.current') }]} />
          </div>
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Target className="w-4 h-4" />
                {t('stack.hero.badge')}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {t('stack.hero.titlePrefix')} <span className="text-gradient-premium">{t('stack.hero.titleSuffix')}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('stack.hero.description')}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency={currency} />
              </div>
            </div>
          </section>
          <sz.SlotA />
          <section className="container mx-auto px-6 pb-20">
            <PageQuickAnswer
              en='Stacking sats means buying small amounts of Bitcoin regularly toward a target. Enter your goal, budget and frequency and this calculator returns how many satoshis you add each period, the date you reach your target, and how price changes move that finish line.'
              tr='Sats biriktirmek, bir hedefe doğru düzenli olarak küçük miktarlarda Bitcoin almaktır. Hedefinizi, bütçenizi ve sıklığınızı girin; bu hesaplayıcı her dönemde eklediğiniz satoshi miktarını, hedefe ulaşacağınız tarihi ve fiyat değişimlerinin bu bitiş çizgisini nasıl kaydırdığını gösterir.'
            />
            <div className="max-w-6xl mx-auto space-y-12">
              <OfflineIndicator />
              {error && <EnhancedErrorDisplay error={error} onRetry={handleRetry} />}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div>
                  <StackSatsInputPanel currentBtcHoldings={currentBtcHoldings} setCurrentBtcHoldings={setCurrentBtcHoldings} targetBtcGoal={targetBtcGoal} setTargetBtcGoal={setTargetBtcGoal} monthlyContribution={monthlyContribution} setMonthlyContribution={setMonthlyContribution} currency={currency} setCurrency={setCurrency} expectedGrowthRate={expectedGrowthRate} setExpectedGrowthRate={setExpectedGrowthRate} onCalculate={handleCalculate} isCalculating={isCalculating} />
                </div>
                <div>
                  <ErrorBoundary>
                    {isCalculating && <Card className="glass-morphism-card border-border/20 shadow-sm"><CardContent className="p-8 text-center"><LoadingSpinner /><p className="text-sm text-muted-foreground mt-4">{t('stack.loading')}</p></CardContent></Card>}
                    {results && !isCalculating && (
                      <div className="space-y-4">
                        <StackSatsResultsPanel results={results} currency={currency} />
                        <sz.SlotB />
                      </div>
                    )}
                    {!results && !isCalculating && <Card className="glass-morphism-card border-border/20 shadow-sm"><CardContent className="p-8 text-center"><div className="space-y-4"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto"><Target className="w-6 h-6 text-primary" /></div><div className="space-y-1"><h3 className="text-lg font-semibold text-foreground">{t('stack.placeholder.title')}</h3><p className="text-sm text-muted-foreground">{t('stack.placeholder.desc')}</p></div></div></CardContent></Card>}
                  </ErrorBoundary>
                </div>
              </div>
              {results && <StackSatsExportReport results={results} currency={currency} currentBtcHoldings={currentBtcHoldings} targetBtcGoal={targetBtcGoal} monthlyContribution={monthlyContribution} expectedGrowthRate={expectedGrowthRate} />}
              {results && <div className="space-y-8"><StackSatsProgressChart results={results} currentBtcHoldings={currentBtcHoldings} /><div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><MilestoneTracker results={results} /><AlternativeScenarios results={results} currency={currency} /></div></div>}
            </div>
          </section>
          <StackSatsContentSections />
          <StackSatsHowItWorksSection />
          <sz.SlotC />
          <StackSatsFAQSection />
          <div className="container mx-auto px-4 sm:px-6"><div className="max-w-6xl mx-auto"><QuickShareLinkPanel slug="stack-sats" headline={language === 'tr' ? 'Sats Biriktirme Hedef Hesaplayıcı' : 'Stack Sats Goal Calculator'} /></div></div>
          <RelatedCalculators />
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('stack.disclaimer.title')}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t('stack.disclaimer.body')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
        <sz.SlotD />
      </PageBackground>
    </PlacementProvider>
    </ErrorBoundary>
    </PlacementProvider>
  );
};

export default StackSatsGoalCalculator;
