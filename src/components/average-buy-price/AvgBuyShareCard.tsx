import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';
import { ShareExportPanel } from '@/components/share-export';
import { AvgBuyResult } from '@/services/averageBuyPriceCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatSymbolAmount } from '@/utils/numberFormat';

interface Props {
  result: AvgBuyResult | null;
}

export const AvgBuyShareCard = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const pageUrl = 'https://bitcoincalculator.tools/calculators/average-buy-price';

  if (!result) return null;

  const fmt = (n: number) => tr
    ? formatSymbolAmount(n, '₺', 0, 'tr-TR')
    : formatSymbolAmount(n, '$', 0, 'en-US');
  const shareText = tr
    ? `📊 Bitcoin ortalama alış fiyatım: ${fmt(result.weightedAvgPrice)} | ${result.totalBtc.toFixed(4)} BTC tutuyorum | ROI: ${result.roiPercent >= 0 ? '+' : ''}${result.roiPercent.toFixed(1)}%\n\nSizinkini hesaplayın 👇\n${pageUrl}`
    : `📊 My Bitcoin average buy price: ${fmt(result.weightedAvgPrice)} | Holding ${result.totalBtc.toFixed(4)} BTC | ROI: ${result.roiPercent >= 0 ? '+' : ''}${result.roiPercent.toFixed(1)}%\n\nCalculate yours 👇\n${pageUrl}`;

  const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  const shareToLinkedin = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank');
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({ title: tr ? 'Kopyalandı!' : 'Copied!', description: tr ? 'Paylaşım metni panoya kopyalandı' : 'Share text copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch { toast({ title: tr ? 'Hata' : 'Error', variant: 'destructive' }); }
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
            { kind: 'copy-link', onClick: copyLink, copied },
          ]}
        />
      </CardContent>
    </Card>
  );
};
