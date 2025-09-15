import React, { Suspense } from "react";
import ValidateOrderToken from "../../_components/validate-order-token";
import ReorderConfirmationPage from "./_components/reorder-confirmation";

interface PageProps {
  searchParams: Promise<{ token: string; type: "purchase-order" | "reorder" }>;
  params: Promise<{ reorderId: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { token, type } = await searchParams;
  const { reorderId } = await params;

  return (
    <ValidateOrderToken orderId={Number(reorderId)} token={token} type={type}>
      <Suspense>
        <ReorderConfirmationPage />
      </Suspense>
    </ValidateOrderToken>
  );
};

export default Page;
