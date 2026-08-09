import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { t } = useLanguage();
  // Prefer the currently-selected date so the picker opens on the right month,
  // then fall back to an explicit `month` prop, then today.
  const selectedProp = (props as { selected?: Date | Date[] }).selected;
  const selectedDate = Array.isArray(selectedProp) ? selectedProp[0] : selectedProp;

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    () => (selectedDate instanceof Date ? selectedDate : props.month ?? new Date()),
  );

  // Keep the calendar in sync when the consumer changes `selected` or `month`
  // externally (e.g. preset chips, form reset, controlled parents).
  React.useEffect(() => {
    if (selectedDate instanceof Date) {
      setCurrentMonth((prev) =>
        prev.getFullYear() === selectedDate.getFullYear() &&
        prev.getMonth() === selectedDate.getMonth()
          ? prev
          : selectedDate,
      );
    }
  }, [selectedDate?.getTime()]);

  React.useEffect(() => {
    if (props.month instanceof Date) setCurrentMonth(props.month);
  }, [props.month?.getTime()]);

  // ── A11y: remember the last-focused day-of-month so a month change restores
  // focus to the analogous day (e.g. Jan 15 → Feb 15) instead of dropping the
  // user back on the Select trigger. This preserves keyboard-navigation flow.
  const containerRef = React.useRef<HTMLDivElement>(null);
  const focusedDayRef = React.useRef<number | null>(null);
  const monthChangeCountRef = React.useRef(0);

  const captureDayFocus = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.matches?.('button[name="day"]')) {
      const n = Number((t.textContent ?? '').trim());
      if (Number.isFinite(n) && n > 0) focusedDayRef.current = n;
    }
  }, []);

  React.useLayoutEffect(() => {
    monthChangeCountRef.current += 1;
    // Skip the initial mount — react-day-picker handles first-focus via
    // `initialFocus` / autofocus itself.
    if (monthChangeCountRef.current === 1) return;
    const day = focusedDayRef.current;
    const root = containerRef.current;
    if (day == null || !root) return;

    // Defer until DayPicker re-renders the new month grid.
    const raf =
      typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame
        : (cb: FrameRequestCallback) => window.setTimeout(() => cb(0), 0);

    raf(() => {
      const buttons = Array.from(
        root.querySelectorAll<HTMLButtonElement>('button[name="day"]:not([disabled])'),
      );
      // Prefer an in-month day whose label matches; fall back to any tile with
      // that day-of-month (last-resort: first enabled day).
      const inMonth = buttons.find(
        (b) => !b.classList.contains('day-outside') && (b.textContent ?? '').trim() === String(day),
      );
      const anyMatch =
        inMonth ?? buttons.find((b) => (b.textContent ?? '').trim() === String(day));
      const target = anyMatch ?? buttons[0];
      target?.focus();
    });
  }, [currentMonth]);

  // Generate year options (from 2009 to current year)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2009 + 1 },
    (_, i) => currentYear - i
  );

  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    // Clamp to day 1 before setFullYear/setMonth to avoid day overflow
    // (e.g. Jan 31 → set month to Feb → March 3 instead of Feb 28).
    newDate.setDate(1);
    newDate.setFullYear(parseInt(year));
    setCurrentMonth(newDate);
    props.onMonthChange?.(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(1);
    newDate.setMonth(monthOptions.indexOf(month));
    setCurrentMonth(newDate);
    props.onMonthChange?.(newDate);
  };

  const captionLabel = `${monthOptions[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={props['aria-label'] ?? t('aria.datePicker', { defaultValue: 'Date picker' })}
      onFocus={captureDayFocus}
      className="contents"
    >
      {/* Polite live region announces month/year changes to screen readers. */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {captionLabel}
      </span>
      <DayPicker
        showOutsideDays={showOutsideDays}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        className={cn("p-3 pointer-events-auto", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "hidden", // Hide default label since we're using custom selectors
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        labels={{
          labelPrevious: () => t('aria.prevMonth', { defaultValue: 'Go to previous month' }),
          labelNext: () => t('aria.nextMonth', { defaultValue: 'Go to next month' }),
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" aria-hidden="true" />,
          IconRight: () => <ChevronRight className="h-4 w-4" aria-hidden="true" />,
          Caption: ({ displayMonth }) => (
            <div className="flex items-center gap-2 mb-2">
              <select
                value={displayMonth.getFullYear().toString()}
                onChange={(event) => handleYearChange(event.target.value)}
                className="h-8 w-20 rounded-md border border-input bg-background/80 px-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={t('aria.selectYear')}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={monthOptions[displayMonth.getMonth()]}
                onChange={(event) => handleMonthChange(event.target.value)}
                className="h-8 w-28 rounded-md border border-input bg-background/80 px-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={t('aria.selectMonth')}
              >
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          ),
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
