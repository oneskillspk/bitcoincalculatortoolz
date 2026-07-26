import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "./SectionHeader";
import { Helmet } from "react-helmet-async";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";


/**
 * What If calculator FAQ. EN/TR item counts kept in sync per spec Section 6.
 * Emits FAQPage JSON-LD matching the visible list.
 */
export const WhatIfFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === "tr";
  const { price: livePrice } = useLiveBitcoinPrice("USD");
  const btcPrice = livePrice && livePrice > 0 ? livePrice : 126198; // fallback = LATEST_ATH_USD

  const fmtUsd = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(2)}M`
      : n >= 1_000
      ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
      : `$${n.toFixed(2)}`;
  const fmtBtc = (n: number) =>
    n >= 0.01 ? `${n.toFixed(4)} BTC` : `${n.toFixed(6)} BTC`;
  const fmtSats = (btc: number) =>
    `${Math.round(btc * 100_000_000).toLocaleString("en-US")} sats`;
  const priceLabel = fmtUsd(btcPrice);

  // Live-computed helpers ($X → BTC + sats at today's price)
  const live = (usd: number) => ({
    btc: fmtBtc(usd / btcPrice),
    sats: fmtSats(usd / btcPrice),
    price: priceLabel,
  });


  const faqData = tr
    ? [
        { q: "Bitcoin \"ya alsaydım\" hesaplayıcısı nasıl çalışır?", a: "Bir tarih ve tutar girersiniz. Hesaplayıcı, o tarihe ait gerçek Bitcoin kapanış fiyatını kullanarak kaç BTC alacağınızı bulur ve bunu bugünkü fiyatla çarpar. Sonuç; toplam getiri, ROI yüzdesi ve yıllıklandırılmış kazançtır." },
        { q: "Fiyat verileri nereden geliyor?", a: "Günlük kapanış fiyatları CoinGecko üzerinden alınır ve Bitcoin geçmişinin başladığı 2013-04-28 tarihine kadar geriye gider." },
        { q: "USD dışında bir para birimi kullanabilir miyim?", a: "Evet. Hesaplayıcı EUR, GBP, TRY dahil onlarca para birimini destekler. Sonuçlar seçtiğiniz para biriminin o tarihteki tarihsel kuruyla dönüştürülür." },
        { q: "Neden erken tarihlerdeki getiriler bu kadar büyük görünüyor?", a: "Bitcoin, 2010-2017 arasında yıllık yaklaşık %200 getiri sağladı. Bu tarihsel gerçek; ancak piyasa değerinin şimdiki büyüklüğü nedeniyle önümüzdeki on yılda tekrar edilmesi olası değildir. Rakamları geçmişi anlamak için kullanın, gelecek beklentisi olarak değil." },
        { q: "Sonuçlar vergi öncesi mi vergi sonrası mı?", a: "Vergi öncesi. Ülkeniz Bitcoin kazançlarını sermaye kazancı olarak vergilendirir; kesin projeksiyonlar için ülkeye özel vergi hesaplayıcılarımıza bakın." },
        { q: "Enflasyon hesaba katılıyor mu?", a: "Ana rakam nominal (dolar bazında) değerdir. Aynı sayfada bulunan Enflasyona Göre Düzeltilmiş Bitcoin Getirileri bölümü, satın alma gücünün gerçek değişimini nasıl ölçeceğinizi gösterir." },
        { q: "BTC miktarı yerine USD tutarı girebilir miyim?", a: "Her ikisi de mümkün. Giriş modunu değiştirerek USD/EUR/TRY tutarı ile ne kadar BTC aldığınızı ya da belirli bir BTC miktarının bugün ne değerde olduğunu hesaplayın." },
        { q: "Sonucumu paylaşabilir miyim?", a: "Evet. Sonuçların altındaki \"Paylaş\" düğmesi, tam olarak aynı hesabı yeniden üreten bir bağlantı oluşturur; başkalarının aynı senaryoyu görmesini kolaylaştırır." },
        { q: "Bugün 100 dolar Bitcoin ne kadar eder?", a: "Bugünkü fiyattan doğrudan bir dönüştürme için tutar alanına 100 yazın ve başlangıç tarihini bugüne ayarlayın; ~126.000 $ yakınlarındaki BTC fiyatında 100 $ yaklaşık 0,00079 BTC'ye denk gelir. Tarihsel bir senaryo için istediğiniz geçmiş tarihi seçin." },
        { q: "1.000 dolarla kaç Bitcoin alabilirim?", a: "1.000 $ / güncel BTC fiyatı = alacağınız BTC miktarı. ~126.000 $ civarında 1.000 $, yaklaşık 0,0079 BTC (≈ 790.000 satoshi) satın alır. Bugünkü satın alma gücünü canlı görmek için hesaplayıcıya girin." },
        { q: "10.000 dolarla ne kadar Bitcoin alabilirim?", a: "126.000 $ yakınlarındaki BTC fiyatıyla 10.000 $ yaklaşık 0,079 BTC alır. Küçük fiyat oynamaları bu rakamı günden güne değiştirir; kesin sonuç için hesaplayıcıyı çalıştırın." },
        { q: "2011'de Bitcoin alsaydım bugün ne değerde olurdu?", a: "2011 boyunca ortalama BTC fiyatı ≈ 5 $ idi. Bugünkü ≈ 126.000 $ ATH'sine göre yaklaşık 25.000× getiri: 100 $, ~2,5 milyon $; 1.000 $, ~25 milyon $ olur. Kesin gün için hesaplayıcıya tarih girin." },
        { q: "2013'te Bitcoin alsaydım bugün ne kadar kazanırdım?", a: "2013 ortalaması ≈ 150 $. ~126.000 $'a göre yaklaşık 840× getiri: 100 $, ~84.000 $; 1.000 $, ~840.000 $ olur. Erken 2013 alışları çok daha yüksek, geç 2013 pik alışları düşük katlar verir." },
        { q: "2015'te Bitcoin alsaydım bugün ne değerde olurdu?", a: "2015 ortalama fiyatı ≈ 300 $. Yaklaşık 420× getiri: 100 $, ~42.000 $; 1.000 $, ~420.000 $ olur." },
        { q: "2017'de Bitcoin alsaydım bugün ne kadar olurdu?", a: "2017 ortalaması ≈ 4.000 $. Yaklaşık 31× getiri: 1.000 $, ~31.000 $; 10.000 $, ~310.000 $ olur. Aralık 2017 pikinde alım yaklaşık 6-7× getiri verir." },
        { q: "2019'da Bitcoin alsaydım bugün ne değerde olurdu?", a: "2019 ortalaması ≈ 7.500 $. Yaklaşık 17× getiri: 1.000 $, ~17.000 $; 5.000 $, ~85.000 $ olur." },
        { q: "2020'de Bitcoin alsaydım bugün ne kadar olurdu?", a: "2020 ortalaması ≈ 11.000 $. Yaklaşık 11× getiri: 1.000 $, ~11.000 $; 10.000 $, ~110.000 $ olur. Mart 2020 dip alımları çok daha yüksek kat verir." },
        { q: "2021'de Bitcoin alsaydım bugün ne değerde olurdu?", a: "2021 ortalaması ≈ 47.000 $. Yaklaşık 2,7× getiri: 1.000 $, ~2.700 $; 10.000 $, ~27.000 $ olur. Kasım 2021 zirvesindeki (69.000 $) alım yaklaşık 1,8× getiri verir." },
        { q: "2023'te Bitcoin alsaydım bugün ne kadar olurdu?", a: "2023 ortalaması ≈ 28.000 $. Yaklaşık 4,5× getiri: 1.000 $, ~4.500 $; 5.000 $, ~22.500 $ olur." },
      ]
    : [
        { q: "How does the Bitcoin \"what if\" calculator work?", a: "You enter a date and an amount. The calculator uses the real Bitcoin closing price on that date to figure out how much BTC you would have bought, then multiplies it by today's price. The result is total return, ROI percentage, and annualized gain." },
        { q: "Where does the price data come from?", a: "Daily closing prices are sourced from CoinGecko and go back to 2013-04-28, the start of Bitcoin's tracked history." },
        { q: "Can I use a currency other than USD?", a: "Yes. The calculator supports dozens of currencies including EUR, GBP, and TRY. Results are converted at the historical exchange rate for the date you selected." },
        { q: "Why do returns from early dates look so large?", a: "Bitcoin returned roughly 200% per year from 2010 to 2017. It's historically accurate, but unlikely to repeat over the next decade because Bitcoin's market cap is now much larger. Use the numbers to understand the past, not to forecast the future." },
        { q: "Are results before or after tax?", a: "Before tax. Your jurisdiction will typically treat Bitcoin gains as capital gains — see our country-specific tax calculators for precise projections." },
        { q: "Is inflation factored in?", a: "The headline figure is nominal (dollar-terms). The Inflation-Adjusted Bitcoin Returns section on the same page explains how to measure the real change in purchasing power." },
        { q: "Can I enter a BTC amount instead of USD?", a: "Both work. Switch input mode to calculate how much BTC a USD/EUR/TRY amount would have bought, or how much a specific BTC amount is worth today." },
        { q: "Can I share my result?", a: "Yes. The \"Share\" button under results creates a link that reproduces the exact same calculation, making it easy to send a scenario to someone else." },
        { q: "What would $100 in bitcoin be worth today?", a: "For a live conversion at today's price, enter $100 with today's start date; at BTC near $126,000 that is about 0.00079 BTC. For a historical scenario, pick any past date and the calculator uses that day's closing price." },
        { q: "How much bitcoin can I buy with $1,000?", a: "$1,000 ÷ current BTC price = the BTC you'd receive. Near $126,000 per BTC, $1,000 buys roughly 0.0079 BTC (about 790,000 satoshis). Enter your amount in the calculator for the live number." },
        { q: "How much bitcoin will $10,000 buy?", a: "At a BTC price near $126,000, $10,000 buys roughly 0.079 BTC. Prices move minute-to-minute, so run the calculator for an exact figure." },
        { q: "How much would I have made if I bought bitcoin in 2011?", a: "The average BTC price across 2011 was about $5. Against the current ~$126,000 all-time high that is roughly a 25,000× return: $100 becomes ~$2.5M, $1,000 becomes ~$25M. Enter an exact 2011 date in the calculator for the day-precise result." },
        { q: "How much would I have made if I bought bitcoin in 2013?", a: "2013 average ≈ $150. Roughly an 840× return today: $100 → ~$84,000, $1,000 → ~$840,000. Early-2013 buys multiply more, late-2013 peak buys much less." },
        { q: "How much would bitcoin be worth if I bought in 2015?", a: "2015 average ≈ $300. Roughly a 420× return: $100 → ~$42,000, $1,000 → ~$420,000." },
        { q: "How much would bitcoin be worth if I bought in 2017?", a: "2017 average ≈ $4,000. Roughly a 31× return: $1,000 → ~$31,000, $10,000 → ~$310,000. A buy at the December 2017 peak is closer to 6–7×." },
        { q: "How much would bitcoin be worth if I bought in 2019?", a: "2019 average ≈ $7,500. Roughly a 17× return: $1,000 → ~$17,000, $5,000 → ~$85,000." },
        { q: "How much would bitcoin be worth if I bought in 2020?", a: "2020 average ≈ $11,000. Roughly an 11× return: $1,000 → ~$11,000, $10,000 → ~$110,000. March-2020 dip buys multiply much more." },
        { q: "How much would bitcoin be worth if I bought in 2021?", a: "2021 average ≈ $47,000. Roughly 2.7×: $1,000 → ~$2,700, $10,000 → ~$27,000. A buy at the November 2021 peak (~$69,000) is closer to 1.8×." },
        { q: "How much would bitcoin be worth if I bought in 2023?", a: "2023 average ≈ $28,000. Roughly 4.5×: $1,000 → ~$4,500, $5,000 → ~$22,500." },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <SectionHeader
        title={tr ? "Sık Sorulan Sorular" : "Frequently Asked Questions"}
      />
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
            <AccordionTrigger className="text-left text-foreground hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
