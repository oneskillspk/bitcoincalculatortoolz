import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

export const AccumulationContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="max-w-3xl mx-auto space-y-12 text-foreground">
      <section className="space-y-4">
        <h2 className="text-h2 font-bold">
          {tr ? "Bitcoin Birikim Puanı Hesaplayıcısı" : "Bitcoin Accumulation Score Calculator"}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr ? (
            <>
              Bitcoin Birikim Puanı Hesaplayıcısı, mevcut Bitcoin varlıklarınızı yaşa göre ayarlanmış bir karşılaştırma ölçütüne göre değerlendiren ücretsiz bir araçtır. Gelecekteki ihtiyaçları öngören emeklilik hesaplayıcılarının aksine bu araç şu basit soruyu yanıtlar: <strong>"Şu anki yaşıma göre Bitcoin yığınım ne not alır?"</strong> A+ (seçkin birikim yapan) ile F (sat yığınlamaya başlama zamanı) arasında bir harf notu almak için yaşınızı ve BTC varlıklarınızı girin; birikim yolculuğunda nerede durduğunuzu gösteren görsel bir yaşam döngüsü eğrisiyle birlikte.
            </>
          ) : (
            <>
              The Bitcoin Accumulation Score Calculator is a free tool that grades your current Bitcoin holdings against an age-adjusted benchmark. Unlike retirement calculators that project future needs, this tool answers one simple question: <strong>"Based on my age right now, what grade does my Bitcoin stack earn?"</strong> Enter your age and BTC holdings to receive a letter grade from A+ (elite accumulator) to F (time to start stacking), along with a visual lifecycle curve showing where you stand on the accumulation journey.
            </>
          )}
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr ? (
            <>
              Puan, Bitcoin Yaşam Döngüsü Birikim Modeli tarafından desteklenmektedir — <Link to="/tr/hesaplayicilar/bitcoin-guc-yasasi" className="text-primary hover:underline">Bitcoin Güç Kanunu</Link> değer kazanma eğrisini tipik bir yaşam döngüsü gelir çan eğrisiyle birleştiren bir çerçeve. Sonuç, yaklaşık 40 yaşında zirveye ulaşan ve emeklilik ile miras aşamalarında yavaş yavaş azalan gerçekçi bir birikim yörüngesidir.
            </>
          ) : (
            <>
              The score is powered by the Bitcoin Lifecycle Accumulation Model — a framework that combines the <Link to="/calculators/power-law" className="text-primary hover:underline">Bitcoin Power Law</Link> appreciation curve with a typical lifecycle income bell curve. The result is a realistic accumulation trajectory that peaks around age 40 and gradually declines through retirement and legacy phases.
            </>
          )}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-h2 font-bold">
          {tr ? "Bitcoin Yaşam Döngüsü Modeli Nasıl Çalışır?" : "How the Bitcoin Lifecycle Model Works"}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr
            ? "Model iki temel gözlem üzerine kuruludur. Birincisi, Bitcoin'in uzun vadeli fiyatı bir Güç Kanunu yörüngesi izler — 2010'dan bu yana tutarlılığını şaşırtıcı biçimde koruyan logaritmik büyüme. İkincisi, insan kazanç kapasitesi, erken kariyer yıllarında daha düşük gelir ve emeklilikte azalan harcanabilir gelirle 30'ların sonundan 40'ların başına kadar zirveye ulaşan bir çan eğrisi izler."
            : "The model is built on two foundational observations. First, Bitcoin's long-term price follows a Power Law trajectory — logarithmic growth that has held remarkably consistent since 2010. Second, human earning capacity follows a bell curve that peaks in the late 30s to early 40s, with lower income during early career years and declining disposable income in retirement."}
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr
            ? "Bu iki eğriyi çarparak — zaman içinde BTC fiyat değer kazanımı × Bitcoin tahsisi için mevcut gelir — model, yaşa özgü birikim hedefleri üretir. 'Ana Birikim Yapan' aşamasındaki 25 yaşındaki bir kişinin hedefi yaklaşık 2,45 BTC iken, kazanç gücünün zirvesindeki 40 yaşındaki birinin hedefi yaklaşık 144 BTC'dir. 40'tan sonra model yaşam tarzı harcamalarını ve portföy düşüşünü hesaba kattıkça hedefler yavaş yavaş azalır."
            : "By multiplying these two curves — BTC price appreciation over time × income available for Bitcoin allocation — the model produces age-specific accumulation targets. A 25-year-old in the \"Prime Accumulator\" phase has a target of approximately 2.45 BTC, while a 40-year-old at peak earning power has a target of approximately 144 BTC. After 40, targets gradually decline as the model accounts for lifestyle spending and portfolio drawdown."}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-h2 font-bold">
          {tr ? "Birikim Yaşınız Neden Önemlidir?" : "Why Your Accumulation Age Matters"}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr ? (
            <>
              13 ile 40 yaş arasında Bitcoin birikim hedefleri, Bitcoin yarılanma döngüsüne yakından benzeyen şekilde her 2-3 yılda bir yaklaşık olarak ikiye katlanır. Bu, birikime başlamak için yalnızca 3 yıl beklemenin küçük bir gecikme yaratmadığı anlamına gelir; aynı kilometre taşına ulaşmak için ihtiyacınız olan Bitcoin miktarını neredeyse <strong>ikiye katlar</strong>. 25 yaşındaki birinin "yolunda" olması için ~2,4 BTC'ye ihtiyacı varken, 28 yaşındaki birinin ~6,8 BTC'ye — neredeyse üç kat daha fazlasına — ihtiyacı vardır.
            </>
          ) : (
            <>
              From age 13 to 40, the Bitcoin accumulation targets roughly double every 2–3 years — closely mirroring the Bitcoin halving cycle. This means waiting just 3 years to start accumulating doesn't create a small delay; it nearly <strong>doubles</strong> the amount of Bitcoin you need to reach the same milestone. A 25-year-old needs ~2.4 BTC to be "on track," but a 28-year-old needs ~6.8 BTC — nearly three times more.
            </>
          )}
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr ? (
            <>
              Bu üstel bileşik etki, hesap makinesinin en önemli eğitsel içgörüsüdür. Sat yığınlamaya ne kadar erken başlarsanız, stratejinizin o kadar az agresif olması gerekir. 20 yaşında küçük haftalık alımlar bile 35 yaşında önemli aylık yatırımların gerektireceği şeyi başarabilir. Yakalama stratejinizi modellemek için{' '}
              <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">Bitcoin DCA Hesaplayıcısını</Link> kullanın.
            </>
          ) : (
            <>
              This exponential compounding effect is the calculator's most important educational insight. The earlier you start stacking sats, the less aggressive your strategy needs to be. Even small weekly purchases at age 20 can achieve what requires substantial monthly investments at age 35. Use the{' '}
              <Link to="/calculators/dca" className="text-primary hover:underline">Bitcoin DCA Calculator</Link> to model your catch-up strategy.
            </>
          )}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-h2 font-bold">
          {tr ? "Notunuzu Anlamak" : "Understanding Your Grade"}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr ? (
            <>
              Notlandırma sistemi, gerçek BTC varlıklarınızı yaşınız için modelin hedefiyle karşılaştırır. <strong>A+</strong>, hedefin %150 veya daha fazlasını tuttuğunuz anlamına gelir — yaş diliminizdeki seçkin bir birikim yapansınız. <strong>B+</strong> (hedefin %90-110'u), yolunda olduğunuz anlamına gelir. <strong>C</strong> (%50-75) büyüme alanı olduğunu, <strong>D</strong> veya <strong>F</strong> ise özel bir birikim stratejisi oluşturma zamanının geldiğini gösterir.
            </>
          ) : (
            <>
              The grading system compares your actual BTC holdings to the model's target for your age. An <strong>A+</strong> means you hold 150% or more of the target — you're an elite accumulator for your age bracket. A <strong>B+</strong> (90–110% of target) means you're on track. A <strong>C</strong> (50–75%) means there's room to grow, while a <strong>D</strong> or <strong>F</strong> signals it's time to build a dedicated accumulation strategy.
            </>
          )}
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr
            ? "Notunuz kalıcı değil — bir anlık görüntü. Her Bitcoin alımı puanınızı iyileştirir. Notunuzun altındaki DCA Yakalama bölümü, boşluğu kapatmak ve B+ veya daha yüksek bir nota ulaşmak için 6 ay, 1 yıl, 2 yıl veya 5 yıl boyunca aylık olarak ne kadar yatırım yapmanız gerektiğini tam olarak gösterir."
            : "Your grade isn't permanent — it's a snapshot. Every Bitcoin purchase improves your score. The DCA Catch-Up section below your grade shows exactly how much you'd need to invest monthly over 6 months, 1 year, 2 years, or 5 years to close the gap and reach a B+ or higher."}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-h2 font-bold">
          {tr ? "Geç Başladınız mı? Matematik Ne Diyor?" : "Late Starter? Here's What the Math Says"}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr ? (
            <>
              Notunuz C, D veya F ise — paniklemeyiniz. Modelin hedefleri ideal bir ömür boyu birikim yoluna dayanmaktadır. Gerçekte çoğu Bitcoin tutucusu BTC'yi "optimal" başlangıç yaşından çok sonra keşfetti. Önemli olan, bugünden itibaren yörüngenizdir. Tutarlı bir{' '}
              <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">dolar maliyeti ortalama</Link> stratejisi — haftada 50-100 $ bile olsa — zaman içinde önemli ölçüde bileşik büyüme sağlar.
            </>
          ) : (
            <>
              If your grade is a C, D, or F — don't panic. The model's targets are based on an idealized lifetime accumulation path. In reality, most Bitcoin holders discovered BTC well after their "optimal" start age. What matters is your trajectory from today forward. A consistent{' '}
              <Link to="/calculators/dca" className="text-primary hover:underline">dollar-cost averaging</Link> strategy — even at $50–$100/week — compounds significantly over time.
            </>
          )}
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {tr ? (
            <>
              Şunu düşünün: 35 yaşında aylık 200 $ DCA'ye başlayan ve bunu 10 yıl sürdüren biri, 25 yaşında bir defada büyük miktarda alıp hiç eklemeyen birinden çok daha fazla birikim yapar. Tutarlılık, zamanlamayı yener. Bir hedef belirlemek ve ilerlemenizi takip etmek için{' '}
              <Link to="/tr/hesaplayicilar/satoshi-biriktirme" className="text-primary hover:underline">Sat Yığınla Hedef Hesaplayıcısını</Link> kullanın veya stratejileri{' '}
              <Link to="/tr/hesaplayicilar/bitcoin-maliyet-ortalama" className="text-primary hover:underline">Toplu Satın Alma ile DCA</Link> aracıyla karşılaştırın.
            </>
          ) : (
            <>
              Consider: someone who starts a $200/month DCA at age 35 and maintains it for 10 years will accumulate substantially more than someone who buys a lump sum at age 25 and never adds to their position. Consistency beats timing. Use the{' '}
              <Link to="/calculators/stack-sats" className="text-primary hover:underline">Stack Sats Goal Calculator</Link> to set a target and track your progress, or compare strategies with the{' '}
              <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">Lump Sum vs DCA</Link> tool.
            </>
          )}
        </p>
      </section>

      <div className="bg-muted/20 rounded-xl p-4 text-xs text-muted-foreground border border-border/30">
        <strong>{tr ? 'Veri Kaynakları:' : 'Data Sources:'}</strong>{' '}
        {tr
          ? "Canlı Bitcoin fiyatı, her 60 saniyede bir güncellenen "
          : "Live Bitcoin price from "}
        <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CoinGecko API</a>
        {tr
          ? "'den, her 60 saniyede bir güncellenir. Birikim hedefleri, ABD Çalışma İstatistikleri Bürosu yaşa göre medyan gelir verileriyle birleştirilen Bitcoin Güç Kanunu modelinden (log-log ölçeğinde 2010'dan bu yana R² = 0,95) türetilmiştir. Zincir üstü dağılım verileri Glassnode aracılığıyla. Son güncelleme: Nisan 2026."
          : ", updated every 60 seconds. Accumulation targets derived from the Bitcoin Power Law model (R² = 0.95 on log-log scale since 2010) combined with U.S. Bureau of Labor Statistics median income by age data. On-chain distribution data via Glassnode. Last updated: April 2026."}
      </div>
    </div>
  );
};
