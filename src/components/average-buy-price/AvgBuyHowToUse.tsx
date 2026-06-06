import { ShoppingCart, Plus, Scale, Target, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { StepGuide } from '@/components/step-guide';

export const AvgBuyHowToUse = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const steps = tr ? [
    { icon: ShoppingCart, title: 'İlk Alımınızı Girin', description: 'BTC miktarını ve ilk alımınız için Bitcoin başına fiyatı girerek başlayın. Hesaplayıcı harcanan ara toplamı anında gösterir.' },
    { icon: Plus, title: 'Daha Fazla Alım Ekleyin', description: 'Her ek alım için yeni satırlar ekleyin (20\'ye kadar). Hesaplayıcı ağırlıklı ortalama formülü kullanır.' },
    { icon: Scale, title: 'Ortalama Alış Fiyatınızı Okuyun', description: 'Tüm alımlarınız için ağırlıklı ortalama BTC başına maliyetinizi, güncel portföy değerini ve gerçekleşmemiş K/Z\'yi görün.' },
    { icon: Target, title: 'Başabaş Durumunuzu Kontrol Edin', description: 'Bitcoin\'in toplam yatırımınızı geri kazanmak için tam olarak nerede işlem görmesi gerektiğini görün.' },
    { icon: Download, title: 'Raporunuzu İndirin', description: 'Markalı PNG veya PDF raporu indirin; finansal danışmanınızla paylaşın veya sosyal medyada gönderin.' },
  ] : [
    { icon: ShoppingCart, title: 'Enter Your First Purchase', description: 'Start by entering the BTC amount and the price per Bitcoin for your first purchase. The subtotal updates instantly.' },
    { icon: Plus, title: 'Add More Purchases', description: 'Click "Add Purchase" to add rows for each additional buy — up to 20. The calculator uses a weighted-average formula.' },
    { icon: Scale, title: 'Read Your Average Buy Price', description: "See your weighted average cost per Bitcoin, current portfolio value, and unrealized profit or loss with ROI." },
    { icon: Target, title: 'Check Your Break-Even', description: "See exactly where Bitcoin needs to trade for you to recover your total investment." },
    { icon: Download, title: 'Download Your Report', description: 'Export a branded PNG or PDF report — share with your advisor, use for tax records, or post to social.' },
  ];

  return (
    <StepGuide
      eyebrow={tr ? 'Nasıl Kullanılır' : 'How to Use'}
      title={tr ? 'Ortalama Alış Fiyatı Hesaplayıcısı' : 'Average Buy Price Calculator'}
      lead={tr
        ? 'Ağırlıklı ortalama alış fiyatınız gerçek maliyet tabanınızdır — vergi raporlama ve portföy yönetimi için kritik.'
        : 'Your weighted-average buy price is your true cost basis — critical for tax reporting and portfolio management.'}
      steps={steps}
      columns={4}
    />
  );
};
