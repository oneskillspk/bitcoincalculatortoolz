import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqs = [
  { question: "What is 'Stacking Sats' and why is it important?", answer: "Stacking Sats refers to the practice of regularly accumulating small amounts of Bitcoin (satoshis) over time. One Bitcoin equals 100 million satoshis. This strategy is important because it allows you to build a Bitcoin position gradually through dollar-cost averaging, reducing the impact of price volatility and making Bitcoin accumulation accessible regardless of your budget." },
  { question: "How does this calculator estimate time to reach my goal?", answer: "The calculator uses your monthly investment amount, current BTC price, and expected annual growth rate to project how long it will take to reach your goal. It factors in price appreciation over time using compound growth models, showing realistic timelines under different market scenarios (conservative 10%, moderate 15%, or optimistic 25% annual growth)." },
  { question: "What if Bitcoin's price changes dramatically?", answer: "That's why we provide three scenarios: conservative, moderate, and optimistic. Bitcoin is known for volatility, so these projections help you understand best-case, worst-case, and likely outcomes. The calculator also shows your average buy price, which tends to smooth out volatility when dollar-cost averaging over time." },
  { question: "What are the popular Bitcoin goal milestones?", answer: "Common goals include: 0.01 BTC (1 million sats - a starter stack), 0.1 BTC (10 million sats - serious accumulator), 0.5 BTC (50 million sats - significant holder), 1.0 BTC (whole coiner - rare achievement), and 2.1 BTC (top 1% of all possible Bitcoin holders, as only 21 million BTC will ever exist)." },
  { question: "Should I use conservative or optimistic growth rates?", answer: "It depends on your planning style. Conservative (10%) is good for cautious planning and ensures you're not disappointed if growth is slower. Moderate (15%) reflects Bitcoin's historical long-term average. Optimistic (25%) shows potential upside but shouldn't be relied upon for critical planning. We recommend reviewing all three scenarios." },
  { question: "Can I update my plan as I progress?", answer: "Absolutely! You should revisit this calculator regularly as your circumstances change. Update your current holdings, adjust monthly contributions if your budget changes, and reassess growth expectations based on market conditions. The calculator is designed for ongoing planning, not just one-time projections." },
  { question: "How many satoshis are in one Bitcoin?", answer: "There are exactly 100,000,000 (one hundred million) satoshis in a single Bitcoin. Named after Bitcoin's pseudonymous creator Satoshi Nakamoto, the satoshi is the smallest on-chain unit. This divisibility allows anyone to own meaningful fractions of Bitcoin regardless of its price per coin." },
  { question: "What is the best strategy to stack sats on a small budget?", answer: "Micro-DCA is the most effective approach for small budgets. Instead of one monthly buy, split your allocation into weekly or even daily purchases. Many exchanges allow recurring buys as low as $1. This smooths out short-term price swings and removes the temptation to time the market. Round-up apps that convert spare change into sats are another low-friction method." },
  { question: "How many sats per dollar can I buy right now?", answer: "The number of sats per dollar fluctuates with Bitcoin's price. At $100,000 per BTC, one dollar buys roughly 1,000 sats. At $50,000 per BTC, one dollar buys about 2,000 sats. Use the calculator above with your local currency to see the exact figure based on the live market price." },
  { question: "Is it too late to start stacking sats in 2026?", answer: "Many long-term holders argue it is never too late. Bitcoin's fixed supply of 21 million coins means scarcity increases over time, especially after each halving event. Starting now still places you ahead of the vast majority of the global population who own zero Bitcoin. The key is consistency, not timing." },
  { question: "Should I self-custody my stacked sats?", answer: "Self-custody is recommended once your stack reaches a meaningful threshold — often cited as 1 million sats (0.01 BTC). Hardware wallets like Ledger or Trezor let you verify your holdings on-chain without trusting an exchange. Until then, reputable exchanges with proof-of-reserves offer a practical starting point." },
  { question: "How does Bitcoin's halving affect my stacking plan?", answer: "Halvings cut the block reward miners receive in half roughly every four years, reducing new supply entering the market. Historically, halvings have preceded significant price appreciation within 12–18 months. If your stacking plan spans multiple years, earlier contributions benefit most from post-halving price rallies." }
];

