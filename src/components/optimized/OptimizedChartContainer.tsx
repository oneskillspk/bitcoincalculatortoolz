import React, { useState, useEffect, useRef, useCallback } from 'react';

interface OptimizedChartContainerProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
  debounceMs?: number;
}

/**
 * Optimized chart container that reduces forced reflows by:
 * 1. Debouncing resize events
 * 2. Using requestAnimationFrame for layout reads
 * 3. Avoiding unnecessary re-renders
 */
export const OptimizedChartContainer: React.FC<OptimizedChartContainerProps> = ({
  children,
  width = "100%",
  height = "100%",
  className = "",
  debounceMs = 150
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [isVisible, setIsVisible] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced resize handler to prevent excessive reflows
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current || !isVisible) return;

      // Use requestAnimationFrame to avoid forced reflow
      requestAnimationFrame(() => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.floor(rect.width);
        const newHeight = Math.floor(rect.height);

        // Only update if dimensions actually changed significantly
        setDimensions(prevDimensions => {
          const widthDiff = Math.abs(prevDimensions.width - newWidth);
          const heightDiff = Math.abs(prevDimensions.height - newHeight);
          
          if (widthDiff > 5 || heightDiff > 5) {
            return { width: newWidth, height: newHeight };
          }
          return prevDimensions;
        });
      });
    }, debounceMs);
  }, [debounceMs, isVisible]);

  // Intersection observer to only measure when visible
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          handleResize(); // Initial measurement
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleResize]);

  // Resize observer with debouncing
  useEffect(() => {
    if (!isVisible) return;

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [handleResize, isVisible]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Responsive height ladder when a numeric pixel height is passed.
  const numericHeight = typeof height === 'number' ? height : undefined;
  const resolvedHeight = numericHeight
    ? `clamp(${Math.round(numericHeight * 0.65)}px, ${Math.round(numericHeight * 0.4)}px + 28vw, ${numericHeight}px)`
    : height;

  return (
    <div
      ref={containerRef}
      className={`chart-container ${className}`}
      style={{
        width,
        height: resolvedHeight,
        minHeight: '200px', // Prevent layout shift
        contain: 'layout style' // CSS containment for performance
      }}
    >
      {isVisible && (
        <div style={{ width: dimensions.width, height: dimensions.height }}>
          {children}
        </div>
      )}
    </div>
  );
};