import { useState } from "react";

import { Loader2 } from "lucide-react";

import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PLATFORM_USER_ROLES, getRoleLabel } from "./helpers";

import type { platformUserInfo, platformUserUpdateType } from "@/Types/platformUserType";
import { updatePlatformUser } from "@/api/endpoint";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/utils";

interface PlatformUserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: platformUserInfo | null;
  onSaved: () => void;
}

export function PlatformUserEditDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: PlatformUserEditDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<platformUserUpdateType>({
    email: "",
    passwordHash: "",
    role: "SUPPORT_ADMIN",
  });

  const [wasOpen, setWasOpen] = useState(open);

  /* Reseed the form from the selected row each time the dialog opens. */

  if (open !== wasOpen) {
    setWasOpen(open);

    if (open && user) {
      setFormData({
        email: user.email,
        passwordHash: "",
        role: user.role,
      });

      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    setLoading(true);

    try {
      const data = await updatePlatformUser(user.id, {
        email: formData.email,
        /* Blank means "keep the current password". */

        passwordHash: formData.passwordHash || undefined,
        role: formData.role,
      });

      if (data?.success) {
        toast.add({ type: "success", description: data?.message });

        onSaved();
        onOpenChange(false);
      } else {
        toast.add({ type: "error", description: data?.message });
      }
    } catch (err) {
      toast.add({
        type: "error",
        description: getApiErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Edit Platform User</DialogTitle>

          <DialogDescription>
            Update the account for {user?.email}. Leave the password blank to
            keep the current one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Field label="Email *">
              <Input
                name="email"
                type="email"
                placeholder="name@redogroup.com"
                value={formData.email}
                onChange={handleChange}
              />
            </Field>

            <Field label="Platform Role">
              <Select
                name="role"
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: value as platformUserUpdateType["role"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {PLATFORM_USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="New Password">
              <Input
                name="passwordHash"
                type="password"
                placeholder="Leave blank to keep current"
                value={formData.passwordHash}
                onChange={handleChange}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading || !formData.email}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}