import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { OptimizedChartContainer } from './OptimizedChartContainer';

interface PerformantResponsiveContainerProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
  minHeight?: number;
}

/**
 * Drop-in replacement for Recharts ResponsiveContainer that reduces forced reflows
 */
export const PerformantResponsiveContainer: React.FC<PerformantResponsiveContainerProps> = ({
  children,
  width = "100%",
  height = "100%",
  className = "",
  minHeight = 300
}) => {
  return (
    <OptimizedChartContainer
      width={width}
      height={height}
      className={className}
      debounceMs={200} // Longer debounce for charts
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </OptimizedChartContainer>
  );
};