import { Helmet } from "react-helmet-async";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { DatasetSchema } from "@/components/seo/DatasetSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

const trUrl = "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ya-olsaydi";
const enUrl = "https://bitcoincalculator.tools/calculators/what-if";

interface Props {
  language: string;
}

export const WhatIfSeoHead = ({ language }: Props) => {
  const webAppSchemaLocalized = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "WebApplication", "inLanguage": "en",
      "name": "Bitcoin What If Calculator",
      "description": "What if you had put $1,000 into Bitcoin in 2020? Or 2017? Or 2013? Enter any amount and any date — find out what you would be sitting on right now.",
      "url": enUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Pre-loaded historical milestone presets (Pizza Day, halvings, COVID low)",
        "Dual-mode input (fiat USD or BTC quantity)",
        "Inflation-adjusted return toggle (CPI)",
        "4-year hold analysis card",
        "Best vs worst entry table by cycle",
        "Tax estimate toggle (long-term capital gains)",
        "Cross-asset performance comparison",
        "Social share snapshot (PNG)",
        "Daily historical price data back to 2010",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org", "@type": "WebApplication", "inLanguage": "tr",
      "name": "Bitcoin Ya Olsaydı Hesaplayıcısı",
      "description": "2020'de Bitcoin'e 1.000 $ koysaydınız ne olurdu? Ya 2017'de? Herhangi bir miktar ve tarih girin — şu anda elinizdekini öğrenin.",
      "url": trUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "featureList": [
        "Önceden yüklenmiş tarihsel kilometre taşı ön ayarları (Pizza Günü, yarılamalar, COVID dibi)",
        "Çift mod giriş (fiat USD veya BTC miktarı)",
        "Enflasyona göre düzeltilmiş getiri seçeneği (TÜFE)",
        "4 yıllık tutma analiz kartı",
        "Döngüye göre en iyi ve en kötü giriş tablosu",
        "Vergi tahmin seçeneği (uzun vadeli sermaye kazancı)",
        "Çoklu varlık performans karşılaştırması",
        "Sosyal paylaşım anlık görüntüsü (PNG)",
        "2010'a kadar günlük tarihsel fiyat verisi",
      ],
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchemaLocalized = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "HowTo", "inLanguage": "en",
      "name": "How to Calculate Historical Bitcoin Investment Returns",
      "description": "Step-by-step guide to calculate what your Bitcoin investment would be worth today",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "name": "Enter Investment Amount", "text": "Input the amount you would have invested in your preferred currency (USD, EUR, etc.)", "url": `${enUrl}#step1` },
        { "@type": "HowToStep", "name": "Select Investment Date", "text": "Choose the historical date when you would have made the Bitcoin investment", "url": `${enUrl}#step2` },
        { "@type": "HowToStep", "name": "Calculate Returns", "text": "Click calculate to see your current value, total profit, ROI percentage, and annualized returns", "url": `${enUrl}#step3` },
        { "@type": "HowToStep", "name": "Analyze Results", "text": "Review the interactive chart, compare with other assets, and export your results if needed", "url": `${enUrl}#step4` },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "HowTo", "inLanguage": "tr",
      "name": "Bitcoin'in Tarihsel Yatırım Getirilerini Nasıl Hesaplarsınız",
      "description": "Bitcoin yatırımınızın bugün ne kadar değerinde olabileceğini hesaplamak için adım adım rehber",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "name": "Yatırım Tutarını Girin", "text": "Tercih ettiğiniz para biriminde (USD, TRY, EUR vb.) yatırım yapmış olacağınız miktarı girin", "url": `${trUrl}#step1` },
        { "@type": "HowToStep", "name": "Yatırım Tarihini Seçin", "text": "Bitcoin yatırımını yapmış olacağınız tarihsel günü seçin", "url": `${trUrl}#step2` },
        { "@type": "HowToStep", "name": "Getiriyi Hesaplayın", "text": "Güncel değeri, toplam kârı, ROI yüzdesini ve yıllıklandırılmış getiriyi görmek için hesapla'ya tıklayın", "url": `${trUrl}#step3` },
        { "@type": "HowToStep", "name": "Sonuçları Analiz Edin", "text": "İnteraktif grafiği inceleyin, diğer varlıklarla karşılaştırın ve gerekirse sonuçları dışa aktarın", "url": `${trUrl}#step4` },
      ],
    },
  );


  return (
    <>
      <Helmet>
        <title>{language === 'tr' ? "Bitcoin Ya Olsaydı Hesaplayıcısı: 2013'te 100 $ = 948.857 $" : 'Bitcoin What If Calculator: $100 in 2013 = $948,857 Today'}</title>
        <meta name="description" content={language === 'tr' ? "Bitcoin alsaydınız ne olurdu? Herhangi bir tutarı ve tarihi girin — 2010'a kadar günlük fiyatlarla bugünkü değeri, toplam getiriyi ve yıllık büyümeyi saniyeler içinde görün." : 'What if you bought Bitcoin in 2013, 2017 or 2020? Enter any amount and date to see what it would be worth today, plus total return and annual growth. Free.'} />
        <link rel="canonical" href={language === 'tr' ? trUrl : enUrl} />
        <link rel="alternate" hrefLang="tr" href={trUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />

        <meta property="og:title" content={language === 'tr' ? 'Bitcoin Ya Olsaydı Hesaplayıcısı' : 'Bitcoin What If Calculator'} />
        <meta property="og:description" content={language === 'tr' ? '2020\'de Bitcoin\'e 1.000$ koysaydınız ne olurdu? Ya 2017\'de? Ya da 2013\'te? Herhangi bir tutar ve tarih girin — şu an elinizde ne olacağını görün.' : 'What if you had put $1,000 into Bitcoin in 2020? Or 2017? Or 2013? Enter any amount and any date — find out what you would be sitting on right now.'} />
        <meta property="og:url" content={language === 'tr' ? trUrl : enUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language === 'tr' ? 'Bitcoin Ya Olsaydı Hesaplayıcısı' : 'Bitcoin What If Calculator'} />
        <meta name="twitter:description" content={language === 'tr' ? '2020\'de Bitcoin\'e 1.000$ koysaydınız ne olurdu? Ya 2017\'de? Şu an elinizde ne olacağını öğrenin.' : 'What if you had put $1,000 into Bitcoin in 2020? Or 2017? Find out what you would have now.'} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />

        <script type="application/ld+json">{JSON.stringify(webAppSchemaLocalized)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchemaLocalized)}</script>
      </Helmet>
      <HelmetOgImage slug="bitcoin-what-if-calculator" enAlt={`Bitcoin What If Calculator | bitcoincalculator.tools`} />

      <DatasetSchema
        name="Bitcoin Historical Price Dataset 2010–2026"
        description="Daily Bitcoin closing-price record from the earliest tradeable price through today, used to power What-If hypothetical investment backtests."
        url={enUrl}
        temporalCoverage="2010-07-17/.."
        variableMeasured={["BTC closing price (USD)", "Hypothetical investment amount", "BTC quantity acquired", "Present value (USD)", "ROI %", "CAGR %"]}
        keywords={["bitcoin historical price", "btc what if calculator", "bitcoin price 2010", "btc backtest dataset"]}
      />

      <BreadcrumbSchema
        language={language}
        items={language === 'tr' ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr/" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Ya Olsaydı Hesaplayıcısı", url: trUrl },
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "What If Calculator", url: enUrl },
        ]}
      />
    </>
  );
};
