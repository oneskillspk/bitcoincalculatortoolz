import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { composeShareText, type ShareParams } from '@/utils/shareLink';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface CopyShareLinkButtonProps {
  slug: string;
  headline: string;
  params: ShareParams;
  label?: string;
  variant?: 'ghost' | 'pill';
  className?: string;
}

export const CopyShareLinkButton = ({
  slug,
  headline,
  params,
  label,
  variant = 'ghost',
  className,
}: CopyShareLinkButtonProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const resolvedLabel = label ?? (tr ? 'Paylaşım bağlantısını kopyala' : 'Copy share link');

  const handleCopy = async () => {
    if (copied) return;
    const { text, url } = composeShareText({ headline, slug, params });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: tr ? 'Paylaşım bağlantısı kopyalandı' : 'Share link copied',
        description: tr ? 'Yapıştır — girdilerin önceden dolu hâlde açılır.' : 'Paste anywhere — opens with your inputs prefilled.',
      });
      setTimeout(() => setCopied(false), 1600);
      if (typeof window !== 'undefined') {
        (window as unknown as { __lastShareUrl?: string }).__lastShareUrl = url;
      }
    } catch {
      toast({
        title: tr ? 'Kopyalanamadı' : 'Could not copy',
        description: tr ? 'Tarayıcın pano erişimini engelledi.' : 'Your browser blocked clipboard access.',
        variant: 'destructive',
      });
    }
  };

  const renderInner = (iconSize: string, labelClass: string) => (
    <>
      <span className="relative inline-flex w-3.5 h-3.5 items-center justify-center shrink-0">
        <Link2
          className={cn(
            iconSize,
            'absolute inset-0 transition-all duration-200',
            copied ? 'opacity-0 scale-75' : 'opacity-100 scale-100',
          )}
          aria-hidden="true"
        />
        <Check
          className={cn(
            iconSize,
            'absolute inset-0 text-primary transition-all duration-200',
            copied ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
          )}
          aria-hidden="true"
        />
      </span>
      <span className={cn('hidden sm:inline truncate transition-opacity duration-200', labelClass)}>
        {copied ? (tr ? 'Kopyalandı!' : 'Copied!') : resolvedLabel}
      </span>
    </>
  );

  if (variant === 'pill') {
    return (
      <Button
        onClick={handleCopy}
        disabled={copied}
        aria-disabled={copied}
        data-copied={copied}
        size="sm"
        variant="outline"
        aria-label={resolvedLabel}
        aria-live="polite"
        title={resolvedLabel}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 text-xs font-medium',
          'h-9 px-3 sm:px-4 rounded-full',
          'min-w-[40px] sm:min-w-[148px]',
          'border-border/60 hover:border-primary/40 hover:bg-primary/5',
          'transition-colors shrink-0',
          'disabled:opacity-100 disabled:cursor-default',
          'data-[copied=true]:border-primary/50 data-[copied=true]:bg-primary/5',
          className,
        )}
      >
        {renderInner('w-3.5 h-3.5', '')}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleCopy}
      disabled={copied}
      aria-disabled={copied}
      data-copied={copied}
      size="sm"
      variant="ghost"
      aria-label={resolvedLabel}
      aria-live="polite"
      title={resolvedLabel}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 text-xs',
        'h-8 px-2 sm:px-3 rounded-lg hover:bg-primary/10',
        'min-w-[32px] sm:min-w-[118px] shrink-0',
        'transition-colors',
        'disabled:opacity-100 disabled:cursor-default',
        'data-[copied=true]:bg-primary/5',
        className,
      )}
    >
      {renderInner('w-3.5 h-3.5 text-muted-foreground', '')}
    </Button>
  );
};
