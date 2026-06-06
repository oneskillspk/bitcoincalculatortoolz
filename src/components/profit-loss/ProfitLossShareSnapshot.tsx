import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ProfitLossResult } from "@/services/profitLossCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildExportFilename } from "@/utils/exportFilename";

interface Props {
  result: ProfitLossResult;
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
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

function drawSnapshot(ctx: CanvasRenderingContext2D, result: ProfitLossResult) {
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
  ctx.fillText("Profit & Loss Snapshot", 100, 88);

  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  ctx.font = "500 14px system-ui, -apple-system, sans-serif";
  const dateW = ctx.measureText(dateStr).width + 28;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, W - dateW - 60, 56, dateW, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(dateStr, W - dateW - 46, 72);

  const isProfit = result.netProfitLoss >= 0;
  const heroColor = isProfit ? "#10b981" : "#ef4444";
  const heroBg = isProfit ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)";

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = heroBg;
  roundRect(ctx, 60, 130, W - 120, 180, 24);
  ctx.fill();
  ctx.strokeStyle = heroColor + "55";
  ctx.lineWidth = 2;
  roundRect(ctx, 60, 130, W - 120, 180, 24);
  ctx.stroke();

  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 18px system-ui, -apple-system, sans-serif";
  ctx.fillText(isProfit ? "Net Profit (after all fees)" : "Net Loss (after all fees)", 90, 175);

  ctx.fillStyle = heroColor;
  ctx.font = "bold 84px system-ui, -apple-system, sans-serif";
  const heroLabel = `${isProfit ? "+" : ""}${fmtCurrency(result.netProfitLoss)}`;
  ctx.fillText(heroLabel, 90, 250);

  const roiText = `${isProfit ? "+" : ""}${result.roiPercent.toFixed(1)}% ROI`;
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
  const roiW = ctx.measureText(roiText).width + 40;
  ctx.fillStyle = heroColor;
  roundRect(ctx, W - 90 - roiW, 200, roiW, 56, 28);
  ctx.fill();
  ctx.fillStyle = "#0a0a0a";
  ctx.textAlign = "center";
  ctx.fillText(roiText, W - 90 - roiW / 2, 238);

  ctx.textAlign = "left";
  const cards = [
    { label: "Total Invested", value: fmtCurrency(result.totalInvested) },
    { label: "BTC Held", value: result.totalBtcHeld.toFixed(4) + " BTC" },
    { label: "Avg Cost Basis", value: fmtCurrency(result.weightedAvgCostBasis) },
    { label: "Break-Even Price", value: fmtCurrency(result.breakevenPrice) },
  ];

  const cardW = (W - 120 - 30) / 4;
  const cardY = 360;
  const cardH = 130;
  cards.forEach((c, i) => {
    const x = 60 + i * (cardW + 10);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    roundRect(ctx, x, cardY, cardW, cardH, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    roundRect(ctx, x, cardY, cardW, cardH, 16);
    ctx.stroke();

    ctx.fillStyle = "#9ca3af";
    ctx.font = "500 14px system-ui, -apple-system, sans-serif";
    ctx.fillText(c.label, x + 20, cardY + 36);

    ctx.fillStyle = i === 3 ? "#f7931a" : "#ffffff";
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
    ctx.fillText(c.value, x + 20, cardY + 80);
  });

  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 16px system-ui, -apple-system, sans-serif";
  ctx.fillText(
    `Sell price ${fmtCurrency(result.sellPrice)}  ·  Total fees paid ${fmtCurrency(result.totalFeesPaid)}  ·  Gross P/L ${fmtCurrency(result.grossProfitLoss)}`,
    60,
    540,
  );

  ctx.fillStyle = "#6b7280";
  ctx.font = "400 14px system-ui, -apple-system, sans-serif";
  ctx.fillText("bitcoincalculator.tools/calculators/profit-loss", 60, H - 30);

  ctx.textAlign = "right";
  ctx.fillText("Estimates only · Not tax advice", W - 60, H - 30);
  ctx.textAlign = "left";
}

export const ProfitLossShareSnapshot = ({ result }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [copied, setCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const { toast } = useToast();

  const buildCanvas = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    drawSnapshot(ctx, result);
    return canvas;
  }, [result]);

