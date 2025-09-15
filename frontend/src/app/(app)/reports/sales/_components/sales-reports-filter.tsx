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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Settings2Icon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { useState } from "react";

const SalesReportFilters = () => {
  const [startDate, setStartDate] = useQueryState("start_date", parseAsIsoDate);
  const [endDate, setEndDate] = useQueryState("end_date", parseAsIsoDate);
  const [operator, setOperator] = useQueryState("operator", {
    clearOnDefault: true,
  });
  const [status, setStatus] = useQueryState("status", { clearOnDefault: true });
  const [paymentMethod, setPaymentMethod] = useQueryState("payment_method", {
    clearOnDefault: true,
  });

  const [draftFilters, setDraftFilters] = useState({
    start_date: startDate,
    end_date: endDate,
    operator: operator,
    status: status,
    payment_method: paymentMethod,
  });

  const handleApplyFilters = () => {
    setStartDate(draftFilters.start_date);
    setEndDate(draftFilters.end_date);
    setOperator(draftFilters.operator);
    setStatus(draftFilters.status);
    setPaymentMethod(draftFilters.payment_method);
  };

  const handleResetFilters = () => {
    setDraftFilters({
      start_date: null,
      end_date: null,
      operator: null,
      status: null,
      payment_method: null,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Settings2Icon className="h-4 w-4" />
          Filters
          {(startDate || endDate || operator || status || paymentMethod) && (
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-lg font-semibold">
            Report Filters
          </SheetTitle>
          <SheetDescription className="text-sm">
            Customize the sales report by applying filters
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      (!draftFilters.start_date || !draftFilters.end_date) &&
                        "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {draftFilters.start_date ? (
                      draftFilters.end_date ? (
                        <>
                          {format(draftFilters.start_date, "LLL dd, y")} -{" "}
                          {format(draftFilters.end_date, "LLL dd, y")}
                        </>
                      ) : (
                        format(draftFilters.start_date, "LLL dd, y")
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
                      from: draftFilters.start_date as Date,
                      to: draftFilters.end_date as Date,
                    }}
                    onSelect={(range) => {
                      const cloneDate = (date: Date) =>
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate(),
                        );

                      const from = range?.from
                        ? new Date(cloneDate(range.from).setHours(0, 0, 0, 0))
                        : null;
                      const to = range?.to
                        ? new Date(
                            cloneDate(range.to).setHours(23, 59, 59, 999),
                          )
                        : null;

                      setDraftFilters((prev) => ({
                        ...prev,
                        start_date: from,
                        end_date: to,
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Operator</Label>
              <Select
                value={draftFilters.operator || ""}
                onValueChange={(value) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    operator: value || null,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All operators" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">John Doe</SelectItem>
                  <SelectItem value="2">Jane Smith</SelectItem>
                  <SelectItem value="3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={draftFilters.status || ""}
                onValueChange={(value) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    status: value || null,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Method</Label>
              <Select
                value={draftFilters.payment_method || ""}
                onValueChange={(value) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    payment_method: value || null,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <SheetFooter className="flex flex-row items-center justify-between gap-3 border-t px-6 py-4">
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            disabled={
              !draftFilters.start_date &&
              !draftFilters.end_date &&
              !draftFilters.operator &&
              !draftFilters.status &&
              !draftFilters.payment_method
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
              <Button onClick={handleApplyFilters} className="px-6">
                Apply
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SalesReportFilters;
