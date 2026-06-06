import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'clean' | 'subtle' | 'minimal';
}

export const PageBackground = ({ 
  children, 
  className, 
  variant = 'clean' 
}: PageBackgroundProps) => {
  const backgroundStyles = {
    clean: "bg-background",
    subtle: "bg-gradient-to-b from-background to-muted/20",
    minimal: "bg-background",
  };

  return (
    <div 
      className={cn("min-h-screen w-full", backgroundStyles[variant], className)}
    >
      {children}
    </div>
  );
};