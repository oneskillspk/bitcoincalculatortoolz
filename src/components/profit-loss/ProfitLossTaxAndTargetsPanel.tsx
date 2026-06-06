import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Target, Receipt, Crosshair, ArrowRight } from "lucide-react";
import { Link } from "@/components/LocalizedLink";
import type { ProfitLossResult } from "@/services/profitLossCalculator";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  result: ProfitLossResult;
  isRealized: boolean;
  onRealizedChange: (v: boolean) => void;
  sellFeePercent: number;
}

const TARGET_PRESETS = [1.5, 2, 3, 5, 10];

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(v);

export const ProfitLossTaxAndTargetsPanel = ({
  result,
  isRealized,
  onRealizedChange,
  sellFeePercent,
}: Props) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const TAX_BRACKETS = [
    { label: tr?"0% (vergi yok)":"0% (no tax)", value: 0 },
    { label: tr?"15% UZKVK":"15% LTCG", value: 15 },
    { label: tr?"20% UZKVK":"20% LTCG", value: 20 },
    { label: tr?"23,8% (UZKVK + NIIT)":"23.8% (LTCG + NIIT)", value: 23.8 },
    { label: tr?"37% (kısa vadeli maks.)":"37% (short-term max)", value: 37 },
  ];

  const [taxIdx, setTaxIdx] = useState(1);
  const [targetMultiple, setTargetMultiple] = useState<number>(2);
  const [customTarget, setCustomTarget] = useState<string>("");

  const taxRate = TAX_BRACKETS[taxIdx]?.value ?? 0;

  const afterTax = useMemo(() => {
    const taxableGain = Math.max(0, result.netProfitLoss);
    const tax = taxableGain * (taxRate / 100);
    const netAfterTax = result.netProceeds - tax;
    const profitAfterTax = result.netProfitLoss - tax;
    const roiAfterTax =
      result.totalInvested > 0 ? (profitAfterTax / result.totalInvested) * 100 : 0;
    return { tax, netAfterTax, profitAfterTax, roiAfterTax };
  }, [result, taxRate]);

  const reverseTarget = useMemo(() => {
    const desiredMultiple = customTarget
      ? parseFloat(customTarget) || targetMultiple
      : targetMultiple;
    if (result.totalBtcHeld <= 0 || desiredMultiple <= 0) return null;
    const sellFeeFactor = 1 - sellFeePercent / 100;
    if (sellFeeFactor <= 0) return null;
    const targetGross = (result.totalInvested * desiredMultiple) / sellFeeFactor;
    const targetPrice = targetGross / result.totalBtcHeld;
    const moveFromCurrent =
      result.sellPrice > 0 ? ((targetPrice - result.sellPrice) / result.sellPrice) * 100 : 0;
    return { multiple: desiredMultiple, targetPrice, moveFromCurrent };
  }, [customTarget, targetMultiple, result, sellFeePercent]);

  return (
    <Card className="bg-card border-border/50">
      <CardContent className="p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              {tr?'Vergi & kâr hedefleri':'Tax & profit targets'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="realized-toggle" className="text-xs text-muted-foreground cursor-pointer">
              {isRealized ? (tr?'Gerçekleşmiş':'Realized') : (tr?'Gerçekleşmemiş':'Unrealized')}
            </Label>
            <Switch
              id="realized-toggle"
              checked={isRealized}
              onCheckedChange={onRealizedChange}
              aria-label={tr?'Gerçekleşmiş/gerçekleşmemiş K/Z geçişi':'Toggle realized vs unrealized P/L'}
            />
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Target className="w-3.5 h-3.5 text-primary" />
                {tr?'Başabaş fiyatı (satım ücreti sonrası)':'Break-even price (after sell fee)'}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-primary">
                {fmt(result.breakevenPrice)}
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground max-w-[55%]">
              <span className="font-mono text-foreground/80">
                {tr?'Toplam Yatırım ÷ (BTC Varlığı × (1 − Satım Ücreti%))':'Total Invested ÷ (BTC Held × (1 − Sell Fee%))'}
              </span>
              <p className="mt-1">
                {tr?'BTC\'nin bu fiyatı aşması gerekir ki zararsız çıkasınız.':'BTC must clear this price for you to walk away whole.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {tr?'Vergi dilimi':'Tax bracket'}
              </span>
            </div>
            <span className="text-sm font-mono text-primary">{TAX_BRACKETS[taxIdx].label}</span>
          </div>
          <Slider
            min={0}
            max={TAX_BRACKETS.length - 1}
            step={1}
            value={[taxIdx]}
            onValueChange={(v) => setTaxIdx(v[0])}
            aria-label={tr?'Vergi dilimi':'Tax bracket'}
          />
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-background/60 border border-border/40 p-2.5">
              <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">
                {tr?'Ödenecek Vergi':'Tax owed'}
              </div>
              <div className="font-mono text-sm font-semibold text-destructive">
                {fmt(afterTax.tax)}
              </div>
            </div>
            <div
              className={cn(
                "rounded-lg border p-2.5",
                afterTax.profitAfterTax >= 0
                  ? "bg-success/5 border-success/20"
                  : "bg-destructive/5 border-destructive/20"
              )}
            >
              <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">
                {tr?'Vergi Sonrası K/Z':'After-tax P/L'}
              </div>
              <div
                className={cn(
                  "font-mono text-sm font-semibold",
                  afterTax.profitAfterTax >= 0 ? "text-success" : "text-destructive"
                )}
              >
                {afterTax.profitAfterTax >= 0 ? "+" : ""}
                {fmt(afterTax.profitAfterTax)}
              </div>
            </div>
            <div className="rounded-lg bg-background/60 border border-border/40 p-2.5">
              <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">
                {tr?'Vergi Sonrası ROI':'After-tax ROI'}
              </div>
              <div className="font-mono text-sm font-semibold text-foreground">
                {afterTax.roiAfterTax.toFixed(2)}%
              </div>
            </div>
          </div>
          <Link
            to="/calculators/capital-gains-tax"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            {tr?'Sermaye Kazancı Vergisi hesaplamasının tamamını gör':'See the full Capital Gains breakdown'}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {tr?'Ters kâr hedefi':'Reverse profit target'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TARGET_PRESETS.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={!customTarget && targetMultiple === m ? "default" : "outline"}
                onClick={() => {
                  setCustomTarget("");
                  setTargetMultiple(m);
                }}
                className="min-h-9"
              >
                {m}x
              </Button>
            ))}
            <div className="flex items-center gap-2">
              <Label htmlFor="custom-target" className="text-xs text-muted-foreground">
                {tr?'Özel ×':'Custom ×'}
              </Label>
              <Input
                id="custom-target"
                type="number"
                step="0.1"
                min="0"
                placeholder={tr?'ör. 7':'e.g. 7'}
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                className="h-9 w-24"
              />
            </div>
          </div>
          {reverseTarget && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-background/60 border border-border/40 p-3">
                <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">
                  {tr?`${reverseTarget.multiple}x için gereken BTC fiyatı`:`BTC price needed for ${reverseTarget.multiple}x`}
                </div>
                <div className="font-mono text-base font-semibold text-primary">
                  {fmt(reverseTarget.targetPrice)}
                </div>
              </div>
              <div className="rounded-lg bg-background/60 border border-border/40 p-3">
                <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">
                  {tr?'Mevcut satış fiyatından hareket':'Move from current sell price'}
                </div>
                <div
                  className={cn(
                    "font-mono text-base font-semibold",
                    reverseTarget.moveFromCurrent >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {reverseTarget.moveFromCurrent >= 0 ? "+" : ""}
                  {reverseTarget.moveFromCurrent.toFixed(1)}%
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
