import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  className?: string;
}

export const AppStoreBadge = ({ className }: Props) => {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      aria-label={t('aria.appStoreComingSoon')}
      title={t('aria.appStoreComingSoon')}
      className={cn(
        'group relative inline-flex items-center gap-3 rounded-xl border border-white/10',
        'bg-[#0b0b0c] text-white',
        'px-5 py-3 cursor-not-allowed opacity-95 select-none',
        'shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]',
        'transition-transform duration-300 motion-safe:hover:scale-[1.015]',
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-white" aria-hidden="true">
        <path d="M16.365 1.43c0 1.14-.46 2.23-1.21 3.04-.81.86-2.13 1.53-3.22 1.44-.13-1.13.43-2.3 1.16-3.07.83-.88 2.24-1.55 3.27-1.41zM20.5 17.07c-.55 1.27-.81 1.83-1.52 2.95-.99 1.55-2.39 3.49-4.12 3.5-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.05-1.77-4.04-3.32-2.78-4.36-3.07-9.48-1.36-12.2 1.22-1.94 3.14-3.07 4.94-3.07 1.84 0 3 .98 4.51.98 1.47 0 2.36-.99 4.49-.99 1.61 0 3.31.88 4.52 2.4-3.97 2.18-3.32 7.85.68 9.74z" />
      </svg>
      <span className="flex flex-col items-start leading-tight">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/70">
          Download on the
        </span>
        <span className="text-base font-semibold tracking-tight">App Store</span>
      </span>
    </button>
  );
};
