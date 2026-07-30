import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const portfolioFaqData = [
  { q: "What is the best Bitcoin portfolio tracker?", a: "The best Bitcoin portfolio tracker is one that requires no signup, saves data privately in your browser, tracks cost basis and profit/loss across multiple purchases, and shows live portfolio value in your local currency. This free Bitcoin portfolio tracker meets all these criteria — it works instantly with no account, never sends your data to a server, and integrates with tools like the wealth percentile calculator and price target calculator." },
  { q: "Is there a free Bitcoin portfolio tracker with no signup?", a: "Yes. This Bitcoin portfolio tracker is completely free and requires no account or signup. Your holdings are saved in your browser's local storage — not on any server. You can add unlimited purchases, track cost basis and profit/loss, and view your portfolio value in USD, PKR, INR, and 100+ currencies with no registration required." },
  { q: "How do I track my Bitcoin portfolio?", a: "Add each purchase as a separate entry with the BTC amount and price you paid. The tracker calculates your total holdings, current value at the live price, average buy price, and unrealized profit or loss. For multiple wallets or exchanges, add each separately and the tracker combines them into a single portfolio view." },
  { q: "How much of a portfolio should be in Bitcoin?", a: "Financial researchers and advisors typically suggest a Bitcoin allocation between 1% and 10% of a total investment portfolio for conservative investors. More aggressive Bitcoin investors may allocate 25% to 50%. Your ideal allocation depends on your risk tolerance, time horizon, and conviction in Bitcoin's long-term value." },
  { q: "How does this portfolio tracker calculate profit and loss?", a: "The tracker calculates profit and loss by comparing the current market value of each holding (BTC amount × live price) against its cost basis (BTC amount × purchase price). The difference is your unrealized profit or loss. Both dollar amounts and percentages are shown for each individual entry and for your total portfolio." },
  { q: "Can I track multiple Bitcoin wallets in one portfolio?", a: "Yes. Add each wallet or exchange holding as a separate entry with its own label, BTC amount, and purchase price. The tracker combines all entries into a single portfolio view with total value, overall average buy price, and combined profit/loss calculations." },
  { q: "Is my Bitcoin portfolio data backed up?", a: "Your portfolio data is stored in your browser's local storage only. If you clear your browser data or switch devices, the data will be lost. Use the Export CSV button to download a backup of your holdings at any time." },
  { q: "How does the portfolio tracker work out my cost basis?", a: "Cost basis is the total amount you originally paid for your Bitcoin. If you bought 0.5 BTC at $40,000 per BTC, your cost basis is $20,000. The tracker calculates this automatically for each entry and for your entire portfolio." },
  { q: "What currencies does the portfolio tracker support?", a: "The tracker supports over 100 currencies including USD, GBP, EUR, PKR, INR, AED, BDT, NGN, MYR, CAD, AUD, and many more. Select your preferred currency from the dropdown and all values convert automatically." },
  { q: "How do I track my Bitcoin cost basis for taxes?", a: "Log every purchase with the exact date, BTC amount, and fiat price paid. The tracker sums these into your total cost basis and average price per BTC. For US taxes (rules effective 2025), this cost basis is subtracted from the sale price to calculate the capital gain reported on IRS Form 8949 — use the Export CSV button to hand your accountant a clean audit trail." },
];

