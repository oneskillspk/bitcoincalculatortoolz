import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check } from "lucide-react";
import type { CAGRResult } from "@/services/cagrCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildExportFilename } from "@/utils/exportFilename";

interface Props {
  result: CAGRResult;
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

function fmtCurrency(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function drawSnapshot(ctx: CanvasRenderingContext2D, result: CAGRResult) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0a0a0a");
  bg.addColorStop(0.5, "#111827");
  bg.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const radial = ctx.createRadialGradient(W * 0.85, H * 0.15, 50, W * 0.85, H * 0.15, 600);
  radial.addColorStop(0, "#f7931a33");
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
  ctx.fillText("CAGR Comparison", 100, 88);

  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  ctx.font = "500 14px system-ui, -apple-system, sans-serif";
  const dateW = ctx.measureText(dateStr).width + 28;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, W - dateW - 60, 56, dateW, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(dateStr, W - dateW - 46, 72);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${fmtCurrency(result.investmentAmount)} Compounded for ${result.years} Years`, 60, 170);

  const sorted = [...result.assets].sort((a, b) => b.cagr - a.cagr);
  const maxCagr = Math.max(...sorted.map((a) => Math.abs(a.cagr)), 1);

  const barsTop = 220;
  const rowH = 70;
  const labelW = 220;
  const barAreaX = 60 + labelW;
  const barAreaW = W - barAreaX - 280;

  sorted.forEach((asset, i) => {
    const y = barsTop + i * rowH;
    const proj = result.projectedValues.find((p) => p.asset === asset.name);
    const barW = Math.max(8, (Math.abs(asset.cagr) / maxCagr) * barAreaW);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 22px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${asset.icon}  ${asset.name}`, 60, y + 28);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "400 14px system-ui, -apple-system, sans-serif";
    ctx.fillText(asset.ticker, 60, y + 50);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRect(ctx, barAreaX, y + 16, barAreaW, 28, 14);
    ctx.fill();

    ctx.fillStyle = asset.color;
    roundRect(ctx, barAreaX, y + 16, barW, 28, 14);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
    const cagrLabel = `${asset.cagr.toFixed(1)}% CAGR`;
    ctx.fillText(cagrLabel, barAreaX + 12, y + 36);

    if (proj) {
      ctx.fillStyle = asset.color;
      ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(fmtCurrency(proj.finalValue), W - 60, y + 32);

      ctx.fillStyle = "#9ca3af";
      ctx.font = "400 13px system-ui, -apple-system, sans-serif";
      ctx.fillText("projected", W - 60, y + 50);
    }
  });

  ctx.textAlign = "left";
  ctx.fillStyle = "#6b7280";
  ctx.font = "400 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("bitcoincalculator.tools/calculators/cagr", 60, H - 30);

  ctx.textAlign = "right";
  ctx.fillText("Historical data: Jan 2016 – Jan 2026", W - 60, H - 30);
  ctx.textAlign = "left";
}

export const CAGRShareSnapshot = ({ result }: Props) => {
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
    link.download = buildExportFilename({ en: 'bitcoin-cagr', tr: 'bitcoin-yillik-buyume' }, 'png', language);
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [buildCanvas]);

  const handleShare = useCallback(async () => {
    const canvas = buildCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "bitcoin-cagr.png", { type: "image/png" });
      const btc = result.assets.find((a) => a.ticker === "BTC");
      const shareText = btc
        ? `Bitcoin's 10-year CAGR: ${btc.cagr.toFixed(1)}% — versus traditional assets in this snapshot.`
        : `Bitcoin CAGR comparison from bitcoincalculator.tools.`;

      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        try {
          await navAny.share({
            files: [file],
            title: "Bitcoin CAGR Snapshot",
            text: shareText,
          });
          return;
        } catch {
          // user cancelled, fall through to download
        }
      }
      const link = document.createElement("a");
      link.download = buildExportFilename({ en: 'bitcoin-cagr', tr: 'bitcoin-yillik-buyume' }, 'png', language);
      link.href = canvas.toDataURL("image/png");
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, "image/png");
  }, [buildCanvas, result]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between bg-muted/30 rounded-lg p-4 border border-border/20">
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-0.5">{tr ? 'Bu BYBÜ karşılaştırmasını paylaş' : 'Share this CAGR comparison'}</p>
        <p>{tr ? 'Her varlığın BYBÜ ve tahmini değerini içeren 1200×630 PNG oluşturur.' : 'Generates a 1200×630 PNG with each asset\'s CAGR and projected value.'}</p>
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
