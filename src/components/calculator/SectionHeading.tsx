import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Small uppercase label above the heading. Optional. */
  eyebrow?: React.ReactNode;
  /** Main heading text. */
  title: React.ReactNode;
  /** Supporting paragraph below the heading. Optional. */
  description?: React.ReactNode;
  /** Right-aligned slot (e.g. action button). Optional. */
  action?: React.ReactNode;
  /** Center-align the heading block. */
  align?: 'left' | 'center';
  /** Render the heading as a different level. Defaults to h2. */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

/**
 * Single source of truth for section headings on calculator pages.
 *
 * Pulls from the global editorial utilities defined in `src/index.css`
 * (.eyebrow, .h-section, .lede) so every section matches the hero's
 * Sora display + ember accent + tight tracking language.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  as: Tag = 'h2',
  className,
}) => {
  const headingClasses = cn(
    'font-display font-semibold text-foreground',
    Tag === 'h1' && 'text-4xl sm:text-5xl lg:text-[3.5rem] tracking-[-0.032em] leading-[1.05]',
    Tag === 'h2' && 'text-3xl md:text-4xl lg:text-[2.75rem] tracking-[-0.028em] leading-[1.1]',
    Tag === 'h3' && 'text-xl sm:text-2xl tracking-[-0.02em] leading-[1.2]',
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('space-y-3 max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <div className="eyebrow eyebrow--primary">
            {eyebrow}
          </div>
        )}
        <Tag className={headingClasses}>{title}</Tag>
        {description && (
          <p className="lede max-w-prose">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeading;
