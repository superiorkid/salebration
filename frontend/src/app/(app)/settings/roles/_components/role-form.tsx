"use client";

import { FormSkeleton } from "@/components/form-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/tanstack/permission";
import {
  useCreateRole,
  useDetailRole,
  useUpdateRole,
} from "@/hooks/tanstack/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { roleSchema, TRoleSchema } from "../role-schema";

interface RoleFormProps {
  roleId?: number;
}

const RoleForm = ({ roleId }: RoleFormProps) => {
  const form = useForm<TRoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const { permissions, isPending: permissionsPending } = usePermissions();
  const { createRoleMutation, isPending: createRolePending } = useCreateRole();
  const { updateRoleMutation, isPending: updateRolePending } = useUpdateRole();

  const onSubmit = (values: TRoleSchema) => {
    if (roleId) {
      updateRoleMutation({ roleId, values });
      return;
    }

    createRoleMutation(values);
  };

  const {
    isPending: roleDetailPending,
    error,
    isError,
    role,
  } = useDetailRole(roleId as number);

  useEffect(() => {
    if (roleId && !roleDetailPending && role?.success) {
      form.reset({
        name: role.data?.name,
        permissions: role.data?.permissions.map((permission) =>
          permission.id.toString(),
        ),
      });
    }
  }, [roleId, roleDetailPending, role, form]);

  if (roleDetailPending && roleId) {
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

  if (!role?.data && roleId) notFound();

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error?.message || "Failed to fetch role data"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          disabled={createRolePending || updateRolePending}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Role Name <span className="text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Example: 'Store Manager', 'Inventory Specialist'"
                  {...field}
                  className="max-w-md"
                />
              </FormControl>
              <FormDescription>
                Choose a descriptive name that reflects the role&apos;s
                responsibilities
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissions"
          disabled={createRolePending || updateRolePending}
          render={({ field }) => (
            <FormItem>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <FormLabel className="flex items-center gap-1 text-base">
                    Permissions <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormDescription>
                    Select the system access privileges for this role
                  </FormDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3"
                  disabled={field.disabled || permissionsPending}
                  onClick={() => {
                    const allPermissionIds =
                      permissions?.data?.map((p) => p.id.toString()) || [];
                    field.onChange(
                      field.value?.length === allPermissionIds.length
                        ? []
                        : allPermissionIds,
                    );
                  }}
                >
                  {field.value?.length === permissions?.data?.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              {permissionsPending ? (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  <span>Loading available permissions...</span>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {(permissions?.data || []).map((item) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-y-0 space-x-3 rounded-lg border p-3"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id.toString())}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([
                                  ...(field.value || []),
                                  item.id.toString(),
                                ])
                              : field.onChange(
                                  field.value?.filter(
                                    (v) => v !== item.id.toString(),
                                  ),
                                );
                          }}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium">
                          {item.name}
                        </FormLabel>
                      </div>
                    </FormItem>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={createRolePending || updateRolePending}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={createRolePending || updateRolePending}
            className="min-w-32"
          >
            {createRolePending || updateRolePending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Role Configuration"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoleForm;
