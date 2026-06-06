import { Button } from "@/components/ui/button";
import { PRESET_DATES, type PresetDate } from "@/services/timeMachineService";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  onSelect: (preset: PresetDate) => void;
  selectedDate: string;
}

export const TimeMachinePresets = ({ onSelect, selectedDate }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{tr ? 'Ünlü Tarihler' : 'Famous Dates'}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {PRESET_DATES.map((preset) => (
          <Button
            key={preset.date}
            variant={selectedDate === preset.date ? "default" : "outline"}
            size="sm"
            className="h-auto py-2 px-3 text-left flex flex-col items-start gap-0.5"
            onClick={() => onSelect(preset)}
          >
            <span className="text-xs font-medium flex items-center gap-1">
              <span>{preset.emoji}</span> {tr ? (preset.labelTr ?? preset.label) : preset.label}
            </span>
            <span className="text-[10px] sm:text-xs opacity-70">{preset.date}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
