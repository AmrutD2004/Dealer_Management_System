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
import { Textarea } from "@/components/ui/textarea";

import { Field } from "@/components/Field";

import type {
  SubscriptionPlan,
  SubscriptionStatus,
  Tenant,
} from "./types";

interface TenantEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  onSave: (tenant: Tenant) => void;
}

const toActiveStatus = (value: string | null): boolean =>
  value === "ACTIVE";

export function TenantEditDialog({
  open,
  onOpenChange,
  tenant,
  onSave,
}: TenantEditDialogProps) {
  const [draft, setDraft] = useState<Tenant | null>(null);

  /*
   * Work on a copy so cancelling never mutates the row in the
   * table, and re-seed the draft every time the dialog opens.
   */

  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);

    setDraft(open && tenant ? { ...tenant } : null);
  }

  const update = <K extends keyof Tenant>(key: K, value: Tenant[K]) => {
    setDraft((previous) => (previous ? { ...previous, [key]: value } : previous));
  };

  const handleSave = () => {
    if (!draft) {
      return;
    }

    onSave(draft);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        {draft && (
          <>
            <DialogHeader>
              <DialogTitle>Edit Tenant</DialogTitle>

              <DialogDescription>
                Update tenant information, subscription and access status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Organization */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Tenant Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tenant Name" className="sm:col-span-2">
                    <Input
                      value={draft.tenantName}
                      onChange={(event) =>
                        update("tenantName", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Tenant Code">
                    <Input
                      value={draft.tenantCode}
                      onChange={(event) =>
                        update("tenantCode", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Email">
                    <Input
                      type="email"
                      value={draft.email}
                      onChange={(event) => update("email", event.target.value)}
                    />
                  </Field>
                </div>
              </div>

              {/* Contact */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Contact Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone">
                    <Input
                      value={draft.phone}
                      onChange={(event) => update("phone", event.target.value)}
                    />
                  </Field>

                  <Field label="GST Number">
                    <Input
                      value={draft.gstNumber}
                      onChange={(event) =>
                        update("gstNumber", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Address" className="sm:col-span-2">
                    <Textarea
                      value={draft.address}
                      onChange={(event) =>
                        update("address", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="City">
                    <Input
                      value={draft.city}
                      onChange={(event) => update("city", event.target.value)}
                    />
                  </Field>

                  <Field label="State">
                    <Input
                      value={draft.state}
                      onChange={(event) => update("state", event.target.value)}
                    />
                  </Field>

                  <Field label="Country">
                    <Input
                      value={draft.country}
                      onChange={(event) =>
                        update("country", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Pincode">
                    <Input
                      value={draft.pincode}
                      onChange={(event) =>
                        update("pincode", event.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>

              {/* Subscription */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Subscription
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Tenant Status */}

                  <Field label="Tenant Status">
                    <Select
                      value={draft.isActive ? "ACTIVE" : "INACTIVE"}
                      onValueChange={(value) =>
                        update("isActive", toActiveStatus(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>

                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Plan */}

                  <Field label="Subscription Plan">
                    <Select
                      value={draft.plan}
                      onValueChange={(value) =>
                        update(
                          "plan",
                          (value as SubscriptionPlan) ?? "BASIC",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="BASIC">Basic</SelectItem>

                        <SelectItem value="PRO">Pro</SelectItem>

                        <SelectItem value="PREMIUM">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Subscription Status */}

                  <Field label="Subscription Status">
                    <Select
                      value={draft.subscriptionStatus}
                      onValueChange={(value) =>
                        update(
                          "subscriptionStatus",
                          (value as SubscriptionStatus) ?? "TRIAL",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="TRIAL">Trial</SelectItem>

                        <SelectItem value="ACTIVE">Active</SelectItem>

                        <SelectItem value="SUSPENDED">Suspended</SelectItem>

                        <SelectItem value="EXPIRED">Expired</SelectItem>

                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
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

              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}