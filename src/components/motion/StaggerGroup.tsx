import { Children, CSSProperties, ElementType, ReactNode, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

interface StaggerGroupProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Step delay in ms (default 60). */
  step?: number;
  /** Starting offset in ms applied before stagger begins. */
  startDelay?: number;
  style?: CSSProperties;
}

/**
 * Assigns --stagger-i to each child in order so any descendant [data-reveal] picks up
 * a staggered --reveal-delay via [data-stagger]. Children should be <Reveal> instances.
 */
export const StaggerGroup = ({
  children,
  as,
  className,
  step = 60,
  startDelay = 0,
  style,
}: StaggerGroupProps) => {
  const Tag = (as ?? 'div') as ElementType;
  const items = Children.toArray(children);

  return (
    <Tag
      data-stagger
      className={cn(className)}
      style={{ ['--stagger-step' as any]: `${step}ms`, ...style }}
    >
      {items.map((child, i) => {
        if (!isValidElement(child)) return child;
        const existingStyle = (child.props as any).style ?? {};
        return cloneElement(child as any, {
          key: (child as any).key ?? i,
          style: {
            ...existingStyle,
            ['--stagger-i' as any]: i,
            ['--reveal-delay' as any]: `${startDelay + i * step}ms`,
          },
        });
      })}
    </Tag>
  );
};