const portfolioFaqsTr = [
  { q: "En iyi Bitcoin portföy takipçisi hangisidir?", a: "En iyi Bitcoin portföy takipçisi, kayıt gerektirmeyen, verileri tarayıcınızda özel olarak kaydeden, birden fazla alım için maliyet tabanını ve kâr/zararı takip eden ve yerel para biriminizde canlı portföy değerini gösteren bir araçtır. Bu ücretsiz Bitcoin portföy takipçisi tüm bu kriterleri karşılar; hesap gerektirmeden anında çalışır, verilerinizi asla sunucuya göndermez." },
  { q: "Kayıt gerektirmeyen ücretsiz bir Bitcoin portföy takipçisi var mı?", a: "Evet. Bu Bitcoin portföy takipçisi tamamen ücretsizdir ve hesap veya kayıt gerektirmez. Varlıklarınız tarayıcınızın yerel depolama alanına kaydedilir; sunucuya değil. Sınırsız alım ekleyebilir, maliyet tabanını ve kâr/zararı takip edebilir, portföy değerinizi USD, PKR, INR ve 100'den fazla para biriminde kayıt gerektirmeden görüntüleyebilirsiniz." },
  { q: "Bitcoin portföyümü nasıl takip ederim?", a: "Her alımı BTC miktarı ve ödediğiniz fiyatla ayrı bir giriş olarak ekleyin. Takipçi toplam varlıklarınızı, canlı fiyattaki güncel değeri, ortalama alış fiyatını ve gerçekleşmemiş kâr veya zararı hesaplar. Birden fazla cüzdan veya borsa için her birini ayrı ayrı ekleyin; takipçi hepsini tek bir portföy görünümünde birleştirir." },
  { q: "Portföyün ne kadarı Bitcoin'de olmalı?", a: "Finansal araştırmacılar ve danışmanlar, muhafazakâr yatırımcılar için toplam yatırım portföyünün %1 ile %10'u arasında bir Bitcoin tahsisini tipik olarak önerir. Daha agresif Bitcoin yatırımcıları %25 ile %50 arasında tahsis yapabilir. İdeal tahsisiniz risk toleransınıza, zaman ufkunuza ve Bitcoin'in uzun vadeli değerine olan inancınıza bağlıdır." },
  { q: "Bu portföy takipçisi kâr ve zararı nasıl hesaplar?", a: "Takipçi, her varlığın mevcut piyasa değerini (BTC miktarı × canlı fiyat) maliyet tabanıyla (BTC miktarı × alış fiyatı) karşılaştırarak kâr ve zararı hesaplar. Fark, gerçekleşmemiş kâr veya zararınızdır. Her giriş için ve toplam portföyünüz için hem dolar tutarları hem de yüzdeler gösterilir." },
  { q: "Birden fazla Bitcoin cüzdanını tek portföyde takip edebilir miyim?", a: "Evet. Her cüzdan veya borsa varlığını kendi etiketi, BTC miktarı ve alış fiyatıyla ayrı bir giriş olarak ekleyin. Takipçi tüm girişleri toplam değer, genel ortalama alış fiyatı ve birleşik kâr/zarar hesaplamalarıyla tek bir portföy görünümünde birleştirir." },
  { q: "Bitcoin portföy verilerim yedekleniyor mu?", a: "Portföy verileriniz yalnızca tarayıcınızın yerel depolama alanında saklanır. Tarayıcı verilerini temizlerseniz veya cihaz değiştirirseniz veriler kaybolacaktır. İstediğiniz zaman varlıklarınızın yedeğini indirmek için CSV Dışa Aktar düğmesini kullanın." },
  { q: "Bitcoin'de maliyet tabanı nedir?", a: "Maliyet tabanı, Bitcoin'iniz için başlangıçta ödediğiniz toplam tutardır. BTC başına 40.000 $'dan 0,5 BTC satın aldıysanız, maliyet tabanınız 20.000 $'dır. Takipçi bunu her giriş için ve tüm portföyünüz için otomatik olarak hesaplar." },
  { q: "Portföy takipçisi hangi para birimlerini destekliyor?", a: "Takipçi USD, GBP, EUR, PKR, INR, AED, BDT, NGN, MYR, CAD, AUD ve çok daha fazlası dahil olmak üzere 100'den fazla para birimini destekler. Açılır menüden tercih ettiğiniz para birimini seçin; tüm değerler otomatik olarak dönüşür." },
  { q: "Vergiler için Bitcoin maliyet tabanımı nasıl takip ederim?", a: "Her alımı tam tarih, BTC miktarı ve ödenen fiyatla kaydedin. Takipçi bunları toplam maliyet tabanınıza ve BTC başına ortalama fiyata toplar. Türkiye'de bu maliyet tabanı satış fiyatından çıkarılarak gelir vergisi beyannamesinde raporlanan sermaye kazancını hesaplar (2025 kuralları) — muhasebecinize temiz bir denetim izi vermek için CSV Dışa Aktar düğmesini kullanın." },
];

export const PortfolioFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? portfolioFaqsTr : portfolioFaqData;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr
              ? 'Bitcoin portföy takibi ve maliyet tabanı hesaplama hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about tracking your Bitcoin portfolio and cost basis'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const toFaqSchema = (lang: 'en' | 'tr', faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: lang,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const portfolioFaqSchemaEn = toFaqSchema('en', portfolioFaqData);
export const portfolioFaqSchemaTr = toFaqSchema('tr', portfolioFaqsTr);

/** @deprecated use portfolioFaqSchemaEn / portfolioFaqSchemaTr */
const portfolioFaqSchema = portfolioFaqSchemaEn;
