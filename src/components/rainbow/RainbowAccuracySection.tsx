import React from 'react';
import { SectionHeader } from '@/components/lot-size/SectionHeader';
import { TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const RainbowAccuracySection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="space-y-12 mt-16">
      <section>
        <SectionHeader
          title={tr ? "Gökkuşağı Grafiği Geçmişi ve Doğruluğu" : "Rainbow Chart History & Accuracy"}
          lead={tr ? "Log-regresyon bantlarının geçmiş döngülerdeki performansı" : "How the log-regression bands performed in past cycles"}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">{tr ? "Destek Doğruluğu (Büyük Fırsat)" : "Support Accuracy (Fire Sale)"}</h4>
                <p className="text-sm text-muted-foreground italic">
                  {tr ? "\"Temelde Büyük Fırsat\" (Mavi/Mor)" : "\"Basically Fire Sale\" (Blue/Purple)"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {tr
                    ? "Tarihsel olarak bu bantlar mükemmel giriş sinyalleri olmuştur. Bitcoin geçmişinin %5'inden azını burada geçirdi, özellikle 2015, 2018 ve 2022 döngü dipleri sırasında. Buradan satın almak 4 yıllık bir ufukta asla kayıpla sonuçlanmadı."
                    : "Historically, these bands have been excellent entry signals. Bitcoin spent less than 5% of its history here, notably during the 2015, 2018, and 2022 cycle bottoms. Buying here has never resulted in a loss over a 4-year horizon."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500 mt-1">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold mb-1">{tr ? "Direnç Doğruluğu (Balon)" : "Resistance Accuracy (Bubble)"}</h4>
                <p className="text-sm text-muted-foreground italic">
                  {tr ? "\"Maksimum Balon Bölgesi\" (Kırmızı)" : "\"Maximum Bubble Territory\" (Red)"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {tr
                    ? "Grafik 2013 ve 2017 zirvelerini doğru bir şekilde tanımladı. Ancak 2021'de Bitcoin kırmızı banda ulaşamadı ve bunun yerine \"Bu bir Balon mu?\" (Turuncu) bölgesinde zirve yaptı; bu da azalan getirilerin eğriyi düzleştirebileceğini gösteriyor."
                    : "The chart correctly identified the 2013 and 2017 peaks. However, in 2021, Bitcoin failed to reach the red band, peaking instead in the \"Is this a Bubble?\" (Orange) zone, showing that diminishing returns may flatten the curve."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-primary/10 flex flex-col justify-center">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {tr ? "Döngü Maksimum Tahmini" : "Cycle Max Prediction"}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b border-border pb-2">
                <span className="text-muted-foreground">{tr ? "2013 Zirvesi" : "2013 Peak"}</span>
                <span className="font-mono text-red-500">{tr ? "Kırmızı Bandı Vurdu" : "Hit Red Band"}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-border pb-2">
                <span className="text-muted-foreground">{tr ? "2017 Zirvesi" : "2017 Peak"}</span>
                <span className="font-mono text-red-500">{tr ? "Kırmızı Bandı Vurdu" : "Hit Red Band"}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-border pb-2">
                <span className="text-muted-foreground">{tr ? "2021 Zirvesi" : "2021 Peak"}</span>
                <span className="font-mono text-orange-500">{tr ? "Turuncu Bandı Vurdu" : "Hit Orange Band"}</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-muted-foreground">{tr ? "2025/26 Mevcut" : "2025/26 Current"}</span>
                <span className="font-mono text-primary font-bold">{tr ? "Devam Ediyor" : "In Progress"}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6 italic text-center">
              {tr
                ? "Gökkuşağı Grafiği eğlenceli bir araçtır, finansal tavsiye değildir. Gelecekteki sonuçları garanti etmeyen geçmiş performansı kullanır."
                : "The Rainbow Chart is a fun tool, not financial advice. It uses past performance which does not guarantee future results."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};