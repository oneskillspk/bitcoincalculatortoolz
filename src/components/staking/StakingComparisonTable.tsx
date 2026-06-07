import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBTC, STAKING_PROTOCOLS, calculateStakingRewards } from "@/services/stakingCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

interface StakingComparisonTableProps {
  btcAmount: number;
  selectedProtocolId: string;
  btcPrice: number;
  compounding: boolean;
}

const RISK_BADGE: Record<string, string> = {
  low: 'text-success bg-success/10',
  medium: 'text-warning bg-warning/$3',
  high: 'text-destructive bg-destructive/10',
};

const TYPE_SHORT: Record<string, { en: string; tr: string }> = {
  native: { en: 'Native', tr: 'Yerel' },
  wrapped: { en: 'Wrapped', tr: 'Sarılı' },
  custodial: { en: 'Custodial', tr: 'Saklama' },
};

const RISK_LABELS: Record<string, { en: string; tr: string }> = {
  low: { en: 'low', tr: 'düşük' },
  medium: { en: 'medium', tr: 'orta' },
  high: { en: 'high', tr: 'yüksek' },
};

export const StakingComparisonTable = ({
  btcAmount,
  selectedProtocolId,
  btcPrice,
  compounding,
}: StakingComparisonTableProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const rows = STAKING_PROTOCOLS.map(protocol => {
    const r1 = calculateStakingRewards({ btcAmount, protocolId: protocol.id, years: 1, compounding }, btcPrice);
    const r3 = calculateStakingRewards({ btcAmount, protocolId: protocol.id, years: 3, compounding }, btcPrice);
    const r5 = calculateStakingRewards({ btcAmount, protocolId: protocol.id, years: 5, compounding }, btcPrice);
    return {
      protocol,
      after1Y: r1?.btcRewards ?? 0,
      after3Y: r3?.btcRewards ?? 0,
      after5Y: r5?.btcRewards ?? 0,
    };
  });

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">
          {tr ? 'Protokol Karşılaştırması' : 'Protocol Comparison'}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {tr
            ? `${formatBTC(btcAmount)} anapara için tüm protokollerde BTC ödülleri`
            : `BTC rewards for ${formatBTC(btcAmount)} principal across all protocols`}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">{tr ? 'Protokol' : 'Protocol'}</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-3">APY</th>
                <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-3 hidden sm:table-cell">{tr ? 'Tür' : 'Type'}</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-3">{tr ? '1Y Ödül' : '1Y Rewards'}</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-3 hidden md:table-cell">{tr ? '3Y Ödül' : '3Y Rewards'}</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-3">{tr ? '5Y Ödül' : '5Y Rewards'}</th>
                <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-3">{tr ? 'Risk' : 'Risk'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ protocol, after1Y, after3Y, after5Y }) => {
                const isSelected = protocol.id === selectedProtocolId;
                return (
                  <tr
                    key={protocol.id}
                    className={`border-b border-border/20 transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: protocol.color }} />
                        <div>
                          <p className={`text-sm font-semibold leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {protocol.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{protocol.platform}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${protocol.color}20`, color: protocol.color }}>
                        {(protocol.apy * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {tr ? (TYPE_SHORT[protocol.type]?.tr ?? protocol.type) : (TYPE_SHORT[protocol.type]?.en ?? protocol.type)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs font-semibold text-success">+{after1Y.toFixed(4)}</span>
                    </td>
                    <td className="px-3 py-3 text-right hidden md:table-cell">
                      <span className="text-xs font-semibold text-success">+{after3Y.toFixed(4)}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs font-semibold text-success">+{after5Y.toFixed(4)}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${RISK_BADGE[protocol.riskLevel]}`}>
                        {tr ? (RISK_LABELS[protocol.riskLevel]?.tr ?? protocol.riskLevel) : (RISK_LABELS[protocol.riskLevel]?.en ?? protocol.riskLevel)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground px-4 py-3 border-t border-border/20">
          {tr
            ? `Tüm ödül değerleri BTC cinsinden gösterilmektedir. ${compounding ? 'Yıllık bileşik' : 'Basit faiz'} uygulandı.`
            : `All reward values shown in BTC. ${compounding ? 'Annual compound' : 'Simple interest'} applied.`}
        </p>
      </CardContent>
    </Card>
  );
};
