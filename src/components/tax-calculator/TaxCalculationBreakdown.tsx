import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedTaxCalculatorService, EnhancedTaxCalculation, TaxConfiguration } from '@/services/enhancedTaxCalculator';
import { AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaxCalculationBreakdownProps {
  calculation: EnhancedTaxCalculation;
  config: TaxConfiguration;
}

export const TaxCalculationBreakdown: React.FC<TaxCalculationBreakdownProps> = ({
  calculation,
  config
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const washSaleEvents = calculation.taxableEvents.filter((e: any) => e.washSale);

  const costBasisLabel = () => {
    if (config.costBasisMethod === 'FIFO') return tr ? 'İlk Giren İlk Çıkar (FIFO)' : 'First In, First Out';
    if (config.costBasisMethod === 'LIFO') return tr ? 'Son Giren İlk Çıkar (LIFO)' : 'Last In, First Out';
    if (config.costBasisMethod === 'SPECIFIC_ID') return tr ? 'En Yüksek Maliyetli İlk Çıkar (HIFO)' : 'HIFO (Highest In, First Out)';
    if (config.costBasisMethod === 'AVERAGE_COST') return tr ? 'Ortalama Maliyet Yöntemi' : 'Average Cost Method';
    return config.costBasisMethod;
  };

  const filingStatusLabel = () => {
    return config.filingStatus.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-4">
      {/* Calculation Method Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            {tr ? 'Hesaplama Detayları' : 'Calculation Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{tr ? 'Maliyet Esası Yöntemi:' : 'Cost Basis Method:'}</span>
              <div className="text-muted-foreground">{costBasisLabel()}</div>
            </div>
            <div>
              <span className="font-medium">{tr ? 'Vergi Yılı:' : 'Tax Year:'}</span>
              <div className="text-muted-foreground">{config.taxYear}</div>
            </div>
            <div>
              <span className="font-medium">{tr ? 'Beyan Durumu:' : 'Filing Status:'}</span>
              <div className="text-muted-foreground">{filingStatusLabel()}</div>
            </div>
            <div>
              <span className="font-medium">{tr ? 'Yıllık Gelir:' : 'Annual Income:'}</span>
              <div className="text-muted-foreground">
                {EnhancedTaxCalculatorService.formatCurrency(config.annualIncome)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wash Sale Warnings */}
      {washSaleEvents.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">{tr ? 'Wash Sale Kuralları Uygulandı' : 'Wash Sale Rules Applied'}</p>
              <p className="text-sm">
                {tr
                  ? `${washSaleEvents.length} işlem wash sale kuralını tetikledi. Bu işlemlerden doğan sermaye kayıpları bu vergi yılı için reddedilmiş olsa da yerine geçen menkul kıymetlerdeki maliyet esasınızı artırabilir.`
                  : `${washSaleEvents.length} transaction(s) triggered the wash sale rule. Capital losses from these transactions have been disallowed for this tax year but may increase your cost basis in replacement securities.`}
              </p>
              <div className="space-y-1">
                {washSaleEvents.map((event: any, idx: number) => (
                  <div key={idx} className="text-xs bg-muted p-2 rounded">
                    {tr ? 'Satış tarihi:' : 'Sale on'} {new Date(event.date).toLocaleDateString()} —{' '}
                    {tr ? 'Orijinal kayıp:' : 'Original loss:'} {EnhancedTaxCalculatorService.formatCurrency(event.originalGainLoss || 0)}{' '}
                    ({tr ? 'reddedildi' : 'disallowed'})
                  </div>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Transaction Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{tr ? 'İşlem Özeti' : 'Transaction Summary'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {calculation.taxableEvents.filter(e => e.gainLoss > 0).length}
                </div>
                <div className="text-muted-foreground">{tr ? 'Kazançlar' : 'Gains'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {calculation.taxableEvents.filter(e => e.gainLoss < 0).length}
                </div>
                <div className="text-muted-foreground">{tr ? 'Kayıplar' : 'Losses'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {washSaleEvents.length}
                </div>
                <div className="text-muted-foreground">{tr ? 'Wash Sales' : 'Wash Sales'}</div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between items-center text-sm">
                <span>{tr ? 'Kısa vadeli işlemler:' : 'Short-term transactions:'}</span>
                <Badge variant="secondary">
                  {calculation.taxableEvents.filter(e => !e.isLongTerm).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>{tr ? 'Uzun vadeli işlemler:' : 'Long-term transactions:'}</span>
                <Badge variant="secondary">
                  {calculation.taxableEvents.filter(e => e.isLongTerm).length}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
