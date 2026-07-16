import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  className?: string;
}

/**
 * Editorial-minimal Google Play badge — official triangle silhouette,
 * monochrome to match the surrounding aesthetic. Disabled "Coming Soon" state.
 */
export const GooglePlayBadge = ({ className }: Props) => {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      aria-label={t('aria.googlePlayComingSoon')}
      title={t('aria.googlePlayComingSoon')}
      className={cn(
        'group relative inline-flex items-center gap-3 rounded-xl border border-white/10',
        'bg-[#0b0b0c] text-white',
        'px-5 py-3 cursor-not-allowed select-none',
        'shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]',
        'transition-transform duration-300 motion-safe:hover:scale-[1.015]',
        className
      )}
    >
      {/* Native multi-color Play triangle */}
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="gp-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00D2FF" />
            <stop offset="1" stopColor="#0085F2" />
          </linearGradient>
          <linearGradient id="gp-red" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF3A44" />
            <stop offset="1" stopColor="#C31162" />
          </linearGradient>
          <linearGradient id="gp-yellow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD400" />
            <stop offset="1" stopColor="#FF8A00" />
          </linearGradient>
          <linearGradient id="gp-green" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00F076" />
            <stop offset="1" stopColor="#00A554" />
          </linearGradient>
        </defs>
        {/* Approximation of the official 4-segment play mark */}
        <path d="M3.6 2.3c-.4.2-.6.6-.6 1.1v17.2c0 .5.2.9.6 1.1L13 12 3.6 2.3z" fill="url(#gp-green)" />
        <path d="M16.8 8.7L13 12l3.8 3.3 4-2.3c.9-.5.9-1.9 0-2.4l-4-2.3z" fill="url(#gp-yellow)" />
        <path d="M3.6 2.3L13 12l3.8-3.3L5.2 1.9c-.6-.3-1.2-.1-1.6.4z" fill="url(#gp-red)" />
        <path d="M3.6 21.7c.4.5 1 .7 1.6.4l11.6-6.8L13 12l-9.4 9.7z" fill="url(#gp-blue)" />
      </svg>
      <span className="flex flex-col items-start leading-tight">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/70">
          Get it on
        </span>
        <span className="text-base font-semibold tracking-tight">Google Play</span>
      </span>
    </button>
  );
};
