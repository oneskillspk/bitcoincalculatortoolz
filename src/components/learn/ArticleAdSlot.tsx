import { useEffect, useRef, useState } from 'react';
import { ADS_ENABLED, AD_SIZE_MAP, type AdSize } from '@/config/adConfig';

interface ArticleAdSlotProps {
  slot: string;
  variant?: 'inline' | 'sidebar-sm' | 'sidebar-lg';
  className?: string;
}

const variantToSize: Record<string, AdSize> = {
  inline: 'inline',
  'sidebar-sm': 'sidebar-sm',
  'sidebar-lg': 'sidebar-lg',
};

export const ArticleAdSlot = ({ slot, variant = 'inline', className = '' }: ArticleAdSlotProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ADS_ENABLED || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!ADS_ENABLED) return null;

  const sizeConfig = AD_SIZE_MAP[variantToSize[variant]];

  return (
    <div
      ref={ref}
      data-ad-slot={slot}
      data-ad-variant={variant}
      className={`mx-auto flex items-center justify-center rounded-lg border border-dashed border-border/30 bg-muted/10 ${sizeConfig.className} ${className}`}
    >
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground select-none">
        {isVisible ? 'Advertisement' : '\u00A0'}
      </span>
    </div>
  );
};
