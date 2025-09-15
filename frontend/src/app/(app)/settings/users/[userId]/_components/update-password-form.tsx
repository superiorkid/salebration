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
import { PasswordInput } from "@/components/ui/password-input";
import { useUpdatePasswordUser } from "@/hooks/tanstack/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { TUpdatePasswordSchema, updatePasswordSchema } from "../../user-schema";

interface UpdatePasswordFormProps {
  handleUpdatePasswordSuccess?: () => void;
}

const UpdatePasswordForm = ({
  handleUpdatePasswordSuccess,
}: UpdatePasswordFormProps) => {
  const { userId } = useParams<{ userId: string }>();

  const form = useForm<TUpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isPending, updateUserPasswordMutation } = useUpdatePasswordUser({
    onSuccess: () => {
      handleUpdatePasswordSuccess?.();
      form.reset();
    },
  });

  const onSubmit = (values: TUpdatePasswordSchema) => {
    updateUserPasswordMutation({ userId: Number(userId), values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter Confirm Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdatePasswordForm;
