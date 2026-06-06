import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: 'How much Bitcoin do I need to be a millionaire?', a: 'It depends on the future price of Bitcoin. At $200k per BTC you need 5 BTC, at $500k you need 2 BTC, at $1M you need just 1 BTC, and at $5M you would only need 0.2 BTC. Use the Reverse Mode above to calculate your exact number based on your target net worth and expected BTC price.' },
  { q: 'What if Bitcoin reaches $1 million — what will 1 BTC be worth?', a: 'If Bitcoin reaches $1 million, 1 BTC will be worth exactly $1,000,000. Even fractional holdings become extremely valuable: 0.1 BTC would be worth $100,000, and 0.01 BTC (1 million satoshis) would be worth $10,000. Use our Forward Mode to model any BTC amount at any price.' },
  { q: 'How do I calculate how much Bitcoin I need for a target net worth?', a: "Divide your target net worth by your expected Bitcoin price. For example, to reach $1M at a $500k BTC price: $1,000,000 ÷ $500,000 = 2 BTC. Our Reverse Mode calculator does this instantly and also shows you the cost to buy that amount at today's live price." },
  { q: 'At what Bitcoin price will 0.1 BTC be worth $100,000?', a: 'When Bitcoin reaches $1,000,000 per coin, 0.1 BTC will be worth exactly $100,000. You can verify this using the Forward Mode: enter 0.1 BTC and set the target price to $1M to see the full breakdown including gain percentage and multiplier from today\'s price.' },
  { q: 'Is it too late to become a Bitcoin millionaire?', a: "No. While early adopters had it easier, Bitcoin is still in its early adoption curve relative to global wealth. With only 21 million BTC ever to exist (and millions already lost), consistent accumulation through dollar-cost averaging can still build substantial wealth over time. The Bitcoin Millionaire Calculator helps you set and track realistic goals." },
  { q: 'What Bitcoin price targets do analysts predict for 2030?', a: 'Predictions vary widely. The Power Law model suggests Bitcoin could reach $500k–$1M by 2030. ARK Invest has modelled a bull-case scenario exceeding $1M. Conservative estimates from traditional finance range from $200k–$500k. No model guarantees future prices, but most long-term frameworks are directionally bullish. Explore projections with our Power Law Calculator.' },
  { q: 'What is the current Bitcoin price?', a: 'The calculator uses a live price feed from CoinGecko, updated every 30 seconds. The price shown in the calculator header reflects real-time market data. You can also override it with a custom price to model hypothetical scenarios.' },
  { q: 'How does the Bitcoin multiplier work?', a: "The multiplier shows how many times your current Bitcoin holdings would multiply in value at your target price. For example, if you hold 0.5 BTC worth $47,000 today and Bitcoin reaches $500,000, your holdings would be worth $250,000 — a 5.3× multiplier. It's a quick way to visualise your potential upside." },
];

