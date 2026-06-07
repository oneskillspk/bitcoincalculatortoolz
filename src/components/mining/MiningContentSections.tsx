import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

export const MiningContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-12">

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "Başa Baş Elektrik Fiyatı Tablosu (2026)" : "Break-Even Electricity Rate Table (2026)"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
              {tr
                ? "Elektrik tarifeniz, madenciliğin karlı mı yoksa zararlı mı olduğunu belirler. Aşağıda 84.000 $ BTC fiyatı ve mevcut ağ zorluğu varsayımıyla 200 TH/s ve 3.500 W'lık Antminer S21 için günlük kar (veya zarar) anlık görüntüsü yer almaktadır. Bu rakamlar fiyat ve zorluk değişiklikleriyle her gün değişmektedir."
                : "Your electricity rate determines whether mining is profitable or a money pit. Below is a snapshot of daily profit (or loss) for the Antminer S21 at 200 TH/s and 3,500W, assuming a $84,000 BTC price and current network difficulty. These numbers shift daily with price and difficulty changes."}
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr ? 'Tarife ($/kWh)' : 'Rate ($/kWh)'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Günlük Maliyet' : 'Daily Cost'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Günlük Gelir' : 'Daily Revenue'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Günlük Kar' : 'Daily Profit'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Karar' : 'Verdict'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rate: "$0.03", cost: "$2.52", rev: "$12.80", profit: "+$10.28", ok: true },
                    { rate: "$0.05", cost: "$4.20", rev: "$12.80", profit: "+$8.60", ok: true },
                    { rate: "$0.07", cost: "$5.88", rev: "$12.80", profit: "+$6.92", ok: true },
                    { rate: "$0.10", cost: "$8.40", rev: "$12.80", profit: "+$4.40", ok: true },
                    { rate: "$0.12", cost: "$10.08", rev: "$12.80", profit: "+$2.72", ok: true },
                    { rate: "$0.15", cost: "$12.60", rev: "$12.80", profit: "+$0.20", ok: false },
                  ].map((row) => (
                    <tr key={row.rate} className="border-t border-border/20">
                      <td className="px-4 py-2.5 text-foreground font-medium">{row.rate}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{row.cost}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{row.rev}</td>
                      <td className={`px-4 py-2.5 text-right font-semibold ${row.ok ? 'text-success' : 'text-warning'}`}>{row.profit}</td>
                      <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                        {row.ok ? (tr ? '✅ Karlı' : '✅ Profitable') : (tr ? '⚠️ Sınırda' : '⚠️ Marginal')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-prose">
              {tr ? (
                <>
                  0,15 $/kWh'de zar zor başa baş geliyorsunuz. En karlı işlemler 0,03-0,07 $/kWh'de çalışır. Konut tarifeniz 0,12 $'ın üzerindeyse, barındırılan madenciliği veya basitçe{' '}
                  <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">dolar maliyeti ortalamayı</Link> düşünün.
                </>
              ) : (
                <>
                  At $0.15/kWh you're barely breaking even. Most profitable operations run at $0.03-$0.07/kWh. If your residential rate is above $0.12, consider hosted mining or simply{' '}
                  <Link to="/calculators/dca" className="text-primary hover:underline">dollar-cost averaging</Link> instead.
                </>
              )}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "ASIC Donanım Karşılaştırması: Hangi Madenci En Fazla Kazandırır?" : "ASIC Hardware Comparison: Which Miner Earns Most?"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
              {tr
                ? "Tüm madenciler eşit değildir. Verimlilik (Terahash başına Joule veya J/TH cinsinden ölçülür) en önemli tek özelliktir. Daha düşük J/TH, hesaplanan hash başına daha az elektrik israfı anlamına gelir. Mevcut nesil böyle sıralanır."
                : "Not all miners are created equal. Efficiency (measured in Joules per Terahash, or J/TH) is the single most important spec. A lower J/TH means less electricity wasted per hash computed. Here's how the current generation stacks up."}
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr ? 'Madenci' : 'Miner'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">TH/s</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Watt' : 'Watts'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">J/TH</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Fiyat' : 'Price'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Antminer S21 Pro", th: "234", w: "3,510", jth: "15.0", price: "$6,500" },
                    { name: "Antminer S21", th: "200", w: "3,500", jth: "17.5", price: "$5,500" },
                    { name: "WhatsMiner M60S", th: "186", w: "3,422", jth: "18.4", price: "$5,200" },
                    { name: "WhatsMiner M50S++", th: "150", w: "3,276", jth: "21.8", price: "$3,800" },
                    { name: "Avalon A1466", th: "150", w: "3,150", jth: "21.0", price: "$3,600" },
                    { name: "Antminer S19 XP", th: "140", w: "3,010", jth: "21.5", price: "$4,200" },
                    { name: "Bitaxe Ultra", th: "0.5", w: "15", jth: "30.0", price: "$70" },
                  ].map((row) => (
                    <tr key={row.name} className="border-t border-border/20">
                      <td className="px-4 py-2.5 text-foreground font-medium">{row.name}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{row.th}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{row.w}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{row.jth}</td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "S21 Pro, 15 J/TH ile verimlilik alanında lider ancak 6.500 $ tutmaktadır. Bitaxe Ultra tamamen farklı bir canavardır: yalnızca 15 watt çeken açık kaynaklı solo bir madenci. Ondan kâr edemezsiniz, ancak eğitim amaçlı madenciliğe katılmanın veya neredeyse sıfır maliyetle piyango tarzı solo madenciliğin bir yoludur."
                : "The S21 Pro leads on efficiency at 15 J/TH but costs $6,500. The Bitaxe Ultra is a different beast entirely: an open-source solo miner drawing just 15 watts. You won't profit from it, but it's a way to participate in mining for educational purposes or lottery-style solo mining at near-zero cost."}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "Bitcoin Madenciliği Karlılığı Nasıl Hesaplanır?" : "How Bitcoin Mining Profitability Is Calculated"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Temel formül basittir. Günlük kazandığınız BTC, toplam ağ hash hızına bölünen hash hızınıza eşittir ve günlük blok ödülüyle çarpılır (144 blok x 3,125 BTC = günde 450 BTC). Ardından havuz ücretlerini ve elektrik maliyetlerini çıkarın."
                : "The core formula is straightforward. Your daily BTC earned equals your hashrate divided by the total network hashrate, multiplied by the daily block reward (144 blocks x 3.125 BTC = 450 BTC per day). Then subtract pool fees and electricity costs."}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Zorlaştıran şey, ağ zorluğunun her 2.016 blokta (yaklaşık iki haftada) değişmesidir. Ağa daha fazla madenci katılırsa zorluk artar ve ödüldeki payınız küçülür. Geçen yıl boyunca zorluk ortalama aylık yaklaşık %3-4 arttı."
                : "What makes it tricky is that network difficulty changes every 2,016 blocks (roughly two weeks). If more miners join the network, difficulty rises and your share of the reward shrinks. Over the past year, difficulty has increased about 3-4% per month on average."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Hesap makinemiz, mempool.space'den canlı zorluk verisi çeker ve 12 aylık kazancı öngörmek için donanım özelliklerinizi kullanır. Aylık zorluk büyümesini hesaba katar; bu nedenle projeksiyonlar, artan rekabeti göz ardı eden sabit oranlı hesap makinelerinden daha gerçekçidir."
                : "Our calculator pulls live difficulty data from mempool.space and uses your hardware specs to project 12 months of earnings. It accounts for monthly difficulty growth, so the projections are more realistic than flat-rate calculators that ignore rising competition."}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "Evde Madencilik mi Yapmak Gerekir, Yoksa Sadece Bitcoin mi Satın Almak?" : "Is Home Mining Worth It vs Just Buying Bitcoin?"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr ? (
                <>
                  Dürüst cevap: çoğu insan için hayır.{' '}
                  <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">DCA</Link> aracılığıyla Bitcoin satın almak daha basit, daha sessiz ve genellikle satın alınan BTC başına daha ucuzdur. 5.500 $'lık bir Antminer S21, 0,08 $/kWh elektrikle ilk yılında yaklaşık 4.400 $ değerinde BTC madenciliği yapabilir; yani doğrudan satın alarak daha fazla sat biriktirirsiniz.
                </>
              ) : (
                <>
                  Honest answer: for most people, no. Buying Bitcoin through{' '}
                  <Link to="/calculators/dca" className="text-primary hover:underline">DCA</Link> is simpler, quieter, and often cheaper per BTC acquired. A $5,500 Antminer S21 might mine $4,400 worth of BTC in its first year at $0.08/kWh electricity, meaning you'd accumulate more sats just buying directly.
                </>
              )}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Evde madencilik belirli durumlarda mantıklıdır: çok ucuz elektriğe erişiminiz varsa (0,05 $/kWh altında), KYC gerektirmeyen Bitcoin istiyorsanız, ısı çıkışını kullanabiliyorsanız (kışın garaj ısıtması) veya teknik tarafla gerçekten ilgileniyorsanız. 70 $ ve 15 watt gücündeki Bitaxe, tam bir ASIC'in gürültüsü ve ısısı olmadan oyunda pay sahibi olmak isteyen hobi kullanıcısı için mükemmeldir."
                : "Home mining makes sense in specific situations: you have access to very cheap electricity (under $0.05/kWh), you want non-KYC Bitcoin, you can use the heat output (garage heating in winter), or you're genuinely interested in the technical side. The Bitaxe at $70 and 15 watts is perfect for the hobbyist who wants skin in the game without the noise and heat of a full ASIC."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Elektrik maliyetleriniz 0,10 $/kWh'nin üzerindeyse, matematik neredeyse hiç işe yaramaz. Herhangi bir donanım satın almadan önce gerçek tarifeyle yukarıdaki rakamları çalıştırın."
                : "If your electricity costs are above $0.10/kWh, the math almost never works. Run the numbers above with your actual rate before buying any hardware."}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "2024 Yarılanması Madenciliğin Karlılığına Ne Yaptı?" : "What the 2024 Halving Did to Mining Profitability"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Nisan 2024'te blok ödülü 6,25'ten 3,125 BTC'ye düştü. Bu, bir gecede madenci gelirlerinde %50 kesinti demektir. 30 J/TH'nin üzerinde verimlilikle çalışan eski makineler neredeyse anında karlı olmaktan çıktı. S19 nesli hayatta kaldı, ancak 0,07 $/kWh'nin üzerinde her şeyde marjlar bıçak sırtına döndü."
                : "In April 2024, the block reward dropped from 6.25 to 3.125 BTC. That's a 50% cut to miner revenue overnight. Older machines with efficiency above 30 J/TH became unprofitable almost immediately. The S19 generation survived, but margins got razor-thin at anything above $0.07/kWh."}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Pek çok madenciyi kurtaran şey takip eden BTC fiyat rallisiydi. Bitcoin, yarılanmadaki yaklaşık 64.000 $'dan 2024 sonunda 100.000 $'ın üzerine taşındı. Yüksek fiyatlar azalan blok ödülünü telafi etti. Ama bu kumardır: fiyat değer kazanımının yarılanmanın gelir kesimini geride bırakacağına bahis oynuyorsunuz."
                : "What saved many miners was the BTC price rally that followed. Bitcoin moved from around $64,000 at the halving to over $100,000 by late 2024. Higher prices offset the reduced block reward. But that's the gamble: you're betting that price appreciation outpaces the halving's revenue cut."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr ? (
                <>
                  Bir sonraki yarılanma, ödülün 1,5625 BTC'ye düştüğü Mart 2028 civarında beklenmektedir. Bugün madencilik donanımı satın alıyorsanız, ROI pencerenizin bu tarihten önce kapanması gerekir; aksi takdirde BTC'nin o noktada önemli ölçüde daha yüksek olacağına inanmanız gerekir. Zaman çizelgesini takip etmek için{' '}
                  <Link to="/tr/hesaplayicilar/bitcoin-yarilama" className="text-primary hover:underline">yarılanma geri sayımımızı</Link> kullanın.
                </>
              ) : (
                <>
                  The next halving is expected around March 2028, when the reward drops to 1.5625 BTC. If you're buying mining hardware today, your ROI window needs to close before then unless you believe BTC will be significantly higher by that point. Use our{' '}
                  <Link to="/calculators/halving-countdown" className="text-primary hover:underline">halving countdown</Link> to track the timeline.
                </>
              )}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
