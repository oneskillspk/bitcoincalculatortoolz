import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "What is the average volatility of BTC?", a: "Bitcoin's annualized realized volatility as of Q1 2025 is approximately 52.2%, down from triple digits in earlier years. Daily volatility averages around 2–3%, compared to gold at roughly 0.7% per day and the S&P 500 at around 0.6% per day." },
  { q: "Is there a VIX for Bitcoin?", a: "Yes. The closest equivalents are the DVOL index (Deribit Bitcoin Volatility Index), which measures 30-day forward-looking implied volatility, and the BVX (CME CF Bitcoin Volatility Index), launched April 2024 as an officially regulated benchmark. Unlike the stock market VIX, Bitcoin's volatility index acts as an 'action gauge' rather than purely a 'fear gauge,' since large BTC moves can be to the upside as well as the downside." },
  { q: "At what time is Bitcoin most volatile?", a: "Bitcoin is most volatile during the 08:00–10:00 UTC window when both the London market open and New York pre-market overlap. The lowest volatility typically occurs during late Asian session hours (00:00–04:00 UTC). Day of week: Monday and Tuesday tend to see higher volatility than weekends." },
  { q: "What is the current implied volatility of BTC?", a: "Bitcoin's implied volatility changes daily. As of March 2026, BTC's IV stands at approximately 51.6% annualized (BVIV index), with an IV rank of 46.51 — meaning current IV is near the median of its historical range. Use the live calculator above for the most current realized volatility reading." },
  { q: "How to check BTC volatility?", a: "Use this calculator above for real-time realized volatility across 7, 30, 60, and 90-day windows. For implied volatility, check the Deribit DVOL index, Volmex BVIV, or the CME BVX index. For quick reference, the expected daily move ≈ annual volatility ÷ 20." },
  { q: "What is the 1% rule in crypto?", a: "The 1% rule means never risking more than 1% of your total trading account on any single trade. Given Bitcoin's high daily volatility (2–3% average), this rule helps prevent account destruction during adverse moves. It determines position size and stop loss placement." },
  { q: "How to predict Bitcoin volatility?", a: "Bitcoin volatility cannot be predicted precisely, but patterns exist: volatility tends to rise after halving events, during US macro announcements (CPI, Fed rate decisions), and after prolonged low-volatility periods (volatility clustering). Implied volatility from options markets (DVOL, BVX) provides the market's best forward-looking estimate." },
  { q: "Is 25% volatility high?", a: "For Bitcoin, 25% annualized volatility would be historically very low — Bitcoin's average is around 50–80%. For traditional assets, 25% is high: the S&P 500 averages 12–16% and gold around 15.5%. For individual tech stocks like NVIDIA or Tesla, 25% would be considered moderate to low. Context is everything." },
  { q: "How is Bitcoin volatility calculated?", a: "Bitcoin volatility is calculated as the standard deviation of daily log returns, annualized by multiplying by √365. Formula: σ = StdDev(ln(Pₜ/Pₜ₋₁)) × √365. This gives 'realized' or 'historical' volatility. 'Implied' volatility is derived from options market pricing." },
  { q: "What are the 4 types of volatility?", a: "The 4 main types are: (1) Historical/Realized volatility — measured from past price data; (2) Implied volatility — derived from options prices, forward-looking; (3) Future volatility — unknown, what will actually happen; (4) Seasonal volatility — patterns tied to time of day, week, or Bitcoin's halving cycle." },
  { q: "How does Bitcoin's volatility compare to stocks?", a: "Bitcoin's annualized volatility is typically 40–80%, compared to 15–20% for the S&P 500 and 12–16% for Gold. However, BTC volatility has been declining over time as the market matures. Individual tech stocks like NVIDIA (~50%) and Tesla (~55%) can match or exceed Bitcoin's volatility." },
  { q: "Why is Bitcoin so volatile compared to gold and the S&P 500?", a: "Bitcoin trades 24/7 in a global market with a comparatively small float versus gold or the S&P 500, which means each unit of buying or selling pressure moves price more. Per Fidelity Digital Assets 2024 research, BTC volatility runs roughly 3.6× gold and 5.1× the S&P 500. As ETF inflows, regulated futures, and corporate treasuries have grown since 2024, that gap has compressed but not closed." },
  { q: "Is Bitcoin more volatile than NVIDIA, Tesla, or MSTR?", a: "On a 30-day annualized basis, Bitcoin (~50%) sits between NVIDIA (~50%) and Tesla (~55%), and well below MSTR (~95%) which is a levered BTC proxy. Coinbase (COIN) also typically prints higher than BTC. The Stock vs BTC table on this page tracks the live ratio." },
  { q: "How do institutions actually use Bitcoin volatility?", a: "Institutions use volatility three ways: (1) position sizing — splitting stop distance by expected daily move, (2) risk budgeting against portfolio variance, and (3) options pricing via implied vol indices like DVOL and CME's BVX. BlackRock's 2024 iShares Bitcoin Trust filings explicitly compared BTC's risk profile to a high-beta tech equity rather than a separate asset category." },
  { q: "How does the volatility percentile help me make decisions?", a: "The percentile gauge ranks today's 30-day vol against every other 30-day window in the past year. Bottom-quartile readings (below the 25th percentile) signal a coiled regime where directional expansion typically follows within weeks. Top-quartile readings call for tighter risk management and smaller position sizes." },
];

