import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface TooltipInfoProps {
  content: string;
  className?: string;
  triggerClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const TooltipInfo = ({ 
  content, 
  className, 
  triggerClassName,
  side = 'top' 
}: TooltipInfoProps) => {
  const { t } = useLanguage();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            type="button"
            className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-help",
              triggerClassName
            )}
            aria-label={t('aria.moreInformation')}
          >
            <HelpCircle className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={cn(
            "max-w-xs text-sm bg-popover/95 backdrop-blur-sm border border-border/50 shadow-lg",
            className
          )}
        >
          <p className="leading-relaxed">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};