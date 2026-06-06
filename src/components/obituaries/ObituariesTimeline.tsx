import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BitcoinObituary, BitcoinObituariesService } from "@/services/bitcoinObituariesService";
import { ChevronDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useLanguage } from "@/contexts/LanguageContext";

interface ObituariesTimelineProps {
  obituaries: BitcoinObituary[];
  currentBtcPrice: number;
}

const ITEMS_PER_PAGE = 20;

export const ObituariesTimeline = ({ obituaries, currentBtcPrice }: ObituariesTimelineProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (obituaries.length === 0) return null;

  const visibleObituaries = obituaries.slice(0, visibleCount);
  const hasMore = visibleCount < obituaries.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSourceTypeColor = (type: string) => {
    switch (type) {
      case 'media': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'expert': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'institution': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'government': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-border/20';
    }
  };

  return (
    <section className="py-16 md:py-20" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? 'Ölüm İlanı Zaman Tüneli' : 'Obituary Timeline'}
            </h2>
            <p className="text-base text-muted-foreground">
              {tr
                ? 'Bitcoin\'in tarihi boyunca "öldü" ilan edildiği her an'
                : 'Every time Bitcoin was declared "dead" throughout history'}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border/50" />

            <div className="space-y-8">
              {visibleObituaries.map((obit, index) => {
                const roi = BitcoinObituariesService.calculateROI(obit.btcPriceAtTime, currentBtcPrice);

                return (
                  <div
                    key={obit.id}
                    className="relative pl-12 md:pl-20 motion-safe:animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                  >
                    <div className="absolute left-2.5 md:left-6.5 w-2 h-2 rounded-full bg-primary border-2 border-background" />

                    <Card className="p-4 rounded-lg bg-card/50 border border-border/50 hover:border-border transition-colors">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{formatDate(obit.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{tr ? 'BTC Fiyatı' : 'BTC Price'}</p>
                            <p className="text-sm font-bold text-foreground">{formatCurrency(obit.btcPriceAtTime, { symbol: '$', code: 'USD' })}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-foreground mb-1">{obit.headline}</h3>
                          <p className="text-xs text-muted-foreground italic line-clamp-2">&ldquo;{obit.quote}&rdquo;</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50">
                          <p className="text-xs font-medium text-foreground">{obit.source}</p>
                          <p className="text-xs text-muted-foreground">
                            {tr ? 'Getiri: ' : 'ROI: '}
                            <span className="font-semibold text-foreground">+{roi.toFixed(0)}%</span>
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex flex-col items-center gap-3 pt-8">
                <p className="text-sm text-muted-foreground">
                  {tr
                    ? `${obituaries.length} ölüm ilanından ${visibleCount} tanesi gösteriliyor`
                    : `Showing ${visibleCount} of ${obituaries.length} obituaries`}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, obituaries.length))}
                    className="border-border/40 hover:border-primary/40"
                  >
                    <ChevronDown className="w-4 h-4 mr-2" />
                    {tr ? 'Daha Fazla Göster' : 'Show More'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setVisibleCount(obituaries.length)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {tr ? `Tümünü Göster (${obituaries.length})` : `Show All (${obituaries.length})`}
                  </Button>
                </div>
              </div>
            )}

            {!hasMore && obituaries.length > ITEMS_PER_PAGE && (
              <div className="text-center pt-6">
                <p className="text-sm text-muted-foreground">
                  {tr
                    ? `Tüm ${obituaries.length} ölüm ilanı yüklendi`
                    : `All ${obituaries.length} obituaries loaded`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
