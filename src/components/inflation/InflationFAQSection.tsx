import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: "Why is Bitcoin's fixed supply important?", answer: "Bitcoin's 21 million coin limit creates digital scarcity, similar to gold. Unlike fiat currencies that can be printed indefinitely, no one can create more Bitcoin beyond the programmed supply. This scarcity combined with growing demand drives long-term value appreciation and protects against monetary inflation." },
  { question: "How is inflation calculated for fiat currencies?", answer: "Fiat inflation is measured through the Consumer Price Index (CPI) which tracks the cost of goods and services, and M2 money supply which measures the total amount of currency in circulation. When central banks create new money, it dilutes existing currency and reduces purchasing power." },
  { question: "What is M2 money supply?", answer: "M2 is the broadest measure of money supply, including cash, checking deposits, savings accounts, and other easily accessible funds. It shows how much currency exists in the economy. When M2 grows faster than economic output, it typically leads to inflation and currency devaluation." },
  { question: "How does Bitcoin protect against inflation?", answer: "Bitcoin's fixed supply means no central authority can devalue your holdings by creating more coins. While fiat currencies lose ~2-8% of purchasing power annually due to inflation, Bitcoin's scarcity and growing adoption have historically led to long-term appreciation, making it a potential inflation hedge." },
  { question: "Why do central banks print money?", answer: "Central banks increase money supply to fund government spending, stimulate economic growth, or respond to crises. However, this expansion devalues existing currency. The 2020 pandemic response saw unprecedented money printing, with the US M2 supply growing by 25% in a single year." },
  { question: "What happens after all 21 million Bitcoin are mined?", answer: "Around the year 2140, all Bitcoin will be mined. After that, miners will be compensated solely through transaction fees rather than block rewards. Bitcoin's inflation rate will reach absolute zero, making it the hardest form of money ever created with perfectly predictable supply." },
  { question: "How accurate is this dashboard's data?", answer: "We use real-time blockchain data for Bitcoin supply and historical Federal Reserve data (FRED API) for fiat M2 money supply and CPI. All calculations are transparent and verifiable. Bitcoin data updates every 10 minutes with new blocks, while fiat data is updated monthly by central banks." },
  { question: "Is this tool free to use?", answer: "Yes, this dashboard is 100% free with no hidden fees or registration required. Our mission is to make transparent financial data accessible to everyone. All calculations happen in your browser, and we don't collect or store any personal data." },
];

const faqsTr = [
  { question: "Bitcoin'in sabit arzı neden önemlidir?", answer: "Bitcoin'in 21 milyon coin sınırı, altına benzer şekilde dijital kıtlık yaratır. Sonsuz basılabilen fiat para birimlerinin aksine, programlanmış arzın ötesinde kimse daha fazla Bitcoin yaratamaz. Artan taleple birleşen bu kıtlık, uzun vadeli değer artışını yönlendirir ve parasal enflasyona karşı koruma sağlar." },
  { question: "Fiat para birimlerinde enflasyon nasıl hesaplanır?", answer: "Fiat enflasyonu, mal ve hizmetlerin maliyetini izleyen Tüketici Fiyat Endeksi (TÜFE) ve dolaşımdaki toplam para miktarını ölçen M2 para arzı aracılığıyla ölçülür. Merkez bankaları yeni para yarattığında mevcut para birimi seyreltilir ve satın alma gücü azalır." },
  { question: "M2 para arzı nedir?", answer: "M2, nakit para, vadesiz mevduat, tasarruf hesapları ve diğer kolayca erişilebilen fonlar dahil olmak üzere para arzının en geniş ölçüsüdür. Ekonomide ne kadar para bulunduğunu gösterir. M2 ekonomik çıktıdan daha hızlı büyüdüğünde bu tipik olarak enflasyona ve para birimi değer kaybına yol açar." },
  { question: "Bitcoin enflasyona karşı nasıl koruma sağlar?", answer: "Bitcoin'in sabit arzı, hiçbir merkezi otoritenin daha fazla coin yaratarak varlıklarınızı değersizleştiremeyeceği anlamına gelir. Fiat para birimleri enflasyon nedeniyle yıllık yaklaşık %2-8 satın alma gücü kaybederken, Bitcoin'in kıtlığı ve artan benimsenmesi tarihsel olarak uzun vadeli değer artışına yol açmış ve onu potansiyel bir enflasyon koruması haline getirmiştir." },
  { question: "Merkez bankaları neden para basıyor?", answer: "Merkez bankaları devlet harcamalarını finanse etmek, ekonomik büyümeyi teşvik etmek veya krizlere yanıt vermek için para arzını artırır. Ancak bu genişleme mevcut para birimini değersizleştirir. 2020 pandemi yanıtı, ABD M2 arzının tek bir yılda %25 büyümesiyle benzeri görülmemiş para basımına sahne oldu." },
  { question: "21 milyon Bitcoin madenciliği yapıldıktan sonra ne olur?", answer: "2140 yılı civarında tüm Bitcoin madenciliği yapılmış olacak. Bundan sonra madenciler blok ödülleri yerine yalnızca işlem ücretleriyle telafi edilecek. Bitcoin'in enflasyon oranı mutlak sıfıra ulaşacak ve onu mükemmel biçimde öngörülebilir arzla şimdiye kadar yaratılmış en sert para formu haline getirecek." },
  { question: "Bu kontrol panelinin verileri ne kadar doğru?", answer: "Bitcoin arzı için gerçek zamanlı blokzincir verileri ve fiat M2 para arzı ile TÜFE için tarihsel Federal Rezerv verileri (FRED API) kullanıyoruz. Tüm hesaplamalar şeffaf ve doğrulanabilirdir. Bitcoin verileri yeni bloklarla 10 dakikada bir güncellenirken, fiat verileri merkez bankaları tarafından aylık güncellenmektedir." },
  { question: "Bu araç ücretsiz mi?", answer: "Evet, bu kontrol paneli gizli ücret veya kayıt gerektirmeden %100 ücretsizdir. Misyonumuz şeffaf finansal verileri herkese erişilebilir kılmaktır. Tüm hesaplamalar tarayıcınızda gerçekleşir ve hiçbir kişisel veriyi toplamıyor veya depolamıyoruz." },
];

export const InflationFAQSection = () => {
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
              ? 'Bitcoin arzı, fiat enflasyonu ve parasal politika hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin supply, fiat inflation, and monetary policy'}
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
