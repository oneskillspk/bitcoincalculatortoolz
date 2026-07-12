import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';
import { ShareExportPanel } from '@/components/share-export';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';

interface Props {
  currentBtcPrice: number;
  currentValue: number;
}

export const PizzaShareCard = ({ currentBtcPrice, currentValue }: Props) => {
  const { language, t } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const pageUrl = 'https://bitcoincalculator.tools/calculators/pizza-day';

  const formatLarge = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    return `$${formatGroupedInt(n, tr ? 'tr-TR' : 'en-US')}`;
  };

  const multiplier = formatGroupedInt(Math.round(currentValue / 41), tr ? 'tr-TR' : 'en-US');

  const shareText = tr
    ? `🍕 2010'daki 10.000 BTC'lik pizza artık ${formatLarge(currentValue)} değerinde! Bu, 41$'ın ${multiplier}x getirisi.\n\nKendi Bitcoin fırsat maliyetini hesapla 👇\n${pageUrl}`
    : `🍕 The 10,000 BTC pizza from 2010 is now worth ${formatLarge(currentValue)}! That's a ${multiplier}x return on $41.\n\nCalculate your own Bitcoin opportunity cost 👇\n${pageUrl}`;

  const shareToTwitter = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToLinkedin = () => {
    const url = encodeURIComponent(pageUrl);
    const title = encodeURIComponent(
      tr ? `Bitcoin Pizza Günü: 2 Pizza İçin ${formatLarge(currentValue)}` : `Bitcoin Pizza Day: ${formatLarge(currentValue)} for 2 Pizzas`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  };

  const shareToReddit = () => {
    const title = encodeURIComponent(
      tr ? `10.000 BTC'lik pizza artık ${formatLarge(currentValue)} değerinde` : `The 10,000 BTC pizza is now worth ${formatLarge(currentValue)}`
    );
    const url = encodeURIComponent(pageUrl);
    window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({ title: tr ? 'Kopyalandı!' : 'Copied!', description: tr ? 'Paylaşım metni panoya kopyalandı' : 'Share text copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: tr ? 'Hata' : 'Error', description: tr ? 'Kopyalama başarısız' : 'Failed to copy', variant: 'destructive' });
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tr ? 'Bitcoin Pizza Günü Hesaplayıcısı' : 'Bitcoin Pizza Day Calculator',
          text: tr ? `2010'daki 10.000 BTC'lik pizza artık ${formatLarge(currentValue)} değerinde!` : `The 10,000 BTC pizza from 2010 is now worth ${formatLarge(currentValue)}!`,
          url: pageUrl,
        });
      } catch { /* user cancelled */ }
    }
  };

  return (
    <Card className="border-border/40 bg-card shadow-sm">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" aria-hidden />
            {tr ? 'Bu Hesaplamayı Paylaş' : 'Share This Calculation'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {tr ? 'Arkadaşlarını pizza matematiğiyle şaşırt 🍕' : "Blow your friends' minds with the pizza math 🍕"}
          </p>
        </div>
        <div className="rounded-lg border border-border/40 bg-muted/30 p-3 text-xs text-foreground leading-relaxed whitespace-pre-line break-words overflow-hidden">
          {shareText}
        </div>
        <ShareExportPanel
          variant="inline"
          actions={[
            { kind: 'twitter', onClick: shareToTwitter },
            { kind: 'linkedin', onClick: shareToLinkedin },
            { kind: 'copy-link', onClick: copyLink, copied },
          ]}
        />
      </CardContent>
    </Card>
  );
};
