import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildScenarioMatrix } from '@/services/lotSizeAdvanced';

interface Props {
  accountBalance: number;
  entryPrice: number;
  stopLossPrice: number;
  contractSize: number;
  leverage: number;
  maintMarginPct: number;
}

export const LotSizeScenarioMatrix = ({
  accountBalance, entryPrice, stopLossPrice, contractSize, leverage, maintMarginPct,
}: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const side: 'long' | 'short' = entryPrice > stopLossPrice ? 'long' : 'short';

  const rows = useMemo(() => buildScenarioMatrix({
    accountBalance, entryPrice, stopLossPrice, contractSize, leverage, maintMarginPct, side,
  }), [accountBalance, entryPrice, stopLossPrice, contractSize, leverage, maintMarginPct, side]);

  if (!rows.length) return null;
  const fmt = (n: number) => n.toLocaleString(tr ? 'tr-TR' : 'en-US', { maximumFractionDigits: 2 });

  return (
    <div className="rounded-xl border border-border/40 bg-card p-4 sm:p-5 min-w-0">
      <h3 className="text-lg font-semibold text-foreground mb-3">
        {tr ? 'Risk Senaryo Matrisi' : 'Risk Scenario Matrix'}
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        {tr ? 'Aynı işlem, farklı risk yüzdeleri — kaldıraç ve tasfiye sabit tutulur.' : 'Same trade, different risk %s — leverage and liquidation held constant.'}
      </p>
      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto px-4 sm:px-0">
          <table className="w-full text-xs sm:text-sm min-w-[26rem]">
            <thead className="text-left text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="pb-2 pr-2 sm:pr-3 whitespace-nowrap">Risk %</th>
                <th className="pb-2 pr-2 sm:pr-3 whitespace-nowrap">{tr ? 'Dolar Riski' : 'Dollar Risk'}</th>
                <th className="pb-2 pr-2 sm:pr-3 whitespace-nowrap">Lot</th>
                <th className="pb-2 pr-2 sm:pr-3 whitespace-nowrap">{tr ? 'Pozisyon' : 'Position'}</th>
                <th className="pb-2 whitespace-nowrap">{tr ? 'Tasfiye ~' : 'Liq. ~'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.riskPercent} className="border-t border-border/30">
                  <td className="py-2 pr-2 sm:pr-3 font-medium whitespace-nowrap">{r.riskPercent}%</td>
                  <td className="py-2 pr-2 sm:pr-3 whitespace-nowrap">${fmt(r.dollarRisk)}</td>
                  <td className="py-2 pr-2 sm:pr-3 font-mono whitespace-nowrap">{r.lotSize.toFixed(4)}</td>
                  <td className="py-2 pr-2 sm:pr-3 whitespace-nowrap">${fmt(r.positionValue)}</td>
                  <td className="py-2 whitespace-nowrap">${fmt(r.liquidationPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Right-edge fade hints at horizontal scroll on narrow viewports. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-card to-transparent sm:hidden"
        />
      </div>
    </div>
  );
};
