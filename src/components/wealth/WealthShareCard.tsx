import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Share2, Lock } from 'lucide-react';
import { ShareExportPanel } from '@/components/share-export';
import { PercentileResult, formatPercentile } from '@/services/wealthPercentileService';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useLanguage } from '@/contexts/LanguageContext';

interface WealthShareCardProps {
  result: PercentileResult;
}

export const WealthShareCard: React.FC<WealthShareCardProps> = ({ result }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { toast } = useToast();
  const { price: btcPrice } = useLiveBitcoinPrice();
  const [includeAmount, setIncludeAmount] = useState(false);
  const [includeFiat, setIncludeFiat] = useState(false);
  const [includeTier, setIncludeTier] = useState(true);

  if (result.btcAmount <= 0) return null;

  const generateShareText = () => {
    let text = tr
      ? `Dünya genelindeki tüm Bitcoin sahiplerinin %${formatPercentile(result.percentile)}'inden fazla Bitcoin'e sahibim!`
      : `I own more Bitcoin than ${formatPercentile(result.percentile)} of all holders worldwide!`;

    if (includeTier) {
      text += ` ${result.tier.tierEmoji} ${result.tier.tierName}${tr ? ' kademesi.' : ' tier.'}`;
    }

    if (includeAmount) {
      text += ` (${result.btcAmount.toFixed(4)} BTC)`;
    }

    if (includeFiat && btcPrice > 0) {
      text += tr
        ? ` Değeri: $${(result.btcAmount * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}.`
        : ` Worth $${(result.btcAmount * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}.`;
    }

    text += tr
      ? '\n\nBitcoin servet dilimini öğren:'
      : '\n\nCheck your Bitcoin wealth percentile:';
    text += '\nhttps://bitcoincalculator.tools/calculators/wealth-percentile';
    text += '\n\n#Bitcoin #BTC #Crypto';

    return text;
  };

  const shareText = generateShareText();

  const shareToTwitter = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent('https://bitcoincalculator.tools/calculators/wealth-percentile');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent('https://bitcoincalculator.tools/calculators/wealth-percentile');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast({ title: tr ? 'Kopyalandı!' : 'Copied!', description: tr ? 'Paylaşım metni panoya kopyalandı.' : 'Share text copied to clipboard.' });
    } catch {
      toast({ title: tr ? 'Kopyalama başarısız' : 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <Card className="border-border/30 bg-card">
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-base">{tr ? 'Sonucunu Paylaş' : 'Share Your Result'}</h3>
        </div>

        <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span className="font-medium uppercase tracking-wider">{tr ? 'Gizlilik Kontrolleri' : 'Privacy Controls'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="share-tier" className="text-xs">{tr ? 'Kademe adını dahil et' : 'Include tier name'}</Label>
              <Switch id="share-tier" checked={includeTier} onCheckedChange={setIncludeTier} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="share-amount" className="text-xs">{tr ? 'BTC miktarını dahil et' : 'Include BTC amount'}</Label>
              <Switch id="share-amount" checked={includeAmount} onCheckedChange={setIncludeAmount} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="share-fiat" className="text-xs">{tr ? 'USD değerini dahil et' : 'Include USD value'}</Label>
              <Switch id="share-fiat" checked={includeFiat} onCheckedChange={setIncludeFiat} />
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground whitespace-pre-wrap border border-border/10">
          {shareText}
        </div>

        <ShareExportPanel
          variant="inline"
          actions={[
            { kind: 'twitter', onClick: shareToTwitter },
            { kind: 'linkedin', onClick: shareToLinkedIn },
            { kind: 'copy-link', onClick: copyToClipboard },
          ]}
        />
      </CardContent>
    </Card>
  );
};
