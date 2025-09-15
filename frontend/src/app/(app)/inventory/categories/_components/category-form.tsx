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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCategories,
  useCreateCategory,
  useDetailCategory,
  useUpdateCategory,
} from "@/hooks/tanstack/product-categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, ShieldAlertIcon } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Category, categorySchema } from "../category-schema";

interface CategoryFormDialog {
  dialogToggle: Dispatch<SetStateAction<boolean>>;
  dropdownToggle?: Dispatch<SetStateAction<boolean>>;

  categoryId?: number;
}

const CategoryForm = ({
  dialogToggle,
  categoryId,
  dropdownToggle,
}: CategoryFormDialog) => {
  const form = useForm<Category>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", parentId: undefined },
  });

  const { categories, isPending: categoriesPending } = useCategories({
    parent_only: false,
  });

  const { createCategoryMutation, isPending: createCategoryPending } =
    useCreateCategory({
      onSuccess: () => {
        dialogToggle(false);
      },
    });

  const { updateCategoryMutation, isPending: updateCategoryPending } =
    useUpdateCategory({
      onSuccess: () => {
        dialogToggle(false);
        dropdownToggle?.(false);
      },
    });

  const onSubmit = (values: Category) => {
    if (categoryId) {
      updateCategoryMutation({ categoryId, values });
    } else {
      createCategoryMutation(values);
    }
  };

  const {
    category,
    isPending: detailCategoryPending,
    error,
    isError,
  } = useDetailCategory(categoryId as number);

  useMemo(() => {
    if (categoryId && !detailCategoryPending && category?.success) {
      form.reset({
        name: category.data?.name,
        description: category.data?.description,
        parentId: category.data?.parent_id || undefined,
      });
    }
  }, [categoryId, detailCategoryPending, category, form]);

  if (detailCategoryPending && categoryId) {
    return (
      <div className="flex justify-center py-7">
        <LoaderCircleIcon strokeWidth={2} size={24} className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-7">
        <ShieldAlertIcon size={48} className="text-rose-500" />
        <p className="mt-2 text-sm text-rose-500">
          {error?.message ||
            "An error occurred while fetching category details."}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          disabled={createCategoryPending || updateCategoryPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name<span className="text-rose-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Category Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          disabled={createCategoryPending || updateCategoryPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {categoriesPending ? (
          <div className="h-10 animate-pulse bg-zinc-100" />
        ) : (
          <FormField
            control={form.control}
            name="parentId"
            disabled={createCategoryPending || updateCategoryPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(
                      value === undefined ? undefined : Number(value),
                    );
                  }}
                  defaultValue={field.value ? String(field.value) : undefined}
                  value={field.value ? String(field.value) : undefined}
                  disabled={field.disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.data
                      ?.filter((cat) => cat.id !== category?.data?.id)
                      .map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={String(cat.id)}
                          disabled={
                            Number(cat.id) === form.getValues("parentId")
                          }
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          disabled={createCategoryPending || updateCategoryPending}
        >
          {createCategoryPending || updateCategoryPending
            ? `${categoryId ? "Updating..." : "Adding..."}`
            : `${categoryId ? "Update" : "Add"} Category`}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
