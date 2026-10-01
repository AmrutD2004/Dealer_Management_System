import { useState } from "react";

import { Loader2 } from "lucide-react";

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

import { emptyPlatformUserForm, isPlatformUserDraftValid } from "./helpers";

import type { PlatformUserDraft, PlatformUserRole, PlatformUserStatus } from "./types";

interface PlatformUserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: PlatformUserDraft) => void;
  loading?: boolean;
}

export function PlatformUserCreateDialog({
  open,
  onOpenChange,
  onCreate,
  loading = false,
}: PlatformUserCreateDialogProps) {
  const [draft, setDraft] = useState<PlatformUserDraft>(emptyPlatformUserForm);

  /*
   * Re-seed on every open so a cancelled create never leaks into the
   * next one.
   */

  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);

    setDraft({ ...emptyPlatformUserForm });
  }

  const update = <K extends keyof PlatformUserDraft>(
    key: K,
    value: PlatformUserDraft[K],
  ) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };

  const isValid = isPlatformUserDraftValid(draft);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValid || loading) {
      return;
    }

    onCreate(draft);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Platform User</DialogTitle>

          <DialogDescription>
            Create an admin account for the DMS platform and grant an initial
            role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
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
                    onChange={(event) => update("firstName", event.target.value)}
                    placeholder="Aarav"
                  />
                </Field>

                <Field label="Middle Name">
                  <Input
                    value={draft.middleName}
                    onChange={(event) =>
                      update("middleName", event.target.value)
                    }
                    placeholder="Optional"
                  />
                </Field>

                <Field label="Last Name *">
                  <Input
                    value={draft.lastName}
                    onChange={(event) => update("lastName", event.target.value)}
                    placeholder="Sharma"
                  />
                </Field>

                <Field label="Phone *">
                  <Input
                    value={draft.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="9876543210"
                  />
                </Field>

                <Field label="Email *" className="sm:col-span-2">
                  <Input
                    type="email"
                    value={draft.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="name@redogroup.com"
                  />
                </Field>
              </div>
            </div>

            {/* Role */}

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Role Assignment
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Platform Role">
                  <Select
                    value={draft.role}
                    onValueChange={(value) =>
                      update(
                        "role",
                        asChoice<PlatformUserRole>(value, "SUPPORT_ADMIN"),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>

                      <SelectItem value="SUPPORT_ADMIN">
                        Support Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

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

            {/* Credentials */}

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Credentials
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Initial Password *" className="sm:col-span-2">
                  <Input
                    type="password"
                    value={draft.password}
                    onChange={(event) => update("password", event.target.value)}
                    placeholder="Set a temporary password"
                  />
                </Field>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!isValid || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

              Create Platform User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
