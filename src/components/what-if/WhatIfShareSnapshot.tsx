import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, Copy, Check, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CalculationResult } from '@/services/bitcoinApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from '@/utils/formatCurrency';

interface Props {
  result: CalculationResult;
}

type Lang = 'en' | 'tr';

const fmtMoney = (n: number, lang: Lang, currency: string) => {
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  if (n >= 1_000_000) return formatCurrencyAmount(n, currency, { locale, compact: true, decimals: 2 });
  if (n >= 1000) return formatCurrencyAmount(n, currency, { locale, decimals: 0 });
  return formatCurrencyAmount(n, currency, { locale, decimals: 2 });
};

const fmtPct = (n: number) =>
  Math.abs(n) >= 1000
    ? `${n >= 0 ? '+' : ''}${(n / 100).toFixed(1)}x`
    : `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

const formatStartDate = (iso: string, lang: Lang) => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const computeCagr = (result: CalculationResult): number => {
  const start = new Date(result.startDate).getTime();
  const now = Date.now();
  const years = Math.max(0.01, (now - start) / (365.25 * 24 * 60 * 60 * 1000));
  if (result.investmentAmount <= 0) return 0;
  return (Math.pow(result.currentValue / result.investmentAmount, 1 / years) - 1) * 100;
};

const drawSnapshot = (canvas: HTMLCanvasElement, result: CalculationResult, lang: Lang) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = 1200;
  const H = 630;
  canvas.width = W;
  canvas.height = H;

  const tr = lang === 'tr';
  const currency = (result as any).currency || (tr ? 'TRY' : 'USD');

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0a0a0f');
  bg.addColorStop(1, '#1a1530');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.85, H * 0.2, 0, W * 0.85, H * 0.2, 500);
  glow.addColorStop(0, 'rgba(247, 147, 26, 0.35)');
  glow.addColorStop(1, 'rgba(247, 147, 26, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#f7931a';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.fillText('₿ bitcoincalculator.tools', 60, 80);

  ctx.fillStyle = 'rgba(247, 147, 26, 0.15)';
  ctx.strokeStyle = 'rgba(247, 147, 26, 0.4)';
  ctx.lineWidth = 1.5;
  const pillX = 60;
  const pillY = 110;
  const pillW = 260;
  const pillH = 40;
  ctx.beginPath();
  (ctx as any).roundRect(pillX, pillY, pillW, pillH, 20);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f7931a';
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(tr ? 'Ya Olsaydı Hesaplayıcısı' : 'What If Calculator', pillX + 20, pillY + 26);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
  ctx.fillText(tr ? 'Şu kadarım olurdu' : 'I would have had', 60, 230);
  ctx.fillStyle = '#10d97e';
  ctx.font = 'bold 96px system-ui, -apple-system, sans-serif';
  ctx.fillText(fmtMoney(result.currentValue, lang, currency), 60, 330);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '400 28px system-ui, -apple-system, sans-serif';
  const fromLabel = tr
    ? `${formatStartDate(result.startDate, lang)} tarihinde ${fmtMoney(result.investmentAmount, lang, currency)} yatırarak`
    : `from ${fmtMoney(result.investmentAmount, lang, currency)} on ${formatStartDate(result.startDate, lang)}`;
  ctx.fillText(fromLabel, 60, 378);

  const statsY = 440;
  const statW = 340;
  const statH = 130;
  const cagr = computeCagr(result);
  const stats = [
    { label: tr ? 'Toplam ROI' : 'Total ROI', value: fmtPct(result.roiPercentage), color: '#10d97e' },
    { label: tr ? 'Yıllıklandırılmış (CAGR)' : 'Annualized (CAGR)', value: fmtPct(cagr), color: '#10d97e' },
    { label: tr ? 'Biriktirilen BTC' : 'BTC Accumulated', value: result.btcAmount.toFixed(4), color: '#f7931a' },
  ];
  stats.forEach((s, i) => {
    const x = 60 + i * (statW + 20);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    (ctx as any).roundRect(x, statsY, statW, statH, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 18px system-ui, -apple-system, sans-serif';
    ctx.fillText(s.label, x + 24, statsY + 38);
    ctx.fillStyle = s.color;
    ctx.font = 'bold 38px system-ui, -apple-system, sans-serif';
    ctx.fillText(s.value, x + 24, statsY + 90);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '500 18px system-ui, -apple-system, sans-serif';
  const url = tr
    ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ya-olsaydi'
    : 'bitcoincalculator.tools/calculators/what-if';
  ctx.fillText(url, 60, 605);
  const dateStr = new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, W - 60, 605);
  ctx.textAlign = 'left';
};

const buildShareText = (result: CalculationResult, lang: Lang): string => {
  const cagr = computeCagr(result);
  const tr = lang === 'tr';
  const currency = (result as any).currency || (tr ? 'TRY' : 'USD');
  const url = tr
    ? 'bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-ya-olsaydi'
    : 'bitcoincalculator.tools/calculators/what-if';
  if (tr) {
    return `${formatStartDate(result.startDate, lang)} tarihinde ${fmtMoney(result.investmentAmount, lang, currency)} BTC alınsaydı → bugün ${fmtMoney(result.currentValue, lang, currency)} (${fmtPct(result.roiPercentage)}, CAGR ${fmtPct(cagr)}) — ${url}`;
  }
  return `${fmtMoney(result.investmentAmount, lang, currency)} in BTC on ${formatStartDate(result.startDate, lang)} → ${fmtMoney(result.currentValue, lang, currency)} today (${fmtPct(result.roiPercentage)}, ${fmtPct(cagr)} CAGR) — ${url}`;
};

export const WhatIfShareSnapshot: React.FC<Props> = ({ result }) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const lang: Lang = tr ? 'tr' : 'en';

  useEffect(() => {
    if (canvasRef.current) drawSnapshot(canvasRef.current, result, lang);
  }, [result, lang]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bitcoin-what-if-${result.startDate}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: tr ? 'PNG indirildi' : 'PNG downloaded',
        description: tr ? 'Anlık görüntü cihazınıza kaydedildi.' : 'Snapshot saved to your device.',
      });
    });
  };

  const sharePng = async () => {
    if (!canvasRef.current) {
      downloadPng();
      return;
    }
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `bitcoin-what-if-${result.startDate}.png`, { type: 'image/png' });
      const shareText = buildShareText(result, lang);
      // @ts-ignore canShare optional
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        try {
          await navigator.share({
            title: tr ? 'Bitcoin Ya Alsaydım Hesabım' : 'My Bitcoin What-If',
            text: shareText,
            files: [file],
          });
          return;
        } catch {
          // fallthrough to download
        }
      }
      downloadPng();
    });
  };

  const copyShareText = async () => {
    const text = buildShareText(result, lang);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: tr ? 'Panoya kopyalandı' : 'Copied to clipboard',
        description: tr ? 'Paylaşımınıza yapıştırın.' : 'Paste it into your post.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: tr ? 'Kopyalama başarısız' : 'Copy failed',
        description: tr ? 'Tekrar deneyin veya PNG paylaşın.' : 'Try again or share the PNG.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{tr ? 'Anlık Görüntü Paylaş' : 'Share Snapshot'}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {tr
                ? 'Yatırım tarihiniz, ROI\'niz ve biriktirilen BTC ile 1200×630 PNG.'
                : '1200×630 PNG with your investment date, ROI, and BTC accumulated.'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl overflow-hidden bg-card ring-1 ring-border/60">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
            style={{ aspectRatio: '1200 / 630' }}
            aria-label={tr ? 'Bitcoin Ya Alsaydım sonucunuzun paylaşılabilir anlık görüntüsü' : 'Shareable snapshot of your Bitcoin What-If result'}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button onClick={sharePng} className="min-h-[44px]" variant="default">
            <Share2 className="w-4 h-4 mr-2" />
            {tr ? 'Anlık Görüntü Paylaş' : 'Share Snapshot'}
          </Button>
          <Button onClick={downloadPng} className="min-h-[44px]" variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            {tr ? 'PNG İndir' : 'Download PNG'}
          </Button>
          <Button onClick={copyShareText} className="min-h-[44px]" variant="outline">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? (tr ? 'Kopyalandı' : 'Copied') : (tr ? 'Metni kopyala' : 'Copy share text')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatIfShareSnapshot;