const faqsTr = [
  { q: "BTC'nin ortalama volatilitesi nedir?", a: "Bitcoin'in 2025 1. çeyreği itibarıyla yıllıklandırılmış gerçekleşen volatilitesi yaklaşık %52,2 olup önceki yıllardaki üç basamaklı rakamlardan gerilemiştir. Günlük volatilite, altının günlük yaklaşık %0,7'sine ve S&P 500'ün yaklaşık %0,6'sına kıyasla ortalama 2-3% civarındadır." },
  { q: "Bitcoin için bir VIX var mı?", a: "Evet. En yakın eşdeğerler, 30 günlük ileriye dönük zımni volatiliteyi ölçen DVOL endeksi (Deribit Bitcoin Volatilite Endeksi) ve Nisan 2024'te resmi olarak düzenlenmiş bir kıyaslama olarak piyasaya çıkan BVX'tir (CME CF Bitcoin Volatilite Endeksi). Hisse senedi piyasası VIX'inden farklı olarak Bitcoin'in volatilite endeksi, büyük BTC hareketleri yukarı veya aşağı yönde olabileceğinden saf bir 'korku göstergesi' yerine bir 'aksiyon göstergesi' gibi davranır." },
  { q: "Bitcoin en çok hangi saatte volatil oluyor?", a: "Bitcoin, hem Londra piyasası açılışının hem de New York ön piyasasının örtüştüğü 08:00-10:00 UTC penceresinde en volatil durumdadır. En düşük volatilite genellikle geç Asya seansı saatlerinde (00:00-04:00 UTC) görülür. Haftanın günü itibarıyla Pazartesi ve Salı günleri hafta sonlarına kıyasla daha yüksek volatilite eğilimi gösterir." },
  { q: "BTC'nin mevcut zımni volatilitesi nedir?", a: "Bitcoin'in zımni volatilitesi günlük değişir. Mart 2026 itibarıyla BTC'nin IV'ü yaklaşık %51,6 yıllıklandırılmış (BVIV endeksi), 46,51 IV sıralamasıyla — mevcut IV'ün tarihsel aralığının ortancasına yakın olduğu anlamına gelir. En güncel gerçekleşen volatilite okumak için yukarıdaki canlı hesap makinesini kullanın." },
  { q: "BTC volatilitesi nasıl kontrol edilir?", a: "7, 30, 60 ve 90 günlük pencereler için gerçek zamanlı gerçekleşen volatilite için yukarıdaki hesap makinesini kullanın. Zımni volatilite için Deribit DVOL endeksini, Volmex BVIV'i veya CME BVX endeksini kontrol edin. Hızlı referans için beklenen günlük hareket ≈ yıllık volatilite ÷ 20." },
  { q: "Kriptoda %1 kuralı nedir?", a: "%1 kuralı, tek bir işlemde toplam işlem hesabınızın %1'inden fazlasını asla riske atmamak anlamına gelir. Bitcoin'in yüksek günlük volatilitesi göz önüne alındığında (ortalama %2-3), bu kural olumsuz hareketler sırasında hesap yıkımını önlemeye yardımcı olur. Pozisyon büyüklüğünü ve stop-loss yerleşimini belirler." },
  { q: "Bitcoin volatilitesi nasıl tahmin edilir?", a: "Bitcoin volatilitesi kesin olarak tahmin edilemez, ancak örüntüler mevcuttur: volatilite, yarılanma olaylarından sonra, ABD makro açıklamaları (TÜFE, Fed faiz kararları) sırasında ve uzun süreli düşük volatilite dönemlerinin ardından yükselme eğilimindedir. Opsiyon piyasalarından gelen zımni volatilite (DVOL, BVX) piyasanın en iyi ileriye dönük tahminini sunar." },
  { q: "%25 volatilite yüksek mi?", a: "Bitcoin için %25 yıllıklandırılmış volatilite tarihsel olarak çok düşük olurdu — Bitcoin'in ortalaması %50-80 civarındadır. Geleneksel varlıklar için %25 yüksektir: S&P 500 %12-16, altın ise yaklaşık %15,5 ortalamasındadır. NVIDIA veya Tesla gibi bireysel teknoloji hisseleri için %25 ılımlı ile düşük arasında kabul edilir. Her şeyde bağlam önemlidir." },
  { q: "Bitcoin volatilitesi nasıl hesaplanır?", a: "Bitcoin volatilitesi, günlük logaritmik getirilerin standart sapması olarak hesaplanır ve √365 ile çarpılarak yıllıklandırılır. Formül: σ = StdDev(ln(Pₜ/Pₜ₋₁)) × √365. Bu 'gerçekleşen' veya 'tarihsel' volatilite verir. 'Zımni' volatilite, opsiyon piyasası fiyatlamasından türetilir." },
  { q: "4 tür volatilite nedir?", a: "4 ana tür şunlardır: (1) Tarihsel/Gerçekleşen volatilite — geçmiş fiyat verilerinden ölçülür; (2) Zımni volatilite — opsiyon fiyatlarından türetilir, ileriye dönük; (3) Gelecekteki volatilite — bilinmeyen, gerçekte ne olacağı; (4) Mevsimsel volatilite — günün saati, hafta veya Bitcoin'in yarılanma döngüsüne bağlı örüntüler." },
  { q: "Bitcoin'in volatilitesi hisse senetleriyle nasıl karşılaştırılır?", a: "Bitcoin'in yıllıklandırılmış volatilitesi tipik olarak %40-80 arasındadır, S&P 500 için %15-20 ve Altın için %12-16 ile karşılaştırıldığında. Ancak BTC volatilitesi piyasa olgunlaştıkça zaman içinde düşmektedir. NVIDIA (~%50) ve Tesla (~%55) gibi bireysel teknoloji hisseleri Bitcoin'in volatilitesini eşleştirebilir veya aşabilir." },
  { q: "Bitcoin neden altın ve S&P 500'e kıyasla bu kadar volatil?", a: "Bitcoin, altın veya S&P 500'e kıyasla nispeten küçük bir dolaşım miktarıyla 7/24 küresel bir piyasada işlem görür; bu da her alım veya satım baskısı biriminin fiyatı daha fazla hareket ettirdiği anlamına gelir. Fidelity Digital Assets 2024 araştırmasına göre BTC volatilitesi altının yaklaşık 3,6 katı ve S&P 500'ün 5,1 katıdır. 2024'ten bu yana ETF girişleri, düzenlenmiş vadeli işlemler ve kurumsal hazineler büyüdükçe bu fark daralmış ancak kapanmamıştır." },
  { q: "Bitcoin, NVIDIA, Tesla veya MSTR'den daha volatil mi?", a: "30 günlük yıllıklandırılmış bazda Bitcoin (~%50), NVIDIA (~%50) ile Tesla (~%55) arasında ve kaldıraçlı BTC vekili olan MSTR'nin (~%95) çok altında kalır. Coinbase (COIN) de tipik olarak BTC'den daha yüksek basar. Bu sayfadaki Hisse Senedi ile BTC tablosu canlı oranı takip eder." },
  { q: "Kurumlar Bitcoin volatilitesini gerçekte nasıl kullanıyor?", a: "Kurumlar volatiliteyi üç şekilde kullanır: (1) Pozisyon boyutlandırma — stop mesafesini beklenen günlük harekete bölme, (2) Portföy varyansına karşı risk bütçelemesi ve (3) DVOL ve CME'nin BVX'i gibi zımni volatilite endeksleri aracılığıyla opsiyon fiyatlaması. BlackRock'un 2024 iShares Bitcoin Trust dosyaları, BTC'nin risk profilini ayrı bir varlık kategorisi yerine açıkça yüksek beta'lı bir teknoloji hissesiyle karşılaştırdı." },
  { q: "Volatilite yüzdeliği kararlarıma nasıl yardımcı olur?", a: "Yüzdelik ölçeği, bugünkü 30 günlük vol'u geçen yılın her diğer 30 günlük penceresiyle sıralar. Alt çeyrek okumaları (25. yüzdeliğin altında), yönsel genişlemenin tipik olarak haftalar içinde takip ettiği kıvrılmış bir rejime işaret eder. Üst çeyrek okumaları, daha sıkı risk yönetimi ve daha küçük pozisyon büyüklükleri gerektirir." },
];

export const VolatilityFAQSection = () => {
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
              ? 'Bitcoin volatilitesi, VIX ve risk yönetimi hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin volatility, VIX, and risk management'}
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

type FaqSchemaEntry = { "@type": "Question"; name: string; acceptedAnswer: { "@type": "Answer"; text: string } };

const toSchema = (list: Array<{ q: string; a: string }>): FaqSchemaEntry[] =>
  list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }));

export const volatilityFaqSchemaDataEn: FaqSchemaEntry[] = toSchema(faqsEn);
export const volatilityFaqSchemaDataTr: FaqSchemaEntry[] = toSchema(faqsTr);
/** @deprecated Use volatilityFaqSchemaDataEn / volatilityFaqSchemaDataTr. */
const volatilityFaqSchemaData: FaqSchemaEntry[] = volatilityFaqSchemaDataEn;
