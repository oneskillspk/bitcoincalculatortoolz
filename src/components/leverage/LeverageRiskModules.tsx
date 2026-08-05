import React from 'react';
import { SectionHeader } from '@/components/lot-size/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, Zap, History } from 'lucide-react';

export const LeverageRiskModules: React.FC = () => {
  return (
    <div className="space-y-12 mt-16">
      <section>
        <SectionHeader
          title="Volatility Buffer Advisor"
          subtitle="Know how much market noise your position can survive"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4 text-yellow-500">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold">Low Volatility (2-3%)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                In quiet markets, 10x leverage is relatively safe. Your liquidation distance should exceed 10% to survive standard daily fluctuations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4 text-orange-500">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold">Medium Volatility (4-6%)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Standard Bitcoin volatility. Reduce leverage to 5x. A "flash wick" of 5% can happen in minutes; ensure your buffer is at least 15%.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <History className="w-5 h-5" />
                <h3 className="font-bold">High Volatility (7%+)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Extreme risk (ETF news, CPI data). 2x leverage max recommended. Positions with less than 30% liquidation distance are high-risk.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
