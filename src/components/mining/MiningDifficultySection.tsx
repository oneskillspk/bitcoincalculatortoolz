import { Card, CardContent } from "@/components/ui/card";
import { Pickaxe, Timer, TrendingDown, Info } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const MiningDifficultySection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Pickaxe className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Madencilik Zorluğu ve Halving Etkisi' : 'Mining Difficulty & Halving Impact'}
            </h2>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr 
                ? 'Bitcoin madenciliği kârlılığı iki ana faktöre bağlıdır: Madencilik zorluğu ve Halving (yarılanma) olayları. Zorluk, her 2016 blokta bir (yaklaşık iki hafta) ağa katılan toplam hashrate\'e göre ayarlanır. Daha fazla madenci katıldıkça zorluk artar ve aynı donanımla elde edilen BTC miktarı azalır.'
                : 'Bitcoin mining profitability is heavily influenced by two main factors: mining difficulty and halving events. Difficulty adjusts every 2016 blocks (approx. two weeks) based on the total hashrate connected to the network. As more miners join, difficulty increases, reducing the amount of BTC earned by the same hardware.'}
            </p>
            <p>
              {tr
                ? 'Halving ise her 210.000 blokta bir madencilere verilen ödülü %50 oranında azaltır. Bu, operasyonel maliyetlerin (elektrik) sabit kalırken gelirin aniden yarıya düşmesi anlamına gelir. Kârlı kalmak için madencilerin daha verimli (J/TH oranı düşük) donanımlara geçmesi veya BTC fiyatının artması gerekir.'
                : 'Halving events reduce the block reward given to miners by 50% every 210,000 blocks. This means revenue drops instantly while operational costs (electricity) remain the same. To stay profitable, miners must upgrade to more efficient hardware (lower J/TH ratio) or rely on BTC price appreciation.'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-3">
              <div className="p-2 bg-warning/10 rounded-lg w-fit"><Timer className="w-5 h-5 text-warning" /></div>
              <h3 className="font-bold text-foreground">{tr ? 'Zorluk Ayarlaması' : 'Difficulty Adjustment'}</h3>
              <p className="text-sm text-muted-foreground">
                {tr 
                  ? 'Ağ hashrate\'i arttıkça zorluk yükselir. Bu, madencilerin "başabaş" (break-even) fiyatının zamanla yukarı çıkmasına neden olur.'
                  : 'As network hashrate grows, difficulty rises. This causes the "break-even" price for miners to trend upward over time.'}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-3">
              <div className="p-2 bg-destructive/10 rounded-lg w-fit"><TrendingDown className="w-5 h-5 text-destructive" /></div>
              <h3 className="font-bold text-foreground">{tr ? 'Ödül Yarılanması' : 'Reward Halving'}</h3>
              <p className="text-sm text-muted-foreground">
                {tr 
                  ? 'Gelecek halving 2028\'de gerçekleşecek ve ödül 3.125 BTC\'den 1.5625 BTC\'ye düşecek. Bu, verimsiz madencileri ağdan silebilir.'
                  : 'The next halving in 2028 will cut rewards from 3.125 BTC to 1.5625 BTC. This can flush out inefficient miners from the network.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
