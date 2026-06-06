import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShareExportPanel } from '@/components/share-export';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  mode: 'forward' | 'reverse';
  forwardText?: string;
  reverseText?: string;
}

const BASE_URL = 'https://bitcoincalculator.tools/calculators/price-target';

export const PriceTargetShareCard: React.FC<Props> = ({ mode, forwardText, reverseText }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = mode === 'forward'
    ? (forwardText || (tr
        ? `Bitcoin Fiyat Hedefi Hesaplayıcısına göz at — BTC stack'inin ne kadar edebileceğini gör! ${BASE_URL}`
        : `Check out the Bitcoin Price Target Calculator — see what your BTC stack could be worth! ${BASE_URL}`))
    : (reverseText || (tr
        ? `Finansal hedeflerime ulaşmak için ne kadar Bitcoin'e ihtiyacım olduğunu hesaplıyorum. ${BASE_URL}`
        : `I'm calculating how much Bitcoin I need to reach my financial goals. ${BASE_URL}`));

  const encoded = encodeURIComponent(shareText);

  const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
  const shareToLinkedin = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(BASE_URL)}`, '_blank');
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({ title: tr ? 'Kopyalandı!' : 'Copied!', description: tr ? 'Paylaşım metni panoya kopyalandı' : 'Share text copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border/40 bg-card shadow-sm">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" aria-hidden />
          {tr ? 'Sonuçları Paylaş' : 'Share Results'}
        </h3>
        <div className="rounded-lg border border-border/40 bg-muted/30 p-3 text-xs text-foreground leading-relaxed whitespace-pre-line break-words overflow-hidden">
          {shareText}
        </div>
        <ShareExportPanel
          variant="inline"
          actions={[
            { kind: 'twitter', onClick: shareToTwitter },
            { kind: 'linkedin', onClick: shareToLinkedin },
            { kind: 'copy-link', onClick: handleCopy, copied },
          ]}
        />
      </CardContent>
    </Card>
  );
};
