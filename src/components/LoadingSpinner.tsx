import { useLanguage } from '@/contexts/LanguageContext';
import bitcoinLogo from '@/assets/bitcoin-logo.png';

interface LoadingSpinnerProps {
  /**
   * When true, overlays the whole viewport (legacy full-page splash).
   * Defaults to false so calculate buttons render an inline result-area loader
   * instead of hijacking the screen with a colored splash.
   */
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ fullScreen = false }: LoadingSpinnerProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-background'
          : 'flex items-center justify-center py-8'
      }
    >
      <div className="relative z-10 text-center">
        <img
          src={bitcoinLogo}
          alt="Bitcoin Calculator Tools"
          className="w-12 h-12 mx-auto mb-4 object-contain"
          loading="eager"
          decoding="async"
        />
        <p className="text-sm font-semibold text-foreground mb-1 tracking-tight">
          {tr ? 'Hesaplanıyor' : 'Calculating'}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          {tr ? 'Sonuçlarınız hazırlanıyor...' : 'Preparing your results...'}
        </p>
        <div className="flex items-center justify-center gap-[5px]">
          <span className="w-[5px] h-[5px] rounded-full bg-primary animate-[pulse-dot_1.4s_ease-in-out_infinite]" />
          <span className="w-[5px] h-[5px] rounded-full bg-primary animate-[pulse-dot_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="w-[5px] h-[5px] rounded-full bg-primary animate-[pulse-dot_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  );
};
