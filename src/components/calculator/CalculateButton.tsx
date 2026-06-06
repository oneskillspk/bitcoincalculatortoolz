import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyLottie } from '@/components/motion/LazyLottie';
import { dotsWave } from '@/components/motion/lottieAnimations';

interface CalculateButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  loading?: boolean;
  loadingLabel?: string;
  children?: React.ReactNode;
  /** Constrain width on >=sm. Defaults to true (full-width on mobile, auto on sm+). */
  responsive?: boolean;
  fullWidth?: boolean;
}

/**
 * Single source of truth for the primary "Calculate" CTA across all calculators.
 * - 48px min tap target
 * - High-contrast accent color, immune to ambient calculator-motion-scope animations
 *   thanks to data-calc-cta-button="true" + matching CSS overrides in src/index.css
 * - Built-in loading state with aria-busy and an inline spinner
 */
export const CalculateButton = React.forwardRef<HTMLButtonElement, CalculateButtonProps>(
  (
    {
      loading = false,
      loadingLabel = 'Calculating…',
      children = 'Calculate',
      responsive = true,
      fullWidth = false,
      className,
      type = 'submit',
      disabled,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        type={type}
        data-calc-cta="true"
        data-calc-cta-button="true"
        aria-busy={loading || undefined}
        disabled={isDisabled}
        className={cn(
          'group relative inline-flex items-center justify-center gap-2',
          'min-h-[48px] rounded-[var(--calc-radius-pill)] px-6 py-3',
          'text-sm font-semibold tracking-wide',
          'bg-primary text-primary-foreground',
          'shadow-[var(--calc-shadow-soft)]',
          'transition-[transform,box-shadow,background-color] duration-200',
          'hover:bg-primary/90 active:translate-y-px',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          fullWidth ? 'w-full' : responsive ? 'w-full sm:w-auto' : '',
          className,
        )}
        style={{ animation: 'none' }}
        {...rest}
      >
        {loading && (
          <>
            <LazyLottie
              animationData={dotsWave}
              mountDelayMs={0}
              className="hidden sm:block h-4 w-12 -mr-1"
              ariaLabel="Calculating"
            />
            <Loader2 className="sm:hidden h-4 w-4 animate-spin" aria-hidden />
          </>
        )}
        <span className="inline-flex items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
          {loading ? loadingLabel : children}
        </span>
      </button>
    );
  },
);
CalculateButton.displayName = 'CalculateButton';

export default CalculateButton;
