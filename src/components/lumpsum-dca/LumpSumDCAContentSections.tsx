import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Brain, Scale } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from '@/components/LocalizedLink';

export const LumpSumDCAContentSections: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  return (
    <div className="max-w-4xl mx-auto space-y-12 pt-4">

      {/* Intro */}

        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? "Toplu Yatırım vs DCA Tartışması, Bitcoin'in Kendi Verileriyle Çözüldü" : "The Lump Sum vs DCA Debate, Settled by Bitcoin's Own Data"}
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? "Vanguard'ın geleneksel piyasalara yönelik 2012 çalışması, toplu yatırımın dolar maliyeti ortalamasını zamanın yaklaşık üçte ikisinde geçtiğini gösterdi. Matematik basit: piyasalar uzun vadede yukarı eğilimlidir, bu yüzden paranızı daha erken yatırmak bu getirinin daha fazlasını yakalar. Ancak Bitcoin geleneksel bir piyasa değildir. %80+ düşüşler ve ardından 5-10x boğa koşuları, 4 yıllık halving döngülerine sıkışmıştır. Bu da matematiği — ve bazen cevabı — değiştirir."
                : "Vanguard's 2012 study on traditional markets famously found that lump-sum investing beats dollar-cost averaging roughly two-thirds of the time. The math is simple: markets trend upward over long periods, so getting your money in earlier captures more of that drift. But Bitcoin isn't a traditional market. It moves in 80%+ drawdowns followed by 5-10x bull runs, all compressed into 4-year halving cycles. That changes the math — and sometimes the answer."}
            </p>
            <p>
              {tr
                ? 'Bu sayfa, her tarihsel Bitcoin aralığında her iki stratejiyi de geriye dönük test etmenizi sağlar. Aşağıda, verilerin gerçekte ne gösterdiğini, her stratejinin nerede kazanıp kaybettiğini ve "dibi beklemenin" fırsat maliyetini bugün tüm sermayeyi yatırmaya karşı nasıl değerlendireceğinizi açıklıyoruz.'
                : 'This page lets you backtest both strategies against any historical Bitcoin date range. Below, we break down what the data actually shows, where each strategy wins and loses, and how to think about the opportunity cost of "waiting for the dip" versus going all-in today.'}
            </p>
          </div>
        </div>




        {/* Regret Minimization */}
        <Card className="border-border/30 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-xl">{tr ? 'Pişmanlık Azaltma Çerçevesi' : 'The Regret-Minimization Framework'}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-prose">
              {tr
                ? "Matematik toplu yatırımın daha sık kazandığını söyler. Davranış ise, tüm sermayeyi yatırdıktan sonraki hafta Bitcoin %50 düşerse panik satışı yapabileceğinizi söyler. Doğru strateji, en yüksek beklenen getiriyi veren değil — 4+ yıl boyunca gerçekten sürdürebileceğiniz stratejidir. Karar vermek için bu matrisi kullanın:"
                : "Math says lump sum wins more often. Behavior says you'll panic-sell if Bitcoin drops 50% the week after you go all-in. The right strategy isn't the one with the highest expected return — it's the one you can actually stick with for 4+ years. Use this matrix to decide:"}
            </p>
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{tr ? 'Bitcoin gelecek ay %60 düşerse, siz...' : 'If Bitcoin drops 60% next month, you would...'}</TableHead>
                    <TableHead className="text-right">{tr ? 'En İyi Strateji' : 'Best Strategy'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{tr ? 'Daha agresif alırım, tartışmasız' : 'Buy more aggressively, no question'}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{tr ? '100% Toplu Yatırım' : '100% Lump Sum'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{tr ? 'Tutup fiyatı kontrol etmeyi bırakırım' : 'Hold and stop checking the price'}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{tr ? '75% Toplu / 25% DCA' : '75% Lump / 25% DCA'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{tr ? 'Midem bulanır ama satmam' : 'Feel sick but resist selling'}</TableCell>
                    <TableCell className="text-right font-semibold">{tr ? '6 ayda 50% Toplu / 50% DCA' : '50% Lump / 50% DCA over 6mo'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{tr ? 'Muhtemelen bazılarını "zararı kilitlemek" için satarım' : 'Probably sell some to "lock in losses"'}</TableCell>
                    <TableCell className="text-right font-semibold">{tr ? '12 ayda 25% Toplu / 75% DCA' : '25% Lump / 75% DCA over 12mo'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{tr ? 'Panikle her şeyi satarım' : 'Sell everything in panic'}</TableCell>
                    <TableCell className="text-right font-semibold text-warning">{tr ? '18-24 ayda 100% DCA' : '100% DCA over 18-24mo'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4 leading-relaxed max-w-prose">
              {tr
                ? 'Dürüst öz değerlendirme, istatistiksel optimizasyondan daha iyidir. Gerçekten tamamlayacağınız bir DCA planı, dipte bozacağınız bir toplu yatırım betinden daha iyi sonuç verir.'
                : 'Honest self-assessment beats statistical optimization. A DCA plan you actually finish outperforms a lump-sum bet you bail on at the bottom.'}
            </p>
          </CardContent>
        </Card>

        {/* Opportunity Cost */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scale className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? "DCA'nın Gizli Fırsat Maliyeti" : 'The Hidden Opportunity Cost of DCA'}
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? "12 ay boyunca DCA yapmak, toplu yatırım yerine sermayenin bir kısmını nakitte tutmak anlamına gelir. Bu nakit bugün yüksek getirili bir tasarruf hesabında yaklaşık %4-5 kazanır — ancak Bitcoin'in 2014'ten beri ortalama yıllık getirisi %60'ın üzerindedir. Bir boğa koşusu sırasında Bitcoin'e DCA yaparken 6 ay boyunca 10.000 $ nakitte tutmanın fırsat maliyeti, kaçırılan kazanç olarak kolayca 3.000 $'ı aşabilir."
                : "When you DCA over 12 months instead of going lump sum, you're effectively keeping a chunk of capital in cash. That cash earns roughly 4-5% in a high-yield savings account today — but Bitcoin's average annual return since 2014 is over 60%. The opportunity cost of holding $10,000 in cash for 6 months while you DCA into Bitcoin during a bull run can easily exceed $3,000 in foregone gains."}
            </p>
            <p>
              {tr
                ? <>Diğer taraftan: bir ayı piyasasında, nakitte bekleyen aynı 10.000 $ sizi %50'lik bir düşüşten korur — daha düşük fiyatlardan BTC biriktirmeye devam ederken 5.000 $'lık kağıt zarardan kurtulursunuz. Bu yüzden <strong>DCA esasen bir volatilite sigortasıdır</strong>. Primini (boğa piyasasında kaçırılan kazanç) aşağı yönlü koruma (ayı piyasasında daha düşük ortalama maliyet) için ödersiniz.</>
                : <>The flip side: in a bear market, that same $10,000 sitting in cash protects you from a 50% drawdown — saving you $5,000 in paper losses while you continue accumulating BTC at lower prices. This is why <strong>DCA is essentially a volatility insurance policy</strong>. You pay the premium (foregone gains in bull markets) in exchange for protection (lower average cost in bear markets).</>}
            </p>
            <p>
              {tr
                ? <>Kendi durumunuz için fırsat maliyetinin tam olarak ne olacağını görmek için yukarıdaki özel tarih aralığını çalıştırın. Ardından bu analizi <a href="/tr/hesaplayicilar/bitcoin-maliyet-ortalama" className="text-primary hover:underline">saf DCA hesaplayıcısı</a> veya <a href="/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi" className="text-primary hover:underline">kâr hesaplayıcısı</a> ile birleştirerek tüm sermaye alternatifini modelleyin.</>
                : <>Run your specific date range above to see exactly what the opportunity cost would have been for your situation. Then pair this analysis with our <Link to="/calculators/dca" className="text-primary hover:underline">pure DCA calculator</Link> or <Link to="/calculators/profit-loss" className="text-primary hover:underline">profit calculator</Link> to model the all-in alternative.</>}
            </p>
          </div>
        </div>

        {/* The Hybrid Strategy */}
        <div className="rounded-xl border border-border/30 bg-muted/30 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">{tr ? 'Profesyonellerin Gerçekte Kullandığı Hibrit Strateji' : 'The hybrid strategy most professionals actually use'}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
            {tr
              ? <>Gerçek dünyadaki tahsisçiler nadiren saf toplu yatırım veya saf DCA seçer. Standart kurumsal yaklaşım <strong>%50/%50 bölünmedir</strong>: sermayenin yarısını hemen yatırarak yükselişi yakalayın, kalan yarısını ise girişinizi yumuşatmak için 6-12 ay boyunca DCA yapın. Bu, toplu yatırımın beklenen getirisinin yaklaşık %80'ini yakalarken zamanlama riski varyansını yarıya indirir. Psikolojik olarak da daha kolaydır — zaten "yatırıma başladınız", bu yüzden kalan DCA alımları bir taahhütten çok bakım gibi hissettirir.</>
              : <>Real-world allocators rarely choose pure lump sum or pure DCA. The standard institutional approach is a <strong>50/50 split</strong>: deploy half your capital immediately to capture upside, then DCA the remaining half over 6-12 months to smooth your entry. This captures roughly 80% of lump sum's expected return while cutting timing-risk variance in half. It's also psychologically easier — you've already "started" investing, so the remaining DCA buys feel like maintenance rather than commitment.</>}
          </p>
        </div>

      </div>
    </section>
  );
};
