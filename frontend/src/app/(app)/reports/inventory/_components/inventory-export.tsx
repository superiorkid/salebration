"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionsEnum } from "@/enums/permissions";
import { env } from "@/env";
import { usePermission } from "@/hooks/use-permission";
import { buildExportUrl } from "@/lib/utils";
import { DownloadIcon, FileSpreadsheetIcon } from "lucide-react";
import Link from "next/link";
import { parseAsBoolean, useQueryState } from "nuqs";

const InventoryExport = () => {
  const [category, _setCategory] = useQueryState("category", {
    parse: (value) => Number(value),
    serialize: (value) => value?.toString() ?? "",
  });
  const [supplier, _setSupplier] = useQueryState("supplier", {
    parse: (value) => Number(value),
    serialize: (value) => value?.toString() ?? "",
  });
  const [showLowStock, _setShowLowStock] = useQueryState(
    "showLowStock",
    parseAsBoolean.withDefault(false),
  );

  const canExportFinancialReport = usePermission(
    PermissionsEnum.EXPORT_INVENTORY_REPORTS,
  );

  if (!canExportFinancialReport) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={!canExportFinancialReport}
        >
          <DownloadIcon className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            href={buildExportUrl({
              mode: "csv",
              path: "/reports/inventory/export",
              baseUrl: env.NEXT_PUBLIC_BACKEND_URL,
              searchParams: {
                category,
                supplier,
                show_low_stock: showLowStock ? "true" : "false",
              },
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
            CSV
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={buildExportUrl({
              mode: "excel",
              path: "/reports/inventory/export",
              baseUrl: env.NEXT_PUBLIC_BACKEND_URL,
              searchParams: {
                category,
                supplier,
                show_low_stock: showLowStock ? "true" : "false",
              },
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
            Excel
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InventoryExport;
