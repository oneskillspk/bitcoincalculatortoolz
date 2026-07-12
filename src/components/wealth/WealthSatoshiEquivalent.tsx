import { formatGroupedInt } from '@/utils/numberFormat';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bitcoin } from 'lucide-react';
import { btcToSats, ESTIMATED_INDIVIDUAL_HOLDERS, TOTAL_BTC_SUPPLY, WORLD_POPULATION } from '@/services/wealthPercentileService';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  btcAmount: number;
}

const fmt = (n: number) => formatGroupedInt(n, 'en-US');

export const WealthSatoshiEquivalent: React.FC<Props> = ({ btcAmount }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (btcAmount <= 0) return null;

  const sats = btcToSats(btcAmount);
  const fairShareBtc = TOTAL_BTC_SUPPLY / WORLD_POPULATION;
  const fairShareSats = Math.round(fairShareBtc * 100_000_000);
  const adopterShareBtc = TOTAL_BTC_SUPPLY / ESTIMATED_INDIVIDUAL_HOLDERS;
  const adopterShareSats = Math.round(adopterShareBtc * 100_000_000);

  const vsFairShare = fairShareSats > 0 ? sats / fairShareSats : 0;
  const vsAdopterShare = adopterShareSats > 0 ? sats / adopterShareSats : 0;

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bitcoin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {tr ? 'Satoshi Karşılığı' : 'Satoshi Equivalent'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {tr ? 'Bitcoin\'cilerin düşündüğü birimle yığınınız' : 'Your stack, denominated the way Bitcoiners think'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              {tr ? 'Satoshiniz' : 'Your sats'}
            </p>
            <p className="text-2xl font-bold text-primary tabular-nums">{fmt(sats)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {tr ? 'satoshi (1 BTC = 100M sats)' : 'satoshis (1 BTC = 100M sats)'}
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              {tr ? 'Eşit paylaşımda adil pay' : 'Fair share if equally split'}
            </p>
            <p className="text-2xl font-bold text-foreground tabular-nums">{fmt(fairShareSats)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {tr
                ? <>Kişi başı adil payın <span className="font-semibold text-foreground">{vsFairShare.toFixed(1)}x</span>'ine sahipsiniz</>
                : <>You own <span className="font-semibold text-foreground">{vsFairShare.toFixed(1)}x</span> the per-person fair share</>}
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              {tr ? 'Bitcoin benimseyici başına' : 'Per Bitcoin adopter'}
            </p>
            <p className="text-2xl font-bold text-foreground tabular-nums">{fmt(adopterShareSats)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {tr
                ? <>Ortalama BTC sahibinin <span className="font-semibold text-foreground">{vsAdopterShare.toFixed(1)}x</span>'ine sahipsiniz</>
                : <>You own <span className="font-semibold text-foreground">{vsAdopterShare.toFixed(1)}x</span> the average BTC holder share</>}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          {tr
            ? '21 milyon BTC\'lik sabit arz ve yaklaşık 106 milyon mevcut holder ile mütevazı sat yığınları bile mutlak kıtlık üzerinde anlamlı bir hak talebini temsil eder.'
            : 'With 21 million BTC capped supply and roughly 106 million current holders worldwide, even modest sat stacks represent a meaningful claim on absolute scarcity.'}
        </p>
      </CardContent>
    </Card>
  );
};
