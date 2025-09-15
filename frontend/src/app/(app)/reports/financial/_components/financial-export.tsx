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

const FinancialExport = () => {
  const [period, _setPeriod] = useQueryState("period", {
    clearOnDefault: true,
  });
  const [startDate, _setStartDate] = useQueryState(
    "start_date",
    parseAsIsoDate,
  );
  const [endDate, _setEndDate] = useQueryState("end_date", parseAsIsoDate);

  const canExportFinancialReport = usePermission(
    PermissionsEnum.EXPORT_FINANCIAL_REPORTS,
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
              path: "/reports/financial/export",
              baseUrl: env.NEXT_PUBLIC_BACKEND_URL,
              searchParams: {
                period,
                start_date: startDate?.toString(),
                end_date: endDate?.toString(),
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
              path: "/reports/financial/export",
              baseUrl: env.NEXT_PUBLIC_BACKEND_URL,
              searchParams: {
                period,
                start_date: startDate?.toString(),
                end_date: endDate?.toString(),
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

export default FinancialExport;
