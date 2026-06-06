import { Card, CardContent } from "@/components/ui/card";
import { Coins, TrendingUp, Shield, Zap, BarChart3, Clock } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const satsPerDollarData = [
  { date: 'Jan 2015', price: '$215', satsPerDollar: '465,116' },
  { date: 'Jan 2017', price: '$960', satsPerDollar: '104,167' },
  { date: 'Jan 2019', price: '$3,700', satsPerDollar: '27,027' },
  { date: 'Jan 2021', price: '$33,000', satsPerDollar: '3,030' },
  { date: 'Jan 2023', price: '$16,500', satsPerDollar: '6,061' },
  { date: 'Jan 2025', price: '$42,000', satsPerDollar: '2,381' },
  { date: 'Apr 2026', price: '$104,000', satsPerDollar: '962' }
];

const milestoneData = [
  { name: 'Starter Stack', sats: '1,000,000', btc: '0.01', usdCost: '$1,040', monthsAt100: '~10' },
  { name: 'Serious Accumulator', sats: '10,000,000', btc: '0.1', usdCost: '$10,400', monthsAt100: '~104' },
  { name: 'Half Coiner', sats: '50,000,000', btc: '0.5', usdCost: '$52,000', monthsAt100: '~520' },
  { name: 'Whole Coiner', sats: '100,000,000', btc: '1.0', usdCost: '$104,000', monthsAt100: '~1,040' },
  { name: 'Top 1% Holder', sats: '210,000,000', btc: '2.1', usdCost: '$218,400', monthsAt100: '~2,184' }
];

