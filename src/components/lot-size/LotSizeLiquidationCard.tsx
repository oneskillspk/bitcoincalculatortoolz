import { useMemo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { calcLiquidationPrice, calcFeeAndFunding } from '@/services/lotSizeAdvanced';

interface Props {
  entryPrice: number;
  stopLossPrice: number;
  leverage: number;
  maintMarginPct: number;
  takerFeeBps: number;
  positionValueUsd: number;
}

export const LotSizeLiquidationCard = ({
  entryPrice, stopLossPrice, leverage, maintMarginPct, takerFeeBps, positionValueUsd,
}: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const side: 'long' | 'short' = entryPrice > stopLossPrice ? 'long' : 'short';

  const liq = useMemo(
    () => calcLiquidationPrice({ entry: entryPrice, leverage, side, maintMarginPct }),
    [entryPrice, leverage, side, maintMarginPct],
  );
  const fees = useMemo(
    () => calcFeeAndFunding({ positionValueUsd, takerFeeBps, fundingRatePct: 0.01, holdHours: 24 }),
    [positionValueUsd, takerFeeBps],
  );

  if (entryPrice <= 0 || leverage <= 0) return null;

  const distancePct = entryPrice > 0 ? Math.abs((liq - entryPrice) / entryPrice) * 100 : 0;
  const fmt = (n: number) => n.toLocaleString(tr ? 'tr-TR' : 'en-US', { maximumFractionDigits: 2 });

  return (
    <div className="rounded-xl border border-border/40 bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="w-4 h-4 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">
          {tr ? 'Tasfiye & Maliyet Tahmini' : 'Liquidation & Cost Estimate'}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{tr ? 'Yön' : 'Side'}</p>
          <p className="font-semibold text-foreground uppercase">{side}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{tr ? 'Tasfiye Fiyatı ~' : 'Liquidation Price ~'}</p>
          <p className="font-semibold text-warning">${fmt(liq)}</p>
          <p className="text-[11px] text-muted-foreground">{distancePct.toFixed(2)}% {tr ? 'uzakta' : 'away'}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{tr ? 'Gidiş-Dönüş Komisyon' : 'Round-Trip Fees'}</p>
          <p className="font-semibold text-foreground">${fmt(fees.roundTripFees)}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{tr ? 'Finansman (24s)' : 'Funding (24h)'}</p>
          <p className="font-semibold text-foreground">${fmt(fees.fundingCost)}</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground/70 mt-3">
        {tr
          ? 'İzole marj varsayımı. Cross-marj hesaplarında tasfiye daha uzakta olur. Finansman ~%0,01/8s ortalamasıyla tahmin edilir.'
          : 'Isolated-margin assumption. Cross-margin accounts liquidate further away. Funding estimated at ~0.01%/8h average.'}
      </p>
    </div>
  );
};
