import { brand } from '@/lib/brandColors';
import { useCallback, useState } from 'react';
import { ShareExportPanel } from '@/components/share-export';
import type { AccumulationResult } from '@/services/accumulationScoreService';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';

interface Props {
  result: AccumulationResult;
  age: number;
}

const W = 1200;
const H = 630;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawSnapshot(ctx: CanvasRenderingContext2D, result: AccumulationResult, age: number) {
  const gradeColor = result.grade.grade.startsWith('A') ? '#10b981'
    : result.grade.grade.startsWith('B') ? '#3b82f6'
    : result.grade.grade.startsWith('C') ? '#f59e0b'
    : result.grade.grade.startsWith('D') ? brand.ember
    : '#ef4444';

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0a0a0a');
  bg.addColorStop(0.5, '#111827');
  bg.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const radial = ctx.createRadialGradient(W * 0.5, H * 0.35, 80, W * 0.5, H * 0.35, 400);
  radial.addColorStop(0, `${gradeColor}20`);
  radial.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#f7931a';
  ctx.beginPath();
  ctx.arc(70, 70, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('₿', 62, 71);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('Bitcoin Calculator Tools', 100, 64);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '400 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('Accumulation Score', 100, 88);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  ctx.font = '500 14px system-ui, -apple-system, sans-serif';
  const dateW = ctx.measureText(dateStr).width + 28;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, W - dateW - 60, 56, dateW, 32, 16);
  ctx.fill();
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText(dateStr, W - dateW - 46, 72);

  ctx.textAlign = 'center';
  ctx.font = '160px system-ui, -apple-system, sans-serif';
  ctx.fillText(result.grade.emoji, W / 2, 240);

  ctx.fillStyle = gradeColor;
  ctx.font = 'bold 80px system-ui, -apple-system, sans-serif';
  ctx.fillText(result.grade.grade, W / 2, 340);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(result.grade.label, W / 2, 400);

  const pctStr = `${Math.min(100, Math.round(result.ratio * 100))}%`;
  ctx.fillStyle = gradeColor;
  ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
  ctx.fillText(pctStr, W / 2, 480);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '500 22px system-ui, -apple-system, sans-serif';
  ctx.fillText('Progress to Target', W / 2, 510);

  const cardY = 540;
  const cardH = 80;
  const gap = 20;
  const cardW = (W - 120 - gap * 2) / 3;

  const cards = [
    { label: 'Age', value: String(age), sub: result.phase.name, color: '#ffffff' },
    { label: 'Target', value: `${result.targetBtc.toFixed(4)} BTC`, sub: 'lifecycle target', color: gradeColor },
    { label: 'Grade Status', value: result.grade.grade, sub: result.grade.label, color: gradeColor },
  ];

  cards.forEach((card, i) => {
    const x = 60 + i * (cardW + gap);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    roundRect(ctx, x, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#9ca3af';
    ctx.font = '500 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(card.label, x + 16, cardY + 24);

    ctx.fillStyle = card.color;
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(card.value, x + 16, cardY + 52);

    ctx.fillStyle = '#6b7280';
    ctx.font = '400 12px system-ui, -apple-system, sans-serif';
    ctx.fillText(card.sub, x + 16, cardY + 70);
  });

  ctx.fillStyle = '#6b7280';
  ctx.font = '400 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('bitcoincalculator.tools/calculators/bitcoin-accumulation-score', 60, H - 30);

  ctx.textAlign = 'right';
  ctx.fillText('Bitcoin Lifecycle Model 2026', W - 60, H - 30);
  ctx.textAlign = 'left';
}

export const AccumulationShareCard = ({ result, age }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [copied, setCopied] = useState(false);

  const buildCanvas = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    drawSnapshot(ctx, result, age);
    return canvas;
  }, [result, age]);

  const handleDownload = useCallback(() => {
    const canvas = buildCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = buildExportFilename({ en: 'bitcoin-accumulation', tr: 'bitcoin-birikim' }, 'png', language, { extra: result.grade.grade.toLowerCase() });
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [buildCanvas, result]);

  const handleShare = useCallback(async () => {
    const canvas = buildCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'bitcoin-accumulation-snapshot.png', { type: 'image/png' });
      const shareText = tr
        ? `${age} yaşında Bitcoin Birikim Puanımda ${result.grade.grade} (${result.grade.label}) aldım! Hedefe ilerleme: %${Math.min(100, Math.round(result.ratio * 100))}. Sizin notunuz nedir?`
        : `I scored ${result.grade.grade} (${result.grade.label}) on the Bitcoin Accumulation Score at age ${age}! Progress: ${Math.min(100, Math.round(result.ratio * 100))}% to target. What's your grade?`;

      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        try {
          await navAny.share({
            files: [file],
            title: tr ? 'Bitcoin Birikim Puanım' : 'My Bitcoin Accumulation Score',
            text: shareText,
          });
          return;
        } catch {
          // User cancelled or share failed, fall through to download
        }
      }
      const link = document.createElement('a');
      link.download = buildExportFilename({ en: 'bitcoin-accumulation', tr: 'bitcoin-birikim' }, 'png', language, { extra: result.grade.grade.toLowerCase() });
      link.href = canvas.toDataURL('image/png');
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, 'image/png');
  }, [buildCanvas, result, age, tr]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-card border border-border/40 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="text-xs text-muted-foreground">
        <p className="font-semibold text-foreground text-sm mb-0.5">
          {tr ? 'Birikim puanınızı paylaşın' : 'Share your accumulation score'}
        </p>
        <p>{tr ? 'Notunuzu, ilerlemenizi ve yaşam döngüsü aşamanızı içeren 1200×630 PNG oluşturur.' : 'Generates a 1200×630 PNG with your grade, progress, and lifecycle phase.'}</p>
      </div>
      <ShareExportPanel
        variant="inline"
        actions={[
          { kind: 'png', onClick: handleShare, copied, tone: 'primary' },
          { kind: 'png', onClick: handleDownload, label: tr ? 'PNG indir' : 'Download PNG' },
        ]}
      />
    </div>
  );
};
