import { CalendarIcon, BarChart3, TrendingDown, Download } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const PowerLawHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: CalendarIcon, title: 'Hedef Tarih Seçin', description: 'Tarih seçici veya hızlı hazır ayar (2026, 2028, 2030, 2035) ile gelecek bir tarih belirleyin.' },
    { icon: BarChart3, title: 'Projeksiyonlu Aralığı Görüntüleyin', description: "Güç Yasası modelinin adil değerini, desteğini ve direncini görün." },
    { icon: TrendingDown, title: 'Güncel Sapmayı Kontrol Edin', description: "Bitcoin'in modele kıyasla değerinin altında mı yoksa üzerinde mi olduğunu anında görün." },
    { icon: Download, title: 'Raporunuzu Dışa Aktarın', description: 'PNG veya PDF raporu indirin.' },
  ] : [
    { icon: CalendarIcon, title: 'Select a Target Date', description: "Choose any future date with the picker or quick presets (2026, 2028, 2030, 2035)." },
    { icon: BarChart3, title: 'View the Projected Range', description: "See the Power Law model's fair value, support, and resistance for your chosen date." },
    { icon: TrendingDown, title: 'Check Current Deviation', description: "Instantly see whether Bitcoin is currently undervalued or overvalued vs. the model." },
    { icon: Download, title: 'Export Your Report', description: 'Download a PNG or PDF report of your analysis.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Güç Yasası Hesaplayıcısı' : 'Power Law Calculator'}
      steps={steps}
    />
  );
};
