"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FinancialPeriodEnum } from "@/enums/financial-period";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Settings2Icon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

const FinancialFilter = () => {
  const [openSheet, openSheetToggle] = useState<boolean>(false);

  const [period, setPeriod] = useQueryState("period", { clearOnDefault: true });
  const [startDate, setStartDate] = useQueryState("start_date", parseAsIsoDate);
  const [endDate, setEndDate] = useQueryState("end_date", parseAsIsoDate);

  const [draftPeriod, setDraftPeriod] = useState(period);
  const [draftDateRange, setDraftDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: startDate,
    to: endDate,
  });

  const handleApply = () => {
    if (draftPeriod === "custom") {
      setStartDate(draftDateRange.from);
      setEndDate(draftDateRange.to);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
    setPeriod(draftPeriod || null);
  };

  const handleReset = () => {
    setDraftPeriod(null);
    setDraftDateRange({ from: null, to: null });
    setPeriod(null);
    setStartDate(null);
    setEndDate(null);
  };

  const periodMap = Object.entries(FinancialPeriodEnum).map(([key, value]) => ({
    label: key.charAt(0) + key.slice(1).toLocaleLowerCase(),
    value,
  }));

  useEffect(() => {
    if (openSheet) {
      setDraftPeriod(period);
      setDraftDateRange({
        from: startDate,
        to: endDate,
      });
    }
  }, [openSheet, period, startDate, endDate]);

  return (
    <Sheet open={openSheet} onOpenChange={openSheetToggle}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Settings2Icon className="h-4 w-4" />
          Filters
          {(period || startDate || endDate) && (
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-lg font-semibold">
            Financial Report Filters
          </SheetTitle>
          <SheetDescription className="text-sm">
            {period === "custom"
              ? "Custom date range"
              : period
                ? `${period.charAt(0).toUpperCase() + period.slice(1)} view`
                : "No filters applied"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time Period</Label>
              <Select
                value={draftPeriod ?? ""}
                onValueChange={(value) => {
                  setDraftPeriod(value || null);
                  if (value !== "custom") {
                    setDraftDateRange({ from: null, to: null });
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  {periodMap.map((period, index) => (
                    <SelectItem key={index} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {draftPeriod === "custom" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        (!draftDateRange.from || !draftDateRange.to) &&
                          "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {draftDateRange.from ? (
                        draftDateRange.to ? (
                          <>
                            {format(draftDateRange.from, "LLL dd, y")} -{" "}
                            {format(draftDateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(draftDateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Select date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: draftDateRange.from ?? undefined,
                        to: draftDateRange.to ?? undefined,
                      }}
                      onSelect={(range) => {
                        const from = range?.from
                          ? new Date(range.from.setHours(0, 0, 0, 0))
                          : null;
                        const to = range?.to
                          ? new Date(range.to.setHours(23, 59, 59, 999))
                          : null;

                        setDraftDateRange({ from, to });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex flex-row items-center justify-between gap-3 border-t px-6 py-4">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={
              !draftPeriod && !draftDateRange.from && !draftDateRange.to
            }
            className="px-4"
          >
            Reset
          </Button>
          <div className="flex gap-3">
            <SheetClose asChild>
              <Button variant="outline" className="px-6">
                Cancel
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                onClick={handleApply}
                className="px-6"
                disabled={
                  draftPeriod === "custom" &&
                  (!draftDateRange.from || !draftDateRange.to)
                }
              >
                Apply
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FinancialFilter;
