import { Settings, Wifi, Calculator, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StepGuide } from "@/components/step-guide";

export const TransactionFeeHowItWorksSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: Settings, title: 'İşlem Detaylarını Girin', description: 'Adres türünüzü (Legacy, SegWit, Taproot), işleminizdeki giriş (UTXO) ve çıkış sayısını belirtin.' },
    { icon: Wifi, title: 'Canlı Ağ Verisi Çekin', description: "Mevcut ağ koşullarına ilişkin doğru veriler sunmak için mempool.space'ten gerçek zamanlı ücret önerilerini çekiyoruz." },
    { icon: Calculator, title: 'Optimal Ücreti Hesaplayın', description: 'İşlem boyutunuza ve seçtiğiniz önceliğe göre satoshi ve USD cinsinden kesin ücreti hesaplıyoruz.' },
    { icon: Zap, title: 'Önceliğinizi Seçin', description: 'Maliyet ile hız arasında denge kurun — daha hızlı onay için daha fazla ödeyin ya da acil olmayan işlemler için ekonomik seçeneği tercih ederek tasarruf edin.' },
  ] : [
    { icon: Settings, title: 'Enter Transaction Details', description: 'Specify your address type (Legacy, SegWit, Taproot), the number of inputs (UTXOs) and outputs for your transaction.' },
    { icon: Wifi, title: 'Fetch Live Network Data', description: 'We pull real-time fee recommendations from mempool.space, giving you accurate data on current network conditions.' },
    { icon: Calculator, title: 'Calculate Optimal Fee', description: 'Based on your transaction size and chosen priority, we calculate the exact fee in satoshis and USD value.' },
    { icon: Zap, title: 'Choose Your Priority', description: 'Balance cost vs speed — pay more for faster confirmation or save by choosing economy for non-urgent transactions.' },
  ];

  return (
    <StepGuide
      title={tr ? 'Bitcoin İşlem Ücreti Hesaplayıcısı' : 'Bitcoin Transaction Fee Calculator'}
      lead={tr ? 'Dört basit adımda doğru Bitcoin işlem ücreti tahmini alın.' : 'Get accurate Bitcoin transaction fee estimates in four simple steps.'}
      steps={steps}
      note={{
        icon: Zap,
        title: tr ? 'İpucu' : 'Pro tip',
        body: tr
          ? "Native SegWit (bc1q) veya Taproot (bc1p) adresleri kullanmak, işlem ücretlerinizi Legacy adreslere kıyasla %40'a kadar azaltabilir."
          : 'Using Native SegWit (bc1q) or Taproot (bc1p) addresses can reduce your transaction fees by up to 40% compared to Legacy addresses.',
      }}
    />
  );
};
