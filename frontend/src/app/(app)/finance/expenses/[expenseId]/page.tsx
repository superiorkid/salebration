import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { expenseKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { detailExpense } from "@/servers/expense";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import DetailExpense from "./_components/detail-expense";
import ExpenseActionButtons from "./_components/expense-action-buttons";

interface DetailExpensePageProps {
  params: Promise<{ expenseId: string }>;
}

export async function generateMetadata({
  params,
}: DetailExpensePageProps): Promise<Metadata> {
  const expenseId = (await params).expenseId;

  const expense = await detailExpense(Number(expenseId));

  if (!expense || "error" in expense) {
    return {
      title: "Expense Not Found",
      description: "No expense record could be found for this ID.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Expense #${expense.data?.id}`,
    description: `Details for expense: ${expense.data?.description || "No additional description"}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const DetailExpensePage = async ({ params }: DetailExpensePageProps) => {
  const { expenseId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: expenseKeys.detail(Number(expenseId)),
    queryFn: async () => detailExpense(Number(expenseId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/finance/expenses"
          className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Expenses
        </Link>

        <div className="mt-7 space-y-8 border p-6">
          <div className="flex items-center justify-between">
            <PageHeader
              title="Expense Details"
              description="View and manage this expense record"
            />

            <ExpenseActionButtons expenseId={Number(expenseId)} />
          </div>

          <Separator />

          <DetailExpense expenseId={Number(expenseId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  DetailExpensePage,
  PermissionsEnum.DETAIL_EXPENSES_PAGE,
);
