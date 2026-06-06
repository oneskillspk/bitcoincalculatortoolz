import { Calendar, Filter, Skull, TrendingUp, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StepGuide } from "@/components/step-guide";

export const ObituariesHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Calendar, title: 'Tarih Aralığı Seçin', description: "2010'daki başlangıcından bugüne kadar analiz etmek istediğiniz zaman dilimini seçin." },
    { icon: Filter, title: 'Kaynağa Göre Filtrele', description: 'Ölüm ilanlarını kaynak türüne göre filtreleyin: medya, uzmanlar, kurumlar veya hükümet.' },
    { icon: Skull, title: 'Ölüm İlanlarını İnceleyin', description: 'Bitcoin\'in "ölüm" ilanlarının tam zaman tünelini ve kimin yaptığını görüntüleyin.' },
    { icon: TrendingUp, title: 'Yatırım Getirisini Hesaplayın', description: 'Her ölüm ilanı tarihinde Bitcoin satın alsaydınız ne kadar kazanacağınızı görün.' },
  ] : [
    { icon: Calendar, title: 'Select Date Range', description: "Choose the time period you want to analyze, from Bitcoin's inception in 2010 to today." },
    { icon: Filter, title: 'Filter by Source', description: 'Filter obituaries by source type: media, experts, institutions, or government.' },
    { icon: Skull, title: 'Analyze Deaths', description: 'View the complete timeline of Bitcoin "death" declarations and who made them.' },
    { icon: TrendingUp, title: 'Calculate ROI', description: 'See how much you would have earned if you bought Bitcoin at each obituary date.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin Ölüm İlanları Nasıl Takip Edilir' : 'How to Track Bitcoin Obituaries'}
      lead={tr ? 'Bitcoin ölüm ilanlarını dört basit adımda takip edin.' : 'Track Bitcoin obituaries in four simple steps.'}
      steps={steps}
      note={{
        icon: Info,
        title: tr ? 'Neden Bitcoin Ölüm İlanlarını Takip Edelim?' : 'Why Track Bitcoin Obituaries?',
        body: tr
          ? 'Bitcoin\'in tarih boyunca gösterdiği dayanıklılığı anlamak, eleştirileri bir perspektife oturtmaya yardımcı olur. Her "ölüm" ilanının ardından Bitcoin toparlanmış ve yeni tüm zamanların en yüksek seviyelerine ulaşmıştır.'
          : 'Understanding Bitcoin\'s resilience through history helps put criticism in perspective. Every "death" declaration has been followed by recovery and new all-time highs.',
      }}
    />
  );
};
