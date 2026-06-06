import { Card, CardContent } from '@/components/ui/card';
import { Crown } from 'lucide-react';
import { Link } from "@/components/LocalizedLink";
import { Holding } from './usePortfolioStorage';
import { useLanguage } from '@/contexts/LanguageContext';

interface PortfolioWealthCalloutProps {
  holdings: Holding[];
}

const getPercentile = (btc: number): { en: string; tr: string } => {
  if (btc >= 100) return { en: 'top 0.01%', tr: 'ilk %0.01' };
  if (btc >= 10)  return { en: 'top 0.1%',  tr: 'ilk %0.1' };
  if (btc >= 1)   return { en: 'top 1%',    tr: 'ilk %1' };
  if (btc >= 0.1) return { en: 'top 5%',    tr: 'ilk %5' };
  if (btc >= 0.01) return { en: 'top 15%',  tr: 'ilk %15' };
  return { en: 'top 30%', tr: 'ilk %30' };
};

export const PortfolioWealthCallout = ({ holdings }: PortfolioWealthCalloutProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const totalBtc = holdings.reduce((s, h) => s + h.btcAmount, 0);
  if (totalBtc <= 0) return null;

  const pct = getPercentile(totalBtc);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5 flex items-start gap-4">
        <Crown className="w-8 h-8 text-primary shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-foreground mb-1">
            {tr ? 'Bitcoin yığınınız dünya genelinde nerede sıralanıyor?' : 'Where does your Bitcoin stack rank globally?'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tr
              ? <>
                  {totalBtc.toFixed(8)} BTC{`'`}ye sahipsiniz. Mevcut tahminlere göre bu, dünya genelindeki tüm Bitcoin sahiplerinin yaklaşık <strong className="text-foreground">{pct.tr}</strong>{`'`}inde yer almanızı sağlıyor.
                </>
              : <>
                  You hold {totalBtc.toFixed(8)} BTC. Based on current estimates, that places you in approximately the <strong className="text-foreground">{pct.en}</strong> of all Bitcoin holders worldwide.
                </>}
          </p>
          <Link to={tr ? '/tr/hesaplayicilar/bitcoin-servet-yuzdesi' : '/calculators/wealth-percentile'} className="text-sm text-primary hover:underline mt-2 inline-block">
            {tr ? 'Detaylı servet yüzdeliği analizini gör →' : 'See detailed wealth percentile breakdown →'}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
