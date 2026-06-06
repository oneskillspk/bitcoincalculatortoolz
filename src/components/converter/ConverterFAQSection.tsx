import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: 'How many satoshis are in one Bitcoin?', answer: 'There are exactly 100,000,000 (one hundred million) satoshis in one Bitcoin. This is the smallest unit of Bitcoin, named after its creator Satoshi Nakamoto. Think of satoshis as the "cents" of Bitcoin — except instead of 100 cents per dollar, there are 100 million satoshis per Bitcoin.' },
  { question: 'What is a satoshi?', answer: 'A satoshi (often abbreviated as "sat" or "sats") is the smallest unit of Bitcoin. It equals 0.00000001 BTC (one hundred-millionth of a Bitcoin). Named after Bitcoin\'s pseudonymous creator Satoshi Nakamoto, satoshis allow people to buy and transact with very small fractions of Bitcoin, making it accessible regardless of Bitcoin\'s price.' },
  { question: 'How do I convert satoshis to US dollars?', answer: 'To convert satoshis to USD: divide the number of satoshis by 100,000,000 to get the BTC amount, then multiply by the current Bitcoin price. For example, 100,000 satoshis ÷ 100,000,000 = 0.001 BTC. If Bitcoin is $100,000, that equals $100. Our converter does this instantly with live prices.' },
  { question: 'What is mBTC (millibitcoin)?', answer: 'mBTC (millibitcoin) equals 0.001 BTC, or one-thousandth of a Bitcoin. It contains 100,000 satoshis. Millibitcoin is a convenient unit for everyday transactions — for example, a $100 purchase when Bitcoin is at $100,000 would be 1 mBTC. Some wallets and exchanges display balances in mBTC.' },
  { question: 'How much is 1 satoshi worth in USD?', answer: 'The value of 1 satoshi depends on Bitcoin\'s current price. To calculate: divide the BTC price by 100,000,000. For example, if Bitcoin is $100,000, then 1 satoshi = $0.001 (one-tenth of a cent). Use our converter above for the real-time value based on the latest Bitcoin price.' },
  { question: 'Can I buy less than 1 Bitcoin?', answer: 'Absolutely! Bitcoin is divisible to 8 decimal places, meaning you can buy as little as 0.00000001 BTC (1 satoshi). Most exchanges let you start with as little as $1 or $10 worth of Bitcoin. You don\'t need to buy a whole coin — this is one of the most common misconceptions about Bitcoin.' },
  { question: 'What is the difference between BTC and sats?', answer: 'BTC and sats are both units of Bitcoin, just at different scales. 1 BTC = 100,000,000 sats. BTC is the standard unit used for large amounts, while "sats" (satoshis) are better for smaller amounts. The "stacking sats" movement encourages people to accumulate satoshis regularly, regardless of Bitcoin\'s price.' },
  { question: 'How do I convert Bitcoin to euros?', answer: 'Use our converter above: select EUR from the currency dropdown, then enter an amount in any field (BTC, sats, or EUR) and all other fields update instantly. The conversion uses real-time exchange rates from CoinGecko, refreshed every 30 seconds for accuracy.' },
  { question: 'Why is Bitcoin divided into satoshis?', answer: 'Satoshis were built into Bitcoin\'s design from the start to enable microtransactions and ensure Bitcoin remains usable even at very high prices. If Bitcoin is worth $1,000,000, you can still transact with 100 satoshis (about $0.001). This divisibility is crucial for everyday payments, especially on the Lightning Network.' },
  { question: 'How does this converter get live Bitcoin prices?', answer: 'Our converter pulls real-time price data from CoinGecko, one of the most trusted cryptocurrency data aggregators. The price automatically refreshes every 30 seconds. We support 100+ fiat currencies with live exchange rates, ensuring your conversions are always based on the latest market data.' },
  { question: 'How much Bitcoin equals $100?', answer: 'Use our live Bitcoin calculator to instantly see how much Bitcoin $100 buys at the current price. The amount updates in real time as BTC price changes. Simply enter 100 in the USD field and the converter will show the exact BTC, mBTC, and satoshi equivalent.' },
  { question: 'How do I convert sats to dollars?', answer: 'Divide the number of sats by 100,000,000 to get the BTC amount, then multiply by the current Bitcoin price in USD. For example, 50,000 sats divided by 100,000,000 equals 0.0005 BTC, which is $50 when Bitcoin is at $100,000. Our converter does this automatically with a live price refreshed every 30 seconds.' },
  { question: 'What is 100 dollars in Bitcoin right now?', answer: 'At a Bitcoin price of $100,000, $100 equals 0.001 BTC, which is 1 mBTC or 100,000 sats. The exact figure changes by the second as the live price moves. Type 100 into the USD field of the converter above to see the current BTC and sats equivalent.' },
  { question: 'Is converting Bitcoin to USD on a calculator a taxable event?', answer: 'No. Looking up a price on a converter is not a taxable event because no asset has changed hands. The taxable event happens only when you actually sell, swap or spend the Bitcoin. At that point the IRS treats it as a disposal at fair market value and you owe capital gains tax on the difference between the sale price and your cost basis.' },
  { question: 'How accurate is the live Bitcoin price?', answer: 'The price shown is a volume-weighted average from CoinGecko, which itself aggregates data from more than 700 exchanges. It refreshes every 30 seconds and is typically within 0.1% to 0.3% of the price you would see on a major exchange like Coinbase or Binance.' },
];

