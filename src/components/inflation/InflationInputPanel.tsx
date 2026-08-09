import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel } from "@/components/calculator";

interface InflationInputPanelProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
  timePeriod: string;
  onTimePeriodChange: (period: string) => void;
}

export const InflationInputPanel = ({
  currency,
  onCurrencyChange,
  timePeriod,
  onTimePeriodChange,
}: InflationInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <InputPanel title={tr ? 'Gösterge Paneli Ayarları' : 'Dashboard Settings'}>
        {/* Currency Selector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
            {tr ? 'Fiat Para Birimi' : 'Fiat Currency'}
          </Label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-full" aria-label={tr ? 'Fiat para birimi seçin' : 'Select fiat currency'}>
              <SelectValue placeholder={tr ? 'Para birimi seçin' : 'Select currency'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">🇺🇸 {tr ? 'ABD Doları (USD)' : 'US Dollar (USD)'}</SelectItem>
              <SelectItem value="EUR">🇪🇺 {tr ? 'Euro (EUR)' : 'Euro (EUR)'}</SelectItem>
              <SelectItem value="GBP">🇬🇧 {tr ? 'İngiliz Sterlini (GBP)' : 'British Pound (GBP)'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Period Selector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            {tr ? 'Analiz Dönemi' : 'Analysis Period'}
          </Label>
          <Select value={timePeriod} onValueChange={onTimePeriodChange}>
            <SelectTrigger className="w-full" aria-label={tr ? 'Analiz dönemi seçin' : 'Select analysis period'}>
              <SelectValue placeholder={tr ? 'Dönem seçin' : 'Select period'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{tr ? '1 Yıl' : '1 Year'}</SelectItem>
              <SelectItem value="5">{tr ? '5 Yıl' : '5 Years'}</SelectItem>
              <SelectItem value="10">{tr ? '10 Yıl' : '10 Years'}</SelectItem>
              <SelectItem value="all">{tr ? 'Tüm Zamanlar (2014-2025)' : 'All Time (2014-2025)'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tr
              ? 'Bitcoin\'in matematiksel olarak sabitlenmiş 21 milyon arzını genişleyen fiat para birimleriyle karşılaştırarak Bitcoin\'in neden "sert para" olarak kabul edildiğini anlayın.'
              : "Compare Bitcoin's mathematically fixed 21 million supply against expanding fiat currencies to understand why Bitcoin is considered \"hard money.\""}
          </p>
        </div>
    </InputPanel>
  );
};
