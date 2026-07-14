import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from "@/components/LocalizedLink";
import { History, Pizza, AlertCircle, Lightbulb, Repeat, CalendarRange, Landmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const WhatIfContentSections = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  return (
    <div>
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Section 1 */}
        <div>
          <h2 className="text-h2 font-semibold text-foreground text-center mb-4">
              {tr ? 'En Ünlü Bitcoin "Ya Alsaydım" Senaryoları' : 'The Most Famous Bitcoin "What If" Scenarios'}
            </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>Her Bitcoin yatırımcısı eninde sonunda aynı zihinsel oyunu oynar. 2010'da 100 $ alsaydım ne olurdu? 2017'de dinleseydim ne olurdu? 5.000 $'dan satmak yerine tutsaydım? Bu hesap makinesi tam da bu egzersiz için yapılmıştır, ancak rakamlar iki yönlü keser. Bir yanda çarpıcı bir servet, öte yanda bunu gerçekten yakalayabilmek için gereken disiplin gösterirler.</p>
                <p>En çok aranan senaryolar duygusal çıpa tarihleri etrafında kümelenmektedir: 2010 Pizza Günü fiyatı (0,0041 $), Bitcoin'in 2011'deki ilk 1 $ kapanışı, 2013'teki 1.000 $'a yükselmesi, 2017 çılgınlık zirvesi 19.800 $ ve Mart 2020 COVID çöküşünün en düşüğü 4.100 $. Bu girişlerin her biri risk, zamanlama ve inanç hakkında farklı bir ders verir.</p>
              </>
            ) : (
              <>
                <p>Every Bitcoin investor eventually plays the same mental game. What if I had bought $100 in 2010? What if I had listened in 2017? What if I had held instead of selling at $5,000? This calculator is built for exactly that exercise, but the numbers cut both ways. They show staggering wealth on one hand and the discipline required to actually capture it on the other.</p>
                <p>The most-searched scenarios cluster around emotional anchor dates: the 2010 Pizza Day price ($0.0041), Bitcoin's first $1 close in 2011, the 2013 spike to $1,000, the 2017 mania peak at $19,800, and the COVID-crash low of $4,100 in March 2020. Each of those entries unlocks a different lesson about risk, timing, and conviction.</p>
              </>
            )}
          </div>
        </div>

        {/* Section 2 - Famous Scenarios Table */}
        <div>
          <h2 className="text-h2 font-semibold text-foreground text-center mb-4">
              {tr ? 'Ünlü Kaçırılmış Fırsat Matematiği' : 'Famous Missed-Opportunity Math'}
            </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-prose">
            {tr
              ? '100.000 $ BTC fiyatında her ikonik Bitcoin fiyat noktasına yatırılan 100 $\'ın değeri.'
              : "Here's what $100 invested at each iconic Bitcoin price point would be worth at $100,000 BTC."}
          </p>
          <Card className="glass-morphism-card border-border/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">{tr ? 'Tarih' : 'Date'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'BTC Fiyatı' : 'BTC Price'}</TableHead>
                    <TableHead className="font-semibold">{tr ? '100$ Ne Alır' : '$100 Buys'}</TableHead>
                    <TableHead className="font-semibold">{tr ? '100.000$\'da Değeri' : 'Worth at $100K'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium">{tr ? 'Mayıs 2010 (Pizza Günü)' : 'May 2010 (Pizza Day)'}</TableCell><TableCell>$0.0041</TableCell><TableCell>24.390 BTC</TableCell><TableCell className="text-success font-semibold">$2.4 {tr ? 'milyar' : 'billion'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">{tr ? 'Şub 2011 (ilk 1$)' : 'Feb 2011 (first $1)'}</TableCell><TableCell>$1.00</TableCell><TableCell>100 BTC</TableCell><TableCell className="text-success font-semibold">$10 {tr ? 'milyon' : 'million'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">{tr ? 'Kas 2013 zirvesi' : 'Nov 2013 peak'}</TableCell><TableCell>$1,242</TableCell><TableCell>0.0805 BTC</TableCell><TableCell className="text-success">$8,050</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">{tr ? 'Ara 2017 zirvesi' : 'Dec 2017 peak'}</TableCell><TableCell>$19,800</TableCell><TableCell>0.00505 BTC</TableCell><TableCell className="text-warning">$505</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">{tr ? 'Mar 2020 (COVID dibi)' : 'Mar 2020 (COVID low)'}</TableCell><TableCell>$4,107</TableCell><TableCell>0.02435 BTC</TableCell><TableCell className="text-success">$2,435</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">{tr ? 'Kas 2021 zirvesi' : 'Nov 2021 peak'}</TableCell><TableCell>$69,000</TableCell><TableCell>0.00145 BTC</TableCell><TableCell className="text-warning">$145</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">{tr ? 'Kas 2022 (FTX dibi)' : 'Nov 2022 (FTX low)'}</TableCell><TableCell>$15,500</TableCell><TableCell>0.00645 BTC</TableCell><TableCell className="text-success">$645</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4">
            {tr
              ? '2017 balonunun mutlak zirvesinden bile alım yapmak (modern Bitcoin tarihindeki en kötü zamanlama) 2026\'ya kadar 5 kat getiri sağlamıştır. Mart 2020 veya Kasım 2022 gibi çöküş sonrası alım yapmak ise serveti çok daha hızlı katladı.'
              : "Even buying at the absolute peak of the 2017 bubble (the worst possible timing in modern Bitcoin history) still produced a 5x return by 2026. Buying after a crash, like March 2020 or November 2022, multiplied wealth far faster."}
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-h2 font-semibold text-foreground text-center mb-4">
              {tr ? 'Geçmiş Getiriler Gelecek Getirileri Tahmin Etmez' : "Why Past Returns Don't Predict Future Returns"}
            </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>Bitcoin 2010-2017 arasında yıllık yaklaşık %200 getiri sağladı. Matematiksel bileşim kâğıt üzerinde güzel görünür; ancak gerçek getiri dağılımı birkaç sert harekete kümelendi. Herhangi bir yılda en iyi 10 günü kaçırsaydınız toplam getiriniz genellikle %70 veya daha fazla düşerdi. Önümüzdeki on yıl son on yıla benzemeyecek. Bitcoin'in piyasa değeri artık milyonlarca kat daha fazla hareket için çok büyük.</p>
                <p>Dürüst çerçeveleme şudur: 2010'da 100 $'lık alım istatistiksel olarak tarihe karışmıştır. Gelecekteki senaryolar çok yıllık tutmalarda 24.000.000% değil, 2x ila 20x aralığında yaşanacaktır. Makul beklentiler önemlidir. Matematiksel destekli uzun vadeli hedefler için <Link to="/calculators/power-law" className="text-primary hover:underline font-medium">{tr ? 'Güç Yasası Hesaplayıcısı\'nı' : 'Power Law Calculator'}</Link> kullanın.</p>
              </>
            ) : (
              <>
                <p>Bitcoin returned roughly 200% per year from 2010 to 2017. The math compounds beautifully on paper, but the actual distribution of returns clustered into a few violent moves. If you missed the best 10 days in any given year, your total return often dropped by 70% or more. The next decade will not look like the last one. Bitcoin's market cap is now too large for another million-fold move.</p>
                <p>The honest framing is this: a $100 buy in 2010 is statistically extinct. Future scenarios live in the 2x to 20x range over multi-year holds, not the 24,000,000% range. Reasonable expectations matter. Use our <Link to="/calculators/power-law" className="text-primary hover:underline font-medium">Power Law Calculator</Link> for math-grounded long-range targets.</p>
              </>
            )}
          </div>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-h2 font-semibold text-foreground text-center mb-4">
              {tr ? 'Bir Sonraki Bitcoin Pişmanlığı Nasıl Önlenir' : 'How to Avoid the Next Bitcoin Regret'}
            </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>Fiyatlar her iki yönde de korku verici olduğunda "ya alsaydım" düşüncesinin panzehiri, gerçekten takip edebileceğiniz bir sistemdir. Yeni Bitcoin yatırımcıları için üç kural tutarlı biçimde işe yarıyor: (1) tamamen kaybetsek de kaldırabileceğiniz sabit bir dolar tutarına karar verin, (2) fiyatına bakmaksızın bir programa göre (haftalık veya aylık) alım yapın ve (3) pozisyonu gözden geçirmeden önce çok yıllı bir zaman çizelgesi belirleyin.</p>
                <p>Bu çerçeve, çoğu yatırımcıyı tuzağa düşüren zamanlama kararını ortadan kaldırır. 2017'de alım yapıp 2018'in %84'lük düşüşünü tutarak geçenler 2020'ye gelindiğinde kâra geçmişti. 2017'de satıp dibi zamanlamaya çalışanların çoğu ise dibi kaçırdı. <Link to="/calculators/dca" className="text-primary hover:underline font-medium">{tr ? 'Bitcoin DCA Hesaplayıcımız' : 'Bitcoin DCA Calculator'}</Link> bu yaklaşımı gerçek tarihsel verilerle modelliyor.</p>
              </>
            ) : (
              <>
                <p>The cure for "what if" thinking is a system you can actually follow when prices are scary in either direction. Three rules consistently work for new Bitcoin allocators: (1) decide a fixed dollar amount you can stomach losing entirely, (2) buy on a schedule (weekly or monthly) regardless of price, and (3) set a multi-year timeline before reviewing the position.</p>
                <p>That framework removes the timing decision that traps most investors. The biggest 2017 buyers who held through 2018's 84% drawdown ended up profitable by 2020. The biggest 2017 sellers who tried to time the bottom mostly missed it. Our <Link to="/calculators/dca" className="text-primary hover:underline font-medium">Bitcoin DCA Calculator</Link> models this approach with real historical data.</p>
              </>
            )}
          </div>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-h2 font-semibold text-foreground text-center mb-4">
              {tr ? '"Ya Alsaydım" ile DCA: Daha İyi Bir Zihinsel Model' : 'What-If vs DCA: A Better Mental Model'}
            </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>"100 $'dan alsaydım ne olurdu" tek atışlık bir sorudur. "2017'den beri her hafta 50 $ alsaydım ne olurdu" ise daha kullanışlı bir sorudur, çünkü gerçek insanların yatırım yapma biçimine daha yakındır. Ocak 2017'den Nisan 2026'ya kadar haftalık 50 $'lık DCA (yaklaşık 485 hafta, 24.250 $ yatırım) yaklaşık 2,1 BTC biriktirirdi; bu da 100 bin $ BTC fiyatıyla yaklaşık 210.000 $'a karşılık gelir. Bu, hiçbir zaman dibi zamanlama ihtiyacı duymadan %766 getiridir.</p>
                <p>Bu hesap makinesinin verdiği ders "2010'da BTC'yi 1 $'dan almam gerekirdi" değildir. Ders şudur: her döngü boyunca tutarlı alım yapmak, manşetleri görmezden gelmek, bireysel alım kararları o an çok kötü görünse bile tarihsel olarak güçlü getiriler sağlamıştır. <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline font-medium">{tr ? 'Toplu Yatırım ve DCA Hesaplayıcısı' : 'Lump Sum vs DCA Calculator'}</Link> ile yan yana karşılaştırın.</p>
              </>
            ) : (
              <>
                <p>"What if I had bought at $100" is a single-shot question. "What if I had bought $50 every week since 2017" is a more useful one because it matches how real people actually invest. A weekly DCA of $50 from January 2017 through April 2026 (about 485 weeks at $24,250 invested) would have accumulated roughly 2.1 BTC, worth approximately $210,000 at $100K BTC pricing. That's a 766% return without ever needing to time a bottom.</p>
                <p>The lesson from this calculator isn't "I should have bought BTC at $1." It's that consistent buying through every cycle, ignoring the headlines, has historically produced strong returns even when individual buy decisions looked terrible at the time. Compare side-by-side with our <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline font-medium">Lump Sum vs DCA Calculator</Link>.</p>
              </>
            )}
          </div>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-h2 font-semibold text-foreground text-center mb-4">
              {tr ? '4 Yıllık Kural: Yarılanmalar Bitcoin Döngülerini Neden Belirler' : 'The 4-Year Rule: Why Halvings Define Bitcoin Cycles'}
            </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>Bitcoin yaklaşık 4 yıllık bir ritimle çalışmaktadır. Her 210.000 blokta bir madencilere ödenen blok ödülü yarıya iner. Yarılanmalar Kasım 2012, Temmuz 2016, Mayıs 2020 ve Nisan 2024'te gerçekleşti ve her biri yeni coin'lerin günlük çıkarımını daralttı. Bu arz şoku, tarihsel olarak bir sonraki döngü için tabanı sıfırladı. Desen o kadar tutarlı ki, CoinGecko 2026 fiyat verilerine göre 2010-2022 arasındaki herhangi bir giriş tarihinden yapılan her tamamlanmış 4 yıllık tutma pozitif nominal getiriyle sonuçlandı.</p>
                <p>Mekanizma grafiğin göründüğünden daha basittir. Çıkarım düşer, yeni coin üretme maliyeti artar ve daha yavaş büyüyen bir arzın karşısında yeni alıcılardan gelen talep birikir. Dört yarılanmadan üçünün ardından 18 ay içinde yeni bir tüm zamanların en yükseği görüldü. 2024 yarılanması, 2025'te 108.000 $'ın üzerindeki baskıyla şu ana kadar aynı senaryoyu izledi. Bu bir sonraki döngüyü garanti etmez; ancak uzun vadeli Bitcoin yatırımcılarının haftalık mumları okumak yerine neden 4 yıllık bloklar halinde planladığını açıklar.</p>
              </>
            ) : (
              <>
                <p>Bitcoin runs on a roughly 4-year heartbeat. Every 210,000 blocks, the block reward paid to miners is cut in half. The halvings landed in November 2012, July 2016, May 2020, and April 2024, and each one tightened the daily issuance of new coins. That supply shock has historically reset the floor for the next cycle. The pattern is so consistent that, per CoinGecko price data through 2026, every completed 4-year hold from any entry date between 2010 and 2022 has ended in a positive nominal return.</p>
                <p>The mechanism is simpler than the chart looks. Issuance falls, the cost of producing a new coin rises, and demand from new buyers accumulates against a slower-growing float. Three of the four halvings were followed by a new all-time high within 18 months. The 2024 halving has, so far, followed the same script with the 2025 print above $108,000. That does not guarantee the next cycle, but it explains why long-only Bitcoin investors plan in 4-year blocks instead of trying to read weekly candles.</p>
              </>
            )}
          </div>
        </div>

        {/* Section 7 */}
        <div>
          <h2 className="text-h2 font-semibold text-foreground text-center mb-4">
              {tr ? 'Enflasyona Göre Düzeltilmiş Bitcoin Getirileri' : 'Inflation-Adjusted Bitcoin Returns'}
            </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>Nominal getiriler her uzun vadeli yatırımı olduğundan iyi gösterir. 2017'de ölçüm yaptığınız dolar, 2026'da bozduracağınız dolarla aynı değildir. BLS Tüketici Fiyat Endeksi CUUR0000SA0 serisine göre ABD fiyatları Ocak 2017'den 2026 başına kadar kümülatif olarak yaklaşık %35 arttı. Gerçek (enflasyona göre düzeltilmiş) getiriler, para birimi birimleri yerine satın alma gücünü karşılaştırabilmek için bu manşeti deflate eder.</p>
                <p>Çalışılmış örnek: 2017 başında yaklaşık 1.000 $/BTC fiyatına yatırılan 1.000 $ 1 BTC satın aldı. 100.000 $ BTC fiyatında bu pozisyon nominal olarak 100.000 $'a değer. %35 kümülatif TÜFE uygulandığında gerçek değer 2017 satın alma gücüyle yaklaşık 74.000 $'a düşer. Manşet rakamı düşer; ancak Bitcoin'in olağanüstü yükselişi enflasyon düzeltmesini hâlâ büyük ölçüde geride bırakır. Aynı getiriyi YBBO rakamı olarak yıllıklandırmak için <Link to="/calculators/cagr" className="text-primary hover:underline font-medium">{tr ? 'YBBO Hesaplayıcımızı' : 'CAGR Calculator'}</Link> kullanın.</p>
              </>
            ) : (
              <>
                <p>Nominal returns flatter every long-duration investment. The dollar you measure with in 2017 is not the same dollar you cash out in 2026. According to the BLS Consumer Price Index series CUUR0000SA0, US prices rose roughly 35% cumulatively from January 2017 to early 2026. Real (inflation-adjusted) returns deflate that headline so you compare purchasing power, not currency units.</p>
                <p>Worked example: $1,000 invested in early 2017 at roughly $1,000 per BTC bought 1 BTC. At a $100,000 BTC price, that position is worth $100,000 in nominal dollars. After applying 35% cumulative CPI, the real value is roughly $74,000 in 2017 purchasing power. The headline number drops, but Bitcoin's outsized run still dwarfs the inflation correction. To annualize the same return as a CAGR figure, use our <Link to="/calculators/cagr" className="text-primary hover:underline font-medium">CAGR Calculator</Link>.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
