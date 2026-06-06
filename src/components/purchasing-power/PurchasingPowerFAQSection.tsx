import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: "What is Bitcoin purchasing power?", answer: "Bitcoin purchasing power refers to how much real-world goods and services your Bitcoin holdings can buy. Our calculator translates your BTC value into tangible items like phones, cars, experiences, and investments, making it easier to understand the actual worth of your cryptocurrency." },
  { question: "How accurate are the item prices?", answer: "Item prices are based on average market prices and are regularly updated. Prices represent typical costs in USD and are converted to other currencies using current exchange rates. Actual prices may vary based on your location, retailer, and specific product variants." },
  { question: "Can I customize the items shown?", answer: "Yes! You can filter items by category (Tech, Transport, Experiences, etc.), search for specific items, and sort by quantity or price. This helps you focus on the items most relevant to your purchasing interests." },
  { question: "Does this calculator include transaction fees?", answer: "No, this calculator shows raw purchasing power based on your Bitcoin's current value. It doesn't account for exchange fees, transaction costs, or taxes that would apply when converting Bitcoin to fiat currency and making actual purchases." },
  { question: "Why is purchasing power important for Bitcoin holders?", answer: "Understanding purchasing power helps you make better financial decisions by showing what your Bitcoin can actually buy. It makes abstract numbers tangible and helps you set realistic goals, whether you're saving for a car, planning a vacation, or building long-term wealth." },
  { question: "How often are Bitcoin prices updated?", answer: "Bitcoin prices are updated in real-time using live market data from the CoinGecko API. When you enable 'Use Live Price', the calculator automatically syncs your BTC and fiat amounts based on current market rates." },
  { question: "Why do some items show very large quantities?", answer: "If you have significant Bitcoin holdings, you may see very large quantities for lower-priced items (like coffee or groceries). We use formatting like '1.5M' or '200K' to make these numbers more readable. This helps illustrate the scale of purchasing power your Bitcoin represents." },
  { question: "Is my financial data private and secure?", answer: "Absolutely. All calculations are performed locally in your browser. We do not store, track, or transmit any of your financial information to our servers. Your Bitcoin holdings and calculations remain completely private." },
];

const faqsTr = [
  { question: "Bitcoin satın alma gücü nedir?", answer: "Bitcoin satın alma gücü, Bitcoin varlıklarınızın gerçek dünyada ne kadar mal ve hizmet satın alabileceğini ifade eder. Hesaplayıcımız BTC değerinizi telefon, araba, deneyim ve yatırımlar gibi somut ürünlere çevirerek kripto paranızın gerçek değerini anlamayı kolaylaştırır." },
  { question: "Ürün fiyatları ne kadar doğru?", answer: "Ürün fiyatları ortalama piyasa fiyatlarına dayanmaktadır ve düzenli olarak güncellenmektedir. Fiyatlar USD cinsinden tipik maliyetleri temsil eder ve güncel döviz kurları kullanılarak diğer para birimlerine dönüştürülür. Gerçek fiyatlar konumunuza, satıcıya ve belirli ürün varyantlarına göre farklılık gösterebilir." },
  { question: "Gösterilen ürünleri özelleştirebilir miyim?", answer: "Evet! Ürünleri kategoriye (Teknoloji, Ulaşım, Deneyimler vb.) göre filtreleyebilir, belirli ürünleri arayabilir ve miktar veya fiyata göre sıralayabilirsiniz. Bu, satın alma ilgi alanlarınıza en uygun ürünlere odaklanmanıza yardımcı olur." },
  { question: "Bu hesap makinesi işlem ücretlerini içeriyor mu?", answer: "Hayır, bu hesap makinesi Bitcoin'in güncel değerine göre ham satın alma gücünü gösterir. Bitcoin'i fiat para birimine dönüştürürken ve gerçek alımlar yaparken uygulanacak borsa ücretlerini, işlem maliyetlerini veya vergileri hesaba katmaz." },
  { question: "Satın alma gücü neden Bitcoin sahipleri için önemlidir?", answer: "Satın alma gücünü anlamak, Bitcoin'inizin gerçekte ne satın alabileceğini göstererek daha iyi finansal kararlar almanıza yardımcı olur. Soyut sayıları somut hale getirir ve araba için tasarruf etmek, tatil planlamak veya uzun vadeli servet inşa etmek isteyenler için gerçekçi hedefler belirlemeye yardımcı olur." },
  { question: "Bitcoin fiyatları ne sıklıkla güncelleniyor?", answer: "Bitcoin fiyatları CoinGecko API'sinden gelen canlı piyasa verileri kullanılarak gerçek zamanlı güncellenmektedir. 'Canlı Fiyat Kullan' seçeneğini etkinleştirdiğinizde, hesap makinesi BTC ve fiat tutarlarınızı güncel piyasa kurlarına göre otomatik olarak senkronize eder." },
  { question: "Bazı ürünler neden çok büyük miktarlar gösteriyor?", answer: "Önemli Bitcoin varlığınız varsa, düşük fiyatlı ürünler (kahve veya market alışverişi gibi) için çok büyük miktarlar görebilirsiniz. Bu sayıları daha okunabilir kılmak için '1,5M' veya '200K' gibi biçimlendirme kullanıyoruz. Bu, Bitcoin'inizin temsil ettiği satın alma gücünün ölçeğini göstermeye yardımcı olur." },
  { question: "Finansal verilerim gizli ve güvenli mi?", answer: "Kesinlikle. Tüm hesaplamalar tarayıcınızda yerel olarak gerçekleştirilir. Finansal bilgilerinizin hiçbirini sunucularımıza depolamıyor, izlemiyor veya iletmiyoruz. Bitcoin varlıklarınız ve hesaplamalarınız tamamen gizli kalır." },
];

export const PurchasingPowerFAQSection = () => {
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
            {tr
              ? 'Bitcoin satın alma gücü hesaplama hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about calculating Bitcoin purchasing power'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
