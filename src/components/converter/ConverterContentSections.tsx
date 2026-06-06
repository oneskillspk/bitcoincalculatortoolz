import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from '@/components/LocalizedLink';

export const ConverterContentSections: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <BookOpen className="w-4 h-4" />
            {tr ? 'Referans Kılavuzu' : 'Reference Guide'}
          </div>
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Eksiksiz Bitcoin Dönüşüm Referansı' : 'The Complete Bitcoin Conversion Reference'}
          </h2>
          <p className="text-muted-foreground mt-3">
            {tr
              ? "Çoğu dönüştürücünün atladığı her şey: birimlerin gerçekte nasıl çalıştığı, canlı fiyatın nereden geldiği ve insanları şaşırtan tek vergi ayrımı."
              : "Everything most converters skip: how the units actually work, where the live price comes from, and the one tax distinction that catches people out."}
          </p>
        </div>

        <div className="space-y-12">
          <article className="space-y-4">
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? "Bitcoin Birimleri Gerçekte Nasıl Sıralanır?" : "How Bitcoin Units Actually Stack Up"}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Bir Bitcoin, 100.000.000 satoshiye eşittir. Bu sayı, bir gün tek bir coin'in bir milyon dolar değer taşıyabileceğini düşünse bile insanların hâlâ bir sentin kesri değerinde fraksiyonlarla işlem yapabilmesi için 2009'da Satoshi Nakamoto tarafından protokole yerleştirildi. BTC ile sats arasında üç ara birim bulunur. Bir milibitcoin (mBTC), Bitcoin'in binde biri veya 100.000 sattır. Microbitcoin, aynı zamanda 'bit' olarak da bilinir, Bitcoin'in milyonda biri veya 100 sattır. 'Bit', 2014 civarında günlük harcamalar için kısa süre popüler oldu, ancak Bitcoin topluluğu büyük ölçüde küçük miktarlar için varsayılan birim olarak sats üzerinde karar kıldı."
                : "One Bitcoin equals 100,000,000 satoshis. That number was baked into the protocol by Satoshi Nakamoto in 2009 so that even if a single coin were worth a million dollars one day, people could still transact in fractions worth a fraction of a cent. Three intermediate units sit between BTC and sats. A millibitcoin (mBTC) is one thousandth of a Bitcoin, or 100,000 sats. A microbitcoin, also called a \"bit\", is one millionth of a Bitcoin, or 100 sats. The \"bit\" was briefly popular around 2014 as a unit for everyday spending, but the Bitcoin community has largely settled on sats as the small-amount default."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Pratik çıkarım basit. Kahve alıyorsanız veya Lightning'de bahşiş gönderiyorsanız, sats cinsinden konuşun. Maaş veya ev fiyatı belirtiyorsanız, BTC cinsinden konuşun. mBTC ve bit notasyonları eski cüzdan yazılımlarında ve bir avuç Avrupa borsasında görünür, ancak bunları bugün bir fiyat akışında nadiren görürsünüz."
                : "The practical takeaway is simple. If you are buying coffee or sending a tip on Lightning, talk in sats. If you are quoting a salary or a house price, talk in BTC. The mBTC and bit notations show up in older wallet software and a handful of European exchanges, but you will rarely see them in a price feed today."}
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? "Canlı Fiyat Nereden Geliyor?" : "Where the Live Price Comes From"}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Bu dönüştürücünün gösterdiği sayı, 700'den fazla borsayı kendisi toplayan CoinGecko'dan çekilen hacme göre ağırlıklı bir ortalamadır. Her 30 saniyede bir yeniliyoruz. Bu spot fiyat, herhangi bir borsada herhangi bir saniyede alacağınız fiyat değildir; çünkü Coinbase, Binance, Kraken ve Bitstamp'ın her birinin kendi emir defterleri vardır ve en iyi alış ile en iyi satış arasındaki spread, 2025 itibarıyla majörlerde tipik olarak 5 ile 30 baz puan arasındadır."
                : "The number this converter shows is a volume-weighted average pulled from CoinGecko, which itself aggregates more than 700 exchanges. We refresh it every 30 seconds. That spot price is not the price you would receive on any single exchange in any given second, because Coinbase, Binance, Kraken and Bitstamp each have their own order books, and the spread between the best bid and best ask is typically 5 to 30 basis points wide on the majors as of 2025."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Aklınızda miktarları dönüştürmek veya yaklaşık bir hesaplama yapmak için, toplu spot fiyat herhangi bir borsadan daha doğrudur çünkü borsaya özgü tuhaflıkları düzeltir. Gerçek bir işlem için her zaman kullandığınız borsadaki kuru kontrol edin. Fark genellikle yüz dolarlık siparişte kuruşlardır, ancak BTC/PKR veya BTC/NGN gibi likit olmayan çiftlerde yüzde bir veya daha fazlasına kadar uzayabilir."
                : "For converting amounts in your head or for a back-of-the-envelope calculation, the aggregated spot price is more accurate than any single exchange because it smooths out venue-specific quirks. For an actual trade, always check the rate on the exchange you are using. The difference is usually pennies on a hundred dollar order, but it can stretch to a percent or more on illiquid pairs like BTC/PKR or BTC/NGN."}
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? "Dönüştürmek ile Satmak: Çoğu Aracın Atladığı Vergi Ayrımı" : "Converting vs. Selling: The Tax Distinction Most Tools Skip"}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "\"0,5 BTC'nin dolar değeri ne kadar\" diye aramak vergiye tabi bir olay değildir. Bir fiyat okuyorsunuz, hepsi bu. Bir borsada 0,5 BTC'yi dolara satmak farklı bir hikayedir. Mevcut IRS rehberine göre bu satış, satış geliri ile maliyet tabanınız arasındaki farka eşit bir sermaye kazancı veya kaybı gerçekleştirir ve satışın yapıldığı yılda kazanç üzerinden vergi ödersiniz. 12 aydan uzun süre elde tutulan Bitcoin'de uzun vadeli kazançlar, 2025'te gelir diliminize göre %0, %15 veya %20 oranında vergilendirilir. Kısa vadeli kazançlar, %37'ye kadar olağan gelir oranınızda vergilendirilir."
                : "Looking up \"how much is 0.5 BTC worth in dollars\" is not a taxable event. You are reading a price, nothing more. Selling 0.5 BTC for dollars on an exchange is a different story. Under current IRS guidance, that sale realises a capital gain or loss equal to the difference between the sale proceeds and your cost basis, and you owe tax on the gain in the year of the sale. Long-term gains, on Bitcoin held more than 12 months, are taxed at 0%, 15% or 20% in 2025 depending on your income bracket. Short-term gains are taxed at your ordinary income rate, up to 37%."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr ? (
                <>
                  Aynı kural, BTC'yi başka bir kripto para birimiyle takas etmek, BTC ile mal için ödeme yapmak veya kendiniz dışında birine ödeme olarak BTC göndermek için de geçerlidir. Üç durumda da IRS bunu işlem anında piyasa rayiç değerinde bir elden çıkarma olarak ele alır. BTC'yi kendi cüzdanlarınız arasında taşımak bir elden çıkarma değildir ve vergilendirilmez. Yalnızca brüt dönüşüm değil, bir satışın vergi sonrası dolar değerini hesaplıyorsanız, federal oranları ve 50 eyalet artı DC düzenini modelleyen{' '}
                  <a href="/tr/hesaplayicilar/bitcoin-vergi-hesaplayicisi" className="text-primary hover:underline">Sermaye Kazancı Vergisi Hesaplayıcısı</a> ile sayıları çalıştırın.
                </>
              ) : (
                <>
                  The same rule applies to swapping BTC for another cryptocurrency, paying for goods in BTC, or sending BTC as a payment to someone other than yourself. In all three cases the IRS treats it as a disposal at fair market value at the moment of the transaction. Moving BTC between your own wallets is not a disposal and not taxable. If you are working out the after-tax dollar value of a sale rather than just the gross conversion, run the numbers through our{' '}
                  <Link to="/calculators/capital-gains-tax" className="text-primary hover:underline">Capital Gains Tax Calculator</Link>, which models federal rates and the 50-state plus DC scheme.
                </>
              )}
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? "Sat Yığınlamak Neden Baskın Birim Haline Geldi?" : "Why Stacking Sats Became the Dominant Unit"}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "\"Sat yığınlama\" ifadesi, tek bir Bitcoin'in beş haneli rakamı ilk kez aştığı ve tam bir coin satın alma fikrinin çoğu insan için ulaşılamaz hissettirmeye başladığı 2018 civarında yaygınlaştı. Bakiyeleri ve birikim hedeflerini sats cinsinden belirtmek konuşmayı yeniden çerçeveledi. 100.000 sat'lık bir alım somut hissediyor. 0.001 BTC'lik bir alım, iki sayı aynı olmasına rağmen bir yuvarlama hatası gibi geliyor."
                : "The phrase \"stacking sats\" took off around 2018, when a single Bitcoin first crossed five figures and the idea of buying a whole coin started to feel out of reach for most people. Quoting balances and accumulation goals in sats reframed the conversation. A 100,000 sat purchase sounds tangible. A 0.001 BTC purchase sounds like a rounding error, even though the two numbers are identical."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr ? (
                <>
                  Bu değişim benimseme için önemlidir. Lightning Network faturaları varsayılan olarak sats cinsinden gösterilir. Cash App, Strike ve modern Bitcoin'e özgü cüzdanların çoğu, bakiyeleri önce sats, sonra BTC olarak gösterir. Tekrarlayan bir satın alma planlıyorsanız, haftada sat cinsinden düşünmek de psikolojik olarak fraksiyonel BTC cinsinden düşünmekten daha kolaydır. Bir sat hedefini herhangi bir gelecek fiyatta bir dolar hedefine çevirmek için{' '}
                  <a href="/tr/hesaplayicilar/satoshi-biriktirme" className="text-primary hover:underline">Sat Yığınla Hedef Hesaplayıcısı</a> projeksiyon işlemini halleder.
                </>
              ) : (
                <>
                  The shift matters for adoption. Lightning Network invoices are denominated in sats by default. The Cash App, Strike and most modern Bitcoin-only wallets show balances in sats first and BTC second. If you are budgeting a recurring purchase, thinking in sats per week is also psychologically easier than thinking in fractional BTC. To turn a sat goal into a dollar goal at any future price, our{' '}
                  <Link to="/calculators/stack-sats" className="text-primary hover:underline">Stack Sats Goal Calculator</Link> handles the projection.
                </>
              )}
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? "Zaman Kazandıran Zihinsel Matematik Kısayolları" : "The Mental Math Shortcuts That Save Time"}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Birkaç pratik kural, çoğu dönüşümü kafanızda yapılabilir kılar. Bitcoin 100.000 $ civarındayken bir sat bir sentin onda biri değerindedir, 1.000 sat bir dolardır ve bir mBTC 100 $'dır. BTC fiyatını %10 yukarı veya aşağı kaydırın ve bu rakamları aynı oranda kaydırın. Bitcoin 50.000 $ civarındayken her şeyi yarıya bölün: bir sat bir sentin yarım onda biri, 2.000 sat bir dolar ve bir mBTC 50 $ değerindedir. USD dışı para birimlerindeki miktarlar için önce yaklaşık USD rakamını alın, ardından kur çarprazını uygulayın. Çoğu insan bu şekilde yapıldığında doğru cevabın yaklaşık yüzde beş içindedir."
                : "A few rules of thumb make most conversions doable in your head. When Bitcoin is near $100,000, one sat is worth one tenth of a cent, 1,000 sats is one dollar, and one mBTC is $100. Shift the BTC price up or down by 10% and shift those numbers by the same. When Bitcoin is near $50,000, halve everything: one sat is worth half a tenth of a cent, 2,000 sats is one dollar, and one mBTC is $50. For amounts in non-USD currencies, get the rough USD figure first and then apply the cross rate. Most people are within five percent of the correct answer when they do it this way."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr ? (
                <>
                  Kalem üzerinde hesaplamadan daha kesin bir şey için, borsalar arasındaki spread ve saniye saniye fiyat kayması tahminleri iki ondalık basamağın ötesinde güvenilmez kıldığından, yukarıdaki hesap makinesi doğru araçtır. Gelecekteki bir BTC fiyatının dönüşümünüze veya portföyünüze ne yapacağını da öngörmeye çalışıyorsanız,{' '}
                  <a href="/tr/hesaplayicilar/bitcoin-ya-olsaydi" className="text-primary hover:underline">Ya Eğer Bitcoin Hesaplayıcısı</a> aynı canlı fiyat akışında ileri yönlü senaryolar modellemektedir.
                </>
              ) : (
                <>
                  For anything more precise than back-of-the-envelope, the calculator above is the right tool, because the spread between exchanges and the second-by-second price drift make estimates unreliable past two decimal places. If you are also trying to project what a future BTC price would do to your conversion or your portfolio, our{' '}
                  <Link to="/calculators/what-if" className="text-primary hover:underline">What-If Bitcoin Calculator</Link> models forward scenarios on the same live price feed.
                </>
              )}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
