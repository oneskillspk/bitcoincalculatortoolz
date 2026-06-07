import { AlertTriangle, Info, Lightbulb, CheckCircle2, BookOpen, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type CalloutVariant = 'info' | 'warning' | 'success' | 'tip' | 'note';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const variantStyles: Record<
  CalloutVariant,
  { container: string; iconWrap: string; icon: LucideIcon; title: string }
> = {
  info: {
    container: 'bg-primary/5 border-primary/30',
    iconWrap: 'text-primary',
    icon: Info,
    title: 'text-foreground',
  },
  warning: {
    container: 'bg-destructive/5 border-destructive/30',
    iconWrap: 'text-destructive',
    icon: AlertTriangle,
    title: 'text-foreground',
  },
  success: {
    container: 'bg-success/$3 border-success/30',
    iconWrap: 'text-success',
    icon: CheckCircle2,
    title: 'text-foreground',
  },
  tip: {
    container: 'bg-warning/$3 border-warning/30',
    iconWrap: 'text-warning',
    icon: Lightbulb,
    title: 'text-foreground',
  },
  note: {
    container: 'bg-muted/40 border-border/60',
    iconWrap: 'text-muted-foreground',
    icon: BookOpen,
    title: 'text-foreground',
  },
};

/**
 * Canonical editorial callout. Replaces ~25 ad-hoc warning/info/note blocks.
 *
 * Use for inline contextual messages within article and methodology copy.
 * Solid border + tinted background, no glass, no gradient.
 */
export const Callout = ({
  variant = 'info',
  title,
  children,
  icon: IconOverride,
  className,
}: CalloutProps) => {
  const style = variantStyles[variant];
  const Icon = IconOverride ?? style.icon;

  return (
    <aside
      role="note"
      className={cn(
        'flex gap-3 rounded-xl border px-4 py-3.5 sm:px-5 sm:py-4',
        style.container,
        className,
      )}
    >
      <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', style.iconWrap)} aria-hidden />
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
        {title && (
          <p className={cn('font-medium mb-1 text-[0.95rem]', style.title)}>{title}</p>
        )}
        {children}
      </div>
    </aside>
  );
};

export default Callout;