const faqsTr = [
  { q: 'Milyoner olmak için ne kadar Bitcoin\'e ihtiyacım var?', a: 'Bu Bitcoin\'in gelecekteki fiyatına bağlıdır. BTC başına 200.000 $\'da 5 BTC, 500.000 $\'da 2 BTC, 1 milyon $\'da yalnızca 1 BTC ve 5 milyon $\'da yalnızca 0,2 BTC\'ye ihtiyacınız var. Hedef net değerinize ve beklenen BTC fiyatına göre tam sayınızı hesaplamak için yukarıdaki Ters Modu kullanın.' },
  { q: 'Bitcoin 1 milyon dolara ulaşırsa 1 BTC ne değer olur?', a: 'Bitcoin 1 milyon dolara ulaşırsa 1 BTC tam olarak 1.000.000 $ değerinde olacak. Kesirli varlıklar bile son derece değerli hale gelir: 0,1 BTC 100.000 $ değerinde, 0,01 BTC (1 milyon satoshi) ise 10.000 $ değerinde olurdu. Herhangi bir fiyatta herhangi bir BTC miktarını modellemek için İleri Modunu kullanın.' },
  { q: 'Hedef net değer için ne kadar Bitcoin\'e ihtiyacım olduğunu nasıl hesaplarım?', a: 'Hedef net değerinizi beklenen Bitcoin fiyatına bölün. Örneğin 500.000 $ BTC fiyatında 1 milyon $\'a ulaşmak için: 1.000.000 $ ÷ 500.000 $ = 2 BTC. Ters Mod hesaplayıcımız bunu anında yapar ve ayrıca bu miktarı bugünün canlı fiyatında satın almanın maliyetini gösterir.' },
  { q: '0,1 BTC hangi Bitcoin fiyatında 100.000 $ değer olur?', a: 'Bitcoin coin başına 1.000.000 $\'a ulaştığında 0,1 BTC tam olarak 100.000 $ değerinde olacak. Bunu İleri Modunu kullanarak doğrulayabilirsiniz: 0,1 BTC girin ve hedef fiyatı 1 milyon $\'a ayarlayın; bugünün fiyatından kazanç yüzdesi ve çarpan dahil tam dökümü görün.' },
  { q: 'Bitcoin milyoneri olmak için çok geç mi?', a: 'Hayır. Erken benimseyenler daha kolay bir yola sahip olsa da Bitcoin, küresel servete kıyasla hâlâ erken benimseme eğrisindedir. Sadece 21 milyon BTC var olacak (ve milyonlarcası zaten kaybolmuş), dolar maliyeti ortalamasıyla sürekli birikim zaman içinde önemli servet oluşturabilir. Bitcoin Milyoner Hesaplayıcısı gerçekçi hedefler belirlemenize ve takip etmenize yardımcı olur.' },
  { q: 'Analistler 2030 için hangi Bitcoin fiyat hedeflerini öngörüyor?', a: 'Tahminler büyük ölçüde farklılık gösterir. Güç Yasası modeli Bitcoin\'in 2030\'a kadar 500.000 $-1 milyon $\'a ulaşabileceğini öngörüyor. ARK Invest 1 milyonun üzerinde bir boğa senaryosu modelledi. Geleneksel finansın muhafazakâr tahminleri 200.000 $-500.000 $ arasında değişiyor. Hiçbir model gelecekteki fiyatları garanti etmez, ancak çoğu uzun vadeli çerçeve yönsel olarak yükseliş yönünde.' },
  { q: 'Bitcoin\'in güncel fiyatı nedir?', a: 'Hesap makinesi her 30 saniyede bir güncellenen CoinGecko\'dan canlı fiyat beslemesi kullanır. Hesap makinesi başlığında gösterilen fiyat gerçek zamanlı piyasa verilerini yansıtır. Varsayımsal senaryolar modellemek için özel bir fiyatla da geçersiz kılabilirsiniz.' },
  { q: 'Bitcoin çarpanı nasıl çalışır?', a: 'Çarpan, hedef fiyata ulaşıldığında mevcut Bitcoin varlıklarınızın kaç kat değerleneceğini gösterir. Örneğin bugün 47.000 $ değerinde 0,5 BTC elinizde tutuyorsanız ve Bitcoin 500.000 $\'a ulaşırsa varlıklarınız 250.000 $ değerinde olur; bu 5,3× çarpandır. Potansiyel yukarı yönlü kârınızı görselleştirmenin hızlı bir yoludur.' },
];

export const PriceTargetFAQSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
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
              ? 'Bitcoin fiyat hedeflerini ve yatırım hedeflerini hesaplama hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about calculating Bitcoin price targets and investment goals'}
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

export const faqSchemaEn = toFaqSchema('en', faqsEn);
export const faqSchemaTr = toFaqSchema('tr', faqsTr);

/** @deprecated use faqSchemaEn / faqSchemaTr with useLocalizedSchema */
export const faqSchema = faqSchemaEn;
