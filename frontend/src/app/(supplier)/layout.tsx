import React from "react";

interface SupplierConfirmationOrderLayoutProps {
  children: React.ReactNode;
}

const SupplierConfirmationOrderLayout = ({
  children,
}: SupplierConfirmationOrderLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold">Confirmation Order</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, Supplier</span>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      <footer className="border-t bg-white p-4 text-center text-sm text-gray-600">
        <div className="mx-auto max-w-7xl">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SupplierConfirmationOrderLayout;
