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
  { q: 'What percentage of people own Bitcoin?', a: 'It is estimated that around 106 million people worldwide hold Bitcoin as of early 2026, which is roughly 1.3% of the global population of 8.1 billion. However, the exact number is difficult to determine since one person can own multiple addresses and some addresses belong to exchanges holding Bitcoin for many users.' },
  { q: 'How much Bitcoin do I need to be in the top 1%?', a: 'To be in the top 1% of Bitcoin addresses by balance, you need approximately 1 BTC or more. Fewer than 1 million addresses hold 1+ BTC, putting whole-coiners in the top ~1.4% of all addresses with a balance. As adoption grows, this threshold will become increasingly difficult to reach.' },
  { q: 'How many people own 1 full Bitcoin?', a: 'Approximately 823,000 Bitcoin addresses hold 1 BTC or more. However, since one person can own multiple addresses and exchanges hold Bitcoin in omnibus wallets, the actual number of individuals who own a whole Bitcoin is likely lower, estimated between 500,000 and 800,000 people globally.' },
  { q: 'What is a Bitcoin whale?', a: 'A Bitcoin whale is an address (or entity) holding 1,000 or more BTC. As of 2026, fewer than 2,000 addresses qualify as whales. Their large holdings mean their buying and selling activity can significantly impact the market price. The term comes from the ocean-themed tier system used by the Bitcoin community.' },
  { q: 'How is Bitcoin wealth distributed?', a: "Bitcoin wealth distribution is highly concentrated. The top ~0.03% of addresses (sharks and above) hold over 60% of all Bitcoin. Meanwhile, roughly 58% of addresses hold less than 0.001 BTC (dust amounts). This Pareto-like distribution is common in both traditional finance and cryptocurrency markets." },
  { q: 'Am I rich if I own 0.1 Bitcoin?', a: 'Owning 0.1 BTC places you in the "Octopus" tier, ahead of approximately 92 to 94% of all Bitcoin addresses worldwide. While 0.1 BTC may not seem like a large amount in fiat terms today, it represents a significant position relative to the broader Bitcoin holder base and the fixed supply of 21 million coins.' },
  { q: 'What are the Bitcoin holder tiers (shrimp, crab, whale)?', a: 'The Bitcoin community uses ocean-themed names for holder tiers based on the amount of BTC held: Plankton (< 0.001), Shrimp (0.001-0.01), Crab (0.01-0.1), Octopus (0.1-1), Fish (1-10), Dolphin (10-100), Shark (100-1,000), Whale (1,000-10,000), Mega Whale (10,000-100,000), and Humpback (100,000+). These tiers help contextualize your holdings relative to others.' },
  { q: 'How many Bitcoin addresses exist?', a: 'There are approximately 57.97 million Bitcoin addresses with a non-zero balance as of 2026. The total number of addresses ever created is much higher (over 1 billion), but most have been emptied or contain only dust amounts. New addresses are created constantly as part of normal Bitcoin usage.' },
  { q: "What percentage of Bitcoin's total supply do I own?", a: 'With approximately 19.8 million BTC mined out of the maximum 21 million supply, owning even a small amount gives you a calculable share. For example, owning 1 BTC means you hold about 0.000005% of the total supply, a tiny fraction, but considering there are 8 billion people, that makes you exceptionally well-positioned.' },
  { q: 'How does Bitcoin compare to global wealth distribution?', a: "Bitcoin's wealth distribution mirrors and in some ways exceeds the inequality seen in traditional finance. The top 0.03% of Bitcoin addresses control over 60% of supply, compared to the real world where the top 1% of people hold about 46% of global wealth. However, Bitcoin's transparent blockchain makes this distribution publicly verifiable, unlike traditional finance." },
  { q: 'How many Bitcoin do you need to be a millionaire?', a: 'At a Bitcoin price of $100,000 per coin, you need 10 BTC to reach a $1 million position. At $200,000 per BTC the threshold drops to 5 BTC, and at $1,000,000 per BTC it falls to 1 BTC. The Future-Price Scenarios panel above shows your specific stack at $200K, $500K, and $1M price points.' },
  { q: 'What is a wholecoiner?', a: "A wholecoiner is anyone who owns at least 1 full Bitcoin in self-custody. With 21 million total coins and an estimated 500,000 to 800,000 individual wholecoiners worldwide, less than 0.01% of the global population can ever achieve this threshold. Wholecoiner status is a common medium-term accumulation goal for serious holders." },
  { q: 'How rare is owning 0.01 BTC?', a: '0.01 BTC, or 1 million satoshis, places you in the "Crab" tier above roughly 78% of all Bitcoin addresses with a balance. As the supply cap of 21 million BTC is asymptotically approached, this tier is expected to become increasingly difficult to enter.' },
  { q: 'Can everyone own 1 Bitcoin?', a: 'No. The math forbids it. With a hard cap of 21 million BTC and roughly 8.1 billion people on Earth, the maximum equally distributed share is about 0.0026 BTC, or 260,000 satoshis, per person.' },
  { q: 'How do exchange wallets affect the wealth distribution data?', a: "Centralized exchanges like Coinbase, Binance, and Kraken hold Bitcoin for millions of users in a small number of omnibus addresses. This skews the raw address distribution upward, making the network look more concentrated than the underlying ownership actually is." },
  { q: 'What percentile am I in if I own 1 satoshi?', a: 'Owning even 1 satoshi (0.00000001 BTC) places you in the bottom Plankton tier, but it still puts you ahead of roughly 99% of the human population since fewer than 1.5% of people on Earth own any Bitcoin at all.' },
  { q: 'How is the wealth percentile calculated?', a: 'The percentile is calculated using on-chain address distribution snapshots from BitInfoCharts and Glassnode, broken into 10 balance tiers. Your BTC amount is mapped into the matching tier and a linear interpolation determines your exact position.' },
];

