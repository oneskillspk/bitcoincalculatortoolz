import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
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


  return (
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
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
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
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
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
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }) => (
          <div className="flex items-center gap-2 mb-2">
            <Select
              value={displayMonth.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="h-8 w-20 text-sm bg-background/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={monthOptions[displayMonth.getMonth()]}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="h-8 w-28 text-sm bg-background/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
