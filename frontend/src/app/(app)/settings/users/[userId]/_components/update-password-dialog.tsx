"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyIcon } from "lucide-react";
import { useState } from "react";
import UpdatePasswordForm from "./update-password-form";

const UpdatePasswordDialog = () => {
  const [dialogOpen, dialogToggle] = useState<boolean>(false);

  const changePasswordSuccess = () => {
    dialogToggle(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={dialogToggle}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <KeyIcon className="h-4 w-4" />
          Update Password
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[500px] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyIcon className="h-5 w-5" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Set a new secure password for this user account
          </DialogDescription>
        </DialogHeader>

        <UpdatePasswordForm
          handleUpdatePasswordSuccess={changePasswordSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordDialog;
