"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type CalendarDateRangePickerProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  numberOfMonths?: number;
  placeholder?: string;
};

export function CalendarDateRangePicker({
  className,
  value,
  onChange,
  numberOfMonths = 2,
  placeholder = "Pick a date",
  ...props
}: CalendarDateRangePickerProps) {
  // Uncontrolled default (keeps your original feel)
  const uncontrolledDefault: DateRange = React.useMemo(
    () => ({
      from: new Date(),
      to: addDays(new Date(), 20),
    }),
    []
  );

  const isControlled = value !== undefined;
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    value ?? uncontrolledDefault
  );

  // Keep internal state in sync if controlled
  React.useEffect(() => {
    if (isControlled) setInternalDate(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled, value?.from?.getTime(), value?.to?.getTime()]);

  const date = internalDate;

  const setDate = (range: DateRange | undefined) => {
    if (!isControlled) setInternalDate(range);
    onChange?.(range);
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
  };

  const label = date?.from
    ? date?.to
      ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
      : format(date.from, "LLL dd, y")
    : placeholder;

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            aria-label="Open date range picker"
            className={cn(
              "w-[260px] justify-between text-left font-normal",
              "!bg-[var(--secondary-dark-color)] border-gray-700 !text-white",
              "!cursor-pointer"
            )}
          >
            <span className="inline-flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {label}
            </span>
            {date?.from || date?.to ? (
              <X
                className="ml-2 h-4 w-4 opacity-70 hover:opacity-100"
                onClick={clearDates}
                aria-label="Clear selection"
              />
            ) : null}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-auto p-0 border-gray-800 bg-[var(--secondary-dark-color)] text-white"
        >
          <div className="p-2">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={numberOfMonths}
            />
            <div className="flex items-center justify-end gap-2 p-2 pt-0">
              <Button
                variant="ghost"
                className="text-white/80 hover:bg-white/10"
                onClick={() => setDate(undefined)}
              >
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
