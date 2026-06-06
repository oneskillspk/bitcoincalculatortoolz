import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check } from "lucide-react";
import type { PercentileResult } from "@/services/wealthPercentileService";
import { btcToSats } from "@/services/wealthPercentileService";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildExportFilename } from "@/utils/exportFilename";

interface Props {
  result: PercentileResult;
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

function drawSnapshot(ctx: CanvasRenderingContext2D, result: PercentileResult) {
  const sats = btcToSats(result.btcAmount);
  const tierColor = result.tier.color || "#f7931a";

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0a0a0a");
  bg.addColorStop(0.5, "#111827");
  bg.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const radial = ctx.createRadialGradient(W * 0.5, H * 0.35, 80, W * 0.5, H * 0.35, 400);
  radial.addColorStop(0, `${tierColor}20`);
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
  ctx.fillText("₿", 62, 71);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 24px system-ui, -apple-system, sans-serif";
  ctx.fillText("Bitcoin Calculator Tools", 100, 64);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "400 16px system-ui, -apple-system, sans-serif";
  ctx.fillText("Wealth Percentile", 100, 88);

  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  ctx.font = "500 14px system-ui, -apple-system, sans-serif";
  const dateW = ctx.measureText(dateStr).width + 28;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, W - dateW - 60, 56, dateW, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(dateStr, W - dateW - 46, 72);

  ctx.textAlign = "center";
  ctx.font = "160px system-ui, -apple-system, sans-serif";
  ctx.fillText(result.tier.tierEmoji, W / 2, 240);

  ctx.fillStyle = tierColor;
  ctx.font = "bold 48px system-ui, -apple-system, sans-serif";
  ctx.fillText(result.tier.tierName, W / 2, 310);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 140px system-ui, -apple-system, sans-serif";
  const pctStr = `${result.percentile.toFixed(1)}%`;
  ctx.fillText(pctStr, W / 2, 450);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("Wealth Percentile", W / 2, 485);

  const cardY = 520;
  const cardH = 80;
  const gap = 20;
  const cardW = (W - 120 - gap * 2) / 3;

  const cards = [
    { label: "BTC Holdings", value: `${result.btcAmount.toFixed(4)} BTC`, sub: `${sats.toLocaleString(getCurrentIntlLocale())} sats`, color: "#ffffff" },
    { label: "Supply Share", value: `${result.supplyPercentage.toFixed(4)}%`, sub: "of total supply", color: tierColor },
    { label: "Addresses Above", value: `${result.addressesAbove.toLocaleString(getCurrentIntlLocale())}`, sub: "with less BTC", color: "#ffffff" },
  ];

  cards.forEach((card, i) => {
    const x = 60 + i * (cardW + gap);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    roundRect(ctx, x, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#9ca3af";
    ctx.font = "500 14px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(card.label, x + 16, cardY + 24);

    ctx.fillStyle = card.color;
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    ctx.fillText(card.value, x + 16, cardY + 52);

    ctx.fillStyle = "#6b7280";
    ctx.font = "400 12px system-ui, -apple-system, sans-serif";
    ctx.fillText(card.sub, x + 16, cardY + 70);
  });

  ctx.fillStyle = "#6b7280";
  ctx.font = "400 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("bitcoincalculator.tools/calculators/wealth-percentile", 60, H - 30);

  ctx.textAlign = "right";
  ctx.fillText("On-chain data: BitInfoCharts 2026", W - 60, H - 30);
  ctx.textAlign = "left";
}

export const WealthShareSnapshot = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [copied, setCopied] = useState(false);

  const buildCanvas = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    drawSnapshot(ctx, result);
    return canvas;
  }, [result]);

  const handleDownload = useCallback(() => {
    const canvas = buildCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = buildExportFilename({ en: 'bitcoin-wealth', tr: 'bitcoin-servet' }, 'png', language, { extra: result.tier.tierName.toLowerCase() });
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [buildCanvas, result]);

  const handleShare = useCallback(async () => {
    const canvas = buildCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "bitcoin-wealth-snapshot.png", { type: "image/png" });
      const shareText = tr
        ? `${result.tier.tierEmoji} ${result.tier.tierName} olarak ${result.btcAmount} BTC ile tüm Bitcoin sahiplerinin %${result.percentile.toFixed(1)} servet diliminindeyim. Siz neredesiniz?`
        : `I'm in the ${result.percentile.toFixed(1)}% wealth percentile as a ${result.tier.tierEmoji} ${result.tier.tierName} with ${result.btcAmount} BTC. What's your rank?`;

      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        try {
          await navAny.share({
            files: [file],
            title: tr ? "Bitcoin Servet Dilimim" : "My Bitcoin Wealth Percentile",
            text: shareText,
          });
          return;
        } catch {
          // user cancelled or share failed, fall through to download
        }
      }
      const link = document.createElement("a");
      link.download = buildExportFilename({ en: 'bitcoin-wealth', tr: 'bitcoin-servet' }, 'png', language, { extra: result.tier.tierName.toLowerCase() });
      link.href = canvas.toDataURL("image/png");
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, "image/png");
  }, [buildCanvas, result, tr]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between bg-muted/30 rounded-lg p-4 border border-border/20">
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-0.5">
          {tr ? 'Servet anlık görüntünü paylaş' : 'Share your wealth snapshot'}
        </p>
        <p>{tr ? 'Kademeni, dilimini ve satoshi sayını içeren 1200×630 PNG oluşturur.' : 'Generates a 1200×630 PNG with your tier, percentile, and satoshi count.'}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleShare} size="sm" variant="default" className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? (tr ? 'Kaydedildi' : 'Saved') : (tr ? 'Anlık Görüntüyü Paylaş' : 'Share Snapshot')}
        </Button>
        <Button onClick={handleDownload} size="sm" variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          PNG
        </Button>
      </div>
    </div>
  );
};
