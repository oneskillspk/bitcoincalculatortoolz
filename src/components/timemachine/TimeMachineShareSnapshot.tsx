import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check } from "lucide-react";
import type { TimeMachineResult } from "@/services/timeMachineService";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { buildExportFilename } from "@/utils/exportFilename";

interface Props {
  result: TimeMachineResult;
  dateLabel: string;
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

function makeFmtCurrency(tr: boolean, fxRate: number) {
  return (usd: number): string => {
    const v = tr ? usd * fxRate : usd;
    const sym = tr ? "₺" : "$";
    if (v >= 1_000_000_000) return `${sym}${(v / 1_000_000_000).toFixed(2)}B`;
    if (v >= 1_000_000) return `${sym}${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `${sym}${(v / 1_000).toFixed(1)}K`;
    return `${sym}${v.toFixed(0)}`;
  };
}

function drawSnapshot(ctx: CanvasRenderingContext2D, result: TimeMachineResult, dateLabel: string, fmtCurrency: (v: number) => string, tr: boolean, fxRate: number) {
  const isPositive = result.roi >= 0;
  const accent = isPositive ? "#10b981" : "#ef4444";

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0a0a0a");
  bg.addColorStop(0.5, "#111827");
  bg.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const radial = ctx.createRadialGradient(W * 0.85, H * 0.15, 50, W * 0.85, H * 0.15, 700);
  radial.addColorStop(0, "#f7931a44");
  radial.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#f7931a";
  ctx.beginPath();
  ctx.arc(70, 70, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText("₿", 62, 71);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 24px system-ui, -apple-system, sans-serif";
  ctx.fillText("Bitcoin Calculator Tools", 100, 64);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "400 16px system-ui, -apple-system, sans-serif";
  ctx.fillText("Bitcoin Time Machine", 100, 88);

  ctx.font = "500 14px system-ui, -apple-system, sans-serif";
  const dateW = ctx.measureText(dateLabel).width + 28;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, W - dateW - 60, 56, dateW, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(dateLabel, W - dateW - 46, 72);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${tr ? 'Yatırım' : 'If you invested'} ${fmtCurrency(result.investment)}${tr ? '' : ' on'}`, 60, 170);
  ctx.fillStyle = "#f7931a";
  ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
  ctx.fillText(dateLabel, 60, 220);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 20px system-ui, -apple-system, sans-serif";
  ctx.fillText("It would be worth today", 60, 290);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 96px system-ui, -apple-system, sans-serif";
  ctx.fillText(fmtCurrency(result.currentValue), 60, 380);

  const roiText = `${isPositive ? "+" : ""}${result.roi.toFixed(1)}% ROI`;
  ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
  const roiW = ctx.measureText(roiText).width + 40;
  ctx.fillStyle = `${accent}22`;
  roundRect(ctx, 60, 410, roiW, 48, 24);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  roundRect(ctx, 60, 410, roiW, 48, 24);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.fillText(roiText, 80, 442);

  const cards = [
    { label: tr ? "Satın Alınan BTC" : "BTC Purchased", value: `${result.btcAmount.toFixed(4)} BTC` },
    { label: tr ? "O Günkü Fiyat" : "Price Then", value: fmtCurrency(result.priceOnDate) },
    { label: tr ? "Bugünkü Fiyat" : "Price Today", value: fmtCurrency(result.currentPrice) },
  ];
  const cardW = 340;
  const cardH = 90;
  const startX = W - cardW - 60;
  cards.forEach((c, i) => {
    const y = 280 + i * (cardH + 14);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(ctx, startX, y, cardW, cardH, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    roundRect(ctx, startX, y, cardW, cardH, 16);
    ctx.stroke();

    ctx.fillStyle = "#9ca3af";
    ctx.font = "500 14px system-ui, -apple-system, sans-serif";
    ctx.fillText(c.label, startX + 20, y + 32);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.fillText(c.value, startX + 20, y + 68);
  });

  ctx.fillStyle = "#6b7280";
  ctx.font = "400 14px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("bitcoincalculator.tools/calculators/time-machine", 60, H - 30);
  ctx.textAlign = "right";
  ctx.fillText("Source: CoinGecko historical data", W - 60, H - 30);
  ctx.textAlign = "left";
}

export const TimeMachineShareSnapshot = ({ result, dateLabel }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const fmtCurrency = makeFmtCurrency(tr, fxRate);
  const [copied, setCopied] = useState(false);

  const buildCanvas = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    drawSnapshot(ctx, result, dateLabel, fmtCurrency, tr, fxRate);
    return canvas;
  }, [result, dateLabel, fmtCurrency, tr, fxRate]);

  const handleDownload = useCallback(() => {
    const canvas = buildCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = buildExportFilename({ en: 'bitcoin-time-machine', tr: 'bitcoin-zaman-makinesi' }, 'png', language);
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [buildCanvas]);

  const handleShare = useCallback(async () => {
    const canvas = buildCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "bitcoin-time-machine.png", { type: "image/png" });
      const shareText = tr
        ? `${dateLabel} tarihinde Bitcoin'e ${fmtCurrency(result.investment)} yatırsaydım, bugün ${fmtCurrency(result.currentValue)} ederdi (${result.roi >= 0 ? "+" : ""}${result.roi.toFixed(1)}% ROI).`
        : `If I'd invested ${fmtCurrency(result.investment)} in Bitcoin on ${dateLabel}, it would be worth ${fmtCurrency(result.currentValue)} today (${result.roi >= 0 ? "+" : ""}${result.roi.toFixed(1)}% ROI).`;

      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        try {
          await navAny.share({
            files: [file],
            title: tr ? "Bitcoin Zaman Makinesi" : "Bitcoin Time Machine",
            text: shareText,
          });
          return;
        } catch {
          // user cancelled
        }
      }
      const link = document.createElement("a");
      link.download = buildExportFilename({ en: 'bitcoin-time-machine', tr: 'bitcoin-zaman-makinesi' }, 'png', language);
      link.href = canvas.toDataURL("image/png");
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, "image/png");
  }, [buildCanvas, result, dateLabel, tr]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-muted/30 rounded-xl p-4 border border-border/20">
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-0.5">
          {tr ? 'Zaman yolculuğu sonucunuzu paylaşın' : 'Share your time-travel result'}
        </p>
        <p>{tr ? 'ROI, yatırım tarihi ve tahmini değeri içeren 1200×630 PNG oluşturur.' : 'Generates a 1200×630 PNG with your ROI, investment date, and projected value.'}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleShare} size="sm" variant="default" className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? (tr ? 'Kaydedildi' : 'Saved') : (tr ? 'Anlık Görüntü Paylaş' : 'Share Snapshot')}
        </Button>
        <Button onClick={handleDownload} size="sm" variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          PNG
        </Button>
      </div>
    </div>
  );
};
