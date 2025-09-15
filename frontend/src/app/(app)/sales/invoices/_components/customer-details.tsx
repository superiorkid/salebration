import { TCustomer } from "@/types/customer";
import { Building2Icon, MailIcon, PhoneIcon } from "lucide-react";

interface CustomerDetailsProps {
  customer: TCustomer;
}

const CustomerDetails = ({ customer }: CustomerDetailsProps) => {
  if (!customer) return null;

  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-medium">Customer Details</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg font-medium">{customer.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground flex items-center gap-2">
              <MailIcon className="h-4 w-4" />
              {customer.email ?? "-"}
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" />
              {customer.phone ?? "-"}
            </p>
          </div>
        </div>

        {customer.company_name && (
          <div className="pt-4">
            <div className="flex items-center gap-2">
              <Building2Icon className="text-muted-foreground h-4 w-4" />
              <p className="font-medium">{customer.company_name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomerDetails;
