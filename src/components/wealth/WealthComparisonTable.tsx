import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { formatGroupedInt } from '@/utils/numberFormat';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3 } from 'lucide-react';
import { getAllTiers, PercentileResult, TOTAL_ADDRESSES_WITH_BALANCE, TOTAL_BTC_SUPPLY } from '@/services/wealthPercentileService';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface WealthComparisonTableProps {
  result: PercentileResult;
}

export const WealthComparisonTable: React.FC<WealthComparisonTableProps> = ({ result }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const { price: btcPrice } = useLiveBitcoinPrice();
  const tiers = getAllTiers(btcPrice > 0 ? btcPrice : undefined);

  const topTiers = tiers.filter(t => t.percentOfAddresses < 0.1);
  const topTierBtcPercent = topTiers.reduce((sum, t) => sum + t.percentOfSupply, 0);

  return (
    <Card className="border-border/30 bg-card">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-base">
              {tr ? 'Tüm Dağıtım Kademeleri' : 'All Distribution Tiers'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {tr
              ? <>Adreslerin ilk %{topTiers.reduce((sum, t) => sum + t.percentOfAddresses, 0).toFixed(2)}'si tüm Bitcoin'in <span className="font-semibold text-foreground">%{topTierBtcPercent.toFixed(1)}</span>'ini tutuyor</>
              : <>The top {topTiers.reduce((sum, t) => sum + t.percentOfAddresses, 0).toFixed(2)}% of addresses hold <span className="font-semibold text-foreground">{topTierBtcPercent.toFixed(1)}%</span> of all Bitcoin</>}
          </p>
        </div>

        <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium">{tr ? 'Kademe' : 'Tier'}</TableHead>
                <TableHead className="text-xs font-medium">{tr ? 'BTC Aralığı' : 'BTC Range'}</TableHead>
                {btcPrice > 0 && <TableHead className="text-xs font-medium hidden sm:table-cell">{tr ? 'Fiat Aralığı' : 'Fiat Range'}</TableHead>}
                <TableHead className="text-xs font-medium text-right">{tr ? 'Adresler' : 'Addresses'}</TableHead>
                <TableHead className="text-xs font-medium text-right hidden sm:table-cell">{tr ? '% Adresler' : '% Addresses'}</TableHead>
                <TableHead className="text-xs font-medium text-right">{tr ? '% Arz' : '% Supply'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((tier) => {
                const isUserTier = tier.tierName === result.tier.tierName;
                return (
                  <TableRow
                    key={tier.tierName}
                    className={cn(
                      'transition-colors',
                      isUserTier ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    )}
                  >
                    <TableCell className="text-xs font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tier.color }} />
                        <span>{tier.tierEmoji}</span>
                        <span>{tier.tierName}</span>
                        {isUserTier && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/30 text-primary ml-1">
                            {tr ? 'SİZ' : 'YOU'}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                      {tier.minBtc >= 1 ? formatGroupedInt(tier.minBtc, getCurrentIntlLocale()) : tier.minBtc}
                      {' – '}
                      {tier.maxBtc >= 21_000_000 ? '∞' : tier.maxBtc >= 1 ? formatGroupedInt(tier.maxBtc, getCurrentIntlLocale()) : tier.maxBtc}
                    </TableCell>
                    {btcPrice > 0 && (
                      <TableCell className="text-xs tabular-nums text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                        ${tier.minFiat !== undefined ? (tier.minFiat >= 1000 ? `${(tier.minFiat / 1000).toFixed(0)}K` : tier.minFiat.toFixed(0)) : '0'}
                        {' – '}
                        {tier.maxFiat !== undefined ? (tier.maxFiat >= 1_000_000 ? `${(tier.maxFiat / 1_000_000).toFixed(0)}M` : tier.maxFiat >= 1000 ? `${(tier.maxFiat / 1000).toFixed(0)}K` : `${tier.maxFiat.toFixed(0)}`) : '∞'}
                      </TableCell>
                    )}
                    <TableCell className="text-xs tabular-nums text-right text-muted-foreground">
                      {tier.addresses >= 1_000_000
                        ? `${(tier.addresses / 1_000_000).toFixed(1)}M`
                        : tier.addresses >= 1_000
                          ? `${(tier.addresses / 1_000).toFixed(0)}K`
                          : formatGroupedInt(tier.addresses, getCurrentIntlLocale())}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums text-right text-muted-foreground hidden sm:table-cell">
                      {tier.percentOfAddresses >= 0.01 ? `${tier.percentOfAddresses.toFixed(2)}%` : `<0.01%`}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums text-right text-muted-foreground">
                      {tier.percentOfSupply.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
