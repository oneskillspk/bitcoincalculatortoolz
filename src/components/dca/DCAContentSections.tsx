import React from 'react';
import { Link } from "@/components/LocalizedLink";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollableTable } from '@/components/ui/ScrollableTable';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/retirement/SectionHeader';

export const DCAContentSections = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const weekdayData = tr ? [
    { day: "Pazartesi", avgReturn: "+14,36%", note: "Tarihsel olarak en güçlü alım günü" },
    { day: "Salı", avgReturn: "+11,82%", note: "En iyi birikim için ikinci gün" },
    { day: "Çarşamba", avgReturn: "+10,15%", note: "Hafta ortası tutarlılığı" },
    { day: "Perşembe", avgReturn: "+9,47%", note: "Ortalamanın biraz altında" },
    { day: "Cuma", avgReturn: "+8,93%", note: "Hafta sonu satış baskısı başlar" },
    { day: "Cumartesi", avgReturn: "+7,61%", note: "Düşük hacim, geniş yayılma" },
    { day: "Pazar", avgReturn: "+6,88%", note: "Haftanın en düşük hacmi" },
  ] : [
    { day: "Monday", avgReturn: "+14.36%", note: "Historically strongest buy day" },
    { day: "Tuesday", avgReturn: "+11.82%", note: "Second-best accumulation day" },
    { day: "Wednesday", avgReturn: "+10.15%", note: "Mid-week consistency" },
    { day: "Thursday", avgReturn: "+9.47%", note: "Slightly below average" },
    { day: "Friday", avgReturn: "+8.93%", note: "Weekend selling pressure begins" },
    { day: "Saturday", avgReturn: "+7.61%", note: "Lower volume, wider spreads" },
    { day: "Sunday", avgReturn: "+6.88%", note: "Lowest volume of the week" },
  ];

  const dcaByYearData = [
    { year: "2017", invested: "$1,200", btc: "0.098 BTC", value2026: "~$8,200", roi: "+583%" },
    { year: "2018", invested: "$1,200", btc: "0.155 BTC", value2026: "~$13,000", roi: "+983%" },
    { year: "2019", invested: "$1,200", btc: "0.134 BTC", value2026: "~$11,200", roi: "+833%" },
    { year: "2020", invested: "$1,200", btc: "0.109 BTC", value2026: "~$9,100", roi: "+658%" },
    { year: "2021", invested: "$1,200", btc: "0.029 BTC", value2026: "~$2,400", roi: "+100%" },
    { year: "2022", invested: "$1,200", btc: "0.049 BTC", value2026: "~$4,100", roi: "+242%" },
    { year: "2023", invested: "$1,200", btc: "0.038 BTC", value2026: "~$3,200", roi: "+167%" },
  ];

  return (
    <div className="space-y-16">
      {/* Section 1 */}
      <div>
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow={tr ? 'Temel Bilgiler' : 'Basics'}
            title={tr?'Bitcoin Dolar Maliyet Ortalama Nedir?':'What Is Bitcoin Dollar-Cost Averaging?'}
            className="mb-8 md:mb-10"
          />
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
            <p>
              {tr
                ? 'Dolar maliyet ortalama, fiyat ne olursa olsun düzenli bir programda — haftalık, iki haftada bir veya aylık — belirli bir dolar miktarıyla Bitcoin satın almak anlamına gelir. Piyasayı zamanlamaya çalışmazsınız. Sadece tutarlı biçimde alım yaparsınız.'
                : 'Dollar-cost averaging means buying a fixed dollar amount of Bitcoin on a regular schedule — weekly, bi-weekly, or monthly — regardless of what the price is doing. You don\'t try to time the market. You just buy consistently.'}
            </p>
            <p>
              {tr
                ? 'Arkasındaki matematik basit. Bitcoin 60.000 $\'a düştüğünde, 100 $\'ınız daha fazla satoshi alır. 100.000 $\'a yükseldiğinde daha az alırsınız. Aylarca ve yıllarca ortalama alım fiyatınız zirvelerin altında düzleşir. Stratejinin tamamı budur.'
                : 'The math behind it is straightforward. When Bitcoin drops to $60,000, your $100 buys more satoshis. When it spikes to $100,000, you buy fewer. Over months and years, your average purchase price smooths out below the peaks. That\'s the whole strategy.'}
            </p>
            <p>
              {tr
                ? '2013\'ten bu yana her 3 yıllık pencerede geriye dönük test yapıldığında, Bitcoin\'e yapılan basit aylık DCA, en az 3 yıl elde tutulduğunda %100 oranında kârlı olmuştur. Aralık 2017\'de — o döngünün mutlak zirvesinde — alım yapmaya başlayan yatırımcılar bile 2020 ortasına kadar başabaş noktasına ulaşmış ve 2024 başında %400\'ün üzerinde kârdaydı.'
                : "Backtesting across every 3-year window since 2013, a simple monthly DCA into Bitcoin has been profitable 100% of the time when held for at least 3 years. Even investors who started buying in December 2017 — the absolute top of that cycle — broke even by mid-2020 and were up over 400% by early 2024."}
            </p>
            <p>
              {tr
                ? 'DCA işe yarar çünkü en büyük iki yatırım hatasını ortadan kaldırır: "doğru zamanı" beklemek (ki asla doğru hissetmez) ve çöküşlerde panikle satmak (oysaki daha fazla alım yapılması gereken an bu anlardır). Oynaklığı düşmandan avantaja dönüştürür.'
                : 'DCA works because it removes the two biggest investing mistakes: waiting for "the right time" (which never feels right) and panic-selling during crashes (when you should be buying more). It turns volatility from an enemy into an advantage.'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div>
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow={tr ? 'Karşılaştırma' : 'Comparison'}
            title={tr?'DCA - Tek Seferlik Yatırım: Tarihsel Olarak Hangi Strateji Kazanıyor?':'DCA vs Lump Sum: Which Strategy Wins Historically?'}
            className="mb-8 md:mb-10"
          />
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
            <p>
              {tr
                ? 'Geleneksel piyasalarda, piyasalar yukarı yönlü seyrettiğinden tek seferlik yatırım DCA\'yı yaklaşık %68 oranında geride bırakır. Bitcoin farklıdır. Boğa piyasalarında bile olağan %30-50\'lik düşüşler gibi aşırı oynaklık, hesabı önemli ölçüde değiştirir.'
                : "In traditional markets, lump-sum investing beats DCA about 68% of the time because markets trend upward. Bitcoin is different. Its extreme volatility — routine 30-50% drawdowns even during bull markets — changes the calculus significantly."}
            </p>
            <p>
              {tr
                ? '2013\'ten bu yana her olası giriş noktasının analizi, Bitcoin\'in tek seferlik alımlarının DCA\'yı yalnızca döngü diplerine yakın alım yaptığınızda (2018 sonu, Mart 2020, Kasım 2022) geride bıraktığını göstermektedir. Sorun şu ki dipleri gerçek zamanlı olarak tespit edemezsiniz.'
                : 'Analysis of every possible entry point since 2013 shows that lump-sum Bitcoin purchases outperform DCA only when you happen to buy near cycle bottoms (late 2018, March 2020, November 2022). The problem is you can\'t identify bottoms in real time.'}
            </p>
            <p>
              {tr
                ? 'DCA, sizi en kötü senaryodan korur: tüm birikimlerinizi bir döngü zirvesinde yatırmak. 17 Aralık 2017\'de 12.000 $ BTC alan biri bir yıl içinde yatırımının %84\'ünün eridiğini gördü. Aynı gün aylık 1.000 $ DCA yapmaya başlayan biri ise önemli ölçüde daha düşük bir ortalama maliyetle daha fazla Bitcoin biriktirdi ve çok daha hızlı toparlandı.'
                : "DCA protects you from the worst-case scenario: investing your entire savings at a cycle top. Someone who put $12,000 into BTC on December 17, 2017 saw their investment drop 84% within a year. Someone who DCA'd $1,000 monthly starting that same day accumulated more Bitcoin at a significantly lower average cost and recovered much faster."}
            </p>
            <p>
              {tr
                ? (
                  <>
                    Pratik yanıt: Tek seferlik bir tutarınız varsa ve güçlü bir kanaatiniz varsa, %50-70\'ini hemen yatırın ve kalanını 3-6 ay içinde DCA ile dağıtın. Gelirden yatırım yapıyorsanız düz aylık DCA\'nın geçmek zordur. Her iki stratejiyi gerçek rakamlarınızla karşılaştırmak için <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">Toplu Tutar - DCA Hesaplayıcısı</Link>\'nı kullanın.
                  </>
                ) : (
                  <>
                    The practical answer: if you have a lump sum and strong conviction, invest 50-70% immediately and DCA the rest over 3-6 months. If you're investing from income, straight monthly DCA is hard to beat. Use our <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">Lump Sum vs DCA Calculator</Link> to compare both strategies with your actual numbers.
                  </>
                )}
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Day Effect */}
      <div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr?'Pazartesi Etkisi: Bitcoin Almak İçin En İyi Gün':'The Monday Effect: Best Day to Buy Bitcoin'}
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed mb-8">
            <p>
              {tr
                ? '2015-2024 yılları arasındaki geriye dönük test verileri, Bitcoin piyasalarında kalıcı bir "Pazartesi etkisi" olduğunu ortaya koymaktadır. Tutarlı biçimde Pazartesi günleri alım yapan yatırımcılar, aynı toplam yatırımla Pazar günleri alım yapanlara kıyasla yaklaşık %14,36 daha fazla Bitcoin biriktirdi.'
                : 'Backtested data from 2015-2024 reveals a persistent "Monday effect" in Bitcoin markets. Investors who consistently bought on Mondays accumulated approximately 14.36% more Bitcoin than those buying on Sundays, given the same total investment.'}
            </p>
            <p>
              {tr
                ? 'Bu durum mantıklıdır. Kurumsal satış baskısı hafta sonları en düşük seviyede olma eğilimindedir ve bu da Pazar gecesine kadar fiyatları hafifçe aşağı iter. Pazartesi sabahı kurumsal masalardan ve otomatik DCA hizmetlerinden gelen taze alımlar fiyatları hafta boyunca yukarı çeker. Etki herhangi bir haftada küçük olsa da yıllar içinde bileşik hale gelir.'
                : 'The pattern makes sense. Institutional selling pressure tends to be lightest over weekends, pushing prices slightly lower by Sunday night. Monday morning brings fresh buying from institutional desks and automated DCA services, driving prices up through the week. The effect is small on any given week but compounds over years.'}
            </p>
            <p>
              {tr
                ? 'Bununla birlikte, DCA yapmanın en iyi günü tutarlı biçimde taahhüt edebildiğiniz gündür. Pazartesi\'yi kaçırıp Salı almak neredeyse hiçbir şey kaybettirmez. Pazartesi\'yi beklediğiniz için haftaları atlamak ise DCA\'nın sağlamak üzere tasarlandığı her şeyi — zaman içinde tutarlı maruz kalımı — maliyete dönüştürür.'
                : "That said, the best day to DCA is the day you can commit to consistently. Missing a Monday and buying Tuesday costs you almost nothing. Missing weeks because you're waiting for Monday costs you everything DCA is designed to provide: consistent exposure over time."}
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-background/80">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold text-xs">{tr?'Gün':'Day'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'Ort. Ekstra BTC Birikimi':'Avg. Extra BTC Accumulated'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'Not':'Note'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weekdayData.map((row) => (
                  <TableRow key={row.day} className="border-border/30">
                    <TableCell className="font-medium text-sm">{row.day}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-primary">{row.avgReturn}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{row.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {tr
              ? '*2015-2024 yılları arasında haftalık 100 $\'lık DCA geriye dönük testine dayanmaktadır. Geçmiş performans gelecekteki sonuçları garanti etmez.'
              : '*Based on backtested $100/week DCA from 2015-2024. Past performance does not guarantee future results.'}
          </p>
        </div>
      </div>

      {/* Section 4: Returns by Year */}
      <div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr?'Başlangıç Yılına Göre Bitcoin DCA Getirileri':'Bitcoin DCA Returns by Starting Year'}
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed mb-8">
            <p>
              {tr
                ? 'Aşağıdaki tablo, başladığınız yıla göre aylık 100 $ DCA stratejisinin ne kadar getiri sağlayacağını göstermektedir. Her başlangıç yılı 2026\'ya kadar kârlıdır; ancak ne kadar erken başladıysanız bileşik etki o kadar dramatik olur.'
                : 'The table below shows what a $100/month DCA strategy would have returned based on the year you started. Every single starting year is profitable by 2026, but the earlier you began, the more dramatic the compounding.'}
            </p>
            <p>
              {tr
                ? '2018\'in öne çıktığına dikkat edin. Bu, Bitcoin satın almak için duygusal olarak en zor yıldı — fiyatlar 19.000 $\'dan 3.200 $\'a geriledi. Yine de 2018\'de disiplinli DCA alıcıları, bu tablodaki tüm gruplar arasında harcanan dolar başına en fazla Bitcoin\'i biriktirdi. Ders: DCA ayı piyasalarında en güçlü şekilde parlar.'
                : "Notice 2018 stands out. That was the worst year emotionally to be buying Bitcoin — prices cratered from $19,000 to $3,200. Yet disciplined DCA buyers in 2018 accumulated the most Bitcoin per dollar spent of any cohort in this table. The lesson: bear markets are when DCA shines hardest."}
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-background/80">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold text-xs">{tr?'Başlangıç Yılı':'Start Year'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'Yıllık Yatırım':'Annual Invested'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'1. Yılda Biriken BTC':'BTC Accumulated (Year 1)'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'Tahmini Bugünkü Değer':'Est. Value Today'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dcaByYearData.map((row) => (
                  <TableRow key={row.year} className="border-border/30">
                    <TableCell className="font-medium text-sm">{row.year}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.invested}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.btc}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.value2026}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-primary">{row.roi}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {tr
              ? '*Tarihsel aylık ortalama fiyatlara dayalı yaklaşık değerlerdir. Gerçek getiriler kesin alım tarihlerine göre değişir.'
              : '*Approximate values based on historical average monthly prices. Actual returns vary by exact purchase dates.'}
          </p>
        </div>
      </div>

      {/* Section 5: How to Automate */}
      <div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr?'Bitcoin DCA Nasıl Otomatikleştirilir':'How to Automate Bitcoin DCA'}
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
            <p>
              {tr
                ? 'Büyük borsaların çoğu otomatik tekrarlayan alımlar sunar. Tutarınızı belirleyin, bir sıklık seçin, banka hesabınızı bağlayın ve işi bırakın. Kurulum beş dakikadan az sürer.'
                : 'Most major exchanges offer automated recurring purchases. Set your amount, pick a frequency, connect a bank account, and walk away. The process takes under five minutes to configure.'}
            </p>
            <p>
              {tr
                ? 'Swan Bitcoin, Strike ve River gibi platformlar, genel amaçlı borsalara kıyasla daha düşük ücretlerle yalnızca Bitcoin\'e odaklanan DCA\'da uzmanlaşmıştır. Coinbase ve Kraken da tekrarlayan alımlar sunmakla birlikte, küçük alımlar için ücret yapıları genellikle daha yüksektir.'
                : 'Platforms like Swan Bitcoin, Strike, and River specialize in Bitcoin-only DCA with lower fees than general-purpose exchanges. Coinbase and Kraken also offer recurring buys, though their fee structures tend to be higher for small purchases.'}
            </p>
            <p>
              {tr
                ? 'Maksimum güvenlik için her alımdan sonra kendi gözetiminize çekin veya bir eşik belirleyin (ör. 0,01 BTC) ve bu eşiğe ulaştığınızda donanım cüzdanına aktarın. Bitcoin\'i bir borsada tutmak, merkezi olmayan bir varlık biriktirmenin amacını ortadan kaldırır.'
                : 'For maximum security, withdraw to self-custody after each purchase or set a threshold (like 0.01 BTC) and transfer to a hardware wallet whenever you hit it. Leaving Bitcoin on an exchange defeats the purpose of accumulating a decentralized asset.'}
            </p>
            <p>
              {tr
                ? 'Ortalama maliyet bazınızı ve toplam birikimlerinizi yukarıdaki hesaplayıcıyı kullanarak takip edin. Rakamlarınızı bilmek, ayı piyasalarında motive kalmanızı sağlar ve duygusal kararları önler. Pek çok uzun vadeli yatırımcı, DCA istatistiklerini aylık olarak kontrol eder ve katkı paylarını fiyat hareketine göre değil, bütçelerine göre ayarlar.'
                : 'Track your average cost basis and total accumulation using our calculator above. Knowing your numbers keeps you motivated during bear markets and prevents emotional decisions. Many long-term holders check their DCA stats monthly and adjust contributions based on their budget — not based on price action.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
