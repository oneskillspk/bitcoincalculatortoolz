import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  maxValue: number;
  color?: 'primary' | 'green' | 'blue' | 'yellow';
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue,
  color = 'primary',
  animated = true,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  const colorClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary',
    green: 'bg-gradient-to-r from-success to-success',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    yellow: 'bg-gradient-to-r from-primary to-primary',
  };

  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className={cn(
          'h-full rounded-full transition-all duration-1000 ease-out',
          colorClasses[color],
          animated && 'animate-fade-in'
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
