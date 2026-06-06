import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Share2, Download, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildExportFilename } from "@/utils/exportFilename";

interface Props {
  liveBtcPrice: number;
  selectedCurrency: string;
  currencySymbol: string;
}

const W = 1200;
const H = 630;

const GRID_CURRENCIES = [
  { code: "USD", symbol: "$", flag: "US" },
  { code: "EUR", symbol: "€", flag: "EU" },
  { code: "GBP", symbol: "£", flag: "GB" },
  { code: "INR", symbol: "₹", flag: "IN" },
  { code: "CAD", symbol: "CA$", flag: "CA" },
  { code: "AUD", symbol: "A$", flag: "AU" },
  { code: "CHF", symbol: "CHF", flag: "CH" },
  { code: "JPY", symbol: "¥", flag: "JP" },
  { code: "PKR", symbol: "₨", flag: "PK" },
];

interface SnapshotData {
  prices: Record<string, number>;
  changes: Record<string, number>;
}

const fetchSnapshotPrices = async (): Promise<SnapshotData> => {
  const vsCurrencies = GRID_CURRENCIES.map((c) => c.code.toLowerCase()).join(",");
  const { data } = await axios.get<{ bitcoin: Record<string, number> }>(
    "https://api.coingecko.com/api/v3/simple/price",
    {
      params: {
        ids: "bitcoin",
        vs_currencies: vsCurrencies,
        include_24hr_change: "true",
      },
      timeout: 8000,
    },
  );
  const raw = data.bitcoin || {};
  const prices: Record<string, number> = {};
  const changes: Record<string, number> = {};
  Object.keys(raw).forEach((key) => {
    if (key.endsWith("_24h_change")) {
      changes[key.replace("_24h_change", "")] = raw[key];
    } else {
      prices[key] = raw[key];
    }
  });
  return { prices, changes };
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fmt(value: number, sym: string, code: string): string {
  if (!value || value <= 0) return "—";
  const noDecimals = ["JPY", "INR", "PKR", "KRW", "VND", "IDR"];
  const decimals = noDecimals.includes(code) ? 0 : 0;
  return `${sym}${value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function drawSnapshot(
  ctx: CanvasRenderingContext2D,
  liveBtcPrice: number,
  selectedCurrency: string,
  currencySymbol: string,
  prices: Record<string, number>,
  changes: Record<string, number>,
) {
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
  ctx.fillText("Live BTC Converter Snapshot", 100, 88);

  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  ctx.font = "500 14px system-ui, -apple-system, sans-serif";
  const dateW = ctx.measureText(dateStr).width + 28;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, W - dateW - 60, 56, dateW, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(dateStr, W - dateW - 46, 72);

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(247,147,26,0.08)";
  roundRect(ctx, 60, 130, W - 120, 160, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(247,147,26,0.35)";
  ctx.lineWidth = 2;
  roundRect(ctx, 60, 130, W - 120, 160, 24);
  ctx.stroke();

  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 18px system-ui, -apple-system, sans-serif";
  ctx.fillText(`1 Bitcoin equals (${selectedCurrency})`, 90, 175);

  ctx.fillStyle = "#f7931a";
  ctx.font = "bold 84px system-ui, -apple-system, sans-serif";
  const heroLabel = liveBtcPrice > 0 ? fmt(liveBtcPrice, currencySymbol, selectedCurrency) : "—";
  ctx.fillText(heroLabel, 90, 250);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 18px system-ui, -apple-system, sans-serif";
  ctx.fillText("Live across 9 major fiat currencies", 60, 335);

  const gridStartY = 360;
  const cols = 3;
  const rows = 3;
  const gap = 14;
  const gridW = W - 120;
  const cellW = (gridW - gap * (cols - 1)) / cols;
  const cellH = 70;

  GRID_CURRENCIES.forEach((cur, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 60 + col * (cellW + gap);
    const y = gridStartY + row * (cellH + gap);
    const isActive = cur.code === selectedCurrency;

    ctx.fillStyle = isActive ? "rgba(247,147,26,0.12)" : "rgba(255,255,255,0.04)";
    roundRect(ctx, x, y, cellW, cellH, 12);
    ctx.fill();
    ctx.strokeStyle = isActive ? "rgba(247,147,26,0.45)" : "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, cellW, cellH, 12);
    ctx.stroke();

    ctx.fillStyle = "#9ca3af";
    ctx.font = "600 13px system-ui, -apple-system, sans-serif";
    ctx.fillText(cur.code, x + 16, y + 26);

    const change = changes[cur.code.toLowerCase()];
    if (typeof change === "number" && Number.isFinite(change)) {
      const up = change >= 0;
      const label = `${up ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}%`;
      ctx.font = "600 12px system-ui, -apple-system, sans-serif";
      const pillW = ctx.measureText(label).width + 14;
      const pillX = x + cellW - pillW - 12;
      const pillY = y + 14;
      ctx.fillStyle = up ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)";
      roundRect(ctx, pillX, pillY, pillW, 20, 10);
      ctx.fill();
      ctx.fillStyle = up ? "#10b981" : "#ef4444";
      ctx.fillText(label, pillX + 7, pillY + 14);
    }

    const price = prices[cur.code.toLowerCase()] ?? (cur.code === "USD" ? liveBtcPrice : 0);
    ctx.fillStyle = isActive ? "#f7931a" : "#ffffff";
    ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
    ctx.fillText(fmt(price, cur.symbol, cur.code), x + 16, y + 54);
  });

  ctx.fillStyle = "#6b7280";
  ctx.font = "400 14px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("bitcoincalculator.tools/calculators/bitcoin-converter", 60, H - 30);

  ctx.textAlign = "right";
  ctx.fillText("Live rates · CoinGecko · Refreshed every 30s", W - 60, H - 30);
  ctx.textAlign = "left";
}

export const ConverterShareSnapshot = ({ liveBtcPrice, selectedCurrency, currencySymbol }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [downloaded, setDownloaded] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const { toast } = useToast();

  const { data: snapshotPrices } = useQuery({
    queryKey: ["converter-snapshot-prices"],
    queryFn: fetchSnapshotPrices,
    refetchInterval: 60_000,
    staleTime: 50_000,
    retry: 2,
  });

  const buildCanvas = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    drawSnapshot(
      ctx,
      liveBtcPrice,
      selectedCurrency,
      currencySymbol,
      snapshotPrices?.prices ?? {},
      snapshotPrices?.changes ?? {},
    );
    return canvas;
  }, [liveBtcPrice, selectedCurrency, currencySymbol, snapshotPrices]);

  const buildShareText = useCallback(() => {
    if (liveBtcPrice <= 0) {
      return `Live Bitcoin price across 9 major currencies — bitcoincalculator.tools/calculators/bitcoin-converter`;
    }
    const priceLabel = fmt(liveBtcPrice, currencySymbol, selectedCurrency);
    return `1 BTC is ${priceLabel} (${selectedCurrency}) right now — see live rates in 9 currencies: bitcoincalculator.tools/calculators/bitcoin-converter`;
  }, [liveBtcPrice, selectedCurrency, currencySymbol]);

  const handleDownload = useCallback(() => {
    const canvas = buildCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = buildExportFilename({ en: 'bitcoin-converter', tr: 'bitcoin-donusturucu' }, 'png', language);
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
    toast({ title: tr ? "Anlık görüntü indirildi" : "Snapshot downloaded", description: tr ? "1200×630 PNG cihazınıza kaydedildi." : "1200×630 PNG saved to your device." });
  }, [buildCanvas, toast, tr]);

  const handleCopyText = useCallback(async () => {
    const text = buildShareText();
    const showSuccess = () => {
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2000);
      toast({ title: tr ? "Paylaşım metni kopyalandı" : "Share text copied", description: tr ? "X, LinkedIn veya başka bir yere yapıştırın." : "Paste it into X, LinkedIn, or anywhere you post." });
    };
    const showFailure = () => {
      toast({
        title: tr ? "Otomatik kopyalanamadı" : "Couldn't copy automatically",
        description: tr ? "Metni manuel olarak kopyalamak için uzun basın." : "Long-press the snapshot text to copy it manually.",
        variant: "destructive",
      });
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
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
      if (ok) showSuccess();
      else showFailure();
    }
  }, [buildShareText, toast, tr]);

  const handleShare = useCallback(async () => {
    const canvas = buildCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "bitcoin-converter.png", { type: "image/png" });
      const shareText = buildShareText();

      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.share && navAny.canShare?.({ files: [file] })) {
        try {
          await navAny.share({
            files: [file],
            title: "Bitcoin Converter Snapshot",
            text: shareText,
          });
          return;
        } catch {
          // user cancelled, fall through to download
        }
      }
      const link = document.createElement("a");
      link.download = buildExportFilename({ en: 'bitcoin-converter', tr: 'bitcoin-donusturucu' }, 'png', language);
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
      toast({ title: tr ? "Anlık görüntü indirildi" : "Snapshot downloaded", description: tr ? "1200×630 PNG cihazınıza kaydedildi." : "1200×630 PNG saved to your device." });
    }, "image/png");
  }, [buildCanvas, buildShareText, toast, tr]);

  return (
    <div className="flex flex-col gap-3 bg-muted/30 rounded-lg p-4 border border-border/20">
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-0.5">{tr ? 'Bu BTC anlık görüntüsünü paylaş' : 'Share this BTC snapshot'}</p>
        <p>{tr
          ? `Canlı BTC fiyatını ${selectedCurrency} cinsinden ve 9 para birimi ızgarasını içeren 1200×630 PNG oluşturur.`
          : `Generates a 1200×630 PNG with the live BTC price in ${selectedCurrency} and the 9-currency grid.`}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleShare} size="sm" variant="default" className="gap-2 min-h-11">
          {downloaded ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {downloaded ? (tr ? 'Kaydedildi' : 'Saved') : (tr ? 'Anlık Görüntü Paylaş' : 'Share Snapshot')}
        </Button>
        <Button onClick={handleDownload} size="sm" variant="outline" className="gap-2 min-h-11">
          <Download className="w-4 h-4" />
          PNG
        </Button>
        <Button
          onClick={handleCopyText}
          size="sm"
          variant="outline"
          className="gap-2 min-h-11"
          aria-label={tr ? 'Paylaşım metnini panoya kopyala' : 'Copy share text to clipboard'}
        >
          {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {textCopied ? (tr ? 'Kopyalandı' : 'Copied') : (tr ? 'Paylaşım metnini kopyala' : 'Copy share text')}
        </Button>
      </div>
    </div>
  );
};
