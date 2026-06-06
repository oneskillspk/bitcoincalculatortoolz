import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: 'What is the Bitcoin Fear & Greed Index?', a: 'The Bitcoin Fear & Greed Index is a market sentiment indicator that ranges from 0 (Extreme Fear) to 100 (Extreme Greed). It aggregates data from multiple sources — including volatility, trading volume, social media sentiment, surveys, Bitcoin dominance, and Google Trends — to produce a single number that represents overall market mood.' },
  { q: 'What does the Fear & Greed Index mean for buying Bitcoin?', a: 'Historically, periods of Extreme Fear (index below 25) have often been buying opportunities, as prices tend to recover from oversold conditions. Conversely, Extreme Greed (above 75) has often preceded corrections. However, the index is not a buy/sell signal on its own — it should be combined with your own research and risk tolerance.' },
  { q: 'How is the Bitcoin Fear & Greed Index calculated?', a: 'The index combines six weighted factors: Volatility (25%), Market Momentum/Volume (25%), Social Media sentiment (15%), Surveys (15%), Bitcoin Dominance (10%), and Google Trends (10%). Each factor is normalized and weighted to produce the final 0-100 score.' },
  { q: "What is 'Extreme Fear' in the crypto market?", a: 'Extreme Fear occurs when the index drops below 25. It means investors are very worried, selling pressure is high, and the market is broadly pessimistic. Historically, these periods have often marked local price bottoms, though timing exact bottoms is extremely difficult.' },
  { q: 'Is it good to buy Bitcoin when the Fear Index is low?', a: "Buying during fear has historically produced above-average returns over 30-day and 90-day horizons. However, this is a statistical tendency, not a guarantee. Dollar-cost averaging during fearful periods can help reduce timing risk. Always invest only what you can afford to lose." },
  { q: 'How often does the Fear & Greed Index update?', a: 'The index updates once daily, typically around midnight UTC. Our dashboard automatically refreshes to show the latest value. You can check back daily to monitor sentiment trends.' },
  { q: 'What happened to Bitcoin after past Extreme Fear periods?', a: 'Our historical analysis shows that Bitcoin has typically gained an average of 10-20% within 30 days of extreme fear readings, though individual outcomes vary widely. Some extreme fear periods preceded further declines before recovery.' },
  { q: "What does 'Extreme Greed' mean for Bitcoin's price?", a: "Extreme Greed (index above 75) suggests the market is overheated with excessive optimism. Historically, these periods have often — but not always — preceded pullbacks or corrections. It's a signal to be cautious, not necessarily to sell immediately." },
  { q: "Can the Fear & Greed Index predict Bitcoin's price?", a: "The index is a sentiment indicator, not a price predictor. It shows how the market *feels*, which can provide contrarian signals. Extreme readings at either end tend to be more predictive of reversals than mid-range readings, but no indicator can reliably predict future prices." },
  { q: 'What are the factors that make up the Fear & Greed Index?', a: "The six factors are: (1) Volatility — comparing current vs. historical volatility, (2) Market Momentum/Volume — current vs. average trading volume, (3) Social Media — sentiment analysis of crypto discussions, (4) Surveys — community polling data, (5) Bitcoin Dominance — BTC's share of total crypto market cap, and (6) Google Trends — search volume for Bitcoin-related terms." },
];

