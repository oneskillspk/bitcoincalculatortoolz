import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  {
    q: 'Who built Bitcoin Calculator Tools?',
    a: "Bitcoin Calculator Tools was created by Web3Believer, a Bitcoin investor and active multi-chain trader since around 2010, together with co-creator Webio, a financial writer and Web3 researcher. Web3Believer has been active on Twitter as @web3believers since 2011 and has been building tools for the Bitcoin community since 2024.",
  },
  {
    q: 'What data sources do the calculators use?',
    a: "All calculators use live price data from the CoinGecko public API, updated in real time. Historical Bitcoin price data goes back to Bitcoin's first tradeable price in 2010. Mining profitability calculations use real-time fee and hash rate data from mempool.space. Transaction fee estimates use live Bitcoin mempool data.",
  },
  {
    q: 'Why are all the tools free?',
    a: 'We believe every Bitcoin investor deserves access to professional-grade analysis tools regardless of how much they have invested. All 46+ calculators are completely free with no signup required, no premium tiers, and no hidden fees. That will never change.',
  },
  {
    q: 'How do you ensure data privacy?',
    a: 'All calculations run entirely in your browser using client-side JavaScript. No personal or financial data is ever sent to our servers, stored in any database, or shared with third parties. We use no cookies that track financial inputs, and all calculation data is cleared from browser memory when you close the tab.',
  },
  {
    q: 'Are the calculations accurate?',
    a: 'Yes. Every calculator is tested against known Bitcoin price milestones: $1 in February 2011, $1,000 in November 2013, $19,783 in December 2017, $69,044 in November 2021, $73,098 in March 2024, $108,135 in January 2025, and ~$126,000 in October 2025. Formulas are documented on each calculator page so you can independently verify any result. Results are for educational purposes and should not be treated as financial advice.',
  },
];

const faqsTr = [
  {
    q: "Bitcoin Hesaplayıcı Araçları kim kurdu?",
    a: "Bitcoin Hesaplayıcı Araçları, yaklaşık 2010'dan bu yana Bitcoin yatırımcısı ve aktif çok zincirli işlemci olan Web3Believer tarafından, finansal yazar ve Web3 araştırmacısı olan ortak yaratıcı Webio ile birlikte oluşturuldu. Web3Believer, 2011'den bu yana Twitter'da @web3believers olarak aktiftir ve 2024'ten bu yana Bitcoin topluluğu için araçlar geliştirmektedir.",
  },
  {
    q: "Hesap makineleri hangi veri kaynaklarını kullanıyor?",
    a: "Tüm hesap makineleri, gerçek zamanlı olarak güncellenen CoinGecko genel API'sinden canlı fiyat verilerini kullanır. Tarihsel Bitcoin fiyat verileri, Bitcoin'in 2010'daki ilk işlem fiyatına kadar geriye gitmektedir. Madencilik karlılığı hesaplamaları, mempool.space'den gerçek zamanlı ücret ve hash hızı verilerini kullanır. İşlem ücreti tahminleri canlı Bitcoin mempool verilerini kullanır.",
  },
  {
    q: "Neden tüm araçlar ücretsiz?",
    a: "Her Bitcoin yatırımcısının, ne kadar yatırım yaptığından bağımsız olarak profesyonel kalitede analiz araçlarına erişmeyi hak ettiğine inanıyoruz. 46'dan fazla hesap makinenin tamamı, kayıt gerekmeksizin, premium katman veya gizli ücret olmaksızın tamamen ücretsizdir. Bu hiçbir zaman değişmeyecek.",
  },
  {
    q: "Veri gizliliğini nasıl sağlıyorsunuz?",
    a: "Tüm hesaplamalar, istemci taraflı JavaScript kullanılarak tamamen tarayıcınızda çalışır. Hiçbir kişisel veya finansal veri sunucularımıza gönderilmez, herhangi bir veritabanında saklanmaz veya üçüncü taraflarla paylaşılmaz. Finansal girdileri izleyen çerez kullanmıyoruz ve tüm hesaplama verileri sekmeyi kapattığınızda tarayıcı belleğinden temizleniyor.",
  },
  {
    q: "Hesaplamalar doğru mu?",
    a: "Evet. Her hesap makinesi, bilinen Bitcoin fiyat kilometre taşlarına göre test edilmiştir: Şubat 2011'de 1 $, Kasım 2013'te 1.000 $, Aralık 2017'de 19.783 $, Kasım 2021'de 69.044 $, Mart 2024'te 73.098 $, Ocak 2025'te 108.135 $ ve Ekim 2025'te yaklaşık 126.000 $. Formüller her hesap makinesi sayfasında belgelenmiştir, böylece herhangi bir sonucu bağımsız olarak doğrulayabilirsiniz. Sonuçlar eğitim amaçlıdır ve finansal tavsiye olarak değerlendirilmemelidir.",
  },
];

export const AboutFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.18em]">
              {tr ? 'SSS' : 'FAQ'}
            </span>
            <h2 className="mt-4 mb-5 text-[1.875rem] sm:text-[2.25rem] md:text-[2.5rem] font-light tracking-[-0.01em] leading-[1.12] text-foreground">
              {tr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed text-pretty max-w-prose">
              {tr
                ? "Bitcoin Hesaplayıcı Araçları, veri kaynaklarımız ve gizlilik uygulamalarımız hakkında."
                : "Common questions about Bitcoin Calculator Tools, our data sources, and privacy practices."}
            </p>
          </div>

          <Accordion type="single" collapsible className="border-y border-border/50 divide-y divide-border/40">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`about-faq-${i}`}
                className="border-0"
              >
                <AccordionTrigger className="py-5 text-left text-[15px] font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-muted-foreground leading-[1.7] pb-6 pr-8">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
