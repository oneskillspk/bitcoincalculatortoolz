import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Milestone {
  date: string;
  label: string;
  emoji: string;
}

const MILESTONES: Milestone[] = [
  { date: "2010-07-17", label: "Bitcoin trades", emoji: "🌱" },
  { date: "2013-11-28", label: "$1K", emoji: "🚀" },
  { date: "2017-12-17", label: "2017 ATH", emoji: "🏔️" },
  { date: "2020-03-12", label: "COVID", emoji: "🦠" },
  { date: "2021-11-10", label: "$69K ATH", emoji: "🎯" },
  { date: "2024-01-11", label: "Spot ETF", emoji: "🏛️" },
  { date: "2024-04-19", label: "Halving #4", emoji: "⛏️" },
];

const MIN_DATE = new Date("2010-07-17").getTime();
const MAX_DATE = Date.now();
const RANGE = MAX_DATE - MIN_DATE;

interface Props {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
}

function dateToValue(date: Date): number {
  return ((date.getTime() - MIN_DATE) / RANGE) * 1000;
}

function valueToDate(value: number): Date {
  return new Date(MIN_DATE + (value / 1000) * RANGE);
}

export const TimeMachineScrubber = ({ selectedDate, onDateChange }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [internalValue, setInternalValue] = useState<number>(
    selectedDate ? dateToValue(selectedDate) : 1000
  );
  const dragRef = useRef(false);

  useEffect(() => {
    if (selectedDate && !dragRef.current) {
      setInternalValue(dateToValue(selectedDate));
    }
  }, [selectedDate]);

  const currentDate = useMemo(() => valueToDate(internalValue), [internalValue]);

  const handleChange = useCallback(
    (vals: number[]) => {
      dragRef.current = true;
      const v = vals[0];
      setInternalValue(v);
      onDateChange(valueToDate(v));
    },
    [onDateChange]
  );

  const handleCommit = useCallback(() => { dragRef.current = false; }, []);

  const handleMilestoneClick = useCallback(
    (m: Milestone) => {
      const d = new Date(m.date);
      setInternalValue(dateToValue(d));
      onDateChange(d);
    },
    [onDateChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {tr ? 'Zaman yolculuğu için sürükleyin' : 'Drag to time travel'}
          </p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {format(currentDate, "MMMM d, yyyy")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {tr ? 'Yıl önce' : 'Years ago'}
          </p>
          <p className="text-lg font-bold text-primary tabular-nums">
            {((MAX_DATE - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)}y
          </p>
        </div>
      </div>

      <div className="relative pt-6 pb-10">
        <div className="absolute inset-x-0 top-0 h-6 pointer-events-none">
          {MILESTONES.map((m) => {
            const pct = (dateToValue(new Date(m.date)) / 1000) * 100;
            return (
              <button
                key={m.date}
                type="button"
                onClick={() => handleMilestoneClick(m)}
                className="absolute -translate-x-1/2 pointer-events-auto group"
                style={{ left: `${pct}%` }}
                aria-label={`${tr ? 'Şuraya git:' : 'Jump to'} ${m.label} (${m.date})`}
              >
                <span className="text-base group-hover:scale-125 transition-transform inline-block">{m.emoji}</span>
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-[9px] whitespace-nowrap text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        <Slider
          value={[internalValue]}
          min={0}
          max={1000}
          step={1}
          onValueChange={handleChange}
          onValueCommit={handleCommit}
          className={cn("cursor-grab active:cursor-grabbing")}
          aria-label={tr ? 'Bitcoin zaman makinesi tarih kaydırıcısı' : 'Bitcoin time machine date scrubber'}
        />

        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-muted-foreground/70 font-medium tabular-nums px-1">
          <span>2010</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};
