import React from 'react';
import { SectionHeader } from '@/components/lot-size/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, Zap, History } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LeverageRiskModules: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="space-y-12 mt-16">
      <section>
        <SectionHeader
          title={tr ? "Oynaklık Tamponu Danışmanı" : "Volatility Buffer Advisor"}
          lead={tr ? "Pozisyonunuzun ne kadar piyasa gürültüsüne dayanabileceğini bilin" : "Know how much market noise your position can survive"}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4 text-yellow-500">
                <Zap className="w-5 h-5" />
                <h3 className="font-bold">{tr ? "Düşük Oynaklık (%2-3)" : "Low Volatility (2-3%)"}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {tr 
                  ? "Sakin piyasalarda 10x kaldıraç nispeten güvenlidir. Standart günlük dalgalanmalardan kurtulmak için tasfiye mesafeniz %10'u aşmalıdır."
                  : "In quiet markets, 10x leverage is relatively safe. Your liquidation distance should exceed 10% to survive standard daily fluctuations."}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4 text-orange-500">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold">{tr ? "Orta Oynaklık (%4-6)" : "Medium Volatility (4-6%)"}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {tr
                  ? "Standart Bitcoin oynaklığı. Kaldıracı 5x'e düşürün. Dakikalar içinde %5'lik bir iğne (flash wick) gelebilir; tamponunuzun en az %15 olduğundan emin olun."
                  : "Standard Bitcoin volatility. Reduce leverage to 5x. A \"flash wick\" of 5% can happen in minutes; ensure your buffer is at least 15%."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <History className="w-5 h-5" />
                <h3 className="font-bold">{tr ? "Yüksek Oynaklık (%7+)" : "High Volatility (7%+)"}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {tr
                  ? "Aşırı risk (ETF haberleri, CPI verileri). Maksimum 2x kaldıraç önerilir. %30'dan az tasfiye mesafesi olan pozisyonlar yüksek risklidir."
                  : "Extreme risk (ETF news, CPI data). 2x leverage max recommended. Positions with less than 30% liquidation distance are high-risk."}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};