import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { formatGroupedInt } from '@/utils/numberFormat';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { HalvingHistoricalImpact } from '@/services/halvingCountdownService';
import { useLanguage } from '@/contexts/LanguageContext';

interface HalvingHistoryTableProps {
  impactData: HalvingHistoricalImpact[];
}

export const HalvingHistoryTable: React.FC<HalvingHistoryTableProps> = ({ impactData }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const isMobile = useIsMobile();

  const avg1YearReturn = impactData
    .map(h => h.returns.find(r => r.label === '1 Year')?.returnPct)
    .filter((v): v is number => v != null);
  const averageReturn = avg1YearReturn.length
    ? Math.round(avg1YearReturn.reduce((a, b) => a + b, 0) / avg1YearReturn.length)
    : 0;

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <History className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{tr ? 'Yarılanma Geçmişi' : 'Halving History'}</h3>
        </div>

        <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
          <p className="text-xs text-muted-foreground">{tr ? 'Yarılanma Sonrası Ort. 1 Yıllık Getiri' : 'Average 1-Year Post-Halving Return'}</p>
          <p className="text-2xl font-bold text-success">+{formatGroupedInt(averageReturn, getCurrentIntlLocale())}%</p>
        </div>

        {impactData.map(halving => {
          const oneYearReturn = halving.returns.find(r => r.label === '1 Year');
          return (
            <Card key={halving.halvingNumber} className={`border-border/30 ${halving.halvingNumber === 4 ? 'ring-1 ring-primary/30' : ''}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{tr ? 'Yarılanma' : 'Halving'} #{halving.halvingNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(halving.date).toLocaleDateString(tr ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{tr ? 'Yarılanmadaki Fiyat' : 'Price at Halving'}</p>
                    <p className="font-semibold">${formatGroupedInt(halving.priceAtHalving, getCurrentIntlLocale())}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-muted-foreground mb-0.5">{tr ? '1Y Fiyat' : '1Y Price'}</p>
                    <p className="font-semibold">${oneYearReturn?.price != null ? formatGroupedInt(oneYearReturn.price, getCurrentIntlLocale()) : 'N/A'}</p>
                  </div>
                  <div className="p-2 rounded bg-success/10">
                    <p className="text-muted-foreground mb-0.5">{tr ? '1Y YG' : '1Y ROI'}</p>
                    <p className="font-semibold text-success">
                      {oneYearReturn?.returnPct != null ? `+${formatGroupedInt(Math.round(oneYearReturn.returnPct), getCurrentIntlLocale())}%` : (tr ? 'Bekl.' : 'TBD')}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-primary/10">
                    <p className="text-muted-foreground mb-0.5">{tr ? 'Döngü ATH' : 'Cycle ATH'}</p>
                    <p className="font-semibold">${formatGroupedInt(halving.allTimeHighAfter, getCurrentIntlLocale())}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="border-border/30 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <History className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg">{tr ? 'Yarılanma Geçmişi ve Performansı' : 'Halving History & Performance'}</CardTitle>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
            <p className="text-xs text-muted-foreground">{tr ? 'Ort. 1Y Getiri' : 'Avg 1Y Return'}</p>
            <p className="text-lg font-bold text-success text-center">+{formatGroupedInt(averageReturn, getCurrentIntlLocale())}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{tr ? 'Yarılanma' : 'Halving'}</TableHead>
                <TableHead className="text-xs">{tr ? 'Tarih' : 'Date'}</TableHead>
                <TableHead className="text-xs text-right">{tr ? 'Fiyat' : 'Price'}</TableHead>
                <TableHead className="text-xs text-right">{tr ? '1Y Fiyat' : '1Y Price'}</TableHead>
                <TableHead className="text-xs text-right">{tr ? '1Y YG' : '1Y ROI'}</TableHead>
                <TableHead className="text-xs text-right">{tr ? 'Döngü ATH' : 'Cycle ATH'}</TableHead>
                <TableHead className="text-xs text-right">{tr ? 'ATH\'e Gün' : 'Days to ATH'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {impactData.map(halving => {
                const oneYearReturn = halving.returns.find(r => r.label === '1 Year');
                return (
                  <TableRow key={halving.halvingNumber} className={halving.halvingNumber === 4 ? 'bg-primary/5' : ''}>
                    <TableCell className="font-semibold text-sm">#{halving.halvingNumber}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(halving.date).toLocaleDateString(tr ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'short' })}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">${formatGroupedInt(halving.priceAtHalving, getCurrentIntlLocale())}</TableCell>
                    <TableCell className="text-right text-sm">${oneYearReturn?.price != null ? formatGroupedInt(oneYearReturn.price, getCurrentIntlLocale()) : (tr ? 'Bekl.' : 'TBD')}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-success">
                      {oneYearReturn?.returnPct != null ? `+${formatGroupedInt(Math.round(oneYearReturn.returnPct), getCurrentIntlLocale())}%` : (tr ? 'Bekl.' : 'TBD')}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">${formatGroupedInt(halving.allTimeHighAfter, getCurrentIntlLocale())}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{halving.daysToATH}</TableCell>
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
