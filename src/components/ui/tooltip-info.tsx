import React, { useEffect, useState, useId } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface TooltipInfoProps {
  content: string;
  className?: string;
  triggerClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Help-icon affordance that adapts to the input device:
 * - Hover-capable pointers (desktop / mouse): Radix Tooltip (hover + focus).
 * - Touch-only pointers (phones / tablets): Radix Popover (tap to toggle,
 *   tap-outside / Escape to close, full a11y).
 *
 * Detection uses `matchMedia('(hover: none)')` so we follow the actual
 * input device rather than viewport width — handles 2-in-1s and tablets
 * with attached keyboards correctly. Public API is unchanged.
 */
export const TooltipInfo = ({
  content,
  className,
  triggerClassName,
  side = 'top',
}: TooltipInfoProps) => {
  const { t } = useLanguage();
  const popoverId = useId();

  // SSR-safe: default to non-touch; resolve on mount.
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: none)');
    const update = () => setIsTouch(mq.matches);
    update();
    // Safari < 14 uses addListener
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  // Shared trigger styles. `before:` adds a transparent 24×24 hit area on
  // touch without enlarging the visible icon, satisfying minimum tap-size
  // guidance while keeping desktop layouts pixel-identical.
  const triggerClasses = cn(
    'relative inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-help',
    'before:absolute before:inset-[-4px] before:content-[""] sm:before:hidden',
    triggerClassName,
  );

  const contentClasses = cn(
    'max-w-xs text-sm bg-popover/95 backdrop-blur-sm border border-border/50 shadow-lg',
    className,
  );

  if (isTouch) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={triggerClasses}
            aria-label={t('aria.moreInformation')}
            aria-controls={popoverId}
          >
            <HelpCircle className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          id={popoverId}
          side={side}
          className={contentClasses}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <p className="leading-relaxed text-popover-foreground">{content}</p>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={triggerClasses}
            aria-label={t('aria.moreInformation')}
          >
            <HelpCircle className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className={contentClasses}>
          <p className="leading-relaxed">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
