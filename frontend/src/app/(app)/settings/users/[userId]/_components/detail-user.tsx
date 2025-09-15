"use client";

import { FormSkeleton } from "@/components/form-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDetailUser } from "@/hooks/tanstack/users";
import { format } from "date-fns";
import { AlertCircleIcon } from "lucide-react";
import { notFound } from "next/navigation";

interface DetailUserProps {
  userId: number;
}

const DetailUser = ({ userId }: DetailUserProps) => {
  const { error, isError, isPending, user } = useDetailUser(userId);

  if (isPending && userId) {
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
          {error?.message || "Failed to fetch user data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!user?.data) notFound();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">Name</h3>
          <p>{user?.data?.name}</p>
        </div>
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">Email</h3>
          <p>{user?.data?.email}</p>
        </div>
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">
            Email Verified
          </h3>
          <p>
            {user?.data?.email_verified_at
              ? format(
                  new Date(user?.data?.email_verified_at as Date),
                  "dd/LL/yyyy HH:mm",
                )
              : "Not verified"}
          </p>
        </div>
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">Role</h3>
          <p>{user?.data?.roles?.[0]?.name || "No role assigned"}</p>
        </div>
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">
            Created At
          </h3>
          <p>
            {format(
              new Date(user?.data?.created_at as Date),
              "dd/LL/yyyy HH:mm",
            )}
          </p>
        </div>
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">
            Last Updated
          </h3>
          <p>
            {format(
              new Date(user?.data?.updated_at as Date),
              "dd/LL/yyyy HH:mm",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