  const buildShareText = useCallback(() => {
    const isProfit = result.netProfitLoss >= 0;
    const sign = isProfit ? "+" : "";
    const direction = tr ? (isProfit ? 'artıda' : 'zararda') : (isProfit ? 'up' : 'down');
    return tr
      ? `BTC pozisyonum ücretler sonrası %${result.roiPercent.toFixed(1)} ${direction} (${sign}${fmtCurrency(result.netProfitLoss)} net) — bitcoincalculator.tools/calculators/profit-loss`
      : `My BTC position is ${direction} ${result.roiPercent.toFixed(1)}% (${sign}${fmtCurrency(result.netProfitLoss)} net) after fees — bitcoincalculator.tools/calculators/profit-loss`;
  }, [result, tr]);

  const handleDownload = useCallback(() => {
    const canvas = buildCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = buildExportFilename({ en: 'bitcoin-profit-loss', tr: 'bitcoin-kar-zarar' }, 'png', language);
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [buildCanvas]);

  const handleCopyText = useCallback(async () => {
    const text = buildShareText();
    const showSuccess = () => {
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2000);
      toast({ title: tr ? 'Paylaşım metni kopyalandı' : 'Share text copied', description: tr ? 'X, LinkedIn veya başka bir yere yapıştırın.' : 'Paste it into X, LinkedIn, or anywhere you post.' });
    };
    const showFailure = () => {
      toast({ title: tr ? 'Otomatik kopyalanamadı' : "Couldn't copy automatically", description: tr ? 'Metni manuel kopyalamak için uzun basın.' : 'Long-press the snapshot text to copy it manually.', variant: 'destructive' });
    };
    try {
      await navigator.clipboard.writeText(text);
      showSuccess();
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      document.body.removeChild(ta);
      if (ok) showSuccess(); else showFailure();
    }
  }, [buildShareText, toast, tr]);

  const handleShare = useCallback(async () => {
    const canvas = buildCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "bitcoin-profit-loss.png", { type: "image/png" });
      const shareText = buildShareText();

      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        try {
          await navAny.share({ files: [file], title: tr ? 'Bitcoin K/Z Anlık Görüntüsü' : 'Bitcoin P/L Snapshot', text: shareText });
          return;
        } catch {
          // user cancelled
        }
      }
      const link = document.createElement("a");
      link.download = buildExportFilename({ en: 'bitcoin-profit-loss', tr: 'bitcoin-kar-zarar' }, 'png', language);
      link.href = canvas.toDataURL("image/png");
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, "image/png");
  }, [buildCanvas, buildShareText, tr]);

  return (
    <div className="flex flex-col gap-3 bg-muted/30 rounded-lg p-4 border border-border/20">
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-0.5">{tr ? 'K/Z anlık görüntünüzü paylaşın' : 'Share your P/L snapshot'}</p>
        <p>{tr ? 'Net kârınızı, ROI\'yi, tutulan BTC\'yi ve başabaş fiyatını içeren 1200×630 PNG oluşturur.' : 'Generates a 1200×630 PNG with your net profit, ROI, BTC held, and break-even price.'}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleShare} size="sm" variant="default" className="gap-2 min-h-11">
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? (tr ? 'Kaydedildi' : 'Saved') : (tr ? 'Anlık Görüntü Paylaş' : 'Share Snapshot')}
        </Button>
        <Button onClick={handleDownload} size="sm" variant="outline" className="gap-2 min-h-11">
          <Download className="w-4 h-4" />
          PNG
        </Button>
        <Button onClick={handleCopyText} size="sm" variant="outline" className="gap-2 min-h-11" aria-label={tr ? 'Paylaşım metnini panoya kopyala' : 'Copy share text to clipboard'}>
          {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {textCopied ? (tr ? 'Kopyalandı' : 'Copied') : (tr ? 'Paylaşım metnini kopyala' : 'Copy share text')}
        </Button>
      </div>
    </div>
  );
};
