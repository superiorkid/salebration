import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { expenseCategoryKeys, expenseKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { detailExpense } from "@/servers/expense";
import { getExpenseCategoriess } from "@/servers/expense-categories";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import EditExpenseForm from "./_components/edit-expense-form";

interface EditExpensePageProps {
  params: Promise<{ expenseId: string }>;
}

export async function generateMetadata({
  params,
}: EditExpensePageProps): Promise<Metadata> {
  const expenseId = (await params).expenseId;

  const expense = await detailExpense(Number(expenseId));

  if (!expense || "error" in expense) {
    return {
      title: "Edit Expense - Not Found",
      description: "The requested expense record could not be found.",
    };
  }

  return {
    title: `Edit Expense #${expense.data?.id}`,
    description: `Modify expense dated ${expense.data?.description} with amount ${expense.data?.amount}`,
  };
}

const EditExpensePage = async ({ params }: EditExpensePageProps) => {
  const { expenseId } = await params;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: expenseKeys.detail(Number(expenseId)),
      queryFn: async () => detailExpense(Number(expenseId)),
    }),
    queryClient.prefetchQuery({
      queryKey: expenseCategoryKeys.all,
      queryFn: async () => getExpenseCategoriess(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <Link
          href="/finance/expenses"
          className={cn(
            buttonVariants({ size: "sm", variant: "ghost" }),
            "text-muted-foreground hover:text-primary",
          )}
        >
          <ChevronLeftIcon strokeWidth={2} size={16} className="mr-2" />
          Back to Expenses
        </Link>

        <div className="bg-card max-w-4xl space-y-8 rounded-lg border p-6 shadow-sm">
          <PageHeader
            title="Update Expense Record"
            description="Modify the expense details including amount, category, date, or supporting documents"
          />

          <EditExpenseForm expenseId={Number(expenseId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  EditExpensePage,
  PermissionsEnum.EDIT_EXPENSES_PAGE,
);
