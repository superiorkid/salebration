import PageHeader from "@/components/page-header";
import { PermissionsEnum } from "@/enums/permissions";
import { env } from "@/env";
import { getQueryClient } from "@/lib/query-client";
import { transactionKeys } from "@/lib/query-keys";
import { withPermission } from "@/lib/with-permission";
import { getTodayKpis, getTransations } from "@/servers/sale";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import TransactionKpiCards from "./_components/transaction-kpi-cards";
import TransationsTable from "./_components/transactions-table";

export const metadata: Metadata = {
  title: `Transaction Management | ${env.APP_NAME}`,
  description: `Track, analyze, and manage all sales transactions and financial activities in ${env.APP_NAME}.`,
  robots: {
    index: false,
    follow: false,
  },
};

const TransactionsPage = async () => {
  const queryCLient = getQueryClient();

  await Promise.all([
    queryCLient.prefetchQuery({
      queryKey: transactionKeys.all,
      queryFn: async () => getTransations(),
    }),
    queryCLient.prefetchQuery({
      queryKey: transactionKeys.kpi(),
      queryFn: async () => getTodayKpis(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <div>
        <PageHeader
          title="Transaction Management"
          description="Track, analyze, and manage all sales transactions and financial activities"
        />

        <div className="mt-7 space-y-7 divide-y">
          <div className="pb-7">
            <h2 className="mb-4 text-xl font-semibold">Sales Overview Today</h2>
            <TransactionKpiCards />
          </div>

          <div className="">
            <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
            <TransationsTable />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  TransactionsPage,
  PermissionsEnum.VIEW_TRANSACTIONS_PAGE,
);
