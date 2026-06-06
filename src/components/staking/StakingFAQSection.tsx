import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: "What is Bitcoin staking?", answer: "Bitcoin staking is the process of locking up your BTC (or a wrapped version) in a protocol to earn yield. Unlike Ethereum's Proof-of-Stake, native Bitcoin doesn't have built-in staking — so platforms like Babylon use cryptographic time-lock scripts, while others like Lido wrap BTC into DeFi protocols. Binance Earn uses custodial lending. All approaches generate yield but with very different risk profiles." },
  { question: "Is Bitcoin staking safe? What are the risks?", answer: "Risk varies sharply by protocol. Babylon (non-custodial, native BTC) carries the lowest risk — your private keys stay with you and Bitcoin never leaves its chain. Lido wBTC introduces smart contract risk: bugs in Ethereum DeFi contracts could result in loss of funds. Binance Earn is custodial — you trust Binance as counterparty. If Binance has liquidity issues, your BTC is at risk. Always stake only what you can afford to lose and diversify across protocols." },
  { question: "What is Babylon Protocol and how does it work?", answer: "Babylon is a Bitcoin staking protocol that uses Bitcoin's native scripting language (no bridge, no wrapping) to allow BTC holders to stake their coins and earn yield. It works through cryptographic time-lock contracts: you lock BTC on Bitcoin's chain, and Babylon's PoS chains use your locked BTC as economic security. If a validator misbehaves, your stake can be slashed. The mechanism is trustless and non-custodial — your BTC never leaves the Bitcoin blockchain." },
  { question: "What is the difference between simple and compound staking?", answer: "Simple interest staking calculates rewards linearly: Rewards = Principal × APY × Years. Your yield does not generate additional yield. Compound staking reinvests your rewards annually: Final Balance = Principal × (1 + APY)^Years. Over 10 years at 4.5% APY, 1 BTC grows to 1.0450 BTC (simple) vs 1.0552 BTC (compound). The difference amplifies significantly at higher APYs or longer durations." },
  { question: "How often do staking APYs change?", answer: "APY rates change frequently — sometimes daily. Babylon's rate depends on demand from PoS chains securing against Bitcoin. Lido wBTC APY shifts with DeFi lending markets. Binance adjusts rates weekly based on platform liquidity. This calculator uses verified rates published as of January 2026 for reference. Always check the protocol's official platform for current rates before staking real funds." },
  { question: "What is a Bitcoin yield calculator?", answer: "A Bitcoin yield calculator estimates how much BTC you can earn by staking or lending your holdings over time. Our calculator compares yield rates across Babylon, Lido wBTC, and Binance Earn — with both simple and compound interest projections over 1 to 10 years." },
];

const faqsTr = [
  { question: "Bitcoin stake etme nedir?", answer: "Bitcoin stake etme, getiri elde etmek için BTC'nizi (veya sarılmış bir versiyonunu) bir protokolde kilitleme işlemidir. Ethereum'un Proof-of-Stake'inin aksine, yerel Bitcoin'de yerleşik stake etme yoktur — bu yüzden Babylon gibi platformlar kriptografik zaman kilidi komut dosyaları kullanırken, Lido gibi diğerleri BTC'yi DeFi protokollerine sarar. Binance Earn saklı borç verme kullanır. Tüm yaklaşımlar getiri üretir, ancak çok farklı risk profilleriyle." },
  { question: "Bitcoin stake etme güvenli mi? Riskler nelerdir?", answer: "Risk protokole göre önemli ölçüde farklılık gösterir. Babylon (saklı olmayan, yerel BTC) en düşük riski taşır — özel anahtarlarınız sizde kalır ve Bitcoin hiçbir zaman zincirini terk etmez. Lido wBTC akıllı sözleşme riski getirir: Ethereum DeFi sözleşmelerindeki hatalar fon kaybına yol açabilir. Binance Earn saklamalıdır — Binance'e karşı taraf olarak güvenirsiniz. Binance'in likidite sorunları varsa BTC'niz risk altındadır. Her zaman yalnızca kaybetmeyi göze alabileceğiniz miktarı stake edin ve protokoller arasında çeşitlendirin." },
  { question: "Babylon Protokolü nedir ve nasıl çalışır?", answer: "Babylon, BTC sahiplerinin coinlerini stake etmesine ve getiri kazanmasına olanak tanımak için Bitcoin'in yerel komut dosyası dilini (köprü yok, sarma yok) kullanan bir Bitcoin stake etme protokolüdür. Kriptografik zaman kilidi sözleşmeleri aracılığıyla çalışır: Bitcoin zincirinde BTC kilitlersiniz ve Babylon'un PoS zincirleri kilitli BTC'nizi ekonomik güvenlik olarak kullanır. Bir doğrulayıcı kötü davranırsa stake'iniz kesilebilir. Mekanizma güvenilirdir ve saklı değildir — BTC'niz asla Bitcoin blokzincirini terk etmez." },
  { question: "Basit ve bileşik stake etme arasındaki fark nedir?", answer: "Basit faiz stake etmesi ödülleri doğrusal olarak hesaplar: Ödüller = Anapara × APY × Yıllar. Getiriniz ek getiri üretmez. Bileşik stake etme ödüllerinizi yıllık olarak yeniden yatırır: Son Bakiye = Anapara × (1 + APY)^Yıllar. %4,5 APY ile 10 yıl boyunca 1 BTC, 1,0450 BTC'ye (basit) karşılık 1,0552 BTC'ye (bileşik) büyür. Fark, daha yüksek APY'lerde veya uzun süreler boyunca önemli ölçüde ampliye olur." },
  { question: "Stake etme APY'leri ne sıklıkla değişiyor?", answer: "APY oranları sık sık değişir — bazen günlük. Babylon'un oranı Bitcoin'e karşı güvenlik sağlayan PoS zincirlerinden gelen talebe bağlıdır. Lido wBTC APY'si DeFi borç verme piyasalarıyla birlikte değişir. Binance oranları platform likiditesine göre haftalık olarak ayarlar. Bu hesap makinesi referans için Ocak 2026 itibarıyla yayınlanan doğrulanmış oranları kullanır. Gerçek fonları stake etmeden önce her zaman güncel oranlar için protokolün resmi platformunu kontrol edin." },
  { question: "Bitcoin getiri hesaplayıcısı nedir?", answer: "Bitcoin getiri hesaplayıcısı, varlıklarınızı zaman içinde stake ederek veya ödünç vererek ne kadar BTC kazanabileceğinizi tahmin eder. Hesaplayıcımız 1 ila 10 yıl boyunca hem basit hem de bileşik faiz projeksiyonlarıyla Babylon, Lido wBTC ve Binance Earn genelinde getiri oranlarını karşılaştırır." },
];

export const StakingFAQSection = () => {
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
              ? 'Bitcoin stake etme ve getiri hesaplamaları hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin staking and yield calculations'}
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
