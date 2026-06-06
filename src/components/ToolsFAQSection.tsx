import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const faqDataEn = [
  { question: "What Bitcoin tools are being developed?", answer: "We're building a suite of Bitcoin-focused tools including a Portfolio Tracker, Security Checker, Market Analyzer, Network Explorer, Price Alerts, and Trend Predictor. These tools are currently in development. In the meantime, explore our 15+ free Bitcoin calculators for DCA, retirement planning, tax estimation, and more." },
  { question: "How do your tools differ from regular cryptocurrency apps?", answer: "Our tools are designed specifically for Bitcoin investors. Rather than covering thousands of tokens, we focus exclusively on Bitcoin analysis — including on-chain metrics, investment strategy modeling, and historical performance tracking. Our existing calculators already provide deep Bitcoin-specific insights." },
  { question: "Will these tools integrate with wallets and exchanges?", answer: "Wallet and exchange integration is planned for future releases. We're exploring secure, read-only connections that would never require access to private keys. Development timelines for these features will be announced as they progress." },
  { question: "Will these Bitcoin analysis tools be free to use?", answer: "Like our existing calculators, we plan to keep core features completely free. Some advanced features for professional users may be offered as premium options in the future, but the fundamentals will always be accessible to everyone." },
  { question: "How secure will the tools be and what data will you collect?", answer: "Security is our top priority. All tools use encrypted connections and follow strict privacy protocols. Our existing calculators already process all data locally in your browser — no financial data is ever stored or transmitted to our servers." },
  { question: "What features will the Portfolio Tracker include?", answer: "The planned Portfolio Tracker will allow tracking Bitcoin holdings across multiple wallets and exchanges. Features under development include automatic position aggregation, cost basis tracking, and performance breakdowns. We'll share updates as development progresses." },
  { question: "What will the Security Checker do?", answer: "The Security Checker is being designed to analyze wallet setups and provide personalized security recommendations. It will aim to identify common configuration issues and guide users through best practices for Bitcoin storage security." },
  { question: "How will the Trend Predictor work?", answer: "The Trend Predictor will use statistical models to analyze historical price data and on-chain metrics. It's important to note that no tool can guarantee price predictions — our goal is to provide data-driven insights to complement your own research and analysis." },
  { question: "Will I be able to set up price alerts?", answer: "Price alerts are a planned feature that will allow notification rules based on price movements and percentage changes. The notification delivery methods are still being finalized — we'll announce supported channels as the feature develops." },
  { question: "What will the Market Analyzer include?", answer: "The Market Analyzer is being designed with a Bitcoin-first approach, focusing on on-chain analysis and Bitcoin-specific technical indicators. While still in development, our existing calculators already provide valuable market analysis tools including historical ROI, DCA modeling, and strategy comparison." },
  { question: "Can professional investors use these tools?", answer: "We're designing our tools to serve both individual and professional investors. Features like detailed reporting and data exports are planned. For now, our existing calculators provide comprehensive analysis suitable for investors of all levels." },
  { question: "Will the tools provide real-time blockchain data?", answer: "Real-time blockchain data is a planned feature for the Network Explorer. Some of our existing tools already use live data — the Transaction Fee Calculator pulls real-time mempool data, and the Lightning Network Calculator uses live network statistics." }
];

