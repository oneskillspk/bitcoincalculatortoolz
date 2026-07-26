import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: 'When is the next Bitcoin halving?', a: 'The next Bitcoin halving (#5) is estimated to occur around April 2028 at block height 1,050,000. The exact date depends on the average block time, which varies. Our countdown uses live block height data from the Bitcoin network for the most accurate estimate.' },
  { q: 'What is a Bitcoin halving?', a: "A Bitcoin halving is a pre-programmed event in Bitcoin's code that cuts the block reward (new BTC created per block) in half every 210,000 blocks, approximately every 4 years. This mechanism controls Bitcoin's inflation rate and ensures the total supply never exceeds 21 million BTC." },
  { q: "What happens to Bitcoin's price after a halving?", a: "Historically, every Bitcoin halving has been followed by a significant price increase within 12-18 months. After Halving #1 (2012), Bitcoin rose ~8,000%. After #2 (2016), it gained ~2,900%. After #3 (2020), it rose ~542%. However, past performance doesn't guarantee future results, and each cycle has shown diminishing percentage returns." },
  { q: 'How many Bitcoin halvings have there been?', a: 'There have been 4 Bitcoin halvings so far: November 2012 (50→25 BTC), July 2016 (25→12.5 BTC), May 2020 (12.5→6.25 BTC), and April 2024 (6.25→3.125 BTC). The next halving (#5) will reduce the reward to 1.5625 BTC per block.' },
  { q: 'What is the current Bitcoin block reward?', a: 'As of the latest halving in April 2024, the Bitcoin block reward is 3.125 BTC per block. This means miners receive 3.125 new Bitcoin for each block they successfully mine, which occurs approximately every 10 minutes.' },
  { q: 'How many Bitcoin are left to mine?', a: 'Approximately 1.2 million Bitcoin remain to be mined out of the 21 million total supply. About 94% of all Bitcoin have already been created. Due to the halving schedule, the remaining BTC will be released at an ever-decreasing rate until around the year 2140.' },
  { q: 'Why does Bitcoin halving affect the price?', a: "The halving reduces the rate of new Bitcoin supply entering the market. With demand staying the same or increasing, basic supply-and-demand economics suggests upward price pressure. Additionally, the halving reinforces Bitcoin's scarcity narrative, often increasing investor interest and media coverage around the event." },
  { q: 'How is the halving date calculated?', a: 'The halving occurs at a specific block height, not a calendar date. Since blocks are mined approximately every 10 minutes on average, we calculate the estimated date by: (target block - current block) × 10 minutes. This gives an approximation that can shift based on actual mining hashrate and difficulty adjustments.' },
  { q: 'What was the biggest price increase after a Bitcoin halving?', a: "The biggest post-halving price increase occurred after Halving #1 in November 2012. Bitcoin's price rose from $12.35 to an all-time high of $1,163 within about a year — a gain of approximately 9,300%. Each subsequent cycle has seen smaller percentage gains but much larger absolute dollar increases." },
  { q: 'When will the last Bitcoin be mined?', a: 'The last Bitcoin is expected to be mined around the year 2140. After all 21 million BTC are created, miners will earn revenue solely from transaction fees. However, over 98% of all Bitcoin will have been mined by 2030, with the remaining 2% being released extremely slowly over the final 110 years.' },
  { q: 'How does the Bitcoin halving affect my investment?', a: 'Each halving reduces the rate of new Bitcoin supply, historically triggering major price rallies within 12–18 months. Use our halving countdown alongside the profit calculator to model how different post-halving price targets would affect your portfolio.' },
  { q: 'What is the daily Bitcoin issuance after the 2024 halving?', a: 'With the block reward at 3.125 BTC and roughly 144 blocks mined per day, approximately 450 BTC enter circulation each day. After the 2028 halving, that figure drops to about 225 BTC per day — a number small enough that a single spot ETF can absorb the entire daily issuance during periods of strong inflows.' },
  { q: 'Why are post-halving returns getting smaller each cycle?', a: "As Bitcoin's market cap grows, it takes exponentially more capital to move the price. Going from $12 to $1,000 (Halving #1) was an $988 move requiring relatively modest inflows. Going from $64,000 to $640,000 would require trillions in new capital. The diminishing-returns pattern reflects Bitcoin maturing into a multi-trillion-dollar asset class." },
  { q: 'How accurate is the halving countdown date?', a: "Our countdown uses the live current block height pulled from the Bitcoin network every 60 seconds, then projects forward at the protocol's 10-minute target block time. The actual date can drift by days or weeks depending on hashrate changes and difficulty adjustments. As the halving approaches, the estimate becomes increasingly precise." },
  { q: "What is the stock-to-flow ratio and how does the halving affect it?", a: "Stock-to-flow (S2F) measures existing supply (stock) divided by annual new production (flow). Each halving doubles Bitcoin's S2F by cutting flow in half. After the 2024 halving, Bitcoin's S2F surpassed gold's. After the 2028 halving, it will be roughly double gold's — making Bitcoin the scarcest monetary asset in human history by this metric." },
  { q: 'Do miners shut down after a halving?', a: 'Some do. The halving instantly cuts mining revenue by 50% in BTC terms, forcing the least efficient miners offline. This typically causes a temporary hashrate drop, followed by a difficulty adjustment that makes mining easier for the survivors. Within 2-4 months, hashrate usually recovers and grows beyond pre-halving levels as more efficient hardware comes online.' },
  { q: 'What happens to Bitcoin when there are no more rewards in 2140?', a: 'Once all 21 million BTC are mined, miners will earn revenue exclusively from transaction fees. The network is designed for this transition — fee revenue already represents 1-15% of miner income depending on network activity. By 2140, ordinals, Lightning settlements, and other on-chain demand are expected to sustain a robust fee market.' },
  { q: 'How many days until the next Bitcoin halving?', a: 'The next halving is estimated for April 2028 at block 1,050,000 — roughly 800+ days from January 2026. The live countdown at the top of this page pulls the current block height from the Bitcoin network every 60 seconds, so the number remains accurate as the network\'s 10-minute average block time drifts.' },
];

