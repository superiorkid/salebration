"use client";

import { XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PaymentFailedPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reason = searchParams.get("reason");
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (reason !== "failed" || !ref) {
      // redirect if accessed manually or missing params
      router.replace("/");
    }
  }, [reason, ref, router]);

  if (reason !== "failed" || !ref) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 px-4 text-center">
      <XCircleIcon className="mb-4 h-20 w-20 text-red-600" />
      <h1 className="text-2xl font-semibold text-red-700">Payment Failed</h1>
      <p className="mt-2 max-w-md text-gray-600">
        Payment for order <strong>#{ref}</strong> failed. Please try again.
      </p>

      <div className="mt-6 flex gap-4">
        <Link href="/sales/pos">
          <a className="rounded-md bg-red-600 px-6 py-2 text-white transition hover:bg-red-700">
            Try Again
          </a>
        </Link>
        <Link href="/">
          <a className="rounded-md bg-gray-300 px-6 py-2 text-gray-800 transition hover:bg-gray-400">
            Back to Home
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