const faqDataTr = [
  { question: "Hangi Bitcoin araçları geliştiriliyor?", answer: "Portföy Takipçisi, Güvenlik Denetleyicisi, Piyasa Analizcisi, Ağ Gezgini, Fiyat Uyarıları ve Trend Tahmincisi dahil bir dizi Bitcoin odaklı araç geliştiriyoruz. Bu araçlar şu anda geliştirme aşamasındadır. Bu arada, DCA, emeklilik planlaması, vergi tahmini ve daha fazlası için 15+ ücretsiz Bitcoin hesaplayıcımızı keşfedin." },
  { question: "Araçlarınız normal kripto para uygulamalarından nasıl farklıdır?", answer: "Araçlarımız özellikle Bitcoin yatırımcıları için tasarlanmıştır. Binlerce token'ı kapsamak yerine, yalnızca Bitcoin analizine odaklanıyoruz — zincir üstü metrikler, yatırım stratejisi modelleme ve geçmiş performans takibi dahil. Mevcut hesaplayıcılarımız zaten derinlemesine Bitcoin'e özgü içgörüler sağlıyor." },
  { question: "Bu araçlar cüzdanlar ve borsalarla entegre olacak mı?", answer: "Cüzdan ve borsa entegrasyonu gelecekteki sürümler için planlanmaktadır. Özel anahtarlara erişim gerektirmeyen güvenli, salt okunur bağlantılar araştırıyoruz. Bu özellikler için geliştirme takvimleri ilerledikçe duyurulacaktır." },
  { question: "Bu Bitcoin analiz araçları ücretsiz mi olacak?", answer: "Mevcut hesaplayıcılarımız gibi temel özellikleri tamamen ücretsiz tutmayı planlıyoruz. Gelecekte profesyonel kullanıcılar için bazı gelişmiş özellikler premium seçenekler olarak sunulabilir, ancak temel işlevler her zaman herkese açık olacaktır." },
  { question: "Araçlar ne kadar güvenli olacak ve hangi verileri toplayacaksınız?", answer: "Güvenlik en öncelikli konumuz. Tüm araçlar şifreli bağlantılar kullanır ve katı gizlilik protokollerini takip eder. Mevcut hesaplayıcılarımız tüm verileri tarayıcınızda yerel olarak işliyor — hiçbir finansal veri sunucularımıza depolanmıyor veya iletilmiyor." },
  { question: "Portföy Takipçisi hangi özellikleri içerecek?", answer: "Planlanan Portföy Takipçisi, birden fazla cüzdan ve borsa genelinde Bitcoin varlıklarını takip etmeye olanak tanıyacak. Geliştirme aşamasındaki özellikler arasında otomatik pozisyon birleştirme, maliyet esası takibi ve performans dökümleri yer alıyor. Geliştirme ilerledikçe güncellemeleri paylaşacağız." },
  { question: "Güvenlik Denetleyicisi ne yapacak?", answer: "Güvenlik Denetleyicisi, cüzdan kurulumlarını analiz etmek ve kişiselleştirilmiş güvenlik önerileri sunmak için tasarlanıyor. Yaygın yapılandırma sorunlarını tespit etmeyi ve kullanıcıları Bitcoin depolama güvenliği için en iyi uygulamalar konusunda yönlendirmeyi amaçlıyor." },
  { question: "Trend Tahmincisi nasıl çalışacak?", answer: "Trend Tahmincisi, geçmiş fiyat verilerini ve zincir üstü metrikleri analiz etmek için istatistiksel modeller kullanacak. Hiçbir aracın fiyat tahminlerini garanti edemeyeceğini belirtmek önemlidir — amacımız, kendi araştırma ve analizinizi tamamlayacak veri odaklı içgörüler sunmaktır." },
  { question: "Fiyat uyarıları kurabilecek miyim?", answer: "Fiyat uyarıları, fiyat hareketlerine ve yüzde değişimlere dayalı bildirim kuralları oluşturmaya olanak tanıyacak planlanan bir özelliktir. Bildirim dağıtım yöntemleri hâlâ tamamlanma aşamasındadır — desteklenen kanallar özellik geliştikçe duyurulacaktır." },
  { question: "Piyasa Analizcisi neler içerecek?", answer: "Piyasa Analizcisi, zincir üstü analize ve Bitcoin'e özgü teknik göstergelere odaklanarak Bitcoin öncelikli bir yaklaşımla tasarlanıyor. Henüz geliştirme aşamasında olsa da mevcut hesaplayıcılarımız; geçmiş YG, DCA modelleme ve strateji karşılaştırması dahil değerli piyasa analizi araçları sunuyor." },
  { question: "Profesyonel yatırımcılar bu araçları kullanabilir mi?", answer: "Araçlarımızı hem bireysel hem de profesyonel yatırımcılara hizmet verecek şekilde tasarlıyoruz. Ayrıntılı raporlama ve veri dışa aktarma gibi özellikler planlanıyor. Şimdilik mevcut hesaplayıcılarımız her seviyeden yatırımcıya uygun kapsamlı analizler sunuyor." },
  { question: "Araçlar gerçek zamanlı blok zinciri verisi sağlayacak mı?", answer: "Gerçek zamanlı blok zinciri verisi, Ağ Gezgini için planlanan bir özelliktir. Mevcut araçlarımızın bazıları zaten canlı veri kullanıyor — İşlem Ücreti Hesaplayıcısı gerçek zamanlı mempool verisi çekiyor ve Lightning Ağı Hesaplayıcısı canlı ağ istatistikleri kullanıyor." }
];

export const ToolsFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqData = tr ? faqDataTr : faqDataEn;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr
              ? 'Bitcoin analiz araçlarımız ve yaklaşan özellikler hakkında sık sorulan soruların yanıtlarını alın'
              : 'Get answers to common questions about our Bitcoin analysis tools and upcoming features'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border/50 rounded-xl px-6">
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
