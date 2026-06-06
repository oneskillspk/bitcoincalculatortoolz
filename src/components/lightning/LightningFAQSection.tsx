import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: "What is the Lightning Network and how does it work?", answer: "The Lightning Network is a Layer 2 payment protocol built on top of Bitcoin. It enables instant, low-cost transactions by creating payment channels between users. Instead of recording every transaction on the blockchain, payments are routed through a network of interconnected channels, with only the opening and closing of channels requiring on-chain transactions. This makes it possible to send even tiny amounts (micropayments) with minimal fees." },
  { question: "How are Lightning Network fees calculated?", answer: "Lightning fees consist of two components: a base fee and a proportional fee. The base fee is a fixed amount (measured in millisatoshis) charged by each routing node regardless of payment size. The proportional fee (measured in PPM - parts per million) is a percentage of the payment amount. Total fee = (base fee × hops) + (amount × ppm rate × hops). For example, a 100,000 sat payment through 3 hops with 1 msat base fee and 100 ppm would cost approximately 30 sats in fees." },
  { question: "What is a routing node and why do hops matter?", answer: "A routing node is a Lightning Network participant that forwards payments between other nodes. When you send a payment, it may travel through several routing nodes (hops) before reaching the recipient. Each hop adds to the total fee because every routing node charges for their service. Fewer hops generally mean lower fees, but the actual route depends on channel liquidity and network topology. Well-connected wallets typically find efficient routes with 2-4 hops." },
  { question: "What's the difference between base fee and proportional fee?", answer: "The base fee is a fixed charge per hop, regardless of payment size. It covers the routing node's operational costs and is typically 1-1000 millisatoshis (0.001-1 satoshi). The proportional fee (PPM) scales with payment size and represents the routing node's profit margin. 100 PPM means 0.01% of the payment amount. For small payments, base fees dominate; for large payments, proportional fees become more significant." },
  { question: "How do Lightning fees compare to on-chain fees?", answer: "Lightning fees are typically 90-99% cheaper than on-chain transaction fees, especially during periods of high network congestion. While an on-chain Bitcoin transaction might cost 1,000-10,000 satoshis (or more during fee spikes), an equivalent Lightning payment usually costs less than 10 satoshis. Additionally, Lightning payments confirm in 1-2 seconds versus 10+ minutes for on-chain transactions." },
  { question: "Is Lightning suitable for large payments?", answer: "Lightning works best for small to medium payments (typically under $1,000-$10,000). Large payments may face challenges due to channel capacity limits - each channel can only route payments up to its available liquidity. For very large transfers, payments may need to be split across multiple routes (Multi-Path Payments or MPP), or on-chain transactions may be more reliable. The network continues to grow, with increasing capacity supporting larger payments over time." },
  { question: "What is channel capacity and why does it matter?", answer: "Channel capacity is the total amount of Bitcoin locked in a payment channel. It determines the maximum payment size that can be routed through that channel. For routing, what matters is the 'local balance' (funds on your side of the channel). If you want to receive payments, you need 'inbound liquidity' (funds on the other side). Channel operators earn routing fees by facilitating payments, with ROI depending on their channel size and routing volume." },
  { question: "How can I minimize Lightning Network fees?", answer: "To minimize fees: 1) Use wallets with good routing algorithms that find efficient paths, 2) Connect directly to merchants or recipients you transact with frequently, 3) Use well-connected nodes as your peers, 4) Consider the time - fees can vary based on network activity, 5) For recurring payments, maintain dedicated channels with reliable routing partners. Most modern Lightning wallets automatically optimize routing to minimize fees." },
];

