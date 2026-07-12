import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';
import { ShareExportPanel } from '@/components/share-export';
import { LoanResult } from '@/services/bitcoinLoanCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatSymbolAmount } from '@/utils/numberFormat';

interface Props {
  results: LoanResult;
}

export const BitcoinLoanShareCard = ({ results }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const pageUrl = 'https://bitcoincalculator.tools/calculators/bitcoin-loan';

  const fmt = (n: number) => formatSymbolAmount(n, '$', 0, tr ? 'tr-TR' : 'en-US');

  const shareText = tr
    ? `🏦 Bitcoin kredi analizi: %${results.currentLtv.toFixed(1)} LTV | ${fmt(results.liquidationPrice)} likidasyon | Borçlanmak ${results.netBorrowAdvantage >= 0 ? 'satmaya göre' : 'satmaktan'} ${fmt(Math.abs(results.netBorrowAdvantage))} ${results.netBorrowAdvantage >= 0 ? 'tasarrufu sağlıyor' : 'daha pahalı'}\n\nKendini hesapla 👇\n${pageUrl}`
    : `🏦 Bitcoin loan analysis: ${results.currentLtv.toFixed(1)}% LTV | Liquidation at ${fmt(results.liquidationPrice)} | Borrow ${results.netBorrowAdvantage >= 0 ? 'saves' : 'costs'} ${fmt(Math.abs(results.netBorrowAdvantage))} vs selling\n\nCalculate yours 👇\n${pageUrl}`;

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
