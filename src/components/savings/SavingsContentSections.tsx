import { Card, CardContent } from "@/components/ui/card";
import { Wallet, PieChart, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const SavingsContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Wallet className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Bitcoin Birikim Planı Nasıl Yapılır?' : 'How to Build a Bitcoin Savings Plan'}
            </h2>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr 
                ? 'Bitcoin birikim planı, gelirinize veya bütçenize göre düzenli olarak Bitcoin almanızı sağlayan disiplinli bir finansal stratejidir. Bu yaklaşım, piyasayı zamanlama stresini ortadan kaldırır ve uzun vadeli birikim yapmanıza olanak tanır.'
                : 'A Bitcoin savings plan is a disciplined financial strategy that ensures you buy Bitcoin regularly based on your income or budget. This approach removes the stress of timing the market and allows you to build long-term wealth.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="p-2 bg-primary/10 rounded-lg w-fit"><PieChart className="w-5 h-5 text-primary" /></div>
            <h3 className="font-bold text-foreground">{tr ? 'Yüzde Bazlı Birikim' : 'Percentage-Based Saving'}</h3>
            <p className="text-sm text-muted-foreground">
              {tr ? 'Maaşınızın sabit bir yüzdesini (örn. %5 veya %10) her ödeme döneminde otomatik olarak Bitcoin\'e ayırın.' : 'Automatically allocate a fixed percentage of your salary (e.g., 5% or 10%) to Bitcoin every pay period.'}
            </p>
          </div>
          <div className="space-y-3">
            <div className="p-2 bg-primary/10 rounded-lg w-fit"><ShieldCheck className="w-5 h-5 text-primary" /></div>
            <h3 className="font-bold text-foreground">{tr ? 'Güvenli Saklama' : 'Secure Storage'}</h3>
            <p className="text-sm text-muted-foreground">
              {tr ? 'Birikimleriniz belirli bir eşiğe ulaştığında, sats’lerinizi borsa yerine kendi donanım cüzdanınıza çekin.' : 'When your savings reach a certain threshold, move your sats to your own hardware wallet instead of an exchange.'}
            </p>
          </div>
          <div className="space-y-3">
            <div className="p-2 bg-primary/10 rounded-lg w-fit"><ArrowUpRight className="w-5 h-5 text-primary" /></div>
            <h3 className="font-bold text-foreground">{tr ? 'Bileşik Getiri' : 'Compound Growth'}</h3>
            <p className="text-sm text-muted-foreground">
              {tr ? 'Bitcoin\'in sınırlı arzı ve artan benimsenmesi, düzenli küçük alımların yıllar içinde büyük bir birikime dönüşmesini sağlar.' : 'Bitcoin\'s limited supply and increasing adoption mean that regular small buys can turn into a significant stack over the years.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
