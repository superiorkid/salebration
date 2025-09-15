import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { getQueryClient } from "@/lib/query-client";
import { expenseKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getExpenses } from "@/servers/expense";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ExpensesTable from "./_components/expenses-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Management",
  description: "Track, categorize, and analyze your organization's spending.",
  robots: {
    index: false,
    follow: false,
  },
};

const ExpensesPageSchema = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: expenseKeys.all,
    queryFn: async () => getExpenses(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <PageHeader
          title="Expense Management"
          description="Track, categorize, and analyze your organization's spending"
        />

        <div className="mt-7">
          <ExpensesTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  ExpensesPageSchema,
  PermissionsEnum.VIEW_EXPENSES_PAGE,
);
