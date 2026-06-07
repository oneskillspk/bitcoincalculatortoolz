import { Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PortfolioPrivacyBadgeProps {
  storageAvailable: boolean;
}

export const PortfolioPrivacyBadge = ({ storageAvailable }: PortfolioPrivacyBadgeProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
        <Lock className="w-5 h-5 text-success mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm text-foreground">
            {tr ? '%100 Gizli — Verileriniz cihazınızı asla terk etmez' : '100% Private — Your data never leaves your device'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {tr
              ? 'Tüm portföy verileri yalnızca tarayıcınızda saklanır. Varlıklarınızı hiçbir zaman görmeyiz. Hesap yok. Kayıt yok. Veri toplama yok. Hiçbir zaman.'
              : 'All portfolio data is stored in your browser only. We never see your holdings. No account. No signup. No data collection. Ever.'}
          </p>
        </div>
      </div>
      {!storageAvailable && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/$3 border border-warning/20">
          <p className="text-xs text-warning">
            {tr
              ? 'Tarayıcınızın gizli modu, oturumlar arasında verileri kaydetmeyebilir. Yedeğinizi korumak için portföyünüzü CSV olarak dışa aktarın.'
              : "Your browser's private mode may not save data between sessions. Export your portfolio as CSV to keep a backup."}
          </p>
        </div>
      )}
    </div>
  );
};
