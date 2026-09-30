import { useState } from "react";

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

import { Field } from "@/components/Field";

import { asChoice } from "@/components/Tenants/helpers";

import { getFullName } from "./helpers";

import type { PlatformUser, PlatformUserStatus } from "./types";

interface PlatformUserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: PlatformUser | null;
  onSave: (user: PlatformUser) => void;
  loading?: boolean;
}

export function PlatformUserEditDialog({
  open,
  onOpenChange,
  user,
  onSave,
  loading = false,
}: PlatformUserEditDialogProps) {
  const [draft, setDraft] = useState<PlatformUser | null>(null);

  /*
   * Work on a copy so cancelling never mutates the row in the table,
   * and re-seed the draft every time the dialog opens.
   */

  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);

    setDraft(open && user ? { ...user } : null);
  }

  const update = <K extends keyof PlatformUser>(
    key: K,
    value: PlatformUser[K],
  ) => {
    setDraft((previous) => (previous ? { ...previous, [key]: value } : previous));
  };

  const isValid = Boolean(
    draft?.firstName.trim() &&
      draft?.lastName.trim() &&
      draft?.email.trim() &&
      draft?.phone.trim(),
  );

  const handleSave = () => {
    if (!draft || !isValid || loading) {
      return;
    }

    onSave(draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        {draft && (
          <>
            <DialogHeader>
              <DialogTitle>Edit Platform User</DialogTitle>

              <DialogDescription>
                Update {getFullName(draft)}&apos;s profile and platform access.
                Use &quot;Assign Role&quot; to change what they can do.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Profile */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Profile
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First Name *">
                    <Input
                      value={draft.firstName}
                      onChange={(event) =>
                        update("firstName", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Middle Name">
                    <Input
                      value={draft.middleName}
                      onChange={(event) =>
                        update("middleName", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Last Name *">
                    <Input
                      value={draft.lastName}
                      onChange={(event) =>
                        update("lastName", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="User Code">
                    <Input value={draft.userCode} disabled />
                  </Field>

                  <Field label="Email *">
                    <Input
                      type="email"
                      value={draft.email}
                      onChange={(event) => update("email", event.target.value)}
                    />
                  </Field>

                  <Field label="Phone *">
                    <Input
                      value={draft.phone}
                      onChange={(event) => update("phone", event.target.value)}
                    />
                  </Field>
                </div>
              </div>

              {/* Access */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Platform Access
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Access Status">
                    <Select
                      value={draft.status}
                      onValueChange={(value) =>
                        update(
                          "status",
                          asChoice<PlatformUserStatus>(value, "ACTIVE"),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>

                        <SelectItem value="INACTIVE">Inactive</SelectItem>

                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>

              <Button onClick={handleSave} disabled={!isValid || loading}>
                Save Changes
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
