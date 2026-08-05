import { Card, CardContent } from "@/components/ui/card";
import { GitCompare, Brain, TrendingUp, ShieldAlert } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const DcaDecisionMatrix = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Brain className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Karar Matrisi: DCA mı, Toplu Yatırım mı?' : 'Decision Matrix: DCA vs. Lump Sum?'}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            {tr 
              ? 'Hangi stratejinin size uygun olduğu, mevcut piyasa duyarlılığına ve risk iştahınıza bağlıdır. Duygu endeksini bir rehber olarak kullanın:'
              : 'Which strategy suits you depends on current market sentiment and your risk appetite. Use the sentiment index as a guide:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              {tr ? 'Aşırı Korku Dönemleri' : 'Extreme Fear Periods'}
            </h3>
            <div className="p-5 bg-success/5 border border-success/20 rounded-2xl space-y-3">
              <p className="text-sm font-bold text-success">{tr ? 'Strateji: Toplu Yatırım (Lump Sum)' : 'Strategy: Lump Sum'}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr 
                  ? 'Piyasa "kan ağlarken" fiyatlar genellikle dibe yakındır. Bu anlarda tüm sermayeyi yatırmak tarihsel olarak en yüksek ROI\'yi sağlamıştır.'
                  : 'When there is "blood in the streets," prices are often near the bottom. Investing the full capital during these moments has historically yielded the highest ROI.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-warning" />
              {tr ? 'Aşırı Açgözlülük Dönemleri' : 'Extreme Greed Periods'}
            </h3>
            <div className="p-5 bg-warning/5 border border-warning/20 rounded-2xl space-y-3">
              <p className="text-sm font-bold text-warning">{tr ? 'Strateji: DCA' : 'Strategy: DCA'}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr 
                  ? 'Fiyatlar zirvedeyken (ATH) toplu yatırım yapmak risklidir. DCA kullanarak alımları zamana yaymak, olası sert düşüşlerden korunmanızı sağlar.'
                  : 'Investing a lump sum at the peak (ATH) is risky. Using DCA to spread purchases over time protects you from potential sharp corrections.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
