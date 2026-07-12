import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LazyLottie } from '@/components/motion/LazyLottie';
import { softSparkle } from '@/components/motion/lottieAnimations';
import { useReveal } from '@/hooks/useReveal';

/** Stable string signature of a ReactNode for change-detection. */
const nodeSig = (n: React.ReactNode): string => {
  if (n == null || typeof n === 'boolean') return '';
  if (typeof n === 'string' || typeof n === 'number') return String(n);
  if (Array.isArray(n)) return n.map(nodeSig).join('|');
  if (React.isValidElement(n)) {
    const el = n as React.ReactElement<{ children?: React.ReactNode }>;
    return `el:${String(el.type)}|${nodeSig(el.props?.children)}`;
  }
  try {
    return JSON.stringify(n);
  } catch {
    return String(n);
  }
};

interface ResultHeroProps {
  label: string;
  value: React.ReactNode;
  badge?: React.ReactNode;
  sub?: React.ReactNode;
  fullValue?: string;
  className?: string;
}

/**
 * Hero number block used at the top of a result panel.
 * Values wrap safely instead of being truncated — pass a compact display via
 * `formatCurrencyForDisplay` and the full amount as `fullValue` for tooltips.
 */
export const ResultHero: React.FC<ResultHeroProps> = ({ label, value, badge, sub, fullValue, className }) => {
  const valueClasses = 'calc-text-display text-foreground block w-full break-words [overflow-wrap:anywhere] tabular-nums';

  const revealRef = useReveal<HTMLDivElement>();

  // Bump a key whenever the displayed value changes so the ember flash replays.
  const [flashKey, setFlashKey] = useState(0);
  const lastSig = useRef<string>('');
  useEffect(() => {
    const sig = nodeSig(value);
    if (sig && sig !== lastSig.current) {
      lastSig.current = sig;
      setFlashKey((k) => k + 1);
    }
  }, [value]);

  const flashed = (
    <span key={flashKey} className="ember-flash">
      {value}
    </span>
  );

  return (
    <div
      ref={revealRef}
      className={cn(
        'reveal lift-card relative rounded-[var(--calc-radius-card)] border border-primary/15 bg-gradient-to-br from-primary/[0.07] to-primary/[0.02] p-6 sm:p-7 text-center',
        className,
      )}
    >
      {/* Decorative ember sparkle — lazy, one-shot, behind content */}
      <LazyLottie
        animationData={softSparkle}
        loop={false}
        className="pointer-events-none absolute right-4 top-4 h-5 w-16 opacity-70"
      />
      <p className="calc-text-label mb-3">{label}</p>
      {fullValue ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`${label}: ${fullValue}`}
              title={fullValue}
              className={cn(valueClasses, 'cursor-help rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40')}
              data-testid="result-hero-value"
            >
              {flashed}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="calc-text-mono text-sm">
            {fullValue}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className={valueClasses} data-testid="result-hero-value">
          {flashed}
        </div>
      )}
      {sub && <p className="calc-text-small text-muted-foreground mt-3 break-words">{sub}</p>}
      {badge && <div className="mt-4 flex justify-center">{badge}</div>}
    </div>
  );
};
