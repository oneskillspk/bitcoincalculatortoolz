import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

export const ZakatContentSections = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  return (
    <div className="space-y-12 max-w-3xl mx-auto">
      {/* Section A */}
      <section>
        <h2 className="text-h2 font-bold text-foreground mb-4">
          {tr ? 'Bitcoin\'den Zekât Öder miyim? İslami Hüküm Açıklaması' : 'Do I Pay Zakat on Bitcoin? Islamic Ruling Explained'}
        </h2>
        <div className="prose prose-sm text-muted-foreground space-y-3">
          {tr ? (
            <>
              <p>Evet, çoğunluk çağdaş İslam âlimine göre. Bitcoin, Zekât tarihindeki değerinin <strong>%2,5</strong>'i üzerinden Zekâta tabi parasal bir varlık veya ticaret malı (<em>māl</em>) olarak değerlendirilmektedir; ancak toplam servetinizin tam bir ay takvimi yılı (Havl) boyunca Nisab eşiğini aşması gerekmektedir.</p>
              <p>Bu hüküm; İslam Fıkıh Akademisi, Mufti Taqi Usmani'nin dijital varlıklara ilişkin çerçevesi ve çoğu İslam finans kuruluşu tarafından desteklenmektedir. Bitcoin şu kriterleri karşılamaktadır: (1) tam mülkiyet, (2) temel ihtiyaçların üzerinde olma, (3) Nisab eşiğini aşma ve (4) bir Havl boyunca elde tutulma.</p>
              <p>Bitcoin'i uzun vadeli bir değer saklama aracı veya yatırım olarak tutmak büyük ölçüde caiz (helal) sayılmaktadır. Borçla yapılan aktif kısa vadeli spekülasyon, İslam finansı ilkeleri çerçevesinde farklı endişelere yol açabilir — durumunuza özgü rehberlik için nitelikli bir âlime danışın.</p>
            </>
          ) : (
            <>
              <p>Yes, according to the majority of contemporary Islamic scholars. Bitcoin is treated as a monetary asset or trade good (<em>māl</em>) subject to Zakat at <strong>2.5%</strong> of its value at your Zakat date, provided your total wealth has exceeded the Nisab threshold for a full lunar year (Hawl).</p>
              <p>This ruling is supported by scholars including the Islamic Fiqh Academy, Mufti Taqi Usmani's framework on digital assets, and most Islamic finance bodies. Bitcoin meets the criteria of being: (1) owned in full, (2) in excess of basic needs, (3) above the Nisab threshold, and (4) held for one Hawl.</p>
              <p>Simply holding Bitcoin as a store of value or long-term investment is widely considered permissible (halal). Active short-term speculation with borrowed funds may raise different concerns under Islamic finance principles — consult a qualified scholar for guidance specific to your situation.</p>
            </>
          )}
        </div>
      </section>

      {/* Section B */}
      <section>
        <h2 className="text-h2 font-bold text-foreground mb-4">
          {tr ? 'BTC İslam\'da Haram mı? Âlimlerin Görüşü' : "Is BTC Haram in Islam? What Scholars Say"}
        </h2>
        <div className="prose prose-sm text-muted-foreground space-y-3">
          {tr ? (
            <>
              <p>Çoğunluk çağdaş İslam âlimi, Bitcoin'i dijital bir parasal varlık olarak değerlendirerek elde tutulmasının ve ticaretinin caiz (helal) olduğunu kabul etmektedir. Görüşler tamamen caizden koşullu caize kadar uzanmaktadır.</p>
              <p>Kısıtlayıcı âlimlerin öne sürdüğü başlıca endişeler şunlardır: aşırı fiyat spekülasyonu, haram işlemlerde kullanım ve devlet güvencesinin olmaması. Ancak bu endişelerin aynısı pek çok geleneksel varlık için de geçerlidir ve Bitcoin'i kategorik olarak haram kılmaz.</p>
              <p>Bitcoin satın almak uzun vadeli bir yatırım olarak <strong>kumar</strong> (<em>maysir</em>) sayılmaz. Kumarın sıfır toplamlı bir şans unsuru içermesi gerekir — temel bir faydası olan bir varlığa yatırım yapmak bu tanımı karşılamaz.</p>
            </>
          ) : (
            <>
              <p>The majority of contemporary Islamic scholars consider Bitcoin permissible (halal) to hold and trade, viewing it as a digital monetary asset. Opinions range from fully permissible to conditionally permissible.</p>
              <p>The primary concerns raised by scholars who restrict it are: extreme price speculation, use in prohibited transactions, and lack of government backing. However, these same concerns apply to many traditional assets and do not make Bitcoin categorically haram.</p>
              <p>Purchasing Bitcoin as a long-term investment is <strong>not</strong> considered gambling (<em>maysir</em>). Gambling requires an element of zero-sum chance — investing in an asset with fundamental utility does not meet this definition.</p>
            </>
          )}
        </div>
      </section>

      {/* Section C */}
      <section>
        <h2 className="text-h2 font-bold text-foreground mb-4">
          {tr ? 'Bitcoin\'den Zekât Nasıl Hesaplanır — Formül' : 'How to Calculate Zakat on Bitcoin — The Formula'}
        </h2>
        <div className="prose prose-sm text-muted-foreground space-y-3">
          {tr ? (
            <>
              <p>Formül oldukça basittir:</p>
              <div className="bg-muted/30 p-4 rounded-xl text-center font-mono text-foreground">
                Zekât = (Toplam Zekât Matrahı − Borçlar) × %2,5
              </div>
              <p>Bitcoin için özellikle: BTC varlıklarınızı güncel piyasa fiyatıyla çarpın, diğer Zekâta tabi varlıkları ekleyin (nakit, altın, gümüş, hisse senedi), 12 ay içinde ödenecek borçları çıkarın ve net toplamın %2,5'ini alın.</p>
              <p><strong>Çalışılmış örnek:</strong> 85.000 $/BTC fiyatından 0,5 BTC = 42.500 $. Artı 5.000 $ nakit ve 50g 22K altın (~7.525 $). Toplam: 55.025 $. Eksi 2.000 $ borç = 53.025 $ net. Zekât = 53.025 $ × %2,5 = <strong>1.325,63 $</strong>.</p>
            </>
          ) : (
            <>
              <p>The formula is straightforward:</p>
              <div className="bg-muted/30 p-4 rounded-xl text-center font-mono text-foreground">
                Zakat = (Total Zakatable Assets − Debts Due) × 2.5%
              </div>
              <p>For Bitcoin specifically: multiply your BTC holdings by the current market price, add all other zakatable assets (cash, gold, silver, stocks), subtract debts due within 12 months, and take 2.5% of the net total.</p>
              <p><strong>Worked example:</strong> 0.5 BTC at $85,000/BTC = $42,500. Plus $5,000 cash and 50g of 22K gold (~$7,525). Total: $55,025. Minus $2,000 in debts = $53,025 net. Zakat = $53,025 × 2.5% = <strong>$1,325.63</strong>.</p>
            </>
          )}
        </div>
      </section>

      {/* Section D */}
      <section>
        <h2 className="text-h2 font-bold text-foreground mb-4">
          {tr ? 'Pakistan\'da Bitcoin Zekâtı — PKR Nisabı 2026' : "Zakat on Bitcoin in Pakistan — PKR Nisab 2026"}
        </h2>
        <div className="prose prose-sm text-muted-foreground space-y-3">
          {tr ? (
            <>
              <p>Pakistan, Zekât ile ilgili Bitcoin aramalarında en yüksek hacme sahip ülkeler arasındadır. PKR cinsinden Gümüş Nisabı, gümüş fiyatları ve USD/PKR kuru ile birlikte her gün dalgalanmaktadır.</p>
              <p>Mart 2026 itibarıyla Pakistan'da Gümüş Nisabı yaklaşık <strong>466.000–470.000 PKR</strong>; Altın Nisabı ise yaklaşık <strong>4.000.000+ PKR</strong>'dir. Güncel değerler için yukarıdaki anlık hesap makinesini kullanın.</p>
              <p>Pakistan Zekât ve Öşür Yönetmeliği 1980 kapsamında Zekât, banka hesaplarından yıllık %2,5 oranında kaynakta kesilerek alınmaktadır. Ancak <strong>Bitcoin varlıkları otomatik olarak kapsanmamaktadır</strong> — kripto varlıklar üzerindeki Zekâtı kendiniz hesaplayıp ödemeniz gerekmektedir.</p>
            </>
          ) : (
            <>
              <p>Pakistan has one of the highest Bitcoin search volumes for Zakat-related queries. The Silver Nisab in PKR fluctuates daily with silver prices and the USD/PKR exchange rate.</p>
              <p>As of March 2026, the Silver Nisab in Pakistan is approximately <strong>₨466,000–470,000 PKR</strong>. The Gold Nisab is approximately <strong>₨4,000,000+ PKR</strong>. Use the live calculator above for today's exact values.</p>
              <p>Under Pakistan's Zakat & Ushr Ordinance 1980, Zakat is deducted at source from bank accounts at 2.5% annually. However, <strong>Bitcoin holdings are not automatically captured</strong> — you must calculate and pay Zakat on crypto assets yourself.</p>
            </>
          )}
        </div>
      </section>

      {/* Section E */}
      <section>
        <h2 className="text-h2 font-bold text-foreground mb-4">
          {tr ? 'Hindistan\'da Bitcoin Zekâtı — 1 Lakh ve INR Nisabı 2026' : "Zakat on Bitcoin in India — 1 Lakh and INR Nisab 2026"}
        </h2>
        <div className="prose prose-sm text-muted-foreground space-y-3">
          {tr ? (
            <>
              <p><strong>"1 Lakh Zekât Hesaplayıcısı"</strong> Hindistan'da en çok aranan Zekât terimlerinden biridir. İşte yanıt:</p>
              <p>%2,5 üzerinden: ₹1,00,000 üzerindeki Zekât = <strong>₹2.500</strong>.</p>
              <p>Ancak 2026'da Hindistan'da Gümüş Nisabı yaklaşık <strong>₹144.000–145.000 INR</strong>'dir. Bu, ₹1,00,000'ın Gümüş Nisabının <em>altında</em> olduğu anlamına gelir — <em>toplam</em> net Zekât matrahınız yalnızca 1 lakh ise <strong>Zekât ödeme yükümlülüğünüz yoktur</strong>. Birleşik varlıklarınızla Nisab eşiğini aşmanız gerekmektedir.</p>
            </>
          ) : (
            <>
              <p><strong>"1 Lakh Zakat Calculator"</strong> is among the most searched Zakat terms in India. Here's the answer:</p>
              <p>At 2.5%: Zakat on ₹1,00,000 = <strong>₹2,500</strong>.</p>
              <p>However, in 2026 the Silver Nisab in India is approximately <strong>₹144,000–145,000 INR</strong>. This means ₹1,00,000 is <em>below</em> the Silver Nisab — if your <em>total</em> net zakatable wealth is only ₹1 lakh, <strong>you are not obligated to pay Zakat</strong>. You must exceed the Nisab threshold with your combined assets.</p>
            </>
          )}
        </div>
      </section>

      {/* Section F */}
      <section>
        <h2 className="text-h2 font-bold text-foreground mb-4">
          {tr ? 'Hangi Varlıklar Zekâta Tabi Değildir?' : "What Assets Are Not Zakatable?"}
        </h2>
        <div className="prose prose-sm text-muted-foreground space-y-3">
          {tr ? (
            <ul className="list-disc pl-5 space-y-1">
              <li>İçinde yaşadığınız birincil konut</li>
              <li>Günlük yaşamda kullanılan kişisel araç ve ev eşyaları</li>
              <li>Kişisel giysi ve eşyalar</li>
              <li>Mesleğiniz için kullandığınız alet ve ekipmanlar</li>
              <li>Bir Havl'den (ay takvimi yılı) az süredir sahip olunan varlıklar</li>
              <li>Kişisel takılar — <em>tartışmalı</em> (Hanefi âlimler altın/gümüş takıların Zekâta TABİ olduğunu söyler)</li>
            </ul>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              <li>Your primary residence (home you live in)</li>
              <li>Personal vehicle and household items used for daily life</li>
              <li>Personal clothing and belongings</li>
              <li>Tools and equipment used for your profession</li>
              <li>Assets owned for less than one Hawl (lunar year)</li>
              <li>Personal jewelry — <em>disputed</em> (Hanafi scholars say gold/silver jewelry IS zakatable)</li>
            </ul>
          )}
          <p>
            {tr
              ? 'Kira geliri sağlayan yatırım amaçlı gayrimenkuller, âlime göre Zekâta tabi olabilir. Yalnızca kişisel kullanım için elde tutulan uzun vadeli taşınmazlar genellikle Zekâta tabi sayılmaz.'
              : 'Investment properties generating rental income may be zakatable depending on the scholar. Long-term real estate held purely for personal use is generally not zakatable.'}
          </p>
        </div>
      </section>

      {/* Section G */}
      <section>
        <h2 className="text-h2 font-bold text-foreground mb-4">
          {tr ? 'Zekât Hesaplamada Yaygın Hatalar' : 'Common Mistakes When Calculating Zakat'}
        </h2>
        <div className="prose prose-sm text-muted-foreground space-y-3">
          {tr ? (
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Gümüş Nisabı uygulanırken Altın Nisabını kullanmak.</strong> Altın Nisabı 2026'da ~14.377 $, Gümüş Nisabı ise ~1.671 $'dır — pek çok kişi daha yüksek eşiği kullanarak hatalı biçimde Zekât yükümlülüğünün dışında kalıyor.</li>
              <li><strong>Bitcoin ve dijital varlıkları unutmak.</strong> Kripto varlıklar da nakit gibi Zekâta tabidir — bunları atlamayın.</li>
              <li><strong>Tüm ipotek bakiyesini düşmek.</strong> Yalnızca 12 aylık taksit düşülebilir, toplam kredi tutarı değil.</li>
              <li><strong>Havl'i hesaba katmamak.</strong> Zekât yalnızca Nisab üzerinde tam bir ay takvimi yılı (354 gün) tutulan varlıklar için vaciptir.</li>
              <li><strong>Güncel olmayan Nisab değerleri kullanmak.</strong> Gümüş fiyatları önemli ölçüde artmıştır — 2026 Nisab değerleri 2024/2025'tekinden çok farklıdır. Her zaman anlık fiyatları kullanın.</li>
            </ol>
          ) : (
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Using Gold Nisab when Silver Nisab applies.</strong> Gold Nisab is ~$14,377 vs Silver's ~$1,671 in 2026 — many people incorrectly exclude themselves from Zakat obligation by using the higher threshold.</li>
              <li><strong>Forgetting Bitcoin and digital assets.</strong> Crypto holdings are zakatable just like cash — don't omit them.</li>
              <li><strong>Deducting full mortgage balance.</strong> Only the 12-month instalment is deductible, not the total loan.</li>
              <li><strong>Not accounting for Hawl.</strong> Zakat is only due on assets held above Nisab for a full lunar year (354 days).</li>
              <li><strong>Using outdated Nisab values.</strong> Silver has surged significantly — 2026 Nisab values are very different from 2024/2025. Always use live prices.</li>
            </ol>
          )}
        </div>
      </section>

      {/* Internal links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/calculators/bitcoin-converter" className="p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-all group">
          <p className="text-sm font-medium text-primary group-hover:underline">
            {tr ? 'BTC\'yi PKR, INR, USD\'ye Çevir →' : 'Convert BTC to PKR, INR, USD →'}
          </p>
          <p className="text-xs text-muted-foreground">
            {tr ? 'Kesin tutarlar için Bitcoin birim dönüştürücümüzü kullanın' : 'Use our Bitcoin unit converter for exact amounts'}
          </p>
        </Link>
        <Link to="/calculators/wealth-percentile" className="p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-all group">
          <p className="text-sm font-medium text-primary group-hover:underline">
            {tr ? 'BTC servetinizin nerede durduğunu görün →' : 'See where your BTC wealth ranks →'}
          </p>
          <p className="text-xs text-muted-foreground">
            {tr ? 'Varlıklarınızı küresel Bitcoin dağılımıyla karşılaştırın' : 'Compare your holdings against global Bitcoin distribution'}
          </p>
        </Link>
        <Link to="/calculators/capital-gains-tax" className="p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-all group">
          <p className="text-sm font-medium text-primary group-hover:underline">
            {tr ? 'BTC üzerindeki İngiltere/ABD vergisini hesapla →' : 'Calculate UK/US tax on BTC →'}
          </p>
          <p className="text-xs text-muted-foreground">
            {tr ? 'Bitcoin satışlarında ödenmesi gereken sermaye kazancı vergisini tahmin edin' : 'Estimate capital gains tax owed on Bitcoin sales'}
          </p>
        </Link>
        <Link to="/calculators/investment" className="p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-all group">
          <p className="text-sm font-medium text-primary group-hover:underline">
            {tr ? 'Bitcoin yatırım büyümesini hesapla →' : 'Calculate Bitcoin investment growth →'}
          </p>
          <p className="text-xs text-muted-foreground">
            {tr ? 'BTC\'nizin 1–20 yıl içinde ne kadar olabileceğini tahmin edin' : 'Project what your BTC could be worth in 1–20 years'}
          </p>
        </Link>
      </div>
    </div>
  );
};
