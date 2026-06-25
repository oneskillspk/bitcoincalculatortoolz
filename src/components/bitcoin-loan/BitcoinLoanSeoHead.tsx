import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { faqSchema, faqSchemaTr } from './bitcoinLoanData';
import { HelmetOgImage } from '@/components/seo/HelmetOgImage';

export const BitcoinLoanSeoHead: React.FC = () => {
  const { language, t } = useLanguage();
  const canonical = language === 'tr'
    ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-kredi'
    : 'https://bitcoincalculator.tools/calculators/bitcoin-loan';

  return (
    <>
    <Helmet>

      <title>{t('loan.meta.title')}</title>
      <meta name="description" content={t('loan.meta.description')} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={t('loan.meta.title')} />
      <meta property="og:description" content={t('loan.meta.ogDescription')} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="bitcoincalculator.tools" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t('loan.meta.title')} />
      <meta name="twitter:description" content={t('loan.meta.twitterDescription')} />
      <meta name="twitter:creator" content="@web3believers" />
      <meta name="twitter:site" content="@web3believers" />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Bitcoin Loan & LTV Calculator",
          "description": "Calculate how much you can borrow against your Bitcoin. Enter your BTC,  loan amount and LTV ratio to see liquidation price and margin call levels. Free.",
          "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "featureList": [
            "LTV ratio calculation",
            "Liquidation price calculator",
            "Margin call price estimation",
            "Amortization schedule",
            "Borrow vs sell tax comparison",
            "Platform preset configurations",
            "Health factor scoring",
            "Multi-scenario analysis"
          ],
          "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
          "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Calculate a Bitcoin-Backed Loan",
          "description": "Step-by-step guide to using the Bitcoin loan calculator to find LTV ratios, liquidation prices, and compare borrowing vs selling",
          "totalTime": "PT3M",
          "supply": [{ "@type": "HowToSupply", "name": "Bitcoin collateral amount, current BTC price, desired loan amount" }],
          "tool": [{ "@type": "HowToTool", "name": "Bitcoin Loan Calculator" }],
          "step": [
            { "@type": "HowToStep", "name": "Enter Bitcoin Collateral", "text": "Input the amount of BTC to use as collateral and the current Bitcoin price", "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan#step1" },
            { "@type": "HowToStep", "name": "Choose Platform Preset", "text": "Select a platform type (Conservative, Standard, Aggressive) or enter custom LTV thresholds", "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan#step2" },
            { "@type": "HowToStep", "name": "Set Loan Terms", "text": "Configure loan amount, interest rate, and term length in months", "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan#step3" },
            { "@type": "HowToStep", "name": "Review Results", "text": "Analyze liquidation price, health factor, monthly payments, and borrow-vs-sell comparison", "url": "https://bitcoincalculator.tools/calculators/bitcoin-loan#step4" },
          ]
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "inLanguage": "en",
          "mainEntity": faqSchema
        })}
      </script>

      {language === 'tr' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": "tr",
            "mainEntity": faqSchemaTr
          })}
        </script>
      )}
    </Helmet>
    <HelmetOgImage slug="bitcoin-loan-calculator" enAlt="Bitcoin Loan & LTV Calculator | bitcoincalculator.tools" />
    </>
  );
};

export default BitcoinLoanSeoHead;

