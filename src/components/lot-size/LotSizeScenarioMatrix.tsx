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
    <div className="rounded-xl border border-border/40 bg-card p-5">
      <h3 className="text-lg font-semibold text-foreground mb-3">
        {tr ? 'Risk Senaryo Matrisi' : 'Risk Scenario Matrix'}
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        {tr ? 'Aynı işlem, farklı risk yüzdeleri — kaldıraç ve tasfiye sabit tutulur.' : 'Same trade, different risk %s — leverage and liquidation held constant.'}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="pb-2 pr-3">Risk %</th>
              <th className="pb-2 pr-3">{tr ? 'Dolar Riski' : 'Dollar Risk'}</th>
              <th className="pb-2 pr-3">Lot</th>
              <th className="pb-2 pr-3">{tr ? 'Pozisyon' : 'Position'}</th>
              <th className="pb-2">{tr ? 'Tasfiye ~' : 'Liq. ~'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.riskPercent} className="border-t border-border/30">
                <td className="py-2 pr-3 font-medium">{r.riskPercent}%</td>
                <td className="py-2 pr-3">${fmt(r.dollarRisk)}</td>
                <td className="py-2 pr-3 font-mono">{r.lotSize.toFixed(4)}</td>
                <td className="py-2 pr-3">${fmt(r.positionValue)}</td>
                <td className="py-2">${fmt(r.liquidationPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
