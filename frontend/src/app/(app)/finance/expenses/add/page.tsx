import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { expenseCategoryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { getExpenseCategoriess } from "@/servers/expense-categories";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import AddExpenseForm from "./_components/add-expense-form";

export const metadata: Metadata = {
  title: "Add New Expense",
  description:
    "Add expense details including amount, category, date, and any supporting documentation.",
  robots: {
    index: false,
    follow: false,
  },
};

const AddExpensePage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: expenseCategoryKeys.all,
    queryFn: async () => getExpenseCategoriess(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Link
          href="/finance/expenses"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Expenses
        </Link>

        <div className="mt-7 max-w-5xl space-y-8 border p-6">
          <PageHeader
            title="Record New Expense"
            description="Add expense details including amount, category, date, and any supporting documentation"
          />

          <AddExpenseForm />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  AddExpensePage,
  PermissionsEnum.ADD_EXPENSES_PAGE,
);
