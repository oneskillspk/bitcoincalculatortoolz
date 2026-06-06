import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { composeShareText, type ShareParams } from '@/utils/shareLink';

/**
 * Canonical clipboard / share-link hook. Used by both ShareExportPanel and the
 * legacy CopyShareLinkButton shim. Lifts the toast + "Copied!" state machine
 * out of every individual share component.
 */
export interface UseShareExportArgs {
  slug: string;
  headline: string;
  params: ShareParams;
}

export const useShareExport = ({ slug, headline, params }: UseShareExportArgs) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    if (copied) return;
    const { text, url } = composeShareText({ headline, slug, params });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: tr ? 'Paylaşım bağlantısı kopyalandı' : 'Share link copied',
        description: tr
          ? 'Yapıştır — girdilerin önceden dolu hâlde açılır.'
          : 'Paste anywhere — opens with your inputs prefilled.',
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
  }, [copied, headline, slug, params, toast, tr]);

  return { copied, copyLink };
};
