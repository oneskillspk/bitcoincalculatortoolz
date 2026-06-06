import { useState, useEffect } from 'react';

// Responsive design breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

export const useResponsiveDesign = () => {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });

      // Determine current breakpoint
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions for responsive design
  const isSmallScreen = currentBreakpoint === 'sm';
  const isMediumScreen = currentBreakpoint === 'md';
  const isLargeScreen = ['lg', 'xl', '2xl'].includes(currentBreakpoint);
  const isMobile = ['sm', 'md'].includes(currentBreakpoint);
  const isDesktop = ['lg', 'xl', '2xl'].includes(currentBreakpoint);

  // Responsive grid columns
  const getGridColumns = (sm: number = 1, md: number = 2, lg: number = 3) => {
    if (isSmallScreen) return sm;
    if (isMediumScreen) return md;
    return lg;
  };

  // Responsive spacing
  const getSpacing = (mobile: number = 4, desktop: number = 8) => {
    return isMobile ? mobile : desktop;
  };

  // Responsive font sizes
  const getFontSize = (mobile: string = 'text-base', desktop: string = 'text-lg') => {
    return isMobile ? mobile : desktop;
  };

  return {
    screenSize,
    currentBreakpoint,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isMobile,
    isDesktop,
    getGridColumns,
    getSpacing,
    getFontSize,
  };
};