export const StackSatsContentSections = () => {
  const { language } = useLanguage();
  const tr = language==='tr';
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Coins className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">{tr ? 'Sats Biriktirmek Ne Demek?' : 'What Does It Mean to Stack Sats?'}</h2>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>{tr ? '“Sats biriktirmek”, Bitcoin topluluğunun zaman içinde düzenli olarak satoshi biriktirme için kullandığı kısa ifadedir. Her Bitcoin tam 100 milyon satoshi içerir; bu da onları günlük satın alımlar ve disiplinli tasarruf planları için ideal birimler yapar. Bu ifade temel bir felsefeyi özetler: Ağa katılmak için tam bir Bitcoin almanız gerekmez.' : '"Stacking sats" is the Bitcoin community\'s shorthand for accumulating satoshis — the smallest unit of Bitcoin. Each Bitcoin contains exactly 100 million satoshis, making them the ideal denomination for everyday purchases and disciplined savings plans. The phrase captures a core philosophy: you don\'t need to buy a whole Bitcoin to participate in the network\'s long-term value proposition.'}</p>
            <p>{tr ? 'Satoshi’lere DCA yapmak, piyasayı zamanlama baskısını ortadan kaldırır. Bitcoin 30.000 $ da olsa 100.000 $ da olsa, sabit aylık katkı fiyat düştüğünde daha fazla sats, yükseldiğinde daha az sats alır. Çok yıllı ufuklarda bu mekanik yaklaşım tarihsel olarak coşku döngülerindeki toplu girişlerden daha düşük bir ortalama maliyet üretmiştir.' : 'Dollar-cost averaging into satoshis removes the emotional burden of timing the market. Whether Bitcoin trades at $30,000 or $100,000, a fixed monthly contribution automatically buys more sats when prices dip and fewer when prices surge. Over multi-year horizons, this mechanical approach has historically produced a lower average cost basis than lump-sum entries during euphoria cycles.'}</p>
            <p>{tr ? 'Stack Sats Goal Calculator bu felsefeyi uygulanabilir sayılara dönüştürür. Mevcut bakiyenizi, hedef kademenizi ve aylık bütçenizi girin; araç muhafazakar (%10 yıllık), orta (%15) ve iyimser (%25) olmak üzere üç büyüme senaryosu üretir, böylece umutla değil gerçekçi beklentilerle plan yapabilirsiniz.' : 'The Stack Sats Goal Calculator translates this philosophy into actionable numbers. Input your current holdings, target milestone, and monthly budget, and the tool projects three growth scenarios — conservative (10% annual), moderate (15%), and optimistic (25%) — so you can plan with realistic expectations rather than hope.'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><BarChart3 className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">{tr ? 'Tarihsel Sats / Dolar' : 'Historical Sats per Dollar'}</h2>
          </div>
          <p className="text-muted-foreground text-sm">{tr ? 'Bir ABD dolarının satın alabildiği satoshi miktarı, Bitcoin fiyatı yükseldikçe azaldı. Erken dönem biriktirenler dolar başına yüz binlerce sats alıyordu; bugün ise her dolar 1.000 sats’ın altında alıyor — bu da şimdi başlamanın aciliyetini gösteriyor.' : 'The number of satoshis one US dollar buys has declined as Bitcoin\'s price rose. Early stackers acquired hundreds of thousands of sats per dollar; today, each dollar buys under 1,000 sats — reinforcing the urgency to start stacking now.'}</p>
          <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="border-b border-border/50"><th className="text-left py-3 px-4 font-semibold text-foreground">{tr ? 'Tarih' : 'Date'}</th><th className="text-left py-3 px-4 font-semibold text-foreground">{tr ? 'BTC Fiyatı' : 'BTC Price'}</th><th className="text-right py-3 px-4 font-semibold text-foreground">{tr ? '1 $ Karşılığı Sats' : 'Sats per $1'}</th></tr></thead><tbody>{satsPerDollarData.map((row, i) => (<tr key={i} className="border-b border-border/20 hover:bg-muted/30 transition-colors"><td className="py-3 px-4 text-muted-foreground">{row.date}</td><td className="py-3 px-4 text-foreground font-medium">{row.price}</td><td className="py-3 px-4 text-right font-mono text-primary font-medium">{row.satsPerDollar}</td></tr>))}</tbody></table></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">{tr ? 'Satoshi Dönüm Noktaları Referansı' : 'Satoshi Milestone Reference'}</h2>
          </div>
          <p className="text-muted-foreground text-sm">{tr ? 'Bugünkü yaklaşık 104.000 $ fiyatla her popüler Bitcoin hedefinin maliyeti ne olur ve 100 $/ay DCA planı ona ulaşmak için ne kadar sürer (fiyat artışı hariç)?' : 'How much does each popular Bitcoin milestone cost at today\'s approximate price of $104,000, and how long would a $100/month DCA plan take to reach it (without price appreciation)?'}</p>
          <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="border-b border-border/50"><th className="text-left py-3 px-4 font-semibold text-foreground">{tr ? 'Kademe' : 'Milestone'}</th><th className="text-right py-3 px-4 font-semibold text-foreground">{tr ? 'Sats' : 'Sats'}</th><th className="text-right py-3 px-4 font-semibold text-foreground">BTC</th><th className="text-right py-3 px-4 font-semibold text-foreground">{tr ? 'USD Maliyeti' : 'USD Cost'}</th><th className="text-right py-3 px-4 font-semibold text-foreground">{tr ? 'Ay @ 100 $/ay' : 'Months @ $100/mo'}</th></tr></thead><tbody>{milestoneData.map((row, i) => (<tr key={i} className="border-b border-border/20 hover:bg-muted/30 transition-colors"><td className="py-3 px-4 text-foreground font-medium">{tr ? (row.name==='Starter Stack' ? 'Başlangıç Stoku' : row.name==='Serious Accumulator' ? 'Ciddi Biriktirici' : row.name==='Half Coiner' ? 'Yarım Coiner' : row.name==='Whole Coiner' ? 'Tam Coiner' : 'İlk %1 Sahip') : row.name}</td><td className="py-3 px-4 text-right font-mono text-muted-foreground">{row.sats}</td><td className="py-3 px-4 text-right text-muted-foreground">{row.btc}</td><td className="py-3 px-4 text-right text-primary font-medium">{row.usdCost}</td><td className="py-3 px-4 text-right text-muted-foreground">{row.monthsAt100}</td></tr>))}</tbody></table></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded-lg"><Clock className="w-5 h-5 text-primary" /></div><h2 className="text-h2 font-bold text-foreground">{tr ? 'Piyasada Kalma Neden Piyasa Zamanlamasını Geçer?' : 'Why Time in Market Beats Timing the Market'}</h2></div>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>{tr ? 'Bitcoin’in dört yıllık halving döngüleri öngörülebilir arz şokları yaratır; yine de çoğu bireysel yatırımcı tutarlı bir şekilde biriktirmek yerine hâlâ “düşüşü yakalamaya” çalışır. Çok sayıda DCA geriye dönük testinden çıkan araştırmalar, sabit haftalık alımın 2013’ten bu yana üç yıllık herhangi bir kaydırmalı pencerede dipleri zamanlamaya çalışmaktan daha iyi performans gösterdiğini ortaya koyuyor.' : 'Bitcoin\'s four-year halving cycles create predictable supply shocks, yet most retail investors still try to "buy the dip" instead of stacking consistently. Research from multiple DCA backtests shows that a fixed weekly buy outperforms attempting to time bottoms over any rolling three-year window since 2013.'}</p>
            <p>{tr ? 'Düzenli birikimin bileşik etkisi yükselen bir piyasada hızlanır. Bitcoin yıllık %15 değer kazandığında, 2020’de başlayan 200 $/ay’lik bir biriktirici, aynı toplam sermayeyi döngünün ortasında toplu yatırımla bekleyen kişiye kıyasla çok daha fazla satın alma gücüne sahip olur.' : 'The compound effect of regular accumulation accelerates in a rising market. When Bitcoin appreciates 15% annually, a $200/month stacker who started in 2020 holds significantly more purchasing power than someone who waited for the "perfect entry" and deployed the same total capital as a lump sum mid-cycle.'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Coins, title: tr ? 'Mikro-DCA' : 'Micro-DCA', desc: tr ? 'Aylık bütçenizi haftalık veya günlük alımlara bölerek kısa vadeli oynaklık boyunca daha yumuşak maliyet ortalaması yapın.' : 'Split your monthly budget into weekly or daily buys for smoother cost averaging across short-term volatility.' },
            { icon: Shield, title: tr ? 'Kendi Saklama Kademeleri' : 'Self-Custody Milestones', desc: tr ? 'Her kilometre taşında sats’leri bir donanım cüzdanına taşıyın. Zincir üstü doğrulama güven ve güvenlik alışkanlığı oluşturur.' : 'Move sats to a hardware wallet at each milestone. On-chain verification builds confidence and security habits.' },
            { icon: Zap, title: tr ? 'Lightning Yuvarlama' : 'Lightning Round-Ups', desc: tr ? 'Günlük harcamaları en yakın dolara yuvarlayıp farkı sats olarak biriktiren Lightning uyumlu uygulamaları kullanın.' : 'Use Lightning-enabled apps that round up everyday purchases to the nearest dollar and stack the change in sats.' }
          ].map(({ icon: Icon, title, desc }, i) => (<Card key={i} className="border border-border/30 bg-card/50"><CardContent className="pt-6 space-y-2"><div className="p-2 bg-primary/10 rounded-lg w-fit"><Icon className="w-5 h-5 text-primary" /></div><h3 className="font-semibold text-foreground">{title}</h3><p className="text-sm text-muted-foreground">{desc}</p></CardContent></Card>))}
        </div>
      </div>
    </section>
  );
};