const faqsTr = [
  { question: 'Bir Bitcoin\'de kaç satoshi vardır?', answer: 'Bir Bitcoin\'de tam olarak 100.000.000 (yüz milyon) satoshi vardır. Bu, Bitcoin\'in en küçük birimidir ve yaratıcısı Satoshi Nakamoto\'nun adını taşır. Satoshileri Bitcoin\'in "kuruşları" gibi düşünebilirsiniz; ancak 1 dolarda 100 kuruş yerine, 1 Bitcoin\'de 100 milyon satoshi vardır.' },
  { question: 'Satoshi nedir?', answer: 'Satoshi (genellikle "sat" veya "sats" olarak kısaltılır), Bitcoin\'in en küçük birimidir. 0,00000001 BTC\'ye (bir Bitcoin\'in yüz milyonda birine) eşittir. Bitcoin\'in takma adlı yaratıcısı Satoshi Nakamoto\'nun adını taşıyan satoshiler, insanların Bitcoin\'in fiyatından bağımsız olarak çok küçük fraksiyonlarla alım satım yapmasına olanak tanır.' },
  { question: 'Satoshileri ABD dolarına nasıl çeviririm?', answer: 'Satoshileri USD\'ye çevirmek için: BTC miktarını elde etmek üzere satoshi sayısını 100.000.000\'a bölün, ardından güncel Bitcoin fiyatıyla çarpın. Örneğin, 100.000 satoshi ÷ 100.000.000 = 0,001 BTC. Bitcoin 100.000 $\'daysa bu 100 $\'a eşittir. Çeviricimiz bunu canlı fiyatlarla anında yapar.' },
  { question: 'mBTC (milibitcoin) nedir?', answer: 'mBTC (milibitcoin), 0,001 BTC\'ye veya bir Bitcoin\'in binde birine eşittir. 100.000 satoshi içerir. Milibitcoin, günlük işlemler için uygun bir birimdir; örneğin Bitcoin 100.000 $\'dayken 100 $\'lık bir alışveriş 1 mBTC olur. Bazı cüzdanlar ve borsalar bakiyeleri mBTC cinsinden gösterir.' },
  { question: '1 satoshi USD\'de ne kadar değer eder?', answer: '1 satoshinin değeri Bitcoin\'in güncel fiyatına bağlıdır. Hesaplamak için: BTC fiyatını 100.000.000\'a bölün. Örneğin Bitcoin 100.000 $\'daysa 1 satoshi = 0,001 $ (bir sentin onda biri). En güncel Bitcoin fiyatına dayalı gerçek zamanlı değer için yukarıdaki çeviricimizi kullanın.' },
  { question: '1 Bitcoin\'den az satın alabilir miyim?', answer: 'Kesinlikle! Bitcoin 8 ondalık basamağa kadar bölünebilir; bu da 0,00000001 BTC (1 satoshi) kadar küçük miktarlar satın alabileceğiniz anlamına gelir. Çoğu borsa 1-10 $ değerinde Bitcoin alımına izin verir. Tam bir coin satın almanız gerekmiyor; bu, Bitcoin hakkındaki en yaygın yanlış anlamalardan biridir.' },
  { question: 'BTC ve sat arasındaki fark nedir?', answer: 'BTC ve sat\'lar, farklı ölçeklerde olmasına rağmen Bitcoin\'in birimleridir. 1 BTC = 100.000.000 sat. BTC büyük miktarlar için kullanılan standart birimken, "sat\'lar" (satoshiler) daha küçük miktarlar için daha uygundur. "Sat biriktirme" hareketi, Bitcoin fiyatından bağımsız olarak insanları düzenli satoshi biriktirmeye teşvik eder.' },
  { question: 'Bitcoin\'i euro\'ya nasıl çeviririm?', answer: 'Yukarıdaki çeviricimizi kullanın: para birimi açılır menüsünden EUR\'yu seçin, ardından herhangi bir alana (BTC, sat veya EUR) bir değer girin; diğer tüm alanlar anında güncellenir. Dönüşüm, 30 saniyede bir yenilenen CoinGecko\'dan alınan gerçek zamanlı döviz kurlarını kullanır.' },
  { question: 'Bitcoin neden satoshilere bölünmüştür?', answer: 'Satoshiler, mikro işlemleri mümkün kılmak ve Bitcoin\'in çok yüksek fiyatlarda bile kullanılabilir kalmasını sağlamak amacıyla başlangıçtan itibaren Bitcoin\'in tasarımına dahil edilmiştir. Bitcoin 1.000.000 $ değerinde olsa bile, 100 satoshi (yaklaşık 0,001 $) ile işlem yapabilirsiniz. Bu bölünebilirlik, özellikle Lightning Network\'te günlük ödemeler için kritik öneme sahiptir.' },
  { question: 'Bu çevirici canlı Bitcoin fiyatlarını nereden alıyor?', answer: 'Çeviricimiz, en güvenilir kripto para veri toplayıcılarından biri olan CoinGecko\'dan gerçek zamanlı fiyat verileri çeker. Fiyat otomatik olarak her 30 saniyede bir yenilenir. Dönüşümlerinizin her zaman en güncel piyasa verilerine dayandığından emin olmak için canlı döviz kurlarıyla 100\'den fazla fiat para birimini destekliyoruz.' },
  { question: '100 $ Bitcoin\'de ne kadar eder?', answer: 'Canlı Bitcoin hesaplayıcımızı kullanarak 100 $\'ın güncel fiyata göre ne kadar Bitcoin satın aldığını anında görün. Miktar, BTC fiyatı değiştikçe gerçek zamanlı güncellenir. Yalnızca USD alanına 100 girin; çevirici tam BTC, mBTC ve satoshi karşılığını gösterecektir.' },
  { question: 'Sat\'ları dolara nasıl çeviririm?', answer: 'BTC miktarını elde etmek için sat sayısını 100.000.000\'a bölün, ardından güncel Bitcoin fiyatını USD cinsinden çarpın. Örneğin 50.000 sat, 100.000.000\'a bölündüğünde 0,0005 BTC eder; Bitcoin 100.000 $\'dayken bu 50 $\'a karşılık gelir. Çeviricimiz bunu 30 saniyede bir yenilenen canlı fiyatla otomatik olarak yapar.' },
  { question: 'Şu anda 100 dolar Bitcoin\'de kaç tane?', answer: 'Bitcoin fiyatı 100.000 $\'dayken 100 $, 0,001 BTC\'ye eşittir; bu da 1 mBTC veya 100.000 sat demektir. Canlı fiyat hareket ettikçe tam rakam saniye saniye değişir. Güncel BTC ve sat karşılığını görmek için yukarıdaki çeviricinin USD alanına 100 yazın.' },
  { question: 'Hesap makinesinde Bitcoin\'i USD\'ye dönüştürmek vergisel bir olay mıdır?', answer: 'Hayır. Bir çeviriciye fiyat bakmak, hiçbir varlık el değiştirmediği için vergisel bir olay değildir. Vergisel olay yalnızca Bitcoin\'i gerçekten sattığınızda, takas ettiğinizde veya harcadığınızda gerçekleşir. Bu noktada IRS bunu piyasa değerinde elden çıkarma olarak değerlendirir ve satış fiyatı ile maliyet bazı arasındaki fark üzerinden sermaye kazancı vergisi ödersiniz.' },
  { question: 'Canlı Bitcoin fiyatı ne kadar doğrudur?', answer: 'Gösterilen fiyat, 700\'den fazla borsadan veri toplayan CoinGecko\'dan alınan hacim ağırlıklı bir ortalamadır. Her 30 saniyede bir yenilenir ve genellikle Coinbase veya Binance gibi büyük bir borsada göreceğiniz fiyatın %0,1 ile %0,3\'ü içindedir.' },
];

export const ConverterFAQSection = () => {
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
              ? 'Bitcoin birimleri, satoshiler ve para birimi dönüşümü hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin units, satoshis, and currency conversion'}
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
