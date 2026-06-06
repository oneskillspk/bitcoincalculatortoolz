import { Activity, LineChart, PieChart, Gem } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const SupplyHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Activity, title: 'Canlı Arzı Görüntüleyin', description: "Güncel dolaşımdaki arzı, madenciliği yapılan yüzdeyi ve kalan BTC'yi mempool.space API'sinden otomatik yükler." },
    { icon: LineChart, title: 'Arz Eğrisini Keşfedin', description: "Bitcoin'in ihracının 21 milyona doğru nasıl azaldığını ve yarılanmaların etkisini gösteren grafik." },
    { icon: PieChart, title: 'Yığın Yüzdenizi Kontrol Edin', description: 'BTC varlıklarınızı girin; toplam arzın yüzde kaçına sahip olduğunuzu görün. 0,01 BTC bile küresel en yüksek dilime sokar.' },
    { icon: Gem, title: 'Kıtlığı Anlayın', description: 'Tahminen 3-4M BTC kalıcı olarak kaybolmuş — etkin arz 17-18M\'ye yakın. Stok-akış oranıyla altından daha kıt.' },
  ] : [
    { icon: Activity, title: 'View Live Supply', description: "Auto-loads the current circulating supply, percentage mined, and remaining BTC from the mempool.space API." },
    { icon: LineChart, title: 'Explore the Supply Curve', description: "The chart shows how Bitcoin's issuance tapers towards 21 million, with halvings every ~4 years cutting new supply by 50%." },
    { icon: PieChart, title: 'Check Your Stack %', description: 'Enter your BTC holdings to see what percentage of the total supply you own. Even 0.01 BTC makes you a top percentile holder.' },
    { icon: Gem, title: 'Understand Scarcity', description: "With ~3–4M BTC lost forever, effective supply is closer to 17–18M. BTC is scarcer than gold by stock-to-flow ratio." },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Bitcoin Arz Hesaplayıcısı' : 'Bitcoin Supply Calculator'}
      steps={steps}
    />
  );
};