export const StackSatsFAQSection = () => {
  const { language } = useLanguage();
  const tr = language==='tr';
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6"><HelpCircle className="w-4 h-4" />FAQ</div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">{tr ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{tr ? 'Satoshi biriktirme ve Bitcoin hedef planlaması hakkında bilmeniz gereken her şey' : 'Everything you need to know about stacking sats and planning your Bitcoin goals'}</p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => {
            const trFaq = tr ? [
              'Satoshi biriktirme, zaman içinde düzenli olarak küçük Bitcoin miktarları (satoshi) biriktirme pratiğidir. 1 Bitcoin tam 100 milyon satoshi eder. Bu strateji, dolar maliyeti ortalaması ile kademeli pozisyon kurmanıza yardımcı olur; fiyat oynaklığının etkisini azaltır ve bütçeniz ne olursa olsun Bitcoin birikimini erişilebilir kılar.',
              'Hesaplayıcı, aylık yatırım tutarınızı, güncel BTC fiyatını ve beklenen yıllık büyüme oranını kullanarak hedefinize ne kadar sürede ulaşacağınızı tahmin eder. Bileşik büyüme modelleriyle zaman çizelgesi üretir ve farklı piyasa senaryolarında (muhafazakar %10, orta %15 veya iyimser %25 yıllık büyüme) gerçekçi projeksiyonlar gösterir.',
              'Bu yüzden üç senaryo sunuyoruz: muhafazakar, orta ve iyimser. Bitcoin oynaklığıyla bilinir; bu projeksiyonlar en iyi, en kötü ve olası sonuçları anlamanıza yardımcı olur. Hesaplayıcı ayrıca ortalama alış fiyatınızı gösterir; bu da zaman içinde DCA yaparken oynaklığı yumuşatır.',
              'Yaygın hedefler şunlardır: 0.01 BTC (1 milyon sats - başlangıç stoku), 0.1 BTC (10 milyon sats - ciddi biriktirici), 0.5 BTC (50 milyon sats - önemli miktar), 1.0 BTC (tam coiner - nadir başarı) ve 2.1 BTC (yalnızca 21 milyon BTC olacağı için tüm olası Bitcoin sahiplerinin ilk %1’i).',
              'Bu, planlama tarzınıza bağlıdır. Muhafazakar (%10), temkinli planlama için iyidir ve büyüme daha yavaş olursa hayal kırıklığını önler. Orta (%15), Bitcoin’in tarihsel uzun vadeli ortalamasını yansıtır. İyimser (%25), potansiyel yukarı yönü gösterir ama kritik planlamada tek dayanak olmamalıdır. Üç senaryoyu da incelemenizi öneririz.',
              'Elbette! Koşullarınız değiştikçe bu hesaplayıcıya düzenli olarak geri dönmelisiniz. Mevcut bakiyenizi güncelleyin, bütçeniz değişirse aylık katkıyı ayarlayın ve piyasa koşullarına göre büyüme beklentilerini yeniden değerlendirin. Hesaplayıcı tek seferlik değil, sürekli planlama için tasarlanmıştır.',
              'Bir Bitcoin tam olarak 100.000.000 (yüz milyon) satoshi eder. Bitcoin’in takma adlı yaratıcısı Satoshi Nakamoto’dan adını alan satoshi, zincir üstündeki en küçük birimdir. Bu bölünebilirlik, coin başına fiyat ne olursa olsun herkesin anlamlı miktarda Bitcoin sahibi olmasını sağlar.',
              'Mikro-DCA, küçük bütçeler için en etkili yaklaşımdır. Tek bir aylık alım yerine, bütçenizi haftalık hatta günlük alımlara bölün. Birçok borsa 1 $ kadar düşük tekrarlı alımlara izin verir. Bu, kısa vadeli fiyat dalgalanmalarını yumuşatır ve piyasayı zamanlama dürtüsünü azaltır. Bozuk para yuvarlama uygulamaları da düşük sürtünmeli bir yöntemdir.',
              'Dolar başına kaç satoshi alabileceğiniz Bitcoin fiyatına göre değişir. BTC 100.000 $ iken 1 dolar yaklaşık 1.000 sats alır. BTC 50.000 $ iken 1 dolar yaklaşık 2.000 sats alır. Canlı piyasa fiyatına göre tam değeri görmek için yukarıdaki hesaplayıcıyı yerel para biriminizle kullanın.',
              'Birçok uzun vadeli sahip, başlamanın hiçbir zaman geç olmadığını savunur. Bitcoin’in 21 milyonluk sabit arzı, özellikle her halving olayından sonra kıtlığın zamanla artması anlamına gelir. Bugün başlamak bile sizi sıfır Bitcoin sahibi olan küresel nüfusun büyük çoğunluğunun önüne koyar. Önemli olan zamanlama değil, istikrardır.',
              'Anlamlı bir seviyeye ulaştığında kendi saklamaya geçmeniz önerilir — çoğu zaman 1 milyon sats (0.01 BTC) sınırı örnek verilir. Ledger veya Trezor gibi donanım cüzdanları, bir borsaya güvenmeden zincir üstünde varlıklarınızı doğrulamanıza izin verir. O zamana kadar, rezerv kanıtı sunan saygın borsalar pratik bir başlangıç sağlar.',
              'Halving’ler, madencilerin aldığı blok ödülünü yaklaşık her dört yılda bir yarıya indirerek piyasaya giren yeni arzı azaltır. Tarihsel olarak halving’leri 12–18 ay içinde önemli fiyat artışları izlemiştir. Birikim planınız birkaç yıla yayılıyorsa, daha erken katkılar halving sonrası ralli döneminden en çok fayda sağlar.'
            ] : [];
            return (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border/50 rounded-xl px-6">
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">{tr ? ['Satoshi biriktirme nedir ve neden önemlidir?', 'Bu hesaplayıcı hedefime ulaşma süresini nasıl tahmin eder?', 'Bitcoin fiyatı dramatik şekilde değişirse ne olur?', 'Popüler Bitcoin hedef kademeleri nelerdir?', 'Muhafazakar mı yoksa iyimser büyüme oranları mı kullanmalıyım?', 'Planımı ilerledikçe güncelleyebilir miyim?', 'Bir Bitcoin’de kaç satoshi vardır?', 'Küçük bütçeyle sats biriktirmek için en iyi strateji nedir?', 'Şu anda 1 dolarla kaç sats alabilirim?', '2026’da sats biriktirmeye başlamak için geç mi?', 'Biriktirdiğim sats’leri kendi saklamalı mıyım?', 'Bitcoin halving’i birikim planımı nasıl etkiler?'][index] : faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">{tr ? trFaq[index] : faq.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};