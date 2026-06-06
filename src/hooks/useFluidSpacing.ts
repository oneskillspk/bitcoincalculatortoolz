import { useResponsiveDesign } from './useResponsiveDesign';

export const useFluidSpacing = () => {
  const { currentBreakpoint, isMobile } = useResponsiveDesign();

  // Fluid spacing scale using CSS clamp for better responsive design
  const getFluidSpacing = (mobile: number, desktop: number) => {
    // Use CSS clamp for smooth scaling between breakpoints
    const min = mobile;
    const max = desktop;
    const preferred = mobile + (desktop - mobile) * 0.5;
    
    return `clamp(${min}rem, ${preferred}vw, ${max}rem)`;
  };

  // Touch-friendly minimum sizes
  const getTouchTargetSize = (size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizes = {
      small: isMobile ? '36px' : '32px',
      medium: isMobile ? '44px' : '40px',
      large: isMobile ? '48px' : '44px'
    };
    return sizes[size];
  };

  // Responsive font sizing with better scaling
  const getFluidFontSize = (
    mobile: string = 'text-sm',
    tablet: string = 'text-base', 
    desktop: string = 'text-lg'
  ) => {
    switch (currentBreakpoint) {
      case 'sm':
        return mobile;
      case 'md':
        return tablet;
      case 'lg':
      case 'xl':
      case '2xl':
      default:
        return desktop;
    }
  };

  // Container spacing that adapts to content density
  const getContainerSpacing = (density: 'compact' | 'comfortable' | 'spacious' = 'comfortable') => {
    const spacingMap = {
      compact: { mobile: 2, desktop: 4 },
      comfortable: { mobile: 4, desktop: 6 },
      spacious: { mobile: 6, desktop: 8 }
    };
    
    const { mobile, desktop } = spacingMap[density];
    return isMobile ? mobile : desktop;
  };

  return {
    getFluidSpacing,
    getTouchTargetSize,
    getFluidFontSize,
    getContainerSpacing,
    isMobile,
    currentBreakpoint
  };
};