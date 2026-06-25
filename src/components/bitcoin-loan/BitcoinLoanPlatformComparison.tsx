import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { loanPlatformRows } from './bitcoinLoanData';

export const BitcoinLoanPlatformComparison: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="container mx-auto px-6 pb-16" aria-labelledby="bitcoin-loan-platform-comparison">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 id="bitcoin-loan-platform-comparison" className="text-h2 font-bold text-foreground">
            {t('loan.platforms.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-3">{t('loan.platforms.subtitle')}</p>
        </div>

        <Card className="glass-morphism-card border-border/20 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[860px]">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr className="border-b border-border/30">
                    <th className="text-left p-4 font-medium">{t('loan.platforms.colPlatform')}</th>
                    <th className="text-left p-4 font-medium">{t('loan.platforms.colCustody')}</th>
                    <th className="text-left p-4 font-medium">{t('loan.platforms.colLtv')}</th>
                    <th className="text-left p-4 font-medium">{t('loan.platforms.colMargin')}</th>
                    <th className="text-left p-4 font-medium">{t('loan.platforms.colRate')}</th>
                    <th className="text-left p-4 font-medium">{t('loan.platforms.colFit')}</th>
                  </tr>
                </thead>
                <tbody>
                  {loanPlatformRows.map((row) => (
                    <tr key={row.platform} className="border-b border-border/20 last:border-0 align-top">
                      <td className="p-4 font-semibold text-foreground">{row.platform}</td>
                      <td className="p-4 text-muted-foreground">{row.custody}</td>
                      <td className="p-4 text-muted-foreground">{row.ltv}</td>
                      <td className="p-4 text-muted-foreground">{row.margin}</td>
                      <td className="p-4 text-muted-foreground">{row.notes}</td>
                      <td className="p-4 text-muted-foreground">{row.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card id="bitcoin-loan-ltv-explained" className="glass-morphism-card border-border/20 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{t('loan.ltvExplained.title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('loan.ltvExplained.body')}</p>
            </CardContent>
          </Card>

          <Card id="bitcoin-loan-50-drawdown-example" className="glass-morphism-card border-warning/20 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h3 className="text-lg font-semibold text-foreground">{t('loan.drawdownExample.title')}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('loan.drawdownExample.body')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BitcoinLoanPlatformComparison;
