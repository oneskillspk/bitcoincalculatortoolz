import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { TooltipInfo } from '@/components/ui/tooltip-info';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useReveal } from '@/hooks/useReveal';

const sigOf = (n: React.ReactNode): string => {
  if (n == null || typeof n === 'boolean') return '';
  if (typeof n === 'string' || typeof n === 'number') return String(n);
  if (Array.isArray(n)) return n.map(sigOf).join('|');
  if (React.isValidElement(n)) {
    const el = n as React.ReactElement<{ children?: React.ReactNode }>;
    return `el:${String(el.type)}|${sigOf(el.props?.children)}`;
  }
  try {
    return JSON.stringify(n);
  } catch {
    return String(n);
  }
};

type Tone = 'default' | 'primary' | 'positive' | 'negative' | 'muted';

interface ResultCardProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  /**
   * Full-precision value for tooltips / accessibility / exports.
   * Pass alongside a compact `value` (e.g. `Rs 3.43M`) so long currencies
   * never need to be truncated inside the card.
   */
  fullValue?: string;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  positive: 'text-success',
  negative: 'text-destructive',
  muted: 'text-muted-foreground',
};

const sizeClasses: Record<NonNullable<ResultCardProps['size']>, string> = {
  sm: 'text-xs sm:text-sm xl:text-base',
  md: 'text-sm sm:text-base xl:text-lg',
  lg: 'text-base sm:text-lg xl:text-xl 2xl:text-2xl',
};

const getValueText = (value: React.ReactNode): string | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return undefined;
};

export const ResultCard: React.FC<ResultCardProps> = ({
  label,
  value,
  sub,
  icon,
  tone = 'default',
  tooltip,
  size = 'md',
  fullValue,
  className,
}) => {
  const valueClasses = cn(
    'calc-text-mono font-semibold leading-tight tabular-nums',
    sizeClasses[size],
    toneClasses[tone],
  );
  const tooltipValue = fullValue ?? getValueText(value);

  // Value never truncates — we rely on the caller passing a compact `value`
  // (use formatCurrencyForDisplay) and a longer `fullValue` for the tooltip.
  // Long words still break safely if a caller forgets the compact display.
  const valueWrapper = cn(
    valueClasses,
    'block min-w-0 max-w-full break-words [overflow-wrap:anywhere]',
  );

  // Replay ember flash whenever the value changes.
  const [flashKey, setFlashKey] = useState(0);
  const lastSig = useRef<string>('');
  useEffect(() => {
    const sig = sigOf(value);
    if (sig && sig !== lastSig.current) {
      lastSig.current = sig;
      setFlashKey((k) => k + 1);
    }
  }, [value]);
  const flashed = <span key={flashKey} className="ember-flash">{value}</span>;

  const valueNode = tooltipValue ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`${label}: ${tooltipValue}`}
          title={tooltipValue}
          className={cn(
            valueWrapper,
            'cursor-help rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          )}
          data-testid="result-card-value"
        >
          {flashed}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="start"
        avoidCollisions
        collisionPadding={12}
        className="max-w-[min(92vw,28rem)] whitespace-normal break-words font-mono tabular-nums text-xs"
      >
        {tooltipValue}
      </TooltipContent>
    </Tooltip>
  ) : (
    <div className={valueWrapper} data-testid="result-card-value">
      {flashed}
    </div>
  );

  const revealRef = useReveal<HTMLDivElement>();
  return (
    <div
      ref={revealRef}
      className={cn(
        'reveal lift-card calc-surface-subtle flex min-h-[100px] min-w-0 flex-col gap-2 p-4 hover:border-border/70',
        className,
      )}
    >
      <div className="flex items-start gap-1.5 min-w-0">
        {icon && <span className="text-muted-foreground shrink-0 mt-0.5 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>}
        <span className="calc-text-label leading-tight min-w-0 break-words [overflow-wrap:anywhere]">{label}</span>
        {tooltip && <TooltipInfo content={tooltip} side="top" />}
      </div>
      {valueNode}
      {sub && <div className="calc-text-small text-muted-foreground break-words">{sub}</div>}
    </div>
  );
};
