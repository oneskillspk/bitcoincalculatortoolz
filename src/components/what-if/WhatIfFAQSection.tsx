import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "./SectionHeader";
import { Helmet } from "react-helmet-async";

/**
 * What If calculator FAQ. EN/TR item counts kept in sync per spec Section 6.
 * Emits FAQPage JSON-LD matching the visible list.
 */
export const WhatIfFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === "tr";

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
        eyebrow={tr ? "SSS" : "FAQ"}
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
