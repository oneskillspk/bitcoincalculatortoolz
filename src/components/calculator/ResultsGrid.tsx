import React from 'react';
import { cn } from '@/lib/utils';

interface ResultsGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

const colClass: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  // 4-up only kicks in at xl — at lg the panel is often nested in a
  // 2/3 column so 4 cards become ~140px each and numeric values overlap.
  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
};

export const ResultsGrid: React.FC<ResultsGridProps> = ({ children, cols = 4, className }) => (
  <div className={cn('reveal-stagger grid min-w-0 gap-3 sm:gap-4', colClass[cols], className)}>{children}</div>
);
