"use client";

import { Button } from "@/components/ui/button";
import { XCircleIcon } from "lucide-react";
import Link from "next/link";

const ValidateTokenError = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 text-center shadow-sm">
        <div className="inline-block rounded-full bg-red-100 p-4">
          <XCircleIcon className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          Verification Failed
        </h2>
        <p className="mt-2 text-gray-600">
          Invalid or expired order verification link
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          <Button className="mt-3 w-full" asChild>
            <Link href="/support">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValidateTokenError;
