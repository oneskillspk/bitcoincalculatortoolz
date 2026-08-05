import { Card, CardContent } from "@/components/ui/card";
import { History, TrendingDown, Target, Info } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const ObituariesContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><History className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Bitcoin Ölüm İlanları Nedir?' : 'What are Bitcoin Obituaries?'}
            </h2>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr 
                ? 'Bitcoin Ölüm İlanları, ana akım medyanın, ekonomistlerin ve finans figürlerinin Bitcoin\'in başarısız olduğunu, değerinin sıfıra gideceğini veya "öldüğünü" iddia ettiği her anın bir kaydıdır. 2010\'dan bu yana Bitcoin yüzlerce kez ölü ilan edildi, ancak her seferinde daha güçlü bir şekilde geri döndü.'
                : 'Bitcoin Obituaries are a record of every time mainstream media, economists, or finance figures claimed Bitcoin had failed, was going to zero, or was "dead." Since 2010, Bitcoin has been declared dead hundreds of times, only to return stronger each time.'}
            </p>
            <p>
              {tr
                ? 'Bu takipçi, yalnızca eleştirileri belgelemekle kalmaz, aynı zamanda bu karamsar tahminlerin yapıldığı anlardaki fırsat maliyetini de hesaplar. Çoğu ölüm ilanı, aslında piyasanın en iyi alım fırsatlarını sunduğu büyük düşüşlerin hemen ardından gelmiştir.'
                : 'This tracker doesn\'t just document the criticism; it calculates the opportunity cost at the moment these pessimistic predictions were made. Many obituaries followed major price corrections, which in hindsight were the best buying opportunities.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-3">
              <div className="p-2 bg-destructive/10 rounded-lg w-fit"><TrendingDown className="w-5 h-5 text-destructive" /></div>
              <h3 className="font-bold text-foreground">{tr ? 'Duygu ve Fiyat Ayrışması' : 'Sentiment vs. Price Divergence'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr 
                  ? 'Medya manşetleri en olumsuz olduğunda, Bitcoin genellikle birikim aşamasındadır. Ölüm ilanlarının yoğunluğu ile fiyat dipleri arasındaki tarihsel korelasyonu inceleyin.'
                  : 'When media headlines are most negative, Bitcoin is often in an accumulation phase. Examine the historical correlation between the density of obituaries and price bottoms.'}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-3">
              <div className="p-2 bg-success/10 rounded-lg w-fit"><Target className="w-5 h-5 text-success" /></div>
              <h3 className="font-bold text-foreground">{tr ? 'Getiri Analizi (ROI)' : 'Return Analysis (ROI)'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr 
                  ? 'En meşhur ölüm ilanlarının yapıldığı gün Bitcoin almış olsaydınız elde edeceğiniz getiriyi görün. Genellikle bu oranlar %10.000\'i aşmaktadır.'
                  : 'See the return you would have earned if you had bought Bitcoin on the day of the most famous obituaries. Often, these returns exceed 10,000%.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