const faqsTr = [
  { q: 'Bitcoin Korku & Açgözlülük Endeksi nedir?', a: '0 (Aşırı Korku) ile 100 (Aşırı Açgözlülük) arasında değişen bir piyasa duygu göstergesidir. Genel piyasa ruh halini temsil eden tek bir sayı üretmek için oynaklık, işlem hacmi, sosyal medya duygusu, anketler, Bitcoin dominansı ve Google Trendler gibi birden fazla kaynaktan veri toplar.' },
  { q: 'Korku & Açgözlülük Endeksi Bitcoin satın almak için ne anlama gelir?', a: 'Tarihsel olarak Aşırı Korku dönemleri (endeks 25\'in altında), fiyatlar aşırı satım koşullarından toparlandığı için sıklıkla alım fırsatları olmuştur. Tersine Aşırı Açgözlülük (75\'in üzerinde) genellikle düzeltmelerden önce gelmiştir. Ancak endeks tek başına bir al/sat sinyali değildir — kendi araştırmanız ve risk toleransınızla birleştirilmelidir.' },
  { q: 'Bitcoin Korku & Açgözlülük Endeksi nasıl hesaplanır?', a: 'Endeks altı ağırlıklı faktörü birleştirir: Oynaklık (%25), Piyasa Momentumu/Hacmi (%25), Sosyal Medya Duygusu (%15), Anketler (%15), Bitcoin Dominansı (%10) ve Google Trendler (%10). Her faktör normalize edilir ve ağırlıklandırılarak nihai 0-100 skoru üretilir.' },
  { q: "Kripto piyasasında 'Aşırı Korku' ne anlama gelir?", a: 'Aşırı Korku, endeks 25\'in altına düştüğünde ortaya çıkar. Yatırımcıların çok endişeli olduğunu, satış baskısının yüksek olduğunu ve piyasanın genel olarak karamsar olduğunu gösterir. Tarihsel olarak bu dönemler sıklıkla yerel fiyat diplerine işaret etmiştir, ancak tam dipleri zamanlamak son derece zordur.' },
  { q: 'Korku Endeksi düşükken Bitcoin satın almak iyi midir?', a: 'Korku dönemlerinde satın almak tarihsel olarak 30 günlük ve 90 günlük dönemlerde ortalamanın üzerinde getiri sağlamıştır. Ancak bu istatistiksel bir eğilimdir, garanti değildir. Korku dönemlerinde dolar maliyet ortalaması (DCA) zamanlama riskini azaltmaya yardımcı olabilir. Her zaman yalnızca kaybetmeyi göze alabileceğiniz miktarda yatırım yapın.' },
  { q: 'Korku & Açgözlülük Endeksi ne sıklıkla güncellenir?', a: 'Endeks genellikle gece yarısı UTC saatinde olmak üzere günde bir kez güncellenir. Kontrol panelimiz en son değeri göstermek için otomatik olarak yenilenir. Duygu trendlerini izlemek için her gün kontrol edebilirsiniz.' },
  { q: 'Geçmişteki Aşırı Korku dönemlerinden sonra Bitcoin\'e ne oldu?', a: 'Tarihsel analizimiz, Bitcoin\'in aşırı korku okumalarından sonraki 30 gün içinde ortalama %10-20 kazandığını göstermektedir; ancak bireysel sonuçlar büyük ölçüde değişmektedir. Bazı aşırı korku dönemleri toparlanmadan önce daha fazla düşüşten önce gelmiştir.' },
  { q: "Bitcoin'in fiyatı için 'Aşırı Açgözlülük' ne anlama gelir?", a: "Aşırı Açgözlülük (endeks 75'in üzerinde), piyasanın aşırı iyimserlikle fazla ısındığını gösterir. Tarihsel olarak bu dönemler çoğu zaman — ancak her zaman değil — geri çekilmelerden veya düzeltmelerden önce gelmiştir. Bu, temkinli olmak için bir sinyaldir, mutlaka hemen satmak için değil." },
  { q: "Korku & Açgözlülük Endeksi Bitcoin'in fiyatını tahmin edebilir mi?", a: "Endeks bir duygu göstergesidir, fiyat tahmincisi değil. Piyasanın *nasıl hissettiğini* gösterir ve bu zıt sinyaller sağlayabilir. Her iki uçtaki aşırı okumalar, orta aralıklı okumalara göre dönüşleri daha iyi öngörme eğilimindedir; ancak hiçbir gösterge gelecekteki fiyatları güvenilir biçimde tahmin edemez." },
  { q: 'Korku & Açgözlülük Endeksini oluşturan faktörler nelerdir?', a: "Altı faktör şunlardır: (1) Oynaklık — mevcut ile geçmiş oynaklığın karşılaştırılması, (2) Piyasa Momentumu/Hacmi — mevcut ile ortalama işlem hacminin karşılaştırılması, (3) Sosyal Medya — kripto tartışmalarının duygu analizi, (4) Anketler — topluluk anket verileri, (5) Bitcoin Dominansı — BTC'nin toplam kripto piyasa değerindeki payı ve (6) Google Trendler — Bitcoin ile ilgili terimlerin arama hacmi." },
];

export const FearGreedFAQSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-4">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border/30 rounded-xl px-5 bg-card"
            >
              <AccordionTrigger className="text-sm sm:text-base font-medium text-foreground hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
