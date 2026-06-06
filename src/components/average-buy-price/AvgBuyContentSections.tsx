import { useLanguage } from '@/contexts/LanguageContext';

export const AvgBuyContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-10">
        <div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Ortalama Alım Fiyatınız Neden Önemlidir?' : 'Why Your Average Buy Price Matters'}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? "Ortalama alım fiyatınız — maliyet tabanınız olarak da bilinir — Bitcoin portföyünüzdeki en önemli tek sayıdır. Herhangi bir anda kârda mı yoksa zararda mı olduğunuzu belirler ve sattığınızda sermaye kazancı vergisini hesaplamak için temel noktadır. Satın aldığınız fiyatların basit bir ortalamasının aksine, ağırlıklı ortalama, her fiyat noktasında gerçekte ne kadar Bitcoin satın aldığınızı hesaba katar. 0,1 BTC'yi 30.000 $'a ve 0,01 BTC'yi 60.000 $'a aldıysanız, ortalamanız 45.000 $ değil — düşük fiyatta on kat daha fazla Bitcoin satın aldığınız için 30.000 $'a çok daha yakındır."
                : "Your average buy price — also called your cost basis — is the single most important number in your Bitcoin portfolio. It determines whether you're in profit or loss at any given moment, and it's the baseline for calculating capital gains tax when you sell. Unlike a simple average of the prices you bought at, a weighted average accounts for how much Bitcoin you actually purchased at each price point. If you bought 0.1 BTC at $30,000 and 0.01 BTC at $60,000, your average isn't $45,000 — it's much closer to $30,000 because you bought ten times more Bitcoin at the lower price."}
            </p>
            <p>
              {tr
                ? "Vergi amaçları doğrultusunda çoğu yargı bölgesi, maliyet tabanınızı doğru bir şekilde takip etmenizi gerektirir. IRS, HMRC ve ATO'nun tamamı, Bitcoin'i elden çıkardığınızda vergiye tabi kazancınızı belirlemek için maliyet tabanını kullanır. Bu sayıyı yanlış almak aşırı vergi ödemeye veya daha da kötüsü bir denetime neden olabilir. Bu hesap makinesi, kayıt tutma ve vergi planlaması için kullanabileceğiniz anlık, doğru ağırlıklı ortalamayı verir."
                : "For tax purposes, most jurisdictions require you to track your cost basis accurately. The IRS, HMRC, and ATO all use cost basis to determine your taxable gain when you dispose of Bitcoin. Getting this number wrong can result in overpaying taxes or, worse, triggering an audit. This calculator gives you an instant, accurate weighted average you can use for record-keeping and tax planning."}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Maliyet Tabanı Nedir?' : 'What Is Cost Basis?'}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-prose">
            {tr
              ? "Maliyet tabanı, vergi amaçları için bir varlığın orijinal değeridir. Bitcoin için, ödediğiniz toplam miktarı aldığınız toplam BTC'ye bölerek hesaplanır. Çalışılmış örnek: 0,05 BTC'yi 30.000 $'a (1.500 $ harcayarak) ve ardından 0,03 BTC'yi 60.000 $'a (1.800 $ harcayarak) satın alıyorsunuz. Toplam harcamanız, BTC başına 41.250 $ ağırlıklı ortalama maliyet tabanı vererek 0,08 BTC için 3.300 $'dır. Sattığınızda vergiye tabi kazancınız veya kaybınız, satış fiyatı eksi bu maliyet tabanı, ardından satılan BTC miktarıyla çarpılarak hesaplanır."
              : "Cost basis is the original value of an asset for tax purposes. For Bitcoin, it's the total amount you paid divided by the total BTC you received. Here's a worked example: You buy 0.05 BTC at $30,000 (spending $1,500) and later buy 0.03 BTC at $60,000 (spending $1,800). Your total spent is $3,300 for 0.08 BTC, giving you a weighted average cost basis of $41,250 per Bitcoin. When you sell, your taxable gain or loss is calculated as the sell price minus this cost basis, multiplied by the amount of BTC sold."}
          </p>
        </div>

        <div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Ortalama Düşürme ile Ortalama Yükseltme Karşılaştırması' : 'Averaging Down vs Averaging Up'}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              {tr ? (
                <>
                  <strong className="text-foreground">Ortalama düşürme</strong>, fiyat mevcut ortalamanızın altına düştükten sonra daha fazla Bitcoin satın almak anlamına gelir. Bu, başa baş noktanızı düşürür ve kâra dönmek için daha küçük bir fiyat toparlanmasına ihtiyaç duyduğunuz anlamına gelir. Ayı piyasaları ve düzeltmeler sırasında yaygın bir strateji — ancak fiyat düşmeye devam ederse risk taşır.
                </>
              ) : (
                <>
                  <strong className="text-foreground">Averaging down</strong> means buying more Bitcoin after the price has fallen below your current average. This lowers your break-even point and means you need a smaller price recovery to return to profit. It's a common strategy during bear markets and corrections — but it carries risk if the price continues to fall.
                </>
              )}
            </p>
            <p>
              {tr ? (
                <>
                  <strong className="text-foreground">Ortalama yükseltme</strong>, fiyat ortalamanızın üzerine çıktıkça daha fazla satın almak anlamına gelir. Bu maliyet tabanınızı artırsa da Bitcoin'in uzun vadeli yörünesinin yukarı olduğuna inanıyorsanız rasyonel bir strateji olabilir. Pek çok yatırımcı karma bir yaklaşım kullanır: fiyat yönünden bağımsız olarak dolar maliyeti ortalar; bu da zaman içinde doğal olarak hem ortalama yükseltme hem de ortalama düşürmeyle sonuçlanır.
                </>
              ) : (
                <>
                  <strong className="text-foreground">Averaging up</strong> means buying more as the price rises above your average. While this increases your cost basis, it can be a rational strategy if you believe Bitcoin's long-term trajectory is upward. Many investors use a hybrid approach: they dollar-cost average regardless of price direction, which naturally results in both averaging up and averaging down over time.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
