import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Centralized typography primitives. Sizes use clamp() with mobile floors.
 * NOTE: base size class is appended raw (not via cn/twMerge) because
 * tailwind-merge groups our custom `text-h*` tokens with `text-foreground`
 * color and was stripping one of them.
 */

type HProps = React.HTMLAttributes<HTMLHeadingElement>;
type PProps = React.HTMLAttributes<HTMLParagraphElement>;
type SProps = React.HTMLAttributes<HTMLSpanElement>;
type UlProps = React.HTMLAttributes<HTMLUListElement>;

const j = (size: string, rest: string, user?: string) =>
  `${size} ${cn(rest, user)}`;

export const H1: React.FC<HProps> = ({ className, ...p }) => (
  <h1 className={j('text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.15] tracking-tight font-bold', 'text-foreground font-display', className)} {...p} />
);
export const H2: React.FC<HProps> = ({ className, ...p }) => (
  <h2 className={j('text-[clamp(1.625rem,1.2rem+1.6vw,2.25rem)] leading-tight tracking-tight font-bold', 'text-foreground font-display', className)} {...p} />
);
export const H3: React.FC<HProps> = ({ className, ...p }) => (
  <h3 className={j('text-[clamp(1.25rem,1.05rem+0.7vw,1.5rem)] leading-snug font-semibold', 'text-foreground', className)} {...p} />
);
export const H4: React.FC<HProps> = ({ className, ...p }) => (
  <h4 className={j('text-[1.125rem] leading-snug font-semibold', 'text-foreground', className)} {...p} />
);

export const Lead: React.FC<PProps> = ({ className, ...p }) => (
  <p className={j('text-[clamp(1.0625rem,1rem+0.3vw,1.1875rem)] leading-[1.6]', 'text-foreground/90', className)} {...p} />
);
export const Body: React.FC<PProps> = ({ className, ...p }) => (
  <p className={j('text-[0.9375rem] leading-[1.65]', 'text-foreground', className)} {...p} />
);
export const Muted: React.FC<PProps> = ({ className, ...p }) => (
  <p className={j('text-[0.9375rem] leading-[1.65]', 'text-muted-foreground', className)} {...p} />
);
export const Small: React.FC<PProps> = ({ className, ...p }) => (
  <p className={j('text-[0.8125rem] leading-[1.55]', 'text-muted-foreground', className)} {...p} />
);

export const Label: React.FC<SProps> = ({ className, ...p }) => (
  <span className={j('text-[0.8125rem] leading-[1.55]', 'font-medium text-foreground', className)} {...p} />
);
export const Caption: React.FC<SProps> = ({ className, ...p }) => (
  <span className={j('text-[0.8125rem] leading-[1.55]', 'text-muted-foreground', className)} {...p} />
);
export const Eyebrow: React.FC<SProps> = ({ className, ...p }) => (
  <span
    className={j(
      'text-[0.8125rem] leading-[1.55]',
      'inline-block font-semibold uppercase tracking-[0.18em] text-primary/80',
      className,
    )}
    {...p}
  />
);

export const List: React.FC<UlProps> = ({ className, ...p }) => (
  <ul className={cn('space-y-2', className)} {...p} />
);

export const ListItem: React.FC<
  React.LiHTMLAttributes<HTMLLIElement> & { tone?: 'default' | 'positive' | 'warning' }
> = ({ className, tone = 'default', children, ...rest }) => {
  const dotColor =
    tone === 'positive' ? 'bg-success' : tone === 'warning' ? 'bg-amber-500' : 'bg-primary';
  return (
    <li
      className={j(
        'text-[0.8125rem] leading-[1.55]',
        'text-muted-foreground flex items-start gap-2 leading-relaxed',
        className,
      )}
      {...rest}
    >
      <span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', dotColor)} />
      <span>{children}</span>
    </li>
  );
};

export const Prose: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => (
  <div
    className={cn(
      'space-y-4 [&>h2]:mt-8 [&>h3]:mt-6 [&>p]:text-body [&>p]:text-foreground/90 [&>p]:leading-[1.65]',
      className,
    )}
    {...rest}
  />
);
