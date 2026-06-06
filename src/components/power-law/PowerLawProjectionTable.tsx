import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePowerLawPrice } from "@/services/powerLawCalculator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarRange } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { formatMoneyCompact } from "@/utils/formatMoney";

export const PowerLawProjectionTable = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const fmt = (n: number) => formatMoneyCompact(n, { tr, fxRate });

  const projections = useMemo(() => {
    const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036];
    return years.map((year) => {
      const date = new Date(`${year}-01-01`);
      const result = calculatePowerLawPrice(date);
      return { year, ...result };
    });
  }, []);

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-primary mb-6">
          <CalendarRange className="w-5 h-5" />
          <h3 className="font-semibold text-foreground">
            {tr ? 'Yıl Bazında Güç Yasası Projeksiyonları (2026–2036)' : 'Year-by-Year Power Law Projections (2026–2036)'}
          </h3>
        </div>

        <div className="overflow-x-auto -mx-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{tr ? 'Yıl' : 'Year'}</TableHead>
                <TableHead className="text-xs text-right">{tr ? 'Destek (Taban)' : 'Support (Floor)'}</TableHead>
                <TableHead className="text-xs text-right">{tr ? 'Gerçek Değer' : 'Fair Value'}</TableHead>
                <TableHead className="text-xs text-right">{tr ? 'Direnç (Tavan)' : 'Resistance (Ceiling)'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projections.map((row) => (
                <TableRow key={row.year}>
                  <TableCell className="font-medium text-foreground">{row.year}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">{fmt(row.support)}</TableCell>
                  <TableCell className="text-right text-primary font-semibold text-sm">{fmt(row.fairValue)}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">{fmt(row.resistance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          {tr
            ? <>Formüle dayanmaktadır: Fiyat = A × Gün<sup>5.8</sup> (Gün = 3 Ocak 2009 Genesis Bloğundan bu yana geçen gün sayısı). Model: Giovanni Santostasi.</>
            : <>Based on the formula Price = A × Days<sup>5.8</sup> where Days = days since January 3, 2009 (Genesis Block). Model by Giovanni Santostasi.</>}
        </p>
      </CardContent>
    </Card>
  );
};
