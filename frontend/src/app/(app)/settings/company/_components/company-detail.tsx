"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { PermissionsEnum } from "@/enums/permissions";
import { useDetailCompany } from "@/hooks/tanstack/company";
import { usePermission } from "@/hooks/use-permission";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  Building2Icon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CompanyDetail = () => {
  const { company, error, isError, isPending } = useDetailCompany();
  const canEditCompany = usePermission(PermissionsEnum.EDIT_COMPANY_PAGE);

  if (isPending) {
    return (
      <div className="flex justify-center py-8">Loading expense detail...</div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch company detail"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-5xl rounded-lg bg-white p-6 shadow-md">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-shrink-0">
          <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
            {company?.data?.media && company?.data?.media.length > 0 ? (
              <Image
                fill
                src={company.data.media.at(0)?.original_url as string}
                alt={`${company.data.display_name} logo`}
                className="h-full w-full object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <Building2Icon className="h-20 w-20 text-gray-400" />
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {company?.data?.display_name}
            </h1>
            {canEditCompany && (
              <Link
                href="/settings/company/edit"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Edit Profile
              </Link>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2Icon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Legal Name</p>
                <p className="font-medium">{company?.data?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-medium">{company?.data?.owner_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MailIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{company?.data?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{company?.data?.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPinIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{company?.data?.address}</p>
              </div>
            </div>

            {company?.data?.website && (
              <div className="flex items-center gap-3">
                <GlobeIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a
                    href={company?.data?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {company.data.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
