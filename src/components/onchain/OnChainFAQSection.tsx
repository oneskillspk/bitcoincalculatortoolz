import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "What is the MVRV ratio and why does it matter?", a: "MVRV (Market Value to Realized Value) compares Bitcoin's current market cap to its 'realized cap' — the aggregate cost basis of all BTC on-chain. When MVRV is below 1.0, it means Bitcoin is trading below the average holder's cost basis, historically a strong buy signal. When above 3.5, most holders are in large profit, which has preceded major corrections in every prior cycle." },
  { q: "What is Stock-to-Flow (S2F) and how does the model work?", a: "Stock-to-Flow measures Bitcoin's scarcity by comparing total supply (stock) to annual new issuance (flow). After the 4th halving in April 2024, the annual flow is ~164,250 BTC/year, giving an S2F ratio above 120. PlanB's model uses historical data to derive a power law relationship between S2F and price. The model price is not a prediction — it's a reference point." },
  { q: "What does hash rate tell us about Bitcoin?", a: "Hash rate measures the total computational power securing the Bitcoin network (in exahashes per second, EH/s). A rising hash rate signals miner confidence, network security growth, and long-term bullishness. Hash rate rarely crashes without price warning. When hash rate drops significantly, it can indicate miner capitulation — historically a bottom signal." },
  { q: "What are active addresses and why are they useful?", a: "Active addresses count the number of unique Bitcoin addresses that sent or received BTC on a given day. They're a proxy for real network usage and adoption. Rising active addresses during a price increase suggests organic demand. Rising price with falling active addresses may signal a speculative rally without fundamental backing." },
  { q: "How accurate is this data and where does it come from?", a: "Price and market cap data are fetched live from CoinGecko's public API. Hash rate and active address figures are approximations based on recent publicly available mempool.space and blockchain.com data, updated periodically. MVRV realized cap is an on-chain approximation. For institutional-grade on-chain data, tools like Glassnode provide more granular figures." },
];

const faqsTr = [
  { q: "MVRV oranı nedir ve neden önemlidir?", a: "MVRV (Piyasa Değeri ile Gerçekleşen Değer), Bitcoin'in mevcut piyasa değerini 'gerçekleşen değeri' ile — zincir üzerindeki tüm BTC'nin toplam maliyet tabanı — karşılaştırır. MVRV 1,0'ın altındayken Bitcoin, ortalama tutucunun maliyet tabanının altında işlem görüyor demektir; bu tarihsel olarak güçlü bir alım sinyalidir. 3,5'in üzerinde olduğunda, çoğu tutucu büyük kârda demektir ve bu her önceki döngüde büyük düzeltmelerin habercisi olmuştur." },
  { q: "Stok-Akış (S2F) nedir ve model nasıl çalışır?", a: "Stok-Akış, Bitcoin'in kıtlığını toplam arzı (stok) ile yıllık yeni ihracı (akış) karşılaştırarak ölçer. Nisan 2024'teki 4. yarılanmadan sonra yıllık akış ~164.250 BTC/yıldır; bu da 120'nin üzerinde bir S2F oranı verir. PlanB'nin modeli, S2F ve fiyat arasındaki güç kanunu ilişkisini türetmek için tarihsel verileri kullanır. Model fiyatı bir tahmin değil — bir referans noktasıdır." },
  { q: "Hash hızı Bitcoin hakkında bize ne anlatır?", a: "Hash hızı, Bitcoin ağını güvence altına alan toplam hesaplama gücünü (saniyede exahash, EH/s cinsinden) ölçer. Artan hash hızı madenci güvenini, ağ güvenliği büyümesini ve uzun vadeli yükselişi işaret eder. Hash hızı nadiren fiyat uyarısı olmadan düşer. Hash hızı önemli ölçüde düştüğünde, madenci teslimiyetini gösterebilir — tarihsel olarak bir dip sinyali." },
  { q: "Aktif adresler nedir ve neden kullanışlıdır?", a: "Aktif adresler, belirli bir günde BTC gönderen veya alan benzersiz Bitcoin adreslerinin sayısını sayar. Gerçek ağ kullanımı ve benimsemenin bir vekilidir. Fiyat artışı sırasında artan aktif adresler organik talebi gösterir. Aktif adresler düşerken yükselen fiyat, temel destekten yoksun spekülatif bir ralliye işaret edebilir." },
  { q: "Bu veriler ne kadar doğru ve nereden geliyor?", a: "Fiyat ve piyasa değeri verileri, CoinGecko'nun genel API'sinden canlı olarak alınır. Hash hızı ve aktif adres rakamları, periyodik olarak güncellenen son kamuya açık mempool.space ve blockchain.com verilerine dayanan yaklaşımlardır. MVRV gerçekleşen değeri, zincir üstü bir yaklaşımadır. Kurumsal düzeyde zincir üstü veriler için Glassnode gibi araçlar daha ayrıntılı rakamlar sunar." },
];

export const OnChainFAQSection = () => {
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
            {tr ? 'Bu kontrol panelinin arkasındaki zincir üstü metrikleri anlayın' : 'Understand the on-chain metrics behind this dashboard'}
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
