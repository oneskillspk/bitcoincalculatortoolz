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

  const faqSchemaLocalized = useLocalizedSchema(
    null,
    {
      "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr", "url": trUrl,
      "mainEntity": [
        { "@type": "Question", "name": "Bu Bitcoin hesaplayıcısı ne kadar doğru?", "acceptedAnswer": { "@type": "Answer", "text": "Hesaplayıcı, geçmiş bir yatırımın performansını yüksek doğrulukla göstermek için Bitcoin'in tarihsel günlük kapanış fiyatlarını kullanır. Nihai değer, tarihsel verilere dayalı kesin bir hesaplamadır." } },
        { "@type": "Question", "name": "Yatırım Getirisi (ROI) nedir?", "acceptedAnswer": { "@type": "Answer", "text": "ROI, bir yatırımın ne kadar kârlı olduğunu gösteren yüzdedir. Net kâr ilk yatırım tutarına bölünerek hesaplanır. %500 ROI, kârın başlangıç yatırımının beş katı olduğunu gösterir." } },
        { "@type": "Question", "name": "Bu hesaplama işlem ücretlerini içeriyor mu?", "acceptedAnswer": { "@type": "Answer", "text": "Hayır. Hesaplayıcı piyasa fiyatına göre ham varlık büyümesini gösterir. Platforma göre değişebilen borsa veya işlem ücretlerini dikkate almaz." } },
        { "@type": "Question", "name": "Bu hesaplayıcı gelecekteki Bitcoin fiyatlarını tahmin edebilir mi?", "acceptedAnswer": { "@type": "Answer", "text": "Bu araç yalnızca geçmiş analizi içindir ve gelecekteki performansı tahmin edemez. Kripto piyasası oldukça oynaktır; geçmiş sonuçlar gelecekteki getirilerin göstergesi değildir." } },
        { "@type": "Question", "name": "10 yıl önce Bitcoin'e 100 $ yatırsaydım?", "acceptedAnswer": { "@type": "Answer", "text": "2014 başında yapılan 100 $'lık bir yatırım, tarihe bağlı olarak bugün yaklaşık 18.000–25.000 $ değerinde olurdu — %18.000'in üzerinde getiri. Tam rakamı görmek için hesaplayıcıyı kendi tarihinizle kullanın." } },
        { "@type": "Question", "name": "Bitcoin'e yatırım yapmak için artık geç mi?", "acceptedAnswer": { "@type": "Answer", "text": "Bu soru 100 $, 1.000 $, 10.000 $ ve 60.000 $ gibi her büyük fiyat seviyesinde sorulmuştur. Her seferinde Bitcoin önemli ölçüde daha yüksek fiyatlara ulaştı. Geçmiş performans garanti vermese de uzun vadeli sahiplerin tarihsel olarak ödüllendirildiği görülmektedir." } },
        { "@type": "Question", "name": "Bitcoin kârımı nasıl hesaplarım?", "acceptedAnswer": { "@type": "Answer", "text": "Kâr = (Güncel Değer − Başlangıç Yatırımı). ROI yüzdesi = ((Güncel Değer − Başlangıç Yatırımı) ÷ Başlangıç Yatırımı) × 100." } },
        { "@type": "Question", "name": "Yıllıklandırılmış getiri (CAGR) nasıl hesaplanır?", "acceptedAnswer": { "@type": "Answer", "text": "CAGR = (Bitiş Değeri ÷ Başlangıç Değeri)^(1 ÷ Yıl) − 1, yüzde olarak ifade edilir. 2017'deki 1.000 $'ın 9 yılda 100.000 $'a ulaşması ≈ yıllık %66 CAGR demektir." } },
      ],
    },
  );

  return (
    <>
      <Helmet>
        <title>{language === 'tr' ? 'Bitcoin Ya Olsaydı Hesaplayıcısı' : 'Bitcoin What If Calculator'}</title>
        <meta name="description" content={language === 'tr' ? '2020\'de Bitcoin\'e 1.000$ koysaydınız ne olurdu? Ya 2017\'de? Ya da 2013\'te? Herhangi bir tutar ve tarih girin — şu an elinizde ne olacağını öğrenin.' : 'What if you had put $1,000 into Bitcoin in 2020? Or 2017? Or 2013? Enter any amount and any date — find out what you would be sitting on right now.'} />
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
        {faqSchemaLocalized && (
          <script type="application/ld+json">{JSON.stringify(faqSchemaLocalized)}</script>
        )}

        {language !== 'tr' && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "url": enUrl,
              "mainEntity": [
                { "@type": "Question", "name": "How accurate is this Bitcoin calculator?", "acceptedAnswer": { "@type": "Answer", "text": "This calculator uses historical daily closing price data for Bitcoin to provide a highly accurate representation of a past investment's performance. The final value is a precise calculation based on historical data." } },
                { "@type": "Question", "name": "What is Return on Investment (ROI)?", "acceptedAnswer": { "@type": "Answer", "text": "Return on Investment (ROI) is a percentage that shows how profitable an investment was. It's calculated by dividing the net profit by the initial investment amount. A 500% ROI means you made five times your initial investment in profit." } },
                { "@type": "Question", "name": "Does this calculation include trading fees?", "acceptedAnswer": { "@type": "Answer", "text": "No, this tool calculates the raw asset growth based on market price. It does not account for potential exchange or trading fees, which can vary depending on the platform used to buy or sell." } },
                { "@type": "Question", "name": "Can this calculator predict future Bitcoin prices?", "acceptedAnswer": { "@type": "Answer", "text": "This tool is for historical analysis only and cannot predict future performance. The cryptocurrency market is highly volatile, and past results are not an indicator of future returns." } },
                { "@type": "Question", "name": "What if I invested $100 in Bitcoin 10 years ago?", "acceptedAnswer": { "@type": "Answer", "text": "A $100 investment in Bitcoin in early 2014 would be worth approximately $18,000–$25,000 today, depending on the exact date. That represents a return of over 18,000%. Use the calculator with your specific date to get a precise figure." } },
                { "@type": "Question", "name": "Is it too late to invest in Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "People have asked this question at every major price level — $100, $1,000, $10,000, and $60,000. At each point, Bitcoin went on to reach significantly higher prices. While past performance doesn't guarantee future results, the historical data shows that long-term holders have been rewarded regardless of when they started." } },
                { "@type": "Question", "name": "How do I calculate my Bitcoin profit?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin profit is calculated as: (Current Value − Original Investment) = Profit. For ROI percentage: ((Current Value − Original Investment) ÷ Original Investment) × 100. For example, if you bought $500 worth of BTC at $10,000 per coin and it's now $69,000, your profit is $2,950 and your ROI is 590%." } },
                { "@type": "Question", "name": "Does this calculator work for other cryptocurrencies like Ethereum or Solana?", "acceptedAnswer": { "@type": "Answer", "text": "No, this tool is specifically designed for Bitcoin and uses Bitcoin's historical price data exclusively. Bitcoin has the longest and most reliable price history in crypto, dating back to 2009." } },
                { "@type": "Question", "name": "How do I calculate Bitcoin returns?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin return = ((Current Price − Purchase Price) ÷ Purchase Price) × 100. For example, buying 1 BTC at $10,000 that is now worth $85,000 gives a return of 750%. Use the date picker above to calculate returns for any historical purchase date." } },
                { "@type": "Question", "name": "What if I bought $100 of Bitcoin in 2010?", "acceptedAnswer": { "@type": "Answer", "text": "A $100 investment in Bitcoin during May 2010 (around Pizza Day, when BTC traded at $0.0041) would have purchased roughly 24,390 BTC. At a $100,000 BTC price, that stake would be worth approximately $2.44 billion. This is the most extreme example in Bitcoin history and is statistically impossible to repeat." } },
                { "@type": "Question", "name": "How much would $1000 in Bitcoin be worth today?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on when you bought. $1,000 invested in January 2017 (BTC ~$1,000) would be worth roughly $100,000 at $100K BTC. $1,000 invested in January 2020 (BTC ~$7,200) would be worth roughly $13,900. $1,000 invested in November 2021 at the $69K peak would still be roughly $1,450. Use the calculator above for your exact date." } },
                { "@type": "Question", "name": "What if I had bought Bitcoin on Pizza Day 2010?", "acceptedAnswer": { "@type": "Answer", "text": "On May 22, 2010, Laszlo Hanyecz famously paid 10,000 BTC for two pizzas, valuing each Bitcoin at roughly $0.0041. A $1 investment that day would have bought 244 BTC, worth around $24.4 million at $100K BTC. Pizza Day is now an annual community holiday celebrating Bitcoin's first real-world transaction." } },
                { "@type": "Question", "name": "What is the worst time in history to have bought Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": "The most painful single buy was the December 2017 peak at $19,800, which took until December 2020 to recover, or the November 2021 peak at $69,000, which took until March 2024 to recover. However, anyone who held through both bear markets eventually came out profitable. Bitcoin has never had a losing 4-year holding period." } },
                { "@type": "Question", "name": "Is the What-If Calculator inflation-adjusted?", "acceptedAnswer": { "@type": "Answer", "text": "The default calculation shows nominal returns (raw price growth without adjusting for inflation). Real purchasing power gains would be slightly lower after accounting for roughly 35% cumulative US inflation from 2017 to 2026. Bitcoin's outsized returns mean inflation adjustment changes the percentage but not the qualitative outcome." } },
                { "@type": "Question", "name": "Can I share my What-If result on social media?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. After calculating, use the export button to download a share-ready image showing your investment amount, purchase date, and current value. The image is generated client-side in your browser, so no data is sent to any server." } },
                { "@type": "Question", "name": "What if I had bought Bitcoin at the all-time high?", "acceptedAnswer": { "@type": "Answer", "text": "Even the worst-timed buys have recovered. Someone who bought at the December 2017 peak of $19,800 was back to break-even by December 2020 and roughly 5x profitable by 2026. The November 2021 peak of $69,000 took until March 2024 to recover and is now sitting at a comfortable gain. Bitcoin has never had a losing 4-year hold from any all-time high entry." } },
                { "@type": "Question", "name": "Has Bitcoin ever had a losing 4-year hold?", "acceptedAnswer": { "@type": "Answer", "text": "No. According to CoinGecko price data through 2026, every 4-year Bitcoin hold from any entry date between 2010 and 2022 has produced a positive nominal return. The pattern lines up with the roughly 4-year halving cycle. This is historical fact, not a guarantee about future cycles." } },
                { "@type": "Question", "name": "How does inflation affect my Bitcoin returns?", "acceptedAnswer": { "@type": "Answer", "text": "Inflation erodes the purchasing power of any nominal return. From 2017 to 2026, US CPI rose roughly 35% per the BLS series CUUR0000SA0. So a $100,000 Bitcoin position from a $1,000 entry in 2017 has a real (CPI-adjusted) value closer to $74,000 in 2017 dollars. Bitcoin's outsized returns mean the inflation correction reduces the headline number but rarely flips the sign." } },
                { "@type": "Question", "name": "What's the worst entry price in Bitcoin history?", "acceptedAnswer": { "@type": "Answer", "text": "The two most painful single-day buys were the December 17, 2017 peak at $19,800 and the November 10, 2021 peak at $69,000. The 2017 peak required a 3-year hold to recover. The 2021 peak required roughly 28 months. Both eventually returned strong profits to anyone who held through the bear market that followed." } },
                { "@type": "Question", "name": "Do I owe tax on my What-If gains?", "acceptedAnswer": { "@type": "Answer", "text": "The What-If Calculator shows hypothetical gains, so no tax is owed on the model. If you had actually held Bitcoin and sold in 2026, US long-term capital gains rates of 0%, 15%, or 20% would apply depending on your income, plus a possible 3.8% NIIT surcharge. Short-term sales (held less than one year) are taxed as ordinary income up to 37%. See the Capital Gains Tax Calculator for a full breakdown." } },
                { "@type": "Question", "name": "How is the annualized return (CAGR) calculated?", "acceptedAnswer": { "@type": "Answer", "text": "CAGR = (Ending Value ÷ Beginning Value)^(1 ÷ Years) − 1, expressed as a percentage. Example: $1,000 in 2017 worth $100,000 in 2026 over 9 years gives a CAGR of (100)^(1/9) − 1 ≈ 66% per year. CAGR smooths out year-to-year volatility into a single average growth rate so you can compare Bitcoin against indexes, gold, or real estate on equal terms." } },
              ]
            })}
          </script>
        )}
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
