import { Gauge, Table2, BarChart3, Calculator, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const DrawdownHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Gauge, title: 'Temel Metrikleri Anlayın', description: "ATH'den güncel düşüş, en kötü çöküş, ortalama düşüş ve ortalama kurtarma süresi — dört temel metrik." },
    { icon: Table2, title: 'En Kötü 10 Çöküşü Analiz Edin', description: 'Zirve/dip tarihleri, fiyatlar, düşüş yüzdesi ve kurtarma süresiyle sıralanmış tabloyu inceleyin.' },
    { icon: BarChart3, title: 'Çöküş Şiddetini Görselleştirin', description: 'Düşüş Derinliği Grafiği her büyük çöküşün şiddetini gösterir: kırmızı (-%70+), turuncu (-%50–70), sarı (-%20–50).' },
    { icon: Calculator, title: '"ATH\'de Alım" Senaryosu', description: '"Tam zirveyi yakalarsam ne olur?" Herhangi bir tutar girin ve bugünkü değerinizi, kâr/zararınızı görün.' },
  ] : [
    { icon: Gauge, title: 'Understand the Key Metrics', description: "Current drawdown from ATH, worst crash ever, average drawdown, and average recovery time — four core metrics." },
    { icon: Table2, title: 'Analyze the Top 10 Crashes', description: 'Review peak/trough dates, prices, drawdown percentages, days to trough, and recovery time, ranked by severity.' },
    { icon: BarChart3, title: 'Visualize Crash Severity', description: 'The Drawdown Depth Chart shows each crash by severity: red (70%+), orange (50–70%), yellow (20–50%).' },
    { icon: Calculator, title: '"Bought at ATH" Scenario', description: '"What if I bought the exact top?" Enter any dollar amount and see today\'s value, profit or loss, and return.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin Düşüş Hesaplayıcısı' : 'Bitcoin Drawdown Calculator'}
      lead={tr
        ? "Bitcoin'in tarihsel çöküş davranışını — düşüş derinliği, süresi ve kurtarma süresini — anlayın."
        : "Understand Bitcoin's historical crash behavior — how deep corrections get, how long they last, and how long recovery takes."}
      steps={steps}
      note={{
        icon: Lightbulb,
        title: tr ? 'Pro İpucu' : 'Pro Tip',
        body: tr
          ? 'Derin düşüşlerin aşırı korku ile çakıştığı anları tespit etmek için Düşüş Hesaplayıcısını Korku & Açgözlülük Endeksi ile birlikte kullanın — tarihsel olarak en iyi alım fırsatları.'
          : 'Pair the Drawdown Calculator with the Fear & Greed Index to identify when deep drawdowns coincide with extreme fear — historically the best buying opportunities.',
      }}
    />
  );
};