const faqsTr = [
  { question: "Lightning Network nedir ve nasıl çalışır?", answer: "Lightning Network, Bitcoin üzerine inşa edilmiş bir Katman 2 ödeme protokolüdür. Kullanıcılar arasında ödeme kanalları oluşturarak anlık, düşük maliyetli işlemlere olanak tanır. Her işlemi blockchain'e kaydetmek yerine, ödemeler birbirine bağlı kanallar ağı üzerinden yönlendirilir; yalnızca kanalların açılması ve kapanması zincir üstü işlem gerektirir. Bu, minimal ücretlerle çok küçük tutarlar (mikro ödemeler) bile göndermeyi mümkün kılar." },
  { question: "Lightning Network ücretleri nasıl hesaplanır?", answer: "Lightning ücretleri iki bileşenden oluşur: temel ücret ve oransal ücret. Temel ücret, ödeme boyutundan bağımsız olarak her yönlendirme düğümü tarafından talep edilen sabit bir miktardır (milisatoshi cinsinden ölçülür). Oransal ücret (PPM - milyonda parça olarak ölçülür), ödeme tutarının bir yüzdesidir. Toplam ücret = (temel ücret × atlama sayısı) + (tutar × ppm oranı × atlama sayısı). Örneğin, 1 msat temel ücret ve 100 ppm ile 3 atlamalı 100.000 sat'lık bir ödeme yaklaşık 30 sat ücrete mal olur." },
  { question: "Yönlendirme düğümü nedir ve atlamalar neden önemlidir?", answer: "Yönlendirme düğümü, ödemeleri diğer düğümler arasında ileten bir Lightning Network katılımcısıdır. Bir ödeme gönderdiğinizde, alıcıya ulaşmadan önce birkaç yönlendirme düğümünden (atlamadan) geçebilir. Her atlama, her yönlendirme düğümü hizmetleri için ücret aldığından toplam ücrete eklenir. Daha az atlama genellikle daha düşük ücret anlamına gelir, ancak gerçek rota kanal likiditesine ve ağ topolojisine bağlıdır. İyi bağlantılı cüzdanlar tipik olarak 2-4 atlamayla verimli rotalar bulur." },
  { question: "Temel ücret ile oransal ücret arasındaki fark nedir?", answer: "Temel ücret, ödeme boyutundan bağımsız olarak her atlama başına sabit bir ücrettir. Yönlendirme düğümünün operasyonel maliyetlerini karşılar ve genellikle 1-1000 milisatoshi'dir (0,001-1 satoshi). Oransal ücret (PPM), ödeme boyutuyla ölçeklenir ve yönlendirme düğümünün kâr marjını temsil eder. 100 PPM, ödeme tutarının %0,01'i anlamına gelir. Küçük ödemelerde temel ücretler baskın gelir; büyük ödemelerde oransal ücretler daha önemli hale gelir." },
  { question: "Lightning ücretleri zincir üstü ücretlerle nasıl karşılaştırılır?", answer: "Lightning ücretleri, özellikle yüksek ağ tıkanıklığı dönemlerinde genellikle zincir üstü işlem ücretlerinden %90-99 daha ucuzdur. Zincir üstü bir Bitcoin işlemi 1.000-10.000 satoshi'ye (ücret artışları sırasında daha fazlasına) mal olabilirken, eşdeğer bir Lightning ödemesi genellikle 10 satoshi'den az tutar. Ayrıca Lightning ödemeleri, zincir üstü işlemlerin 10+ dakikasına karşılık 1-2 saniyede onaylanır." },
  { question: "Lightning büyük ödemeler için uygun mu?", answer: "Lightning, küçük ile orta ölçekli ödemeler için en iyi şekilde çalışır (genellikle 1.000-10.000 $'ın altında). Büyük ödemeler, kanal kapasitesi sınırları nedeniyle zorluklarla karşılaşabilir — her kanal yalnızca mevcut likiditesine kadar ödeme yönlendirebilir. Çok büyük transferler için ödemelerin birden fazla rotaya bölünmesi gerekebilir (Çok Yollu Ödemeler veya MPP) ya da zincir üstü işlemler daha güvenilir olabilir. Ağ büyümeye devam etmektedir ve artan kapasite zamanla daha büyük ödemeleri desteklemektedir." },
  { question: "Kanal kapasitesi nedir ve neden önemlidir?", answer: "Kanal kapasitesi, bir ödeme kanalında kilitlenen toplam Bitcoin miktarıdır. O kanal üzerinden yönlendirilebilecek maksimum ödeme boyutunu belirler. Yönlendirme için önemli olan, 'yerel bakiye' (kanalın sizin tarafınızdaki fonlar) dır. Ödeme almak istiyorsanız 'gelen likidite' (diğer taraftaki fonlar) gerekir. Kanal operatörleri, ödemeleri kolaylaştırarak yönlendirme ücreti kazanır; YG, kanal büyüklüklerine ve yönlendirme hacmine bağlıdır." },
  { question: "Lightning Network ücretlerini nasıl en aza indirebilirim?", answer: "Ücretleri en aza indirmek için: 1) Verimli yollar bulan iyi yönlendirme algoritmalarına sahip cüzdanlar kullanın, 2) Sık işlem yaptığınız tüccar veya alıcılara doğrudan bağlanın, 3) İyi bağlantılı düğümleri eşleri olarak kullanın, 4) Zamanı göz önünde bulundurun — ücretler ağ etkinliğine göre değişebilir, 5) Yinelenen ödemeler için güvenilir yönlendirme ortaklarıyla özel kanallar sürdürün. Modern Lightning cüzdanlarının çoğu, ücretleri en aza indirmek için yönlendirmeyi otomatik olarak optimize eder." },
];

export const LightningFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const items = tr ? faqsTr : faqsEn;

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
            {tr ? 'Lightning Network ücretleri ve ödemeleri hakkında bilmeniz gereken her şey' : 'Everything you need to know about Lightning Network fees and payments'}
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default LightningFAQSection;
