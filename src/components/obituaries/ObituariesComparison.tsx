import { Card } from "@/components/ui/card";
import { BitcoinObituary, BitcoinObituariesService } from "@/services/bitcoinObituariesService";
import { formatCurrency } from "@/utils/formatters";
import { useLanguage } from "@/contexts/LanguageContext";

interface ObituariesComparisonProps {
  famousObituaries: BitcoinObituary[];
  currentBtcPrice: number;
}

export const ObituariesComparison = ({ famousObituaries, currentBtcPrice }: ObituariesComparisonProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (famousObituaries.length === 0) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <section className="py-16 md:py-20" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? 'Önemli Ölüm İlanları' : 'Notable Obituaries'}
            </h2>
            <p className="text-base text-muted-foreground">
              {tr
                ? 'Tarih boyunca en çok atıfta bulunulan Bitcoin "ölüm" ilanları'
                : 'The most referenced Bitcoin "death" declarations throughout history'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {famousObituaries.slice(0, 8).map((obit) => {
              const roi = BitcoinObituariesService.calculateROI(obit.btcPriceAtTime, currentBtcPrice);

              return (
                <Card
                  key={obit.id}
                  className="p-4 bg-card/50 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-muted-foreground">{formatDate(obit.date)}</p>
                      <p className="text-sm font-bold text-foreground">{formatCurrency(obit.btcPriceAtTime, { symbol: '$', code: 'USD' })}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
                        {obit.headline}
                      </h3>
                      <p className="text-xs text-muted-foreground italic line-clamp-2">
                        &ldquo;{obit.quote}&rdquo;
                      </p>
                    </div>

                    <p className="text-xs font-medium text-foreground">— {obit.source}</p>

                    <div className="pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {tr ? 'Alsaydınız yatırım getirisi' : 'ROI if bought'}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          +{roi.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
