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
import { useCreateExpenseCategory } from "@/hooks/tanstack/expense-categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  expenseCategoriesSchema,
  TExpenseCategoriesSchema,
} from "../expense-categories-schema";

interface ExpenseCategoryFormProps {
  onSubmitSuccess?: () => void;
}

const ExpenseCategoryForm = ({ onSubmitSuccess }: ExpenseCategoryFormProps) => {
  const form = useForm<TExpenseCategoriesSchema>({
    resolver: zodResolver(expenseCategoriesSchema),
    defaultValues: {
      name: "",
    },
  });

  const { createExpenseCategoryMutation, isPending } = useCreateExpenseCategory(
    {
      onSuccess: () => {
        onSubmitSuccess?.();
      },
    },
  );

  const onSubmit = (values: TExpenseCategoriesSchema) => {
    createExpenseCategoryMutation(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSubmitSuccess?.()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isValid}>
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Category"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseCategoryForm;
