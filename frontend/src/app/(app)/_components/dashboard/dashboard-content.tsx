"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDashboardMetrics } from "@/hooks/tanstack/dashboard";
import { SalesByPaymentMethod, Summary } from "@/types/dashboard";
import { AlertCircleIcon } from "lucide-react";
import DashboardStats from "./dashboard-stats";
import DashboardTopSelling from "./dashboard-top-selling";
import PaymentMethodsTotal from "./payment-methods-total";
import WeeklySale from "./weekly-sale";

const DashboardContent = () => {
  const { dashboard, error, isError, isPending, isRefetching } =
    useDashboardMetrics();

  if (isPending || isRefetching) {
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-muted/50 h-36 rounded-lg border" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch dashboard metrics"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-7 space-y-5">
      <section>
        <DashboardStats summary={dashboard?.data?.summary as Summary} />
      </section>
      <section className="flex flex-col gap-4 xl:flex-row">
        <PaymentMethodsTotal
          paymentMethod={
            dashboard?.data?.sales_by_payment_method as SalesByPaymentMethod[]
          }
        />
        <DashboardTopSelling
          topProducts={dashboard?.data?.top_products || []}
        />
      </section>
      <section className="aspect-square space-y-8 border p-5 md:aspect-video xl:aspect-[4/1]">
        <WeeklySale data={dashboard?.data?.weekly_sales || []} />
      </section>
    </div>
  );
};

export default DashboardContent;
