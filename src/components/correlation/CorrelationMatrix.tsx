import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CorrelationResult } from '@/services/correlationService';
import { useLanguage } from '@/contexts/LanguageContext';

interface CorrelationMatrixProps {
  data: CorrelationResult[];
  loading?: boolean;
}

const ASSETS = ['Bitcoin', 'S&P 500', 'Gold', 'Nasdaq', 'US Dollar (DXY)'];

function getColor(value: number): string {
  if (value >= 0.7) return 'bg-success/80 text-white';
  if (value >= 0.3) return 'bg-success/40 text-foreground';
  if (value > 0.05) return 'bg-success/15 text-foreground';
  if (value > -0.05) return 'bg-muted/30 text-muted-foreground';
  if (value > -0.3) return 'bg-destructive/15 text-foreground';
  if (value > -0.7) return 'bg-destructive/40 text-foreground';
  return 'bg-destructive/80 text-white';
}

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ data, loading }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const getCoeff = (a: string, b: string): number => {
    const entry = data.find(d => d.assetA === a && d.assetB === b);
    return entry?.coefficient ?? 0;
  };

  if (loading) {
    return (
      <Card className="glass-morphism-card border-border/20">
        <CardHeader><CardTitle className="text-foreground">{tr ? 'Korelasyon Matrisi' : 'Correlation Matrix'}</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <CardTitle className="text-foreground">{tr ? 'Korelasyon Matrisi' : 'Correlation Matrix'}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {tr
            ? 'Günlük log-getiriler arasında Pearson korelasyon katsayısı (−1 ile +1 arası)'
            : 'Pearson correlation coefficient (−1 to +1) between daily log-returns'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 text-muted-foreground font-medium min-w-[120px]"></th>
                {ASSETS.map(asset => (
                  <th key={asset} className="p-2 text-center text-muted-foreground font-medium min-w-[90px] text-xs">
                    {asset === 'US Dollar (DXY)' ? 'DXY' : asset}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ASSETS.map(row => (
                <tr key={row}>
                  <td className="p-2 text-foreground font-medium text-xs whitespace-nowrap">
                    {row === 'US Dollar (DXY)' ? 'DXY' : row}
                  </td>
                  {ASSETS.map(col => {
                    const val = getCoeff(row, col);
                    return (
                      <td key={col} className="p-1.5">
                        <div className={`rounded-lg px-2 py-2.5 text-center font-mono text-sm font-semibold ${getColor(val)}`}>
                          {val.toFixed(2)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-success/60" />
            <span>{tr ? 'Pozitif' : 'Positive'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-muted/30" />
            <span>{tr ? 'Sıfıra Yakın' : 'Near Zero'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-destructive/60" />
            <span>{tr ? 'Negatif' : 'Negative'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
