"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDetailExpense } from "@/hooks/tanstack/expense";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface DetailExpenseProps {
  expenseId: number;
}

const DetailExpense = ({ expenseId }: DetailExpenseProps) => {
  const { error, expense, isError, isPending } = useDetailExpense(expenseId);

  if (isPending) {
    return (
      <div className="flex justify-center py-8">Loading expense detail...</div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch expense detail"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!expense?.data) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{expense?.data?.title}</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Description
            </h3>
            <p className="text-base">{expense?.data?.description || "-"}</p>
          </div>

          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Category
            </h3>
            <p className="text-base capitalize">
              {expense?.data?.category?.name}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Amount
            </h3>
            <p className="text-base font-medium">
              {formatCurrency(expense?.data?.amount || 0)}
            </p>
          </div>

          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Payment Date
            </h3>
            <p className="text-base">
              {format(new Date(expense?.data?.paid_at as Date), "PPpp")}
            </p>
          </div>

          <div>
            <h3 className="text-muted-foreground text-sm font-medium">
              Created At
            </h3>
            <p className="text-base">
              {format(new Date(expense?.data?.created_at as Date), "PPpp")}
            </p>
          </div>
        </div>
      </div>

      {(expense?.data?.media || [])?.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Attachments</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {expense?.data?.media.map((file) => (
              <div key={file.id} className="overflow-hidden rounded-lg border">
                <div className="relative aspect-video">
                  <Image
                    fill
                    src={file.original_url}
                    alt={file.name}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {file.size > 1024
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : `${file.size} bytes`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailExpense;
