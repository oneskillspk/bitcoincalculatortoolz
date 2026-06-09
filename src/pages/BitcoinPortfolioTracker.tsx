import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import RelatedCalculators from '@/components/RelatedCalculators';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { bitcoinApi, SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { Button } from '@/components/ui/button';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { usePortfolioStorage } from '@/components/portfolio/usePortfolioStorage';
import { PortfolioPrivacyBadge } from '@/components/portfolio/PortfolioPrivacyBadge';
import { PortfolioSummaryBar } from '@/components/portfolio/PortfolioSummaryBar';
import { AddHoldingForm } from '@/components/portfolio/AddHoldingForm';
import { HoldingsTable } from '@/components/portfolio/HoldingsTable';
import { PortfolioStatsCards } from '@/components/portfolio/PortfolioStatsCards';
import { PortfolioAllocationChart } from '@/components/portfolio/PortfolioAllocationChart';
import { PortfolioScenarioCalculator } from '@/components/portfolio/PortfolioScenarioCalculator';
import { PortfolioWealthCallout } from '@/components/portfolio/PortfolioWealthCallout';
import { PortfolioContentSections } from '@/components/portfolio/PortfolioContentSections';
import { PortfolioFAQSection, portfolioFaqSchema } from '@/components/portfolio/PortfolioFAQSection';
import { PortfolioHowToUse } from '@/components/portfolio/PortfolioHowToUse';
import { useLanguage } from "@/contexts/LanguageContext";

const BitcoinPortfolioTracker: React.FC = () => {
  const { language, t } = useLanguage();
  const { holdings, addHolding, updateHolding, deleteHolding, clearAll, exportCSV, storageAvailable } = usePortfolioStorage();
  const [currency, setCurrency] = useState('USD');

  const { data: livePrice } = useQuery({
    queryKey: ['current-bitcoin-price', 'USD'],
    queryFn: () => bitcoinApi.getCurrentPrice('USD'),
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const { data: exchangeRate } = useQuery({
    queryKey: ['exchange-rate', currency],
    queryFn: () => currency === 'USD' ? Promise.resolve(1) : bitcoinApi.getCurrentPrice(currency).then(p => livePrice ? p / livePrice : 1),
    enabled: currency !== 'USD' && !!livePrice,
    staleTime: 60000,
  });

  const rate = currency === 'USD' ? 1 : (exchangeRate ?? 1);
  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  const breadcrumbItems = [
    { name: 'Home', url: 'https://bitcoincalculator.tools/' },
    { name: 'Calculators', url: 'https://bitcoincalculator.tools/calculators' },
    { name: 'Bitcoin Portfolio Tracker', url: 'https://bitcoincalculator.tools/calculators/portfolio-tracker' },
  ];

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bitcoin Portfolio Tracker",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": "https://bitcoincalculator.tools/calculators/portfolio-tracker",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": [
      "Bitcoin portfolio tracking with no signup",
      "Live BTC price portfolio valuation",
      "Cost basis and average buy price calculator",
      "Unrealized profit and loss tracking",
      "Multi-currency portfolio value: USD, PKR, INR, AED, GBP",
      "Browser localStorage — no server data collection",
      "Bitcoin milestone progress tracker",
      "Portfolio scenario calculator",
      "CSV export",
      "Bitcoin wealth percentile integration"
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Track Your Bitcoin Portfolio",
    "step": [
      { "@type": "HowToStep", "text": "Click 'Add Holding' and enter your BTC amount" },
      { "@type": "HowToStep", "text": "Enter the price per Bitcoin when you purchased" },
      { "@type": "HowToStep", "text": "Optionally add a label and purchase date" },
      { "@type": "HowToStep", "text": "Repeat for each Bitcoin purchase or wallet" },
      { "@type": "HowToStep", "text": "View your total portfolio value, profit/loss, and average buy price instantly" },
      { "@type": "HowToStep", "text": "Select your currency to see values in USD, PKR, INR, or 100+ others" },
    ]
  };

  const canonicalUrl = language === 'tr'
    ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-portfoy'
    : 'https://bitcoincalculator.tools/calculators/portfolio-tracker';

  return (
    <PageBackground variant="clean">
      <Helmet>
        <title>{t('portfolio.meta.title')}</title>
        <meta name="description" content={t('portfolio.meta.description')} />
        <meta name="keywords" content="bitcoin portfolio tracker, free crypto portfolio tracker, bitcoin portfolio calculator, bitcoin portfolio tracker no signup, bitcoin portfolio tracker free, bitcoin holdings tracker, BTC portfolio, bitcoin cost basis tracker" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-portfoy" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/portfolio-tracker" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/portfolio-tracker" />

        <meta property="og:title" content={t('portfolio.meta.title')} />
        <meta property="og:description" content={t('portfolio.meta.ogDescription')} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-portfolio-tracker" enAlt={`Bitcoin Portfolio Tracker | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('portfolio.meta.title')} />
        <meta name="twitter:description" content={t('portfolio.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />

        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(portfolioFaqSchema)}</script>
      </Helmet>

      <BreadcrumbSchema language={language} items={breadcrumbItems} />
      <Header />

      <main id="main-content" className="pt-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 pt-8">
          <Breadcrumb items={[
            { label: t('portfolio.crumb.home'), href: '/' },
            { label: t('portfolio.crumb.calculators'), href: language === 'tr' ? '/tr/hesaplayicilar' : '/calculators' },
            { label: t('portfolio.crumb.current') },
          ]} />
        </div>

        {/* Hero */}
        <div className="py-16 text-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span>₿</span> {t('portfolio.hero.badge')}
            </div>
            <h1 className="text-h1 font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {t('portfolio.hero.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {t('portfolio.hero.description')}
            </p>
            <CompactLiveBitcoinPrice currency="USD" />
          </div>
        </div>

        {/* Main Tracker */}
        <div className="container mx-auto px-4 sm:px-6 space-y-6 pb-16">
          <ErrorBoundary>
            <PortfolioSummaryBar
              holdings={holdings}
              livePrice={livePrice ?? null}
              currency={currency}
              setCurrency={setCurrency}
              exchangeRate={rate}
            />

            <PortfolioPrivacyBadge storageAvailable={storageAvailable} />

            <AddHoldingForm onAdd={addHolding} livePrice={livePrice ?? null} />

            <HoldingsTable
              holdings={holdings}
              livePrice={livePrice ?? null}
              onUpdate={updateHolding}
              onDelete={deleteHolding}
              currencySymbol={currencySymbol}
              currency={currency}
              exchangeRate={rate}
            />

            {holdings.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <Download className="w-4 h-4 mr-1" /> {t('portfolio.actions.exportCsv')}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-1" /> {t('portfolio.actions.clear')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('portfolio.dialog.title')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('portfolio.dialog.desc')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('portfolio.dialog.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={clearAll}>{t('portfolio.dialog.confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            <PortfolioStatsCards holdings={holdings} livePrice={livePrice ?? null} currencySymbol={currencySymbol} currency={currency} exchangeRate={rate} />
            <PortfolioAllocationChart holdings={holdings} livePrice={livePrice ?? null} currencySymbol={currencySymbol} exchangeRate={rate} />
            <PortfolioScenarioCalculator holdings={holdings} currencySymbol={currencySymbol} exchangeRate={rate} />
            <PortfolioWealthCallout holdings={holdings} />
          </ErrorBoundary>

          {storageAvailable && holdings.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              {t('portfolio.privacyNote')}
            </p>
          )}
        </div>

        {/* Content Sections — full width */}
        <PortfolioContentSections />

        {/* How To Use */}
        <PortfolioHowToUse />

        {/* FAQ — full width bg-muted/30 */}
        <PortfolioFAQSection />

        {/* Related Calculators */}
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-20">
          <RelatedCalculators />
        </div>

        {/* Disclaimer */}
        <div className="container mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning" />
            <p>
              {t('portfolio.disclaimer')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
};

export default BitcoinPortfolioTracker;
