"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // Container
        "p-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
        // Subtle gradient frame
        "relative before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:p-[1px]",
        "before:bg-gradient-to-br before:from-pink-200/60 before:via-fuchsia-200/40 before:to-indigo-200/40",
        "dark:before:from-pink-400/10 dark:before:via-fuchsia-400/10 dark:before:to-indigo-400/10",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-3",
        month: "flex flex-col gap-4",
        caption:
          "flex justify-center items-center relative w-full pt-1 pb-2 rounded-xl",
        caption_label:
          "text-sm font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 dark:from-pink-300 dark:via-fuchsia-300 dark:to-indigo-300",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 p-0 bg-background/60 backdrop-blur-sm border-input/60 text-foreground/70",
          "hover:opacity-100 hover:border-primary/40 hover:shadow-sm",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
          "aria-disabled:opacity-40"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm",
          "focus-within:relative focus-within:z-20",
          // selection backgrounds
          "[&:has([aria-selected])]:bg-primary/10",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100 rounded-lg",
          "hover:bg-primary/10 hover:text-foreground",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          // dreamy gradient pill for selected day
          "text-white hover:!text-white !bg-[linear-gradient(135deg,var(--primary)_0%,oklch(0.72_0.17_310)_100%)]",
        day_today:
          "bg-accent/60 text-accent-foreground ring-1 ring-primary/30",
        day_outside:
          "day-outside text-muted-foreground/70 aria-selected:bg-accent/40 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
        day_range_middle:
          "aria-selected:bg-primary/15 aria-selected:text-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...iconProps }) => (
          <ChevronLeft className={cn("size-4", className)} {...iconProps} />
        ),
        IconRight: ({ className, ...iconProps }) => (
          <ChevronRight className={cn("size-4", className)} {...iconProps} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
