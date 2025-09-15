import { Suspense } from "react";
import PaymentFailedPage from "./_components/payment-failed-page";

const Page = () => {
  return (
    <Suspense>
      <PaymentFailedPage />;
    </Suspense>
  );
};

export default Page;
