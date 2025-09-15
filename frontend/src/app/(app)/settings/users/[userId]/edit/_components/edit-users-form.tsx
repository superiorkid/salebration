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
import { useRoles } from "@/hooks/tanstack/role";
import { useDetailUser, useUpdateUser } from "@/hooks/tanstack/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { editUserSchema, TEditUserSchema } from "../../../user-schema";

interface EditUserFormProps {
  userId: number;
}

const EditUsersForm = ({ userId }: EditUserFormProps) => {
  const form = useForm<TEditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      email: "",
      name: "",
      role: 0,
    },
  });

  const { roles, isPending: rolesPending } = useRoles();
  const { isPending: updateUserPending, updateUserMutation } = useUpdateUser();

  const onSubmit = (values: TEditUserSchema) => {
    updateUserMutation({ userId, values });
  };

  const {
    error,
    isError,
    isPending: userDetailPending,
    user,
  } = useDetailUser(userId);

  useMemo(() => {
    if (userId && !userDetailPending && user?.success) {
      form.reset({
        email: user.data?.email,
        name: user.data?.name,
        role: user.data?.roles?.at(0)?.id,
      });
    }
  }, [userId, userDetailPending, user]);

  if (userDetailPending && userId) {
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

  if (!user?.data) {
    notFound();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          disabled={updateUserPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          disabled={updateUserPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emails</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          disabled={updateUserPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value.toString()}
                disabled={field.disabled}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rolesPending ? (
                    <SelectItem value="0" disabled>
                      Loading...
                    </SelectItem>
                  ) : roles?.data && roles.data.length > 0 ? (
                    <>
                      <SelectItem value="0" disabled>
                        Select a Role
                      </SelectItem>
                      {roles.data.map((role, index) => (
                        <SelectItem
                          key={index}
                          value={role.id.toString()}
                          className="capitalize"
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <SelectItem value="0" disabled>
                      No Roles Found.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateUserPending}>
          {updateUserPending ? "Saving..." : "Save User"}
        </Button>
      </form>
    </Form>
  );
};

export default EditUsersForm;
