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
import { parseAsIsoDate, useQueryState } from "nuqs";

const ExportsDropdown = () => {
  const [startDate, _setStartDate] = useQueryState(
    "start_date",
    parseAsIsoDate,
  );
  const [endDate, _setEndDate] = useQueryState("end_date", parseAsIsoDate);
  const [operator, _setOperator] = useQueryState("operator", {
    clearOnDefault: true,
  });
  const [status, _setStatus] = useQueryState("status", {
    clearOnDefault: true,
  });
  const [paymentMethod, _setPaymentMethod] = useQueryState("payment_method", {
    clearOnDefault: true,
  });

  const canExportSalesReport = usePermission(
    PermissionsEnum.EXPORT_SALES_REPORTS,
  );

  if (!canExportSalesReport) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={!canExportSalesReport}
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
              path: "/reports/sales/export",
              baseUrl: env.NEXT_PUBLIC_BACKEND_URL,
              searchParams: {
                operator,
                status,
                payment_method: paymentMethod,
                start_date: startDate?.toISOString(),
                end_date: endDate?.toISOString(),
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
              path: "/reports/sales/export",
              baseUrl: env.NEXT_PUBLIC_BACKEND_URL,
              searchParams: {
                operator,
                status,
                payment_method: paymentMethod,
                start_date: startDate?.toISOString(),
                end_date: endDate?.toISOString(),
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

export default ExportsDropdown;
