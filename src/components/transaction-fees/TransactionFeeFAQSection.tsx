import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: "What is a sat/vB (satoshi per virtual byte)?", answer: "A sat/vB (satoshi per virtual byte) is the unit used to measure Bitcoin transaction fees. It represents how many satoshis (the smallest unit of Bitcoin, 0.00000001 BTC) you're willing to pay per virtual byte of transaction data. Higher sat/vB means faster confirmation as miners prioritize transactions with higher fees." },
  { question: "How are Bitcoin transaction fees calculated?", answer: "Bitcoin transaction fees are calculated by multiplying your transaction's size (in virtual bytes) by the fee rate (sat/vB). The size depends on: (1) Number of inputs (UTXOs being spent), (2) Number of outputs (recipients + change), and (3) Address type used. For example, a 140 vB transaction with a 20 sat/vB fee rate costs 2,800 satoshis." },
  { question: "What's the difference between Legacy, SegWit, and Taproot addresses?", answer: "Legacy addresses (starting with \"1\") are the original Bitcoin address format and use the most block space. SegWit addresses (starting with \"3\" for wrapped, \"bc1q\" for native) use a more efficient structure, reducing fees by ~30-40%. Taproot addresses (starting with \"bc1p\") are the newest format, offering the best privacy and lowest fees, especially for complex transactions." },
  { question: "Why do Bitcoin fees change so frequently?", answer: "Bitcoin fees are determined by supply and demand in the block space market. When many users want to transact, they compete for limited block space (1 MB per ~10 minutes), driving fees up. During quiet periods, fees drop significantly. Factors like market volatility, trading activity, and even time of day affect fee levels." },
  { question: "How can I save on transaction fees?", answer: "Several strategies can help reduce fees: (1) Use Native SegWit or Taproot addresses for 30-40% savings, (2) Consolidate UTXOs during low-fee periods to reduce future transaction sizes, (3) Wait for off-peak hours (typically weekends and early morning UTC), (4) Batch multiple payments into one transaction, (5) Use the Lightning Network for small, frequent payments." },
  { question: "What happens if my fee is too low?", answer: "If your fee is too low, your transaction may remain unconfirmed in the mempool for an extended period. During congestion, low-fee transactions can be dropped from mempools after about 2 weeks. You can speed up a stuck transaction using Replace-By-Fee (RBF) if enabled, or Child-Pays-For-Parent (CPFP) by spending the unconfirmed output with a higher fee." },
  { question: "How does SegWit reduce transaction fees?", answer: "SegWit (Segregated Witness) moves signature data (the \"witness\") outside the main transaction block, using a separate space with a 75% weight discount. This means SegWit transactions take up less \"block weight\" than Legacy transactions with the same data, allowing you to pay lower fees for equivalent priority." },
  { question: "What is Replace-By-Fee (RBF)?", answer: "Replace-By-Fee (RBF) is a feature that allows you to increase the fee on an unconfirmed transaction. If your transaction is stuck because the fee was too low, RBF lets you broadcast a new version with a higher fee. The transaction must be marked as RBF-enabled when originally sent. Most modern wallets support this feature." },
];

