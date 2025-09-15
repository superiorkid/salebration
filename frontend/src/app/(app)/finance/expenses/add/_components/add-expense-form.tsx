"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateExpense } from "@/hooks/tanstack/expense";
import { useExpenseCategories } from "@/hooks/tanstack/expense-categories";
import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  AlertCircleIcon,
  CalendarIcon,
  FileTextIcon,
  ImageIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  createExpenseSchema,
  TCreateExpenseSchema,
} from "../../expense-schema";

const AddExpenseForm = () => {
  const maxSizeMB = 3;
  const maxSize = maxSizeMB * 1024 * 1024;

  const form = useForm<TCreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      title: "",
      description: "",
      category_id: 0,
      amount: 0,
      images: undefined,
      paid_at: undefined,
    },
  });

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/png,image/jpeg,image/jpg,application/pdf",
    maxSize,
    multiple: true,
    onFilesChange: (files) => {
      const fileArr = files.map((file) => file.file) as File[];
      form.setValue("images", fileArr);
    },
  });

  const { createExpenseMutation, isPending: createExpensePending } =
    useCreateExpense();

  const onSubmit = (values: TCreateExpenseSchema) => {
    const formData = new FormData();

    formData.append("title", values.title);
    if (values.description) {
      formData.append("description", values.description);
    }
    formData.append("category_id", values.category_id.toString());
    formData.append("amount", values.amount.toString());
    formData.append("paid_at", values.paid_at.toISOString());
    if (values.images) {
      for (const image of values.images) {
        formData.append("images[]", image);
      }
    }

    createExpenseMutation(formData);
  };

  const { expenseCategories, isPending: categoriesPending } =
    useExpenseCategories();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          disabled={createExpensePending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          disabled={createExpensePending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          disabled={createExpensePending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
                disabled={field.disabled}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesPending ? (
                    <SelectItem value="0" disabled>
                      Loading...
                    </SelectItem>
                  ) : expenseCategories?.data &&
                    expenseCategories.data.length > 0 ? (
                    <>
                      <SelectItem value="0" disabled>
                        Select a category
                      </SelectItem>
                      {expenseCategories.data.map((category, index) => (
                        <SelectItem
                          key={index}
                          value={category.id.toString()}
                          className="capitalize"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <SelectItem value="0" disabled>
                      No Result Found.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            disabled={createExpensePending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="peer ps-9 pe-12"
                      placeholder="0.00"
                      type="number"
                      {...field}
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                      Rp
                    </span>
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      IDR
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paid_at"
            disabled={createExpensePending}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Paid At</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        disabled={field.disabled}
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            data-files={files.length > 0 || undefined}
            className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
          >
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload image file"
            />
            {files.length > 0 ? (
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-medium">
                    Uploaded Files ({files.length})
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openFileDialog}
                  >
                    <UploadIcon
                      className="-ms-0.5 size-3.5 opacity-60"
                      aria-hidden="true"
                    />
                    Add more
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-accent relative flex aspect-square items-center justify-center rounded-md"
                    >
                      {file.file.type === "application/pdf" ? (
                        <FileTextIcon
                          strokeWidth={2}
                          size={50}
                          className="stroke-zinc-500"
                        />
                      ) : (
                        <Image
                          fill
                          src={file.preview as string}
                          alt={file.file.name}
                          className="size-full rounded-[inherit] object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      <Button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        size="icon"
                        className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                        aria-label="Remove image"
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                  className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <ImageIcon className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">
                  Drop your images here
                </p>
                <p className="text-muted-foreground text-xs">
                  SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={openFileDialog}
                  disabled={createExpensePending}
                >
                  <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                  Select images
                </Button>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )}
        </div>

        <Button type="submit" disabled={createExpensePending}>
          {createExpensePending ? "Saving..." : "Save Expense"}
        </Button>
      </form>
    </Form>
  );
};

export default AddExpenseForm;
