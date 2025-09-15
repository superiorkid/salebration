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
import { useCustomerForm } from "@/context/customer-form-context";
import {
  useDetailCustomer,
  useUpdateCustomer,
} from "@/hooks/tanstack/customer";
import { useAssignCustomerToSale } from "@/hooks/tanstack/sale";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as RPNInput from "react-phone-number-input";
import { toast } from "sonner";
import { customerSchema, TCustomer } from "../customer-schema";

interface CustomerFormProps {
  onFormSubmit?: () => void;
  customerId?: number;
  saleId?: number;
}

const CustomerForm = ({
  onFormSubmit,
  customerId,
  saleId,
}: CustomerFormProps) => {
  const router = useRouter();
  const {
    customer,
    error,
    isError,
    isPending: detailCustomerPending,
  } = useDetailCustomer(customerId || 0);

  const { updateCustomerMutation, isPending: updateCustomerPending } =
    useUpdateCustomer({
      onSuccess: () => {
        router.push("/customers");
      },
    });
  const { setCustomerData } = useCustomerForm();

  const form = useForm<TCustomer>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      postalCode: "",
      companyName: "",
      email: "",
      notes: "",
      phone: "",
    },
  });

  const { assignCustomerToSaleMutation, isPending: assignCustomerPending } =
    useAssignCustomerToSale({
      onAssignSuccess: () => {
        onFormSubmit?.();
      },
    });

  const onSubmit = async (values: TCustomer) => {
    try {
      if (saleId && !customerId) {
        assignCustomerToSaleMutation({ saleId, payload: values });
        return;
      }

      if (customerId) {
        updateCustomerMutation({ customerId, values });
        return;
      }

      setCustomerData(values);
      form.reset();
      onFormSubmit?.();
      toast.success("Customer added to transaction", {
        description:
          "Customer information has been saved for this transaction. The data will be submitted when you complete the transaction.",
      });
    } catch (error) {
      toast.error("Operation failed", {
        description: "Failed to save customer information for this transaction",
      });
      console.error("Submission error:", error);
    }
  };

  useEffect(() => {
    if (customerId && !!customer?.data && !detailCustomerPending) {
      form.reset({
        name: customer.data.name || "",
        companyName: customer.data.company_name || "",
        address: customer.data.address || "",
        city: customer.data.city || "",
        email: customer.data.email || "",
        notes: customer.data.notes || "",
        phone: customer.data.phone || "",
        postalCode: customer.data.postal_code || "",
      });
    }
  }, [customerId, customer?.data, detailCustomerPending]);

  if (detailCustomerPending && customerId) {
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
          {error?.message || "Failed to fetch customer data"}
        </AlertDescription>
      </Alert>
    );
  }

  if (customerId && !customer?.data) notFound();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            disabled={updateCustomerPending || assignCustomerPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full Name<span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            disabled={updateCustomerPending || assignCustomerPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            disabled={updateCustomerPending || assignCustomerPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            disabled={updateCustomerPending || assignCustomerPending}
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
                    placeholder="+62 812 3456 7890"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          disabled={updateCustomerPending || assignCustomerPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="123 Main St, Apt 4B, Jakarta 10110"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            disabled={updateCustomerPending || assignCustomerPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Jakarta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            disabled={updateCustomerPending || assignCustomerPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="10110" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          disabled={updateCustomerPending || assignCustomerPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Customer preferences, special requirements, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={updateCustomerPending || assignCustomerPending}
        >
          {updateCustomerPending || assignCustomerPending ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {customerId ? "Save Changes" : "Create Customer"}
        </Button>
      </form>
    </Form>
  );
};

export default CustomerForm;
