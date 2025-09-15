import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import UpdatePasswordDialog from "./update-password-dialog";

interface ActionButtonsProps {
  userId: number;
}

const ActionButtons = ({ userId }: ActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Link
        href={`/settings/users/${userId}/edit`}
        className={cn(
          buttonVariants({ size: "sm", variant: "outline" }),
          "flex items-center gap-1",
        )}
      >
        <PencilIcon className="h-4 w-4" />
        Edit User
      </Link>
      <UpdatePasswordDialog />
    </div>
  );
};

export default ActionButtons;
