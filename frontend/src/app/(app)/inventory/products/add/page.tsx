import PageHeader from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { withPermission } from "@/lib/with-permission";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ProductForm from "../_components/product-form";

export const metadata: Metadata = {
  title: `Add New Product | ${env.APP_NAME}`,
  description: `Fill in product details, variants, pricing, and inventory information in ${env.APP_NAME}.`,
  robots: {
    index: false,
    follow: false,
  },
};

const AddProductPage = () => {
  return (
    <div>
      <Link
        href="/inventory/products"
        className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
      >
        <ChevronLeftIcon strokeWidth={2} size={20} className="mr-1" />
        Back to Products
      </Link>

      <div className="mt-7 space-y-8 p-3">
        <PageHeader
          title="Add New Product"
          description="Fill in product details, variants, pricing, and inventory information"
        />

        <ProductForm />
      </div>
    </div>
  );
};

export default withPermission(
  AddProductPage,
  PermissionsEnum.ADD_PRODUCTS_PAGE,
);
