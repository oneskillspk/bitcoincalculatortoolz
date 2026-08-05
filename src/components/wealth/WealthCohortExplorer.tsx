import React from 'react';
import { SectionHeader } from '@/components/lot-size/SectionHeader';
import { Wallet, Users, Layout } from 'lucide-react';

export const WealthCohortExplorer: React.FC = () => {
  const cohorts = [
    { label: 'Humpback', range: '10,000+ BTC', count: '100+', share: 'Large Institutions', icon: Wallet, color: 'text-purple-500' },
    { label: 'Whale', range: '1,000 - 10,000 BTC', count: '2,000+', share: 'Exchanges/Funds', icon: Users, color: 'text-blue-500' },
    { label: 'Shark', range: '100 - 1,000 BTC', count: '14,000+', share: 'High Net Worth', icon: Layout, color: 'text-cyan-500' },
    { label: 'Fish', range: '10 - 100 BTC', count: '140,000+', share: 'Early Adopters', icon: Wallet, color: 'text-green-500' },
    { label: 'Shrimp', range: '< 1 BTC', count: '45,000,000+', share: 'Retail Investors', icon: Users, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-12 mt-16">
      <section>
        <SectionHeader
          title="On-Chain Cohort Explorer"
          lead="Where do you fit in the Bitcoin ecosystem?"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          {cohorts.map((c) => (
            <div key={c.label} className="bg-card/50 border border-primary/5 rounded-2xl p-6 text-center hover:border-primary/20 transition-colors">
              <div className={`mx-auto p-3 rounded-full bg-muted w-fit mb-4 ${c.color}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg mb-1">{c.label}</h4>
              <p className="text-xs text-primary font-mono mb-3">{c.range}</p>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Typical Owner</div>
              <p className="text-xs font-medium">{c.share}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-sm text-muted-foreground leading-relaxed text-center">
            The top 1% of Bitcoin addresses typically hold more than 10 BTC, but due to exchange addresses and "lost" coins, the real number for individuals to be in the top 1% is estimated to be closer to <strong>1 BTC</strong>. This tool uses on-chain distribution models to estimate your rank.
          </p>
        </div>
      </section>
    </div>
  );
};
