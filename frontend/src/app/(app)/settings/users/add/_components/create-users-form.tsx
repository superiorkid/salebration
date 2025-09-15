"use client";

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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoles } from "@/hooks/tanstack/role";
import { useCreateUser } from "@/hooks/tanstack/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TUserSchema, userSchema } from "../../user-schema";

const CreateUsersForm = () => {
  const form = useForm<TUserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: 0,
    },
  });

  const { roles, isPending: rolesPending } = useRoles();
  const { createUserMutation, isPending: createUserPending } = useCreateUser();

  const onSubmit = (values: TUserSchema) => {
    createUserMutation(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            disabled={createUserPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            disabled={createUserPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    {...field}
                    autoComplete="email"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            disabled={createUserPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Create Password*</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="At least 6 characters"
                    {...field}
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            disabled={createUserPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password*</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Re-enter your password"
                    {...field}
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="role"
          disabled={createUserPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
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

        <Button type="submit" disabled={createUserPending}>
          {createUserPending ? "Saving..." : "Save User"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateUsersForm;
