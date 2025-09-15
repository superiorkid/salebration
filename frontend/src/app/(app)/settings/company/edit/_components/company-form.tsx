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
import { Textarea } from "@/components/ui/textarea";
import { useDetailCompany, useUpdateCompany } from "@/hooks/tanstack/company";
import { useFileUpload } from "@/hooks/use-file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CircleUserRoundIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as RPNInput from "react-phone-number-input";
import { companySchema, TCompanySchema } from "../company-schema";

const CompanyForm = () => {
  const [existingLogo, setExistingLogo] = useState<{
    id: number;
    preview: string;
    name: string;
    type: string;
  } | null>(null);

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  const form = useForm<TCompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      address: "",
      display_name: "",
      email: "",
      name: "",
      website: "",
      phone: "",
      owner_name: "",
      logo: undefined,
    },
  });

  const { isPending: updateCompanyPending, updateCompanyMutation } =
    useUpdateCompany();
  const onSubmit = (values: TCompanySchema) => {
    console.log(values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("display_name", values.display_name);
    if (values.website) {
      formData.append("website", values.website);
    }
    if (values.owner_name) {
      formData.append("owner_name", values.owner_name);
    }
    if (files && files.length > 0) {
      formData.append("logo", files.at(0)?.file as File);
    } else if (existingLogo) {
      formData.append("logo", existingLogo.id.toString());
    }

    updateCompanyMutation(formData);
  };

  const {
    company,
    error,
    isError,
    isPending: detailCompanyPending,
  } = useDetailCompany();

  useEffect(() => {
    if (!detailCompanyPending && company?.success) {
      const media = company.data?.media;
      if (media && media.length > 0) {
        setExistingLogo({
          id: media?.at(0)?.id as number,
          preview: media?.at(0)?.original_url as string,
          name: media?.at(0)?.file_name as string,
          type: media?.at(0)?.mime_type as string,
        });
      }

      form.reset({
        name: company.data?.name,
        address: company.data?.address,
        display_name: company.data?.display_name,
        email: company.data?.email,
        owner_name: company.data?.owner_name,
        phone: company.data?.phone,
        website: company.data?.website,
      });
    }
  }, [detailCompanyPending, company?.success, company?.data]);

  if (detailCompanyPending) {
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
          {error?.message || "Failed to fetch company data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 items-center gap-4">
          <FormField
            control={form.control}
            name="name"
            disabled={updateCompanyPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="display_name"
            disabled={updateCompanyPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter display name.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          disabled={updateCompanyPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter address.." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            disabled={updateCompanyPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner_name"
            disabled={updateCompanyPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter owner name.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            disabled={updateCompanyPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <RPNInput.default
                    className="flex rounded-md shadow-xs"
                    international
                    flagComponent={FlagComponent}
                    countrySelectComponent={CountrySelect}
                    inputComponent={PhoneInput}
                    placeholder="Enter phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            disabled={updateCompanyPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Enter website.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 align-top">
            <div
              className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
              aria-label={
                previewUrl
                  ? "Preview of uploaded image"
                  : existingLogo
                    ? "Existing company logo"
                    : "Default user avatar"
              }
            >
              {previewUrl ? (
                <Image
                  className="size-full object-cover"
                  src={previewUrl}
                  alt="Preview of uploaded image"
                  width={32}
                  height={32}
                />
              ) : existingLogo ? (
                <Image
                  className="size-full object-cover"
                  src={existingLogo.preview}
                  alt={`Existing logo: ${existingLogo.name}`}
                  height={32}
                />
              ) : (
                <div aria-hidden="true">
                  <CircleUserRoundIcon className="opacity-60" size={16} />
                </div>
              )}
            </div>
            <div className="relative inline-block">
              <Button
                type="button"
                onClick={openFileDialog}
                aria-haspopup="dialog"
                disabled={updateCompanyPending}
              >
                {previewUrl || existingLogo ? "Change logo" : "Upload logo"}
              </Button>
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload image file"
                tabIndex={-1}
              />
            </div>
          </div>

          {/* File info display */}
          {(fileName || existingLogo) && (
            <div className="inline-flex gap-2 text-xs">
              <p className="text-muted-foreground truncate" aria-live="polite">
                {fileName || existingLogo?.name}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (fileName) {
                    removeFile(files[0]?.id);
                  } else if (existingLogo) {
                    setExistingLogo(null);
                  }
                }}
                className="text-destructive font-medium hover:underline"
                aria-label={`Remove ${fileName || existingLogo?.name}`}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <Button type="submit" disabled={updateCompanyPending}>
          {updateCompanyPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default CompanyForm;
