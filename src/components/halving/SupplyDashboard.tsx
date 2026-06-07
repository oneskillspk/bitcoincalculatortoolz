import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, Pickaxe, TrendingDown, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { BitcoinSupplyService } from '@/services/bitcoinSupplyService';
import { useLanguage } from '@/contexts/LanguageContext';

export const SupplyDashboard: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const { data: supplyData, isLoading } = useQuery({
    queryKey: ['bitcoin-supply-data'],
    queryFn: () => BitcoinSupplyService.getSupplyData(),
    staleTime: 60000,
    refetchInterval: 120000,
  });

  const stats = [
    {
      icon: Coins,
      label: tr ? 'Toplam Madencilik' : 'Total Mined',
      value: supplyData ? `${(supplyData.currentSupply / 1_000_000).toFixed(2)}M` : '—',
      subtext: supplyData ? `${supplyData.percentageMined}% of 21M` : '',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Pickaxe,
      label: tr ? 'Kalan' : 'Remaining',
      value: supplyData ? `${(supplyData.remainingToMine / 1_000_000).toFixed(2)}M` : '—',
      subtext: supplyData ? `${(100 - supplyData.percentageMined).toFixed(2)}% ${tr ? 'kaldı' : 'left'}` : '',
      color: 'text-warning',
      bgColor: 'bg-warning/$3',
    },
    {
      icon: TrendingDown,
      label: tr ? 'Yıllık Enflasyon' : 'Annual Inflation',
      value: supplyData ? `${supplyData.currentInflationRate}%` : '—',
      subtext: tr ? 'Güncel arz artışı' : 'Current supply growth',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Clock,
      label: tr ? 'Yarılanma Sonrası Oran' : 'Post-Halving Rate',
      value: supplyData ? `~${(supplyData.currentInflationRate / 2).toFixed(2)}%` : '—',
      subtext: tr ? 'Bir sonraki yarılanmadan sonra' : 'After next halving',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="border-border/30">
            <CardContent className="p-5 animate-pulse">
              <div className="h-10 w-10 bg-muted rounded-lg mb-3" />
              <div className="h-4 w-20 bg-muted rounded mb-2" />
              <div className="h-6 w-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/30 bg-card hover:shadow-sm transition-shadow">
          <CardContent className="p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            {stat.subtext && (
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
