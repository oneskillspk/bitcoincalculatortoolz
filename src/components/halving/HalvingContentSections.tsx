import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, History, Coins, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from '@/components/LocalizedLink';

export const HalvingContentSections: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="container mx-auto px-6 py-16 space-y-12">
      <div className="max-w-4xl mx-auto space-y-12">

        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? "Bitcoin Yarılanma Döngüsünü Anlamak" : "Understanding the Bitcoin Halving Cycle"}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? "Bitcoin yarılanması, finansal tarihin en öngörülebilir parasal olayıdır. Her 210.000 blokta bir — kabaca dört yılda bir — madencilerin yeni bir blok eklemesi için aldıkları ödül yarıya indirilir. Satoshi Nakamoto tarafından 2009'da yazılan bu tek kod satırı, Bitcoin'in arz programını kanıtlanabilir biçimde kıt kılan şeydir: 21 milyon coin, istisnasız, merkez bankası yok, sürpriz yok."
                : "The Bitcoin halving is the most predictable monetary event in financial history. Every 210,000 blocks — roughly every four years — the reward miners receive for adding a new block is cut in half. This single line of code, written by Satoshi Nakamoto in 2009, is what makes Bitcoin's supply schedule provably scarce: 21 million coins, no exceptions, no central bank, no surprises."}
            </p>
            <p>
              {tr
                ? "Bir sonraki yarılanma (#5), ödülün 3.125 BTC'den blok başına 1.5625 BTC'ye düşeceği blok yüksekliği <strong>1.050.000</strong>'de Nisan 2028 olarak tahmin edilmektedir. O noktada var olacak tüm Bitcoin'in %96'sından fazlası zaten madencilik yapılmış olacak. Geri sayımımız, Bitcoin ağından her 60 saniyede bir canlı blok yüksekliği verisi çeker; bu nedenle gördüğünüz tarih, madenciler 10 dakikalık hedeften daha hızlı veya daha yavaş blok keşfettikçe gerçek zamanlı olarak güncellenir."
                : "The next halving (#5) is projected for April 2028 at block height <strong>1,050,000</strong>, when the reward will drop from 3.125 BTC to 1.5625 BTC per block. By that point, more than 96% of all Bitcoin that will ever exist will already have been mined. Our countdown pulls live block-height data from the Bitcoin network every 60 seconds, so the date you see updates in real time as miners discover blocks faster or slower than the 10-minute target."}
            </p>
          </div>
        </div>

        <Card className="border-border/30 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <History className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {tr ? "Her Yarılanmadan 12 Ay Sonra Bitcoin Fiyatı" : "Bitcoin Price 12 Months After Each Halving"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {tr ? "Tarihsel performans — geçmiş sonuçlar gelecekteki getirileri tahmin etmez" : "Historical performance — past results do not predict future returns"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">{tr ? 'Yarılanma' : 'Halving'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'Tarih' : 'Date'}</TableHead>
                    <TableHead className="font-semibold text-right">{tr ? 'Yarılanmadaki Fiyat' : 'Price at Halving'}</TableHead>
                    <TableHead className="font-semibold text-right">{tr ? '1 Yıl Sonra Fiyat' : 'Price 1Y After'}</TableHead>
                    <TableHead className="font-semibold text-right">{tr ? 'Döngü ATH' : 'Cycle ATH'}</TableHead>
                    <TableHead className="font-semibold text-right">{tr ? "ATH'ye Gün" : 'Days to ATH'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#1</TableCell>
                    <TableCell>{tr ? 'Kas 2012' : 'Nov 2012'}</TableCell>
                    <TableCell className="text-right font-mono">$12.35</TableCell>
                    <TableCell className="text-right font-mono text-success">$1,000 (+8,000%)</TableCell>
                    <TableCell className="text-right font-mono">$1,163</TableCell>
                    <TableCell className="text-right">368</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#2</TableCell>
                    <TableCell>{tr ? 'Tem 2016' : 'Jul 2016'}</TableCell>
                    <TableCell className="text-right font-mono">$650</TableCell>
                    <TableCell className="text-right font-mono text-success">$2,500 (+285%)</TableCell>
                    <TableCell className="text-right font-mono">$19,783</TableCell>
                    <TableCell className="text-right">525</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#3</TableCell>
                    <TableCell>{tr ? 'May 2020' : 'May 2020'}</TableCell>
                    <TableCell className="text-right font-mono">$8,821</TableCell>
                    <TableCell className="text-right font-mono text-success">$56,700 (+543%)</TableCell>
                    <TableCell className="text-right font-mono">$69,044</TableCell>
                    <TableCell className="text-right">549</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#4</TableCell>
                    <TableCell>{tr ? 'Nis 2024' : 'Apr 2024'}</TableCell>
                    <TableCell className="text-right font-mono">$64,000</TableCell>
                    <TableCell className="text-right font-mono text-success">$97,000 (+52%)</TableCell>
                    <TableCell className="text-right font-mono">$109,000</TableCell>
                    <TableCell className="text-right">290</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5">
                    <TableCell className="font-medium">#5</TableCell>
                    <TableCell>{tr ? 'Nis 2028 (tahmini)' : 'Apr 2028 (est.)'}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{tr ? 'Belirsiz' : 'TBD'}</TableCell>
                    <TableCell className="text-right text-muted-foreground">—</TableCell>
                    <TableCell className="text-right text-muted-foreground">—</TableCell>
                    <TableCell className="text-right text-muted-foreground">—</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-prose">
              {tr
                ? "Her döngü daha küçük yüzde kazançlar, ancak daha büyük mutlak dolar hareketleri üretti. Azalan getiri kalıbı, analistlerin çoğunun 2028 döngüsünü modellerken izlediği şeydir."
                : "Each cycle has produced smaller percentage gains but larger absolute dollar moves. The diminishing-returns pattern is what most analysts watch when modelling the 2028 cycle."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/30 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Coins className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {tr ? "Arz Emisyon Eğrisi" : "The Supply Emission Curve"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{tr ? 'Dönem' : 'Era'}</TableHead>
                    <TableHead>{tr ? 'Yıllar' : 'Years'}</TableHead>
                    <TableHead className="text-right">{tr ? 'Blok Başına Ödül' : 'Reward / Block'}</TableHead>
                    <TableHead className="text-right">{tr ? 'Oluşturulan BTC' : 'BTC Created'}</TableHead>
                    <TableHead className="text-right">% of 21M</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{tr ? 'Dönem 1' : 'Era 1'}</TableCell>
                    <TableCell>2009–2012</TableCell>
                    <TableCell className="text-right font-mono">50 BTC</TableCell>
                    <TableCell className="text-right font-mono">10,500,000</TableCell>
                    <TableCell className="text-right">50.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{tr ? 'Dönem 2' : 'Era 2'}</TableCell>
                    <TableCell>2012–2016</TableCell>
                    <TableCell className="text-right font-mono">25 BTC</TableCell>
                    <TableCell className="text-right font-mono">5,250,000</TableCell>
                    <TableCell className="text-right">25.0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{tr ? 'Dönem 3' : 'Era 3'}</TableCell>
                    <TableCell>2016–2020</TableCell>
                    <TableCell className="text-right font-mono">12.5 BTC</TableCell>
                    <TableCell className="text-right font-mono">2,625,000</TableCell>
                    <TableCell className="text-right">12.5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{tr ? 'Dönem 4' : 'Era 4'}</TableCell>
                    <TableCell>2020–2024</TableCell>
                    <TableCell className="text-right font-mono">6.25 BTC</TableCell>
                    <TableCell className="text-right font-mono">1,312,500</TableCell>
                    <TableCell className="text-right">6.25%</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5">
                    <TableCell className="font-medium">{tr ? 'Dönem 5 (şimdi)' : 'Era 5 (now)'}</TableCell>
                    <TableCell>2024–2028</TableCell>
                    <TableCell className="text-right font-mono">3.125 BTC</TableCell>
                    <TableCell className="text-right font-mono">656,250</TableCell>
                    <TableCell className="text-right">3.125%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{tr ? 'Dönem 6' : 'Era 6'}</TableCell>
                    <TableCell>2028–2032</TableCell>
                    <TableCell className="text-right font-mono">1.5625 BTC</TableCell>
                    <TableCell className="text-right font-mono">328,125</TableCell>
                    <TableCell className="text-right">1.56%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">{tr ? 'Dönem 33+' : 'Era 33+'}</TableCell>
                    <TableCell className="text-muted-foreground">~2140</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">≈ 0 BTC</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{tr ? 'Son sat' : 'Last sat'}</TableCell>
                    <TableCell className="text-right text-muted-foreground">100%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "2032 yılına kadar tüm Bitcoin'in %98'inden fazlası dolaşımda olacak. Kalan %2, son satoshi yaklaşık 2140 yılında madencilikle çıkarılırken önümüzdeki 108 yıl boyunca yavaş yavaş piyasaya çıkacak. Bundan sonra madenciler gelirlerini yalnızca işlem ücretlerinden kazanacak — bu geçiş için ağ birinci günden bu yana hazırlanıyor."
                : "By 2032, more than 98% of all Bitcoin will be in circulation. The remaining 2% will trickle out over the next 108 years, with the final satoshi mined around the year 2140. After that, miners earn revenue exclusively from transaction fees — a transition the network has been preparing for since day one."}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? "Yarılanma Piyasayı Neden Etkiliyor?" : "Why the Halving Moves the Market"}
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? "Mekanik basit: Bitcoin'in günlük ihracı bir gecede %50 düşerken talep sabit kalır veya büyür. Nisan 2024'te günlük yeni arz yaklaşık 900 BTC'den 450 BTC'ye düştü. 2028 yarılanmasında günde 225 BTC'ye — tek bir orta ölçekli ETF'nin bir öğleden sonra emebileceğinden daha azına — düşecek. Arz şoku tezi tek bir cümlede böyle."
                : "The mechanics are simple: Bitcoin's daily issuance drops by 50% overnight while demand stays flat or grows. In April 2024, daily new supply fell from roughly 900 BTC to 450 BTC. At the 2028 halving, it will fall to 225 BTC per day — less than what a single mid-sized ETF can absorb in an afternoon. That's the supply shock thesis in one sentence."}
            </p>
            <p>
              {tr
                ? "Tarih bu teze iyi davrandı. Her önceki yarılanmanın ardından Bitcoin, 290 ile 549 gün içinde yeni bir tüm zamanlar rekoruna ulaştı. Ancak yüzde kazançlar her döngüde küçüldü — %8.000 olan %285'e, sonra %543'e, ardından %52'ye döndü — çünkü varlık olgunlaştı ve marjinal alıcı etkisi zayıfladı. Ciddi analistlerin çoğu artık 2028 döngüsünü başka bir 10x patlama beklemek yerine %80-200 aralığında modelliyor."
                : "History has been kind to this thesis. After every previous halving, Bitcoin reached a new all-time high within 290 to 549 days. But the percentage gains have shrunk each cycle — 8,000% became 285%, then 543%, then 52% — as the asset matures and the marginal-buyer effect weakens. Most serious analysts now model the 2028 cycle in the 80–200% range rather than expecting another 10x rip."}
            </p>
            <p>
              {tr ? (
                <>
                  Canlı blok yüksekliği geri sayımını görmek, yarılanma sonrası etki tablolarını incelemek ve farklı yarılanma sonrası senaryoların portföyünüz için ne anlama geldiğini modellemek için{' '}
                  <a href="/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi" className="text-primary hover:underline">Kâr Hesaplayıcısı</a>,{' '}
                  <a href="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">DCA Hesaplayıcısı</a> veya{' '}
                  <a href="/tr/hesaplayicilar/bitcoin-ya-olsaydi" className="text-primary hover:underline">Ya Eğer Hesaplayıcısı</a> ile verileri eşleştirin.
                </>
              ) : (
                <>
                  Use this page to see the live block-height countdown, study the post-halving impact tables, and pair the data with our{' '}
                  <Link to="/calculators/profit-loss" className="text-primary hover:underline">Profit Calculator</Link>,{' '}
                  <Link to="/calculators/dca" className="text-primary hover:underline">DCA Calculator</Link>, or{' '}
                  <Link to="/calculators/what-if" className="text-primary hover:underline">What-If Calculator</Link>{' '}
                  to model what different post-halving scenarios mean for your portfolio.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/30 bg-muted/30 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">
              {tr ? "Geri sayımın doğruluğuna dair bir not" : "A note on the countdown's accuracy"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
            {tr
              ? "Bitcoin bir saate göre tik atmaz — bloklara göre tik atar. Protokol her 10 dakikada bir blok hedefler, ancak gerçek blok süreleri hash hızıyla dalgalanır. Madencilik kapasitesi zorluk ayarlamasından daha hızlı büyüdüğünde bloklar daha hızlı gelir ve yarılanma tarihi öne kayar. Hash hızı düştüğünde (2021 ortasında kısa bir süre olduğu gibi) bloklar yavaşlar ve tarih geriye kayar. Geri sayımımız canlı geçerli blok yüksekliğini kullanır, bu nedenle gördüğünüz tahmini tarih her zaman mevcut en doğru yaklaşımdır."
              : "Bitcoin doesn't tick on a clock — it ticks on blocks. The protocol targets one block every 10 minutes, but actual block times fluctuate with hashrate. When mining capacity grows faster than the difficulty adjustment, blocks come in faster and the halving date drifts earlier. When hashrate drops (as it did briefly in mid-2021), blocks slow down and the date drifts later. Our countdown uses the live current block height, so the estimated date you see is always the most accurate available approximation."}
          </p>
        </div>

      </div>
    </section>
  );
};
