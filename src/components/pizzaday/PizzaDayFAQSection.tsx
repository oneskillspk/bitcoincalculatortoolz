import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: 'What is Bitcoin Pizza Day?', a: "Bitcoin Pizza Day is celebrated on May 22 each year. It commemorates the first known real-world transaction using Bitcoin, when Laszlo Hanyecz paid 10,000 BTC for two Papa John's pizzas on May 22, 2010. The transaction is considered a pivotal moment in Bitcoin's history as it established BTC as a medium of exchange with real-world purchasing power." },
  { q: 'How much is 10,000 Bitcoin worth today?', a: 'The value changes every second based on the live Bitcoin price. At $100,000 per BTC, 10,000 Bitcoin would be worth $1 billion. Our calculator shows the exact real-time value using live market data, updated every 30 seconds.' },
  { q: 'Who bought pizza with Bitcoin?', a: "Laszlo Hanyecz, a programmer from Jacksonville, Florida, made the purchase. He posted on the BitcoinTalk forum offering 10,000 BTC for two large pizzas. Jeremy Sturdivant (known as \"jercos\") accepted the offer and ordered two Papa John's pizzas delivered to Laszlo's home." },
  { q: 'What is Bitcoin opportunity cost?', a: 'Bitcoin opportunity cost is the potential profit you missed by spending money on something else instead of buying Bitcoin. For example, if you spent $100 on dinner in 2015 when Bitcoin was ~$250, you could have bought 0.4 BTC — which at $100,000 would be worth $40,000 today. Our calculator helps you quantify this for any past purchase.' },
  { q: 'How do I calculate my Bitcoin opportunity cost?', a: "Enter the amount you spent, the date of the purchase, and optionally the item name into our Opportunity Cost Calculator. The tool looks up the historical Bitcoin price on that date, calculates how much BTC you could have purchased, and shows what that BTC would be worth at today's price." },
  { q: 'Why is Bitcoin Pizza Day important?', a: "Bitcoin Pizza Day is important because it was the first time Bitcoin was used to purchase a physical good, proving it could function as real money. This transaction helped establish Bitcoin's legitimacy as a currency and is a key milestone in cryptocurrency history. It also serves as a powerful illustration of Bitcoin's long-term appreciation potential." },
  { q: 'How many pizzas can 1 Bitcoin buy?', a: "At current prices, 1 Bitcoin can buy thousands of pizzas. Our Bitcoin Pizza Index chart tracks this metric over time, using a $20 average pizza price. In 2010, you couldn't even buy one pizza with 1 BTC. Today, 1 BTC buys over 5,000 pizzas." },
  { q: 'When is Bitcoin Pizza Day 2026?', a: "Bitcoin Pizza Day is always on May 22. In 2026, it falls on a Friday (May 22, 2026). Many Bitcoin communities celebrate with pizza parties, special offers from crypto exchanges, and social media events. It's become one of the most recognized dates in the cryptocurrency calendar." },
];

const faqsTr = [
  { q: "Bitcoin Pizza Günü nedir?", a: "Bitcoin Pizza Günü her yıl 22 Mayıs'ta kutlanır. Laszlo Hanyecz'in 22 Mayıs 2010'da iki Papa John's pizzası için 10.000 BTC ödediği, Bitcoin kullanılan ilk bilinen gerçek dünya işlemini anmaktadır. İşlem, BTC'yi gerçek dünyadaki satın alma gücüne sahip bir değişim aracı olarak kurduğu için Bitcoin tarihinde çok önemli bir an olarak kabul edilmektedir." },
  { q: "10.000 Bitcoin bugün ne kadar eder?", a: "Değer, canlı Bitcoin fiyatına göre her saniye değişir. BTC başına 100.000 $'da 10.000 Bitcoin 1 milyar dolar değerinde olurdu. Hesap makinemiz, her 30 saniyede güncellenen canlı piyasa verilerini kullanarak tam gerçek zamanlı değeri göstermektedir." },
  { q: "Bitcoin ile pizza kimler satın aldı?", a: "Satın almayı Jacksonville, Florida'dan bir programcı olan Laszlo Hanyecz yaptı. BitcoinTalk forumuna iki büyük pizza için 10.000 BTC teklif ederek yazı yazdı. Jeremy Sturdivant ('jercos' olarak bilinir) teklifi kabul etti ve iki Papa John's pizzasını Laszlo'nun evine teslim ettirdi." },
  { q: "Bitcoin fırsat maliyeti nedir?", a: "Bitcoin fırsat maliyeti, Bitcoin satın almak yerine başka bir şeye para harcayarak kaçırdığınız potansiyel kârdır. Örneğin, Bitcoin ~250 $'dayken 2015'te akşam yemeğine 100 $ harcadıysanız, 0,4 BTC satın alabilirdiniz — bu, 100.000 $'da bugün 40.000 $ değerinde olurdu. Hesap makinemiz, geçmişteki herhangi bir satın alma için bunu sayısal hale getirmenize yardımcı olur." },
  { q: "Bitcoin fırsat maliyetimi nasıl hesaplarım?", a: "Harcadığınız miktarı, satın alma tarihini ve isteğe bağlı olarak ürün adını Fırsat Maliyeti Hesaplayıcısına girin. Araç, o tarihteki tarihsel Bitcoin fiyatına bakar, ne kadar BTC satın alabileceğinizi hesaplar ve bu BTC'nin bugünün fiyatında ne kadar değer taşıyacağını gösterir." },
  { q: "Bitcoin Pizza Günü neden önemlidir?", a: "Bitcoin Pizza Günü önemlidir çünkü Bitcoin'in fiziksel bir mal satın almak için kullanıldığı ilk seferdir; bu da gerçek para işlevi görebileceğini kanıtladı. Bu işlem Bitcoin'in para birimi olarak meşruiyetini kurmasına yardımcı oldu ve kripto para tarihi açısından önemli bir kilometre taşıdır. Ayrıca Bitcoin'in uzun vadeli değer kazanma potansiyelinin güçlü bir göstergesi işlevi görmektedir." },
  { q: "1 Bitcoin kaç pizza satın alabilir?", a: "Mevcut fiyatlarla 1 Bitcoin binlerce pizza satın alabilir. Bitcoin Pizza Endeksi grafiğimiz, 20 $ ortalama pizza fiyatı kullanarak bu ölçütü zaman içinde izler. 2010'da 1 BTC ile tek bir pizza bile satın alamazdınız. Bugün 1 BTC 5.000'den fazla pizza satın alıyor." },
  { q: "Bitcoin Pizza Günü 2026 ne zaman?", a: "Bitcoin Pizza Günü her zaman 22 Mayıs'tadır. 2026'da Cuma gününe denk geliyor (22 Mayıs 2026). Pek çok Bitcoin topluluğu pizza partileri, kripto borsalarından özel teklifler ve sosyal medya etkinlikleriyle kutlama yapar. Kripto para takviminin en tanınan tarihlerinden biri haline geldi." },
];

export const PizzaDayFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

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
            {tr ? 'Bitcoin Pizza Günü ve fırsat maliyeti hakkında bilmeniz gereken her şey' : 'Everything you need to know about Bitcoin Pizza Day and opportunity cost'}
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