const faqsTr = [
  { question: "sat/vB (sanal bayt başına satoshi) nedir?", answer: "sat/vB (sanal bayt başına satoshi), Bitcoin işlem ücretlerini ölçmek için kullanılan birimdir. İşlem verilerinin her sanal baytı için ödemeye hazır olduğunuz satoshi sayısını (Bitcoin'in en küçük birimi, 0,00000001 BTC) temsil eder. Daha yüksek sat/vB, madenciler daha yüksek ücretli işlemlere öncelik verdiğinden daha hızlı onay anlamına gelir." },
  { question: "Bitcoin işlem ücretleri nasıl hesaplanır?", answer: "Bitcoin işlem ücretleri, işleminizin boyutu (sanal bayt cinsinden) ücret oranıyla (sat/vB) çarpılarak hesaplanır. Boyut şunlara bağlıdır: (1) Giriş sayısı (harcanan UTXO'lar), (2) Çıkış sayısı (alıcılar + para üstü) ve (3) Kullanılan adres türü. Örneğin, 20 sat/vB ücret oranıyla 140 vB'lik bir işlem 2.800 satoshi'ye mal olur." },
  { question: "Legacy, SegWit ve Taproot adresleri arasındaki fark nedir?", answer: "Legacy adresler (\"1\" ile başlayan) orijinal Bitcoin adres biçimidir ve en fazla blok alanı kullanır. SegWit adresleri (sarılmış için \"3\" ile, yerel için \"bc1q\" ile başlayan) daha verimli bir yapı kullanarak ücretleri ~%30-40 azaltır. Taproot adresleri (\"bc1p\" ile başlayan) en yeni biçimdir; özellikle karmaşık işlemler için en iyi gizlilik ve en düşük ücretleri sunar." },
  { question: "Bitcoin ücretleri neden bu kadar sık değişiyor?", answer: "Bitcoin ücretleri blok alanı piyasasındaki arz ve talep tarafından belirlenir. Çok sayıda kullanıcı işlem yapmak istediğinde sınırlı blok alanı için rekabet ederler (~10 dakikada 1 MB), bu da ücretleri artırır. Sakin dönemlerde ücretler önemli ölçüde düşer. Piyasa volatilitesi, ticaret faaliyeti ve hatta günün saati gibi faktörler ücret düzeylerini etkiler." },
  { question: "İşlem ücretlerinden nasıl tasarruf edebilirim?", answer: "Birkaç strateji ücretleri azaltmaya yardımcı olabilir: (1) %30-40 tasarruf için Yerel SegWit veya Taproot adresleri kullanın, (2) Gelecekteki işlem boyutlarını azaltmak için düşük ücret dönemlerinde UTXO'ları birleştirin, (3) Yoğun olmayan saatleri bekleyin (genellikle hafta sonları ve erken sabah UTC), (4) Birden fazla ödemeyi tek bir işlemde gruplandırın, (5) Küçük ve sık ödemeler için Lightning Network kullanın." },
  { question: "Ücretim çok düşük olursa ne olur?", answer: "Ücretiniz çok düşükse, işleminiz uzun süre mempool'da onaylanmamış kalabilir. Tıkanma dönemlerinde düşük ücretli işlemler yaklaşık 2 hafta sonra mempool'lardan düşürülebilir. Etkinleştirilmişse Replace-By-Fee (RBF) kullanarak veya onaylanmamış çıktıyı daha yüksek ücretle harcayarak (CPFP) sıkışan bir işlemi hızlandırabilirsiniz." },
  { question: "SegWit işlem ücretlerini nasıl azaltır?", answer: "SegWit (Segregated Witness), imza verilerini ('tanık') ana işlem bloğu dışına taşır ve %75 ağırlık indirimi olan ayrı bir alan kullanır. Bu, SegWit işlemlerinin aynı veriyle Legacy işlemlerinden daha az 'blok ağırlığı' kapladığı anlamına gelir; böylece eşdeğer öncelik için daha düşük ücret ödeyebilirsiniz." },
  { question: "Replace-By-Fee (RBF) nedir?", answer: "Replace-By-Fee (RBF), onaylanmamış bir işlemdeki ücreti artırmanıza olanak tanıyan bir özelliktir. İşleminiz düşük ücret nedeniyle sıkışmışsa, RBF daha yüksek ücretle yeni bir sürüm yayınlamanıza izin verir. İşlemin başlangıçta gönderildiğinde RBF etkin olarak işaretlenmesi gerekir. Modern cüzdanların çoğu bu özelliği destekler." },
];

export const TransactionFeeFAQSection = () => {
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
            {tr ? 'Bitcoin işlem ücretleri hakkında bilmeniz gereken her şey' : 'Everything you need to know about Bitcoin transaction fees'}
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
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
