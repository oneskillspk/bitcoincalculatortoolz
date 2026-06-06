import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, InputField, CalculateButton } from "@/components/calculator";

interface PowerLawInputPanelProps {
  onCalculate: (targetDate: Date) => void;
}

const PRESETS = [
  { label: "2026", year: 2026 },
  { label: "2028", year: 2028 },
  { label: "2030", year: 2030 },
  { label: "2035", year: 2035 },
];

export const PowerLawInputPanel = ({ onCalculate }: PowerLawInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() + 1);
  const [targetDate, setTargetDate] = useState<Date>(defaultDate);

  const handlePreset = (year: number) => {
    const d = new Date(year, 0, 1);
    setTargetDate(d);
    onCalculate(d);
  };

  return (
    <InputPanel
      title={tr ? 'Güç Yasası Parametreleri' : 'Power Law Parameters'}
      onSubmit={(e) => { e.preventDefault(); onCalculate(targetDate); }}
      footer={
        <CalculateButton fullWidth>
          {tr ? 'Güç Yasası Fiyatını Hesapla' : 'Calculate Power Law Price'}
        </CalculateButton>
      }
    >
      <InputField
        label={<span className="inline-flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-muted-foreground" />{tr ? 'Hedef Projeksiyon Tarihi' : 'Target Projection Date'}</span>}
        tooltip={tr ? 'Güç yasası modelini değerlendireceğiniz gelecekteki tarih.' : 'Future date at which to evaluate the power-law model.'}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-background/50 border-border/30",
                !targetDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {targetDate ? format(targetDate, "PPP") : <span>{tr ? 'Bir tarih seçin' : 'Pick a date'}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={targetDate}
              onSelect={(d) => d && setTargetDate(d)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </InputField>

      <InputField label={tr ? 'Hızlı Ön Ayarlar' : 'Quick Presets'}>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.year}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePreset(p.year)}
              className="text-sm bg-background/50 border-border/30 hover:bg-primary/10 hover:text-primary"
            >
              {p.label}
            </Button>
          ))}
        </div>
      </InputField>
    </InputPanel>
  );
};
