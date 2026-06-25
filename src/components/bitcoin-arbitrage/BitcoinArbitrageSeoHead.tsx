import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { faqsEn, faqsTr } from "./bitcoinArbitrageData";

export const BitcoinArbitrageSeoHead: React.FC = () => {
  const { language, t } = useLanguage();

  const webAppSchemaEn = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Bitcoin Arbitrage Calculator",
    "description": "Calculate Bitcoin arbitrage profit between exchanges. Enter prices on two exchanges, add trading fees, and see your net spread and profit opportunity instantly. Free.",
    "url": "https://bitcoincalculator.tools/calculators/bitcoin-arbitrage",
    "inLanguage": "en",
    "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": ["Bitcoin price spread calculator", "Exchange fee comparison", "Net arbitrage profit calculator", "Cross-exchange Bitcoin price comparison", "Trading fee impact calculator"],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };
  const webAppSchemaTr = {
    "@context": "https://schema.org", "@type": "WebApplication",
    "name": "Bitcoin Arbitraj Hesaplayıcısı",
    "description": "Borsalar arasında Bitcoin arbitraj kârını hesaplayın. İki borsadaki fiyatları girin, işlem ücretlerini ekleyin ve net spread ile kâr fırsatını anında görün. Ücretsiz.",
    "url": "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arbitraj",
    "inLanguage": "tr",
    "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
    "featureList": ["Bitcoin fiyat farkı hesaplayıcısı", "Borsa ücreti karşılaştırması", "Net arbitraj kâr hesaplayıcısı", "Borsa arası Bitcoin fiyat karşılaştırması", "İşlem ücreti etkisi hesaplayıcısı"],
    "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
  };

  const howToSchemaEn = {
    "@context": "https://schema.org", "@type": "HowTo",
    "name": "How to Calculate Bitcoin Arbitrage Profit",
    "description": "Step-by-step guide to calculating Bitcoin arbitrage profit between exchanges",
    "inLanguage": "en",
    "step": [
      { "@type": "HowToStep", "name": "Enter Exchange A Price", "text": "Enter the Bitcoin price on your first exchange" },
      { "@type": "HowToStep", "name": "Enter Exchange B Price", "text": "Enter the Bitcoin price on your second exchange" },
      { "@type": "HowToStep", "name": "Add Trading Fees", "text": "Add the trading fee percentage for each exchange" },
      { "@type": "HowToStep", "name": "Enter Trade Amount", "text": "Enter your trade amount in USD" },
      { "@type": "HowToStep", "name": "Read Results", "text": "Read your net arbitrage profit after all fees" }
    ]
  };
  const howToSchemaTr = {
    "@context": "https://schema.org", "@type": "HowTo",
    "name": "Bitcoin Arbitraj Kârı Nasıl Hesaplanır?",
    "description": "Borsalar arasında Bitcoin arbitraj kârını hesaplamak için adım adım rehber",
    "inLanguage": "tr",
    "step": [
      { "@type": "HowToStep", "name": "A Borsasının Fiyatını Girin", "text": "İlk borsadaki Bitcoin fiyatını girin" },
      { "@type": "HowToStep", "name": "B Borsasının Fiyatını Girin", "text": "İkinci borsadaki Bitcoin fiyatını girin" },
      { "@type": "HowToStep", "name": "İşlem Ücretlerini Ekleyin", "text": "Her borsa için işlem ücreti yüzdesini ekleyin" },
      { "@type": "HowToStep", "name": "İşlem Tutarını Girin", "text": "USD cinsinden işlem tutarınızı girin" },
      { "@type": "HowToStep", "name": "Sonuçları Okuyun", "text": "Tüm ücretler düşüldükten sonraki net arbitraj kârınızı okuyun" }
    ]
  };

  const faqSchemaEn = { "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "en", "mainEntity": faqsEn.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) };
  const faqSchemaTr = { "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr", "mainEntity": faqsTr.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) };

  const webAppSchema = useLocalizedSchema(webAppSchemaEn, webAppSchemaTr);
  const howToSchema = useLocalizedSchema(howToSchemaEn, howToSchemaTr);
  const faqSchema = useLocalizedSchema(faqSchemaEn, faqSchemaTr);

  const canonical = language === 'tr'
    ? 'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arbitraj'
    : 'https://bitcoincalculator.tools/calculators/bitcoin-arbitrage';

  return (
    <>
      <Helmet>
        <title>{t('arb.meta.title')}</title>
        <meta name="description" content={t('arb.meta.description')} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-arbitraj" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/bitcoin-arbitrage" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/bitcoin-arbitrage" />
        <meta property="og:title" content={t('arb.meta.ogTitle')} />
        <meta property="og:description" content={t('arb.meta.ogDescription')} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('arb.meta.twitterTitle')} />
        <meta name="twitter:description" content={t('arb.meta.twitterDescription')} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <HelmetOgImage slug="bitcoin-arbitrage-calculator" enAlt={`Bitcoin Arbitrage Calculator | bitcoincalculator.tools`} />
    </>
  );
};