const faqsTr = [
  { q: 'Bir sonraki Bitcoin yarılanması ne zaman?', a: 'Bir sonraki Bitcoin yarılanması (#5), 1.050.000 blok yüksekliğinde yaklaşık Nisan 2028\'de gerçekleşmesi beklenmektedir. Kesin tarih, değişken olan ortalama blok süresine bağlıdır. Geri sayımımız, en doğru tahmin için Bitcoin ağından canlı blok yüksekliği verilerini kullanır.' },
  { q: 'Bitcoin yarılanması nedir?', a: "Bitcoin yarılanması, Bitcoin'in kodunda önceden programlanmış ve her 210.000 blokta (yaklaşık her 4 yılda bir) blok ödülünü (blok başına oluşturulan yeni BTC) yarıya indiren bir olaydır. Bu mekanizma Bitcoin'in enflasyon oranını kontrol eder ve toplam arzın hiçbir zaman 21 milyon BTC'yi aşmamasını sağlar." },
  { q: "Yarılanmadan sonra Bitcoin'in fiyatına ne olur?", a: "Tarihsel olarak her Bitcoin yarılanması, 12-18 ay içinde önemli bir fiyat artışıyla takip edilmiştir. Yarılanma #1'den (2012) sonra Bitcoin yaklaşık %8.000 yükseldi. #2'den (2016) sonra yaklaşık %2.900 kazandı. #3'ten (2020) sonra yaklaşık %542 yükseldi. Ancak geçmiş performans gelecekteki sonuçları garanti etmez ve her döngü azalan yüzde getirileri göstermiştir." },
  { q: 'Kaç tane Bitcoin yarılanması oldu?', a: 'Şimdiye kadar 4 Bitcoin yarılanması oldu: Kasım 2012 (50→25 BTC), Temmuz 2016 (25→12.5 BTC), Mayıs 2020 (12.5→6.25 BTC) ve Nisan 2024 (6.25→3.125 BTC). Bir sonraki yarılanma (#5) ödülü blok başına 1.5625 BTC\'ye indirecek.' },
  { q: 'Mevcut Bitcoin blok ödülü nedir?', a: 'Nisan 2024\'teki son yarılanma itibarıyla Bitcoin blok ödülü blok başına 3.125 BTC\'dir. Bu, madencilerin başarıyla maden yaptıkları her blok için 3.125 yeni Bitcoin aldığı anlamına gelir ve bu yaklaşık her 10 dakikada bir gerçekleşir.' },
  { q: 'Kaç Bitcoin daha madenciliği yapılacak?', a: '21 milyon toplam arzın yaklaşık 1.2 milyonu hâlâ madenciliği yapılacak. Tüm Bitcoin\'lerin yaklaşık %94\'ü zaten oluşturuldu. Yarılanma takvimi nedeniyle kalan BTC, 2140 yılına kadar giderek azalan bir hızda serbest bırakılacak.' },
  { q: 'Bitcoin yarılanması fiyatı neden etkiliyor?', a: "Yarılanma, piyasaya giren yeni Bitcoin arzının oranını azaltır. Talep aynı kalırken veya artarken temel arz-talep ekonomisi yukarı yönlü fiyat baskısını önerir. Ek olarak yarılanma, Bitcoin'in kıtlık anlatısını pekiştirir ve genellikle olay etrafında yatırımcı ilgisini ve medya haberlerini artırır." },
  { q: 'Yarılanma tarihi nasıl hesaplanır?', a: 'Yarılanma, takvim tarihine değil belirli bir blok yüksekliğine göre gerçekleşir. Bloklar ortalama yaklaşık her 10 dakikada bir madenciliği yapıldığından, tahmini tarihi şu şekilde hesaplarız: (hedef blok - mevcut blok) × 10 dakika. Bu, gerçek madencilik hash oranına ve zorluk ayarlamalarına göre değişebilecek bir yaklaşık değer verir.' },
  { q: 'Bitcoin yarılanmasından sonraki en büyük fiyat artışı ne oldu?', a: "Yarılanma sonrası en büyük fiyat artışı, Kasım 2012'deki Yarılanma #1'den sonra yaşandı. Bitcoin'in fiyatı yaklaşık bir yıl içinde 12.35 dolardan 1.163 dolarlık tüm zamanların en yüksek değerine ulaştı — yaklaşık %9.300'lük bir artış. Her sonraki döngü daha küçük yüzde kazançlar ancak çok daha büyük mutlak dolar artışları gördü." },
  { q: 'Son Bitcoin ne zaman madenciliği yapılacak?', a: 'Son Bitcoin\'in yaklaşık 2140 yılında madenciliği yapılması bekleniyor. 21 milyon BTC\'nin tamamı oluşturulduktan sonra madenciler yalnızca işlem ücretlerinden gelir elde edecek. Ancak tüm Bitcoin\'lerin %98\'inden fazlası 2030\'a kadar madenciliği yapılmış olacak; kalan %2 ise son 110 yıl boyunca son derece yavaş serbest bırakılacak.' },
  { q: 'Bitcoin yarılanması yatırımımı nasıl etkiler?', a: 'Her yarılanma, yeni Bitcoin arzının oranını azaltır; bu tarihsel olarak 12-18 ay içinde büyük fiyat rallilerine yol açmaktadır. Farklı yarılanma sonrası fiyat hedeflerinin portföyünüzü nasıl etkileyeceğini modellemek için yarılanma geri sayımımızı kâr hesaplayıcısıyla birlikte kullanın.' },
  { q: '2024 yarılanmasından sonra günlük Bitcoin ihracı ne kadardır?', a: 'Blok ödülü 3.125 BTC ve günde yaklaşık 144 blok madenciliği yapılırken, her gün yaklaşık 450 BTC dolaşıma giriyor. 2028 yarılanmasından sonra bu rakam günde yaklaşık 225 BTC\'ye düşecek — güçlü girişler dönemlerinde tek bir spot ETF\'nin tüm günlük ihracı emebileceği kadar küçük bir rakam.' },
  { q: 'Yarılanma sonrası getiriler neden her döngüde azalıyor?', a: "Bitcoin'in piyasa değeri büyüdükçe fiyatı hareket ettirmek için üstel olarak daha fazla sermaye gerekiyor. 12 dolardan 1.000 dolara gitmek (Yarılanma #1) nispeten mütevazı girişler gerektiren 988 dolarlık bir hareketti. 64.000 dolardan 640.000 dolara gitmek ise trilyonlarca yeni sermaye gerektirecektir. Azalan getiriler kalıbı, Bitcoin'in trilyon dolarlık bir varlık sınıfına olgunlaşmasını yansıtmaktadır." },
  { q: 'Yarılanma geri sayım tarihi ne kadar doğru?', a: "Geri sayımımız, Bitcoin ağından her 60 saniyede çekilen canlı mevcut blok yüksekliğini kullanır, ardından protokolün 10 dakikalık hedef blok süresiyle ileriye doğru projeksiyon yapar. Gerçek tarih, hash oranı değişikliklerine ve zorluk ayarlamalarına bağlı olarak günler veya haftalar kayabilir. Yarılanma yaklaştıkça tahmin giderek daha kesin hale gelir." },
  { q: "Stok/akış oranı nedir ve yarılanma bunu nasıl etkiler?", a: "Stok/akış (S2F), mevcut arzı (stok) yıllık yeni üretim (akış) ile böler. Her yarılanma, akışı yarıya indirerek Bitcoin'in S2F'sini ikiye katlar. 2024 yarılanmasından sonra Bitcoin'in S2F'si altını geçti. 2028 yarılanmasından sonra altının yaklaşık iki katı olacak — bu metrik ile Bitcoin'i insanlık tarihinin en kıt para varlığı yapacak." },
  { q: 'Madenciler yarılanmadan sonra kapanıyor mu?', a: 'Bazıları kapanıyor. Yarılanma, madencilik gelirini BTC cinsinden anında %50 kesilerek en verimsiz madencileri çevrimdışı bırakıyor. Bu genellikle geçici bir hash oranı düşüşüne yol açar, ardından hayatta kalanlar için madenciliği kolaylaştıran bir zorluk ayarlaması gelir. 2-4 ay içinde hash oranı genellikle toparlanır ve daha verimli donanım devreye girdikçe yarılanma öncesi seviyelerin üzerine çıkar.' },
  { q: '2140\'ta artık ödül kalmayınca Bitcoin\'e ne olur?', a: 'Tüm 21 milyon BTC madenciliği yapıldıktan sonra madenciler gelirlerini yalnızca işlem ücretlerinden elde edecek. Ağ bu geçiş için tasarlandı — ücret geliri ağ aktivitesine bağlı olarak zaten madenci gelirinin %1-15\'ini temsil ediyor. 2140\'a gelindiğinde, ordinaller, Lightning ödemeleri ve diğer zincir üstü talep sağlam bir ücret piyasasını sürdürmesi bekleniyor.' },
  { q: 'Bir sonraki Bitcoin yarılanmasına kaç gün kaldı?', a: 'Bir sonraki yarılanma Nisan 2028 için, blok 1.050.000\'de tahmin edilmektedir — Ocak 2026\'dan itibaren yaklaşık 800+ gün. Sayfanın üstündeki canlı geri sayım, Bitcoin ağından mevcut blok yüksekliğini her 60 saniyede bir çeker; bu nedenle ağın 10 dakikalık ortalama blok süresi kaysa bile sayı doğru kalır.' },
];

export const HalvingFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqItems = tr ? faqsTr : faqsEn;

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
              ? 'Bitcoin yarılanmaları ve etkileri hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin halvings and their impact'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card border border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
