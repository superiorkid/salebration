import { Suspense } from "react";
import ValidateOrderToken from "../../_components/validate-order-token";
import PurchaseOrderConfirmation from "./_components/purchase-order-confirmation";

interface PageProps {
  searchParams: Promise<{ token: string; type: "purchase-order" | "reorder" }>;
  params: Promise<{ purchaseOrderId: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { token, type } = await searchParams;
  const { purchaseOrderId } = await params;

  return (
    <ValidateOrderToken
      orderId={Number(purchaseOrderId)}
      token={token}
      type={type}
    >
      <Suspense>
        <PurchaseOrderConfirmation />
      </Suspense>
    </ValidateOrderToken>
  );
};

export default Page;
