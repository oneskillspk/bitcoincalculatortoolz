import { Zap, Settings, Calculator, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StepGuide } from "@/components/step-guide";

export const LightningHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Zap, title: 'Ödeme Detaylarını Girin', description: 'Ödeme miktarınızı satoshi, BTC veya USD olarak belirtin. Yaygın ödeme boyutları için hızlı ön ayarları kullanın ya da özel bir miktar girin.' },
    { icon: Settings, title: 'Ücret Parametrelerini Yapılandırın', description: 'Beklenen yönlendirme atlamalarını ve ücret oranlarını ayarlayın. Gerçekçi tahminler için ağ ortalamalarını kullanın ya da belirli senaryolar için özelleştirin.' },
    { icon: Calculator, title: 'Toplam Ücretleri Hesaplayın', description: 'Temel ücret, orantılı ücret ve toplam maliyeti gösteren anlık ücret tahminleri alın. Ödemenizin yüzdesi olarak efektif ücret oranını görün.' },
    { icon: TrendingUp, title: 'Karşılaştırın ve Optimize Edin', description: 'Lightning ücretlerini zincir üstü işlem maliyetleriyle karşılaştırın. Anlık Lightning ödemeleriyle daha yavaş zincir üstü transferlere kıyasla ne kadar tasarruf ettiğinizi görün.' },
  ] : [
    { icon: Zap, title: 'Enter Payment Details', description: 'Specify your payment amount in satoshis, BTC, or USD. Use quick presets for common payment sizes or enter a custom amount.' },
    { icon: Settings, title: 'Configure Fee Parameters', description: 'Set the expected number of routing hops and fee rates. Use network averages for realistic estimates or customize for specific scenarios.' },
    { icon: Calculator, title: 'Calculate Total Fees', description: 'Get instant fee estimates showing base fee, proportional fee, and total cost. See the effective fee rate as a percentage of your payment.' },
    { icon: TrendingUp, title: 'Compare and Optimize', description: 'Compare Lightning fees against on-chain transaction costs. See how much you save with instant Lightning payments versus slower on-chain transfers.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Lightning Ücretlerini 4 Basit Adımda Hesaplayın' : 'Calculate Lightning Fees in 4 Simple Steps'}
      lead={tr
        ? 'Kullanımı kolay hesaplayıcımızla Lightning Network ödeme maliyetlerinizi anlayın.'
        : 'Understand your Lightning Network payment costs with our easy-to-use calculator.'}
      steps={steps}
    />
  );
};

export default LightningHowItWorksSection;
