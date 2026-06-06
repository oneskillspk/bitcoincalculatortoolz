import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check } from "lucide-react";
import type { VolatilityData } from "@/services/volatilityService";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildExportFilename } from "@/utils/exportFilename";

interface Props {
  data: VolatilityData;
}

const regimeMeta: Record<VolatilityData["regime"], { label: string; color: string; accent: string }> = {
  low: { label: "Low", color: "#10b981", accent: "Coiled spring" },
  normal: { label: "Normal", color: "#3b82f6", accent: "Steady cadence" },
  high: { label: "High", color: "#f59e0b", accent: "Heated tape" },
  extreme: { label: "Extreme", color: "#ef4444", accent: "Liquidation zone" },
};

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

function drawSnapshot(ctx: CanvasRenderingContext2D, data: VolatilityData) {
  const meta = regimeMeta[data.regime];

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0a0a0a");
  bg.addColorStop(0.5, "#111827");
  bg.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const radial = ctx.createRadialGradient(W * 0.85, H * 0.15, 50, W * 0.85, H * 0.15, 600);
  radial.addColorStop(0, `${meta.color}33`);
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
  ctx.fillText("Volatility Snapshot", 100, 88);

  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  ctx.font = "500 14px system-ui, -apple-system, sans-serif";
  const dateW = ctx.measureText(dateStr).width + 28;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, W - dateW - 60, 56, dateW, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(dateStr, W - dateW - 46, 72);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("BTC 30-Day Realized Volatility", 60, 180);

  ctx.fillStyle = meta.color;
  ctx.font = "bold 200px system-ui, -apple-system, sans-serif";
  const volStr = `${data.vol30d.toFixed(1)}%`;
  ctx.fillText(volStr, 60, 380);

  const volW = ctx.measureText(volStr).width;
  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("annualized", 80 + volW, 380);

  const cardY = 430;
  const cardH = 140;
  const gap = 24;
  const cardW = (W - 120 - gap * 2) / 3;

  const cards = [
    { label: "Regime", value: meta.label, sub: meta.accent, color: meta.color },
    {
      label: "1Y Percentile",
      value: `${data.volatilityPercentile}th`,
      sub: data.volatilityPercentile >= 75 ? "Top quartile" : data.volatilityPercentile <= 25 ? "Bottom quartile" : "Mid range",
      color: "#ffffff",
    },
    {
      label: "Expected Daily Move",
      value: `±${data.expectedDailyMove.toFixed(2)}%`,
      sub: `±$${Math.round((data.currentPrice * data.expectedDailyMove) / 100).toLocaleString()}`,
      color: "#ffffff",
    },
  ];

  cards.forEach((card, i) => {
    const x = 60 + i * (cardW + gap);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    roundRect(ctx, x, cardY, cardW, cardH, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#9ca3af";
    ctx.font = "500 16px system-ui, -apple-system, sans-serif";
    ctx.fillText(card.label, x + 24, cardY + 36);

    ctx.fillStyle = card.color;
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.fillText(card.value, x + 24, cardY + 88);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "400 14px system-ui, -apple-system, sans-serif";
    ctx.fillText(card.sub, x + 24, cardY + 116);
  });

  ctx.fillStyle = "#6b7280";
  ctx.font = "400 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("bitcoincalculator.tools/calculators/volatility", 60, H - 30);

  ctx.textAlign = "right";
  ctx.fillText("Daily closing prices, log returns, annualized x sqrt(365)", W - 60, H - 30);
  ctx.textAlign = "left";
}

export const VolatilityShareSnapshot = ({ data }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [copied, setCopied] = useState(false);

  const buildCanvas = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    drawSnapshot(ctx, data);
    return canvas;
  }, [data]);

  const handleDownload = useCallback(() => {
    const canvas = buildCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = buildExportFilename({ en: 'bitcoin-volatility', tr: 'bitcoin-volatilite' }, 'png', language);
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [buildCanvas]);

  const handleShare = useCallback(async () => {
    const canvas = buildCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "bitcoin-volatility.png", { type: "image/png" });
      const shareText = tr
        ? `BTC 30 günlük oynaklık: %${data.vol30d.toFixed(1)} (${regimeMeta[data.regime].label} rejimi, 1 yılın ${data.volatilityPercentile}. diliminde)`
        : `BTC 30d volatility: ${data.vol30d.toFixed(1)}% (${regimeMeta[data.regime].label} regime, ${data.volatilityPercentile}th percentile vs 1y)`;

      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        try {
          await navAny.share({
            files: [file],
            title: tr ? "Bitcoin Oynaklık Anlık Görüntüsü" : "Bitcoin Volatility Snapshot",
            text: shareText,
          });
          return;
        } catch {
          // user cancelled
        }
      }
      const link = document.createElement("a");
      link.download = buildExportFilename({ en: 'bitcoin-volatility', tr: 'bitcoin-volatilite' }, 'png', language);
      link.href = canvas.toDataURL("image/png");
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, "image/png");
  }, [buildCanvas, data, tr]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between bg-muted/30 rounded-lg p-4 border border-border/20">
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-0.5">
          {tr ? 'Bu anlık görüntüyü paylaş' : 'Share this snapshot'}
        </p>
        <p>{tr ? 'Güncel oynaklık, rejim ve dilimi içeren 1200×630 PNG oluşturur.' : 'Generates a 1200×630 PNG with current vol, regime, and percentile.'}</p>
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
