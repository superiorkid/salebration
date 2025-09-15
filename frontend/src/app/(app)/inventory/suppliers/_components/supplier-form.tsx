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
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateSupplier,
  useDetailSupplier,
  useUpdateSupplier,
} from "@/hooks/tanstack/supplier";
import { useFileUpload } from "@/hooks/use-file-upload";
import { getFileNameFromUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CircleUserRoundIcon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as RPNInput from "react-phone-number-input";
import { Supplier, supplierSchema } from "../supplier-schema";
import { notFound } from "next/navigation";

interface SupplierFormProps {
  supplierId?: number;
}

const SupplierForm = ({ supplierId }: SupplierFormProps) => {
  const form = useForm<Supplier>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      status: true,
      profile_image: undefined,
    },
  });

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      multiple: false,
      maxSize: 1024 * 1024 * 2,
      onFilesAdded: (addedFiles) => {
        const file = addedFiles.at(0)?.file;
        form.setValue("profile_image", file as File);
      },
    });

  const { createSupplierMutation, isPending: createSupplierPending } =
    useCreateSupplier();
  const { updateSupplierMutation, isPending: updateSupplierPending } =
    useUpdateSupplier();

  const onSubmit = (values: Supplier) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("status", values.status ? "active" : "inactive");

    if (values.phone) {
      formData.append("phone", values.phone);
    }

    if (values.address) {
      formData.append("address", values.address);
    }

    if (values.profile_image) {
      formData.append("profile_image", values.profile_image);
    }

    if (supplierId) {
      updateSupplierMutation({ supplierId, formData });
    } else {
      createSupplierMutation(formData);
    }
  };

  const {
    supplier,
    error,
    isError,
    isPending: supplierDetailPending,
  } = useDetailSupplier(supplierId as number);

  useEffect(() => {
    if (supplierId && !supplierDetailPending && supplier?.success) {
      form.reset({
        name: supplier.data?.name || "",
        email: supplier.data?.email || "",
        address: supplier.data?.address || "",
        phone: supplier.data?.phone || undefined,
        status: supplier.data?.status === "active",
        profile_image: supplier.data?.profile_image || undefined,
      });
    }
  }, [
    supplierId,
    supplierDetailPending,
    supplier?.success,
    supplier?.data,
    form,
  ]);

  const profileImage = form.getValues("profile_image");

  const fileName =
    files[0]?.file.name ||
    (typeof profileImage === "string"
      ? getFileNameFromUrl(profileImage)
      : profileImage instanceof File
        ? profileImage.name
        : null);

  const imagePreviewUrl =
    files[0]?.preview ||
    (typeof profileImage === "string"
      ? profileImage
      : profileImage instanceof File
        ? URL.createObjectURL(profileImage)
        : null);

  useEffect(() => {
    return () => {
      if (profileImage instanceof File) {
        URL.revokeObjectURL(imagePreviewUrl as string);
      }
    };
  }, [profileImage, imagePreviewUrl]);

  if (supplierDetailPending && supplierId) {
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
          {error?.message || "Failed to fetch supplier data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!supplier?.data && supplierId) notFound();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          disabled={createSupplierPending || updateSupplierPending}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                Name<span className="text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <FormField
            control={form.control}
            name="email"
            disabled={createSupplierPending || updateSupplierPending}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Email<span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            disabled={createSupplierPending || updateSupplierPending}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <RPNInput.default
                    className="flex rounded-md shadow-xs"
                    international
                    flagComponent={FlagComponent}
                    countrySelectComponent={CountrySelect}
                    inputComponent={PhoneInput}
                    placeholder="Enter phone number"
                    defaultCountry="ID"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          disabled={createSupplierPending || updateSupplierPending}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Address..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 align-top">
            <div
              className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
              aria-label={
                imagePreviewUrl
                  ? "Preview of uploaded image"
                  : "Default user avatar"
              }
            >
              {imagePreviewUrl ? (
                <Image
                  className="size-full object-cover"
                  src={imagePreviewUrl}
                  alt="Preview of uploaded image"
                  width={32}
                  height={32}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
              ) : (
                <div aria-hidden="true">
                  <CircleUserRoundIcon className="opacity-60" size={16} />
                </div>
              )}
            </div>
            <div className="relative inline-block w-full">
              <Button
                type="button"
                onClick={openFileDialog}
                aria-haspopup="dialog"
                className="w-full"
              >
                {fileName ? "Change image" : "Upload image"}
              </Button>
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload image file"
              />
            </div>
          </div>
          {fileName && (
            <div className="inline-flex gap-2 text-xs">
              <p className="text-muted-foreground truncate" aria-live="polite">
                {fileName}
              </p>
              <button
                type="button"
                onClick={() => {
                  removeFile(files[0]?.id);
                  form.setValue("profile_image", undefined);
                }}
                className="text-destructive font-medium hover:underline"
                aria-label={`Remove ${fileName}`}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="status"
          disabled={createSupplierPending || updateSupplierPending}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormLabel>{field.value ? "Active" : "Not Active"}</FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createSupplierPending || updateSupplierPending}
        >
          {createSupplierPending || updateSupplierPending
            ? `${supplierId ? "Updating..." : "Adding..."}`
            : `${supplierId ? "Edit" : "Add"} Supplier`}
        </Button>
      </form>
    </Form>
  );
};

export default SupplierForm;
