"use client";

import { FormSkeleton } from "@/components/form-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProduct,
  useProductDetail,
  useUpdateProduct,
} from "@/hooks/tanstack/product";
import { useCategories } from "@/hooks/tanstack/product-categories";
import { useSuppliers } from "@/hooks/tanstack/supplier";
import { cn, getFileNameFromUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Product, productSchema } from "../product-schema";
import ProductVariantManual from "./product-variant-manual";

interface ProductFormProps {
  productId?: number;
}

const ProductForm = ({ productId }: ProductFormProps) => {
  const [existingProductImage, setExistingProductImage] = useState<
    string | undefined
  >(undefined);

  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      basePrice: undefined,
      isActive: true,
      image: undefined,
      categoryId: undefined,
      supplierId: undefined,
      productVariantHelpers: [],
      productVariants: [],
    },
  });

  console.log("errors", form.formState.errors);

  const { createProductMutation, isPending: createProductPending } =
    useCreateProduct();

  const { updateProductMutation, isPending: updateProductPending } =
    useUpdateProduct();

  const onSubmit = (values: Product) => {
    const cleanedVariants = (values.productVariants ?? []).filter(
      (v) => v && typeof v === "object" && Object.keys(v).length > 0,
    );

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("sku", values.sku);
    formData.append("description", values.description || "");
    formData.append("base_price", values.basePrice.toString());
    formData.append("status", values.isActive ? "active" : "inactive");
    formData.append("category_id", values.categoryId);
    formData.append("supplier_id", values.supplierId);

    if (values.image) {
      formData.append("image", values.image);
    }

    cleanedVariants.forEach((variant, index) => {
      formData.append(`variants[${index}][attribute]`, variant.attribute);
      formData.append(`variants[${index}][value]`, variant.value);
      formData.append(`variants[${index}][sku_suffix]`, variant.skuSuffix);
      formData.append(`variants[${index}][barcode]`, variant.barcode || "");
      formData.append(
        `variants[${index}][additional_price]`,
        variant.additionalPrice.toString(),
      );
      formData.append(
        `variants[${index}][selling_price]`,
        variant.sellingPrice.toString(),
      );
      formData.append(
        `variants[${index}][quantity]`,
        variant.quantity.toString(),
      );
      formData.append(
        `variants[${index}][min_stock_level]`,
        variant.minStockLevel.toString(),
      );

      if (variant.image) {
        formData.append(`variants[${index}][image]`, variant.image);
      }

      if (productId) {
        formData.append(`variants[${index}][product_id]`, productId.toString());
      }

      if (productId && variant.id) {
        formData.append(`variants[${index}][id]`, variant.id.toString());
      }
    });

    if (productId) {
      updateProductMutation({ formData, productId });
    } else {
      createProductMutation(formData);
    }
  };

  const { categories, isPending: productCategoriesPending } = useCategories({
    parent_only: false,
  });

  const { suppliers, isPending: suppliersPending } = useSuppliers();

  const {
    product,
    error,
    isError,
    isPending: detailProductPending,
  } = useProductDetail(productId as number);

  useMemo(() => {
    if (productId && !detailProductPending && product?.data) {
      const mappedVariants =
        product.data.variants?.map((variant) => ({
          id: variant.id,
          attribute: variant.attribute,
          value: variant.value,
          skuSuffix: variant.sku_suffix,
          barcode: variant.barcode ?? undefined,
          additionalPrice: Number(variant.additional_price),
          sellingPrice: Number(variant.selling_price),
          quantity: Number(variant.quantity),
          minStockLevel: Number(variant.min_stock_level),
        })) || [];

      form.reset({
        name: product.data.name,
        sku: product.data.sku,
        description: product.data.description || "",
        basePrice: Number(product.data.base_price),
        categoryId: product.data.category_id?.toString(),
        supplierId: product.data.supplier_id?.toString(),
        isActive: product.data.status === "active",
        image: product.data.image as string,
        productVariants: mappedVariants,
      });

      if (product.data.image) {
        setExistingProductImage(product.data.image);
      }
    }
  }, [productId, detailProductPending, product?.data, form]);

  if (
    productCategoriesPending ||
    suppliersPending ||
    (detailProductPending && productId)
  ) {
    return (
      <FormSkeleton
        fields={[
          { type: "input", label: true },
          { type: "input", label: true },
          { type: "input", label: true },
          { type: "textarea", label: true },
          { type: "switch", label: true },
        ]}
      />
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch product detail data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!product?.data && productId) notFound();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 space-y-5 border p-5">
            <h1 className="font-bold">Product Information</h1>

            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="name"
                disabled={createProductPending || updateProductPending}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Name<span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Product Name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                disabled={createProductPending || updateProductPending}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Stock Keeping Unit (SKU)
                      <span className="text-rose-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Product SKU..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              disabled={createProductPending || updateProductPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Product Description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basePrice"
              disabled={createProductPending || updateProductPending}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Price<span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="peer ps-9 pe-12"
                        placeholder="0.00"
                        type="number"
                        {...field}
                      />
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                        Rp
                      </span>
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                        IDR
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              className={cn(
                "flex flex-col",
                existingProductImage && "space-y-2.5",
              )}
            >
              <FormField
                control={form.control}
                name="image"
                disabled={createProductPending || updateProductPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        disabled={field.disabled}
                        onChange={(event) => {
                          const files = event.target.files;
                          if (
                            (files || []).length > 0 &&
                            files?.[0] instanceof File
                          ) {
                            field.onChange(files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {existingProductImage && (
                <p className="text-muted-foreground text-xs font-medium tracking-wide">
                  <span className="font-bold">existing image:</span>{" "}
                  <Link
                    href={existingProductImage}
                    target="_blank"
                    className="hover:cursor-pointer hover:underline"
                  >
                    {getFileNameFromUrl(existingProductImage)}
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="w-full space-y-5 border p-5 lg:w-[336px] 2xl:w-[439px]">
            <h1 className="font-bold">Related Information</h1>

            <FormField
              control={form.control}
              name="categoryId"
              disabled={createProductPending || updateProductPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category<span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select produce category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.data?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierId"
              disabled={createProductPending || updateProductPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Supplier<span className="text-rose-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers?.data?.map((supplier) => (
                        <SelectItem
                          key={supplier.id}
                          value={String(supplier.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative size-6">
                              <Image
                                fill
                                src={
                                  supplier.profile_image ||
                                  "https://picsum.photos/200"
                                }
                                alt={`${supplier.name} image`}
                                className="rounded-full"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <span>{supplier.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              disabled={createProductPending || updateProductPending}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <ProductVariantManual
          isFormSubmitting={createProductPending || updateProductPending}
          mode={productId ? "edit" : "create"}
        />

        <Button
          type="submit"
          disabled={createProductPending || updateProductPending}
        >
          {createProductPending || updateProductPending
            ? `${productId ? "Updating..." : "Adding..."}`
            : `${productId ? "Update" : "Add"} Product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
