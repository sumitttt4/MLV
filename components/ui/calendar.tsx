"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-brand-cream",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 text-brand-cream/60 hover:text-brand-gold transition-colors inline-flex items-center justify-center rounded-md",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-brand-cream/40 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-brand-gold/10 [&:has([aria-selected])]:bg-brand-gold/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-brand-gold/20 hover:text-brand-gold transition-colors inline-flex items-center justify-center text-brand-cream",
        day_range_end: "day-range-end",
        day_selected:
          "bg-brand-gold text-brand-dark hover:bg-brand-gold hover:text-brand-dark focus:bg-brand-gold focus:text-brand-dark font-bold",
        day_today: "bg-brand-gold/20 text-brand-gold font-bold",
        day_outside:
          "day-outside text-brand-cream/20 opacity-50 aria-selected:bg-brand-gold/10 aria-selected:text-brand-cream/40",
        day_disabled: "text-brand-cream/20 opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
