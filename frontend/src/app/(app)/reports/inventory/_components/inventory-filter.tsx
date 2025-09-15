"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { useCategories } from "@/hooks/tanstack/product-categories";
import { useSuppliers } from "@/hooks/tanstack/supplier";
import { Settings2Icon } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";

const InventoryFilter = () => {
  const { suppliers, isPending: isSupplierPending } = useSuppliers();
  const { categories, isPending: isCategoriesPending } = useCategories({
    parent_only: false,
  });

  const [category, setCategory] = useQueryState("category", {
    parse: (value) => Number(value),
    serialize: (value) => value?.toString() ?? "",
  });
  const [supplier, setSupplier] = useQueryState("supplier", {
    parse: (value) => Number(value),
    serialize: (value) => value?.toString() ?? "",
  });
  const [showLowStock, setShowLowStock] = useQueryState(
    "showLowStock",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const [draftFilters, setDraftFilters] = useState({
    category,
    supplier,
    showLowStock: showLowStock ?? false,
  });

  const handleApplyFilters = () => {
    setCategory(draftFilters.category || null);
    setSupplier(draftFilters.supplier || null);
    setShowLowStock(draftFilters.showLowStock || null);
  };

  const handleResetFilters = () => {
    setDraftFilters({
      category: null,
      supplier: null,
      showLowStock: false,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Settings2Icon className="h-4 w-4" />
          Filters
          {(category || supplier || showLowStock) && (
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-lg font-semibold">
            Inventory Filters
          </SheetTitle>
          <SheetDescription className="text-sm">
            {getActiveFiltersLabel(category, supplier, showLowStock)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={draftFilters.category?.toString() ?? ""}
                onValueChange={(value) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    category: value ? Number(value) : null,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {isCategoriesPending ? (
                    <SelectItem value="0" disabled>
                      Loading...
                    </SelectItem>
                  ) : categories?.data && categories.data.length > 0 ? (
                    categories.data.map((category, index) => (
                      <SelectItem
                        key={index}
                        value={category.id.toString()}
                        className="capitalize"
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="0" disabled>
                      No Categories Found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Supplier</Label>
              <Select
                value={draftFilters.supplier?.toString() ?? ""}
                onValueChange={(value) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    supplier: value ? Number(value) : null,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All suppliers" />
                </SelectTrigger>
                <SelectContent>
                  {isSupplierPending ? (
                    <SelectItem value="0" disabled>
                      Loading...
                    </SelectItem>
                  ) : suppliers?.data && suppliers.data.length > 0 ? (
                    suppliers.data.map((supplier, index) => (
                      <SelectItem
                        key={index}
                        value={supplier.id.toString()}
                        className="capitalize"
                      >
                        {supplier.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="0" disabled>
                      No Categories Found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Low Stock Toggle */}
            <div className="flex items-center justify-between space-y-2 rounded-lg border p-4">
              <div>
                <Label className="text-sm font-medium">
                  Show Low Stock Only
                </Label>
                <p className="text-muted-foreground text-xs">
                  Display items below minimum stock level
                </p>
              </div>
              <Switch
                checked={draftFilters.showLowStock}
                onCheckedChange={(checked) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    showLowStock: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <SheetFooter className="flex flex-row items-center justify-between gap-3 border-t px-6 py-4">
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            disabled={!category && !supplier && !showLowStock}
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

// Helper function to show active filters
function getActiveFiltersLabel(
  category: number | null,
  supplier: number | null,
  showLowStock: boolean | null,
): string {
  const activeFilters = [];
  if (category) activeFilters.push(`Category: ${getCategoryName(category)}`);
  if (supplier) activeFilters.push(`Supplier: ${getSupplierName(supplier)}`);
  if (showLowStock) activeFilters.push("Low Stock Only");

  return activeFilters.length > 0
    ? activeFilters.join(", ")
    : "No filters applied";
}

// Mock helper functions - replace with your actual data
function getCategoryName(id: number): string {
  const categories: Record<number, string> = {
    1: "Electronics",
    2: "Clothing",
    3: "Food",
    4: "Furniture",
  };
  return categories[id] || `Category ${id}`;
}

function getSupplierName(id: number): string {
  const suppliers: Record<number, string> = {
    1: "Supplier A",
    2: "Supplier B",
    3: "Supplier C",
  };
  return suppliers[id] || `Supplier ${id}`;
}

export default InventoryFilter;
