import { useState } from 'react';
import { Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ArticleShareButtonsProps {
  title: string;
  slug: string;
  /**
   * Page locale. Drives the canonical share URL — TR pages must share
   * `/tr/ogrenin/<slug>`, not the EN `/learn/<slug>`. Optional; falls back
   * to the language context for legacy callers.
   */
  language?: 'en' | 'tr';
}

export const ArticleShareButtons = ({ title, slug, language: langProp }: ArticleShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { language: ctxLanguage } = useLanguage();
  const language = langProp ?? ctxLanguage;
  const tr = language === 'tr';
  const url = tr
    ? `https://bitcoincalculator.tools/tr/ogrenin/${slug}`
    : `https://bitcoincalculator.tools/learn/${slug}`;

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: tr ? 'Bağlantı kopyalandı!' : 'Link copied!', duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: tr ? 'Kopyalanamadı' : 'Failed to copy', variant: 'destructive' });
    }
  };

  const btnClass =
    'w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-150';

  return (
    <div className="flex items-center gap-2">
      <button onClick={shareTwitter} className={btnClass} aria-label={tr ? "Twitter'da paylaş" : "Share on Twitter"} title={tr ? "X / Twitter'da Paylaş" : "Share on X / Twitter"}>
        <Twitter className="w-3.5 h-3.5" />
      </button>
      <button onClick={shareLinkedIn} className={btnClass} aria-label={tr ? "LinkedIn'de paylaş" : "Share on LinkedIn"} title={tr ? "LinkedIn'de Paylaş" : "Share on LinkedIn"}>
        <Linkedin className="w-3.5 h-3.5" />
      </button>
      <button onClick={copyLink} className={btnClass} aria-label={tr ? 'Bağlantıyı kopyala' : 'Copy link'} title={tr ? 'Bağlantıyı kopyala' : 'Copy link'}>
        {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Link2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
