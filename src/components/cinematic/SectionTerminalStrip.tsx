import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTerminalStripProps {
  /** Module identifier shown on the left rail, e.g. "SEC-01" or "CALC-LIVE". */
  moduleId: string;
  /** Optional sub-label next to the module id, e.g. "BTC/USD". */
  context?: string;
  /** Right-aligned uppercase status badge, e.g. "LIVE", "WEEKLY". */
  status?: string;
  /** Animate the ember dot for live signals. */
  pulse?: boolean;
  className?: string;
}

/**
 * Shared terminal strip used as the top chrome on every Instrument Panel
 * surface across the homepage. Pure presentation, no data, no copy keys.
 */
export const SectionTerminalStrip: React.FC<SectionTerminalStripProps> = ({
  moduleId,
  context,
  status,
  pulse = false,
  className,
}) => (
  <div
    className={cn(
      'flex items-center justify-between gap-3 border-y border-border/60 bg-background/40 px-4 sm:px-5 py-2.5',
      className,
    )}
    aria-hidden
  >
    <div className="flex items-center gap-2 min-w-0">
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full bg-primary shrink-0',
          pulse && 'animate-pulse',
        )}
      />
      <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground truncate">
        {moduleId}
        {context && <span className="text-foreground/60"> · {context}</span>}
      </span>
    </div>
    {status && (
      <span className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-foreground/70 shrink-0">
        {status}
      </span>
    )}
  </div>
);

export default SectionTerminalStrip;
