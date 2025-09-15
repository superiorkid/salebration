import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PermissionsEnum } from "@/enums/permissions";
import { env } from "@/env";
import { getQueryClient } from "@/lib/query-client";
import { transactionKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { detailTransaction } from "@/servers/sale";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import TransactionDetails from "./_components/transaction-details";

interface TransactionDetailPageProps {
  params: Promise<{ transactionId: string }>;
}

export async function generateMetadata({
  params,
}: TransactionDetailPageProps): Promise<Metadata> {
  const transactionId = (await params).transactionId;

  const transaction = await detailTransaction(Number(transactionId));

  if (!transaction || "error" in transaction) {
    return {
      title: `Transaction Detail | ${env.APP_NAME}`,
      description: "Could not load transaction details.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Transaction #${transaction.data?.invoice.number}`,
    description: `Details for transaction #${transaction.data?.invoice.number} from ${
      transaction.data?.customer?.name
        ? `, customer: ${transaction.data?.customer?.name}`
        : ""
    }.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const TransactionDetailPage = async ({
  params,
}: TransactionDetailPageProps) => {
  const { transactionId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: transactionKeys.detail(Number(transactionId)),
    queryFn: async () => detailTransaction(Number(transactionId)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 py-6">
        <Link
          href="/sales/transactions"
          className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
        >
          <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
          Back to Transactions
        </Link>

        <div className="mt-7 space-y-8 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <PageHeader
              title="Detail Transaction"
              description="View all details of this transaction including items, payments, and customer information."
            />
          </div>

          <Separator />

          <TransactionDetails transactionId={Number(transactionId)} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default withPermission(
  TransactionDetailPage,
  PermissionsEnum.DETAIL_TRANSACTIONS_PAGE,
);
