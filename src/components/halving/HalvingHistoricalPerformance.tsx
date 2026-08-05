import { Card, CardContent } from "@/components/ui/card";
import { History, TrendingUp, Calendar, Info } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const HalvingHistoricalPerformance = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const data = [
    { date: '2012-11-28', price: '$12', m1: '$13', m6: '$123', y1: '$964' },
    { date: '2016-07-09', price: '$650', m1: '$590', m6: '$910', y1: '$2,550' },
    { date: '2020-05-11', price: '$8,800', m1: '$9,400', m6: '$15,500', y1: '$56,000' },
    { date: '2024-04-19', price: '$64,000', m1: '$66,000', m6: '$68,000', y1: '?' },
  ];

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><History className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Geçmiş Halving Performansları' : 'Historical Halving Performance'}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            {tr 
              ? 'Bitcoin\'in fiyatı tarihsel olarak her halving olayından sonra arz şoku nedeniyle yükselme eğilimi göstermiştir. İşte her döngüdeki değişimler:'
              : 'Bitcoin\'s price has historically trended upward following each halving event due to the resulting supply shock. Here is the breakdown for each cycle:'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50">
                <th className="py-4 px-4 font-bold text-foreground">{tr ? 'Halving Tarihi' : 'Halving Date'}</th>
                <th className="py-4 px-4 font-bold text-foreground">{tr ? 'Halving Fiyatı' : 'Price at Halving'}</th>
                <th className="py-4 px-4 font-bold text-foreground">{tr ? '1 Ay Sonra' : '1 Month After'}</th>
                <th className="py-4 px-4 font-bold text-foreground">{tr ? '6 Ay Sonra' : '6 Months After'}</th>
                <th className="py-4 px-4 font-bold text-foreground">{tr ? '1 Yıl Sonra' : '1 Year After'}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-border/20 hover:bg-primary/5 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium">{row.date}</td>
                  <td className="py-4 px-4 text-sm">{row.price}</td>
                  <td className="py-4 px-4 text-sm text-success font-medium">{row.m1}</td>
                  <td className="py-4 px-4 text-sm text-success font-bold">{row.m6}</td>
                  <td className="py-4 px-4 text-sm text-success font-black">{row.y1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-info/5 border border-info/20 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tr 
              ? 'Not: Geçmiş performans gelecekteki sonuçların garantisi değildir. Arz şoku genellikle 12-18 aylık bir gecikmeyle fiyata yansır.'
              : 'Note: Past performance is not an indicator of future results. The supply shock usually reflects in the price with a 12-18 month lag.'}
          </p>
        </div>
      </div>
    </section>
  );
};
