import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { expenseCategoryKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getExpenseCategoriess } from "@/servers/expense-categories";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import ExpenseCategoriesTable from "./_components/expense-categories-table";

export const metadata: Metadata = {
  title: "Expense Categories",
  description:
    "Organize and categorize your business expenses for better financial tracking and reporting.",
};

const ExpenseCategoryPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: expenseCategoryKeys.all,
    queryFn: async () => getExpenseCategoriess(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Manage Expense Categories"
          description="Organize and categorize your business expenses for better financial tracking and reporting."
        />

        <div className="mt-7">
          <ExpenseCategoriesTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  ExpenseCategoryPage,
  PermissionsEnum.VIEW_EXPENSES_CATEGORY_PAGE,
);