const faqsTr = [
  { q: 'İnsanların yüzde kaçı Bitcoin sahibidir?', a: '2026 başı itibarıyla dünya genelinde yaklaşık 106 milyon kişinin Bitcoin sahibi olduğu tahmin edilmektedir; bu, 8,1 milyarlık küresel nüfusun yaklaşık %1,3\'üne karşılık gelir. Ancak kesin sayıyı belirlemek güçtür; zira bir kişi birden fazla adrese sahip olabilir ve bazı adresler pek çok kullanıcı için Bitcoin tutan borsalara aittir.' },
  { q: 'İlk %1\'de olmak için ne kadar Bitcoin gerekir?', a: "Bakiye bazında Bitcoin adreslerinin ilk %1'inde yer almak için yaklaşık 1 BTC veya daha fazlasına sahip olmanız gerekir. 1'den fazla BTC tutan adres sayısı 1 milyonun altındadır; bu da tam coin sahiplerini bakiyesi olan tüm adreslerin ilk ~%1,4'üne koymaktadır. Benimseme büyüdükçe bu eşiğe ulaşmak giderek güçleşecektir." },
  { q: '1 tam Bitcoin\'e kaç kişi sahiptir?', a: 'Yaklaşık 823.000 Bitcoin adresi 1 BTC veya daha fazlasına sahiptir. Ancak bir kişi birden fazla adrese sahip olabileceğinden ve borsalar Bitcoin\'i ortak cüzdanlarda tuttuğundan, gerçekte tam Bitcoin\'e sahip kişi sayısı daha düşüktür ve küresel olarak 500.000 ila 800.000 arasında tahmin edilmektedir.' },
  { q: 'Bitcoin balinası nedir?', a: '2026 itibarıyla 1.000 veya daha fazla BTC tutan bir adres (veya kuruluş). 2.000\'den az adres balina olarak nitelendirilebilmektedir. Büyük varlıkları nedeniyle alım ve satım faaliyetleri piyasa fiyatını önemli ölçüde etkileyebilir. Terim, Bitcoin topluluğunun kullandığı okyanus temalı kademeli sistemden gelmektedir.' },
  { q: 'Bitcoin serveti nasıl dağılmıştır?', a: 'Bitcoin servetinin dağılımı son derece yoğundur. En üstteki ~%0,03\'lük adresler (köpekbalıkları ve üzeri), tüm Bitcoin\'in %60\'ından fazlasını elinde tutmaktadır. Öte yandan adreslerin yaklaşık %58\'i 0,001 BTC\'den az (toz miktarlar) tutmaktadır. Bu Pareto benzeri dağılım, hem geleneksel finans hem de kripto para piyasalarında yaygındır.' },
  { q: '0,1 Bitcoin\'e sahipsem zengin sayılır mıyım?', a: '0,1 BTC sahibi olmak sizi "Ahtapot" kademesine koyar; bu, dünya genelindeki tüm Bitcoin adreslerinin yaklaşık %92 ila %94\'ünün önünde yer aldığınız anlamına gelir. 0,1 BTC bugün fiat para cinsinden büyük bir miktar gibi görünmese de geniş Bitcoin sahibi tabanı ve 21 milyon coin\'lik sabit arz göz önüne alındığında önemli bir konumu temsil etmektedir.' },
  { q: 'Bitcoin sahibi kademeleri (karides, yengeç, balina) nelerdir?', a: 'Bitcoin topluluğu, tutulan BTC miktarına göre okyanus temalı sahibi kademeleri kullanır: Plankton (< 0,001), Karides (0,001-0,01), Yengeç (0,01-0,1), Ahtapot (0,1-1), Balık (1-10), Yunus (10-100), Köpekbalığı (100-1.000), Balina (1.000-10.000), Mega Balina (10.000-100.000) ve Kambur Balina (100.000+). Bu kademeler, varlıklarınızı başkalarına göre bağlamlandırmaya yardımcı olur.' },
  { q: 'Kaç tane Bitcoin adresi mevcuttur?', a: '2026 itibarıyla sıfırdan fazla bakiyeye sahip yaklaşık 57,97 milyon Bitcoin adresi bulunmaktadır. Oluşturulan toplam adres sayısı çok daha yüksektir (1 milyarın üzerinde), ancak çoğu boşaltılmış veya yalnızca toz miktarlar içermektedir.' },
  { q: "Bitcoin'in toplam arzının yüzde kaçına sahibim?", a: 'Maksimum 21 milyon arzdan yaklaşık 19,8 milyon BTC madenciliği yapılmışken, küçük bir miktara bile sahip olmak hesaplanabilir bir pay sağlar. Örneğin 1 BTC sahibi olmak, toplam arzın yaklaşık %0,000005\'ini tuttuğunuz anlamına gelir.' },
  { q: 'Bitcoin küresel servet dağılımıyla nasıl karşılaştırılır?', a: "Bitcoin'in servet dağılımı, geleneksel finanstaki eşitsizliği yansıtmakta ve bazı açılardan aşmaktadır. Bitcoin adreslerinin en üstteki %0,03'ü arzın %60'ından fazlasını kontrol etmektedir. Ancak Bitcoin\'in şeffaf blok zinciri bu dağılımı geleneksel finansın aksine kamuya açık biçimde doğrulanabilir kılmaktadır." },
  { q: 'Milyoner olmak için ne kadar Bitcoin gerekir?', a: 'Bitcoin fiyatının coin başına 100.000 dolar olduğu bir senaryoda 1 milyon dolarlık bir pozisyona ulaşmak için 10 BTC gerekir. 200.000 dolar/BTC\'de eşik 5 BTC\'ye, 1.000.000 dolar/BTC\'de ise 1 BTC\'ye düşer.' },
  { q: 'Tam coin sahibi (wholecoiner) nedir?', a: "Tam coin sahibi, kendi saklama alanında en az 1 tam Bitcoin\'e sahip olan herkestir. 21 milyon toplam coin ve tahminen 500.000 ila 800.000 bireysel tam coin sahibiyle dünya nüfusunun %0,01'inden azı bu eşiğe ulaşabilir." },
  { q: '0,01 BTC sahip olmak ne kadar nadirdir?', a: '0,01 BTC (1 milyon satoshi), bakiyesi olan tüm Bitcoin adreslerinin yaklaşık %78\'inin önünde "Yengeç" kademesine koyar. 21 milyon BTC arz tavanı asimptotik olarak yaklaşılırken bu kademeye girmenin giderek güçleşmesi beklenmektedir.' },
  { q: 'Herkes 1 Bitcoin\'e sahip olabilir mi?', a: 'Hayır. Matematik buna izin vermiyor. 21 milyon BTC\'lik sert tavan ve Dünya\'da yaklaşık 8,1 milyar insanla, maksimum eşit dağıtım payı kişi başına yaklaşık 0,0026 BTC\'dir.' },
  { q: 'Borsa cüzdanları servet dağılımı verilerini nasıl etkiler?', a: 'Coinbase, Binance ve Kraken gibi merkezi borsalar, milyonlarca kullanıcı için Bitcoin\'i az sayıda ortak adreste tutmaktadır. Bu, ham adres dağılımını yukarıya çekerek ağın gerçek sahipliğin olduğundan daha yoğun görünmesine yol açar.' },
  { q: '1 satoshi\'ye sahipsem hangi yüzdelik dilimdeyim?', a: 'Yalnızca 1 satoshiye (0,00000001 BTC) sahip olmak sizi en alt Plankton kademesine koyar; ancak yine de Dünya nüfusunun yaklaşık %99\'unun önüne geçirir; zira Dünya\'daki insanların %1,5\'inden azı herhangi bir Bitcoin\'e sahiptir.' },
  { q: 'Servet yüzdelik dilimi nasıl hesaplanır?', a: 'Yüzdelik dilim, BitInfoCharts ve Glassnode\'dan alınan zincir üstü adres dağılımı anlık görüntüleri kullanılarak 10 bakiye kademesine bölünerek hesaplanır. BTC miktarınız eşleşen kademeye eşlenir ve doğrusal enterpolasyon tam konumunuzu belirler.' },
];

export const WealthFAQSection: React.FC = () => {
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

const wealthFaqJsonLd = faqsEn;
export const wealthFaqJsonLdEn = faqsEn;
export const wealthFaqJsonLdTr = faqsTr;
