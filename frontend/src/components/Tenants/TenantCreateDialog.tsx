import { useState } from "react";

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

import { Button } from "@/components/ui/button";

import { Field } from "@/components/Field";
import { FormSection } from "./FormSection";
import { asChoice, emptyTenantForm } from "./helpers";

import type { SubscriptionPlan, SubscriptionStatus, TenantDraft } from "./types";

interface TenantCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: TenantDraft) => void;
}

const toActiveStatus = (value: string | null): boolean =>
  value === "ACTIVE";

export function TenantCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: TenantCreateDialogProps) {
  const [draft, setDraft] = useState<TenantDraft>(emptyTenantForm);

  /*
   * Discard the draft on every open/close transition so a
   * cancelled create never leaks its values into the next one.
   */

  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);

    setDraft(emptyTenantForm);
  }

  const update = <K extends keyof TenantDraft>(
    key: K,
    value: TenantDraft[K],
  ) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };

  const isValid = Boolean(
    draft.tenantName.trim() &&
      draft.email.trim() &&
      draft.gstNumber.trim(),
  );

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    onSubmit(draft);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Tenant</DialogTitle>

          <DialogDescription>
            Create a new organization on the DMS platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tenant Information */}

          <FormSection title="Tenant Information" withSeparator={false}>
            <Field label="Tenant Name *" className="sm:col-span-2">
              <Input
                placeholder="ABC Motors Pvt Ltd"
                value={draft.tenantName}
                onChange={(event) =>
                  update("tenantName", event.target.value)
                }
              />
            </Field>

            <Field label="Tenant Code">
              <Input
                placeholder="TEN-007"
                value={draft.tenantCode}
                onChange={(event) => update("tenantCode", event.target.value)}
              />
            </Field>

            <Field label="Email *">
              <Input
                type="email"
                placeholder="admin@company.com"
                value={draft.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </Field>
          </FormSection>

          {/* Contact */}

          <FormSection title="Contact Information">
            <Field label="Phone">
              <Input
                placeholder="98765 43210"
                value={draft.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
            </Field>

            <Field label="GST Number *">
              <Input
                placeholder="27AAECA1234A1Z5"
                value={draft.gstNumber}
                onChange={(event) => update("gstNumber", event.target.value)}
              />
            </Field>

            <Field label="Address" className="sm:col-span-2">
              <Textarea
                placeholder="Business address"
                value={draft.address}
                onChange={(event) => update("address", event.target.value)}
              />
            </Field>

            <Field label="City">
              <Input
                placeholder="Pune"
                value={draft.city}
                onChange={(event) => update("city", event.target.value)}
              />
            </Field>

            <Field label="State">
              <Input
                placeholder="Maharashtra"
                value={draft.state}
                onChange={(event) => update("state", event.target.value)}
              />
            </Field>

            <Field label="Country">
              <Input
                placeholder="India"
                value={draft.country}
                onChange={(event) => update("country", event.target.value)}
              />
            </Field>

            <Field label="Pincode">
              <Input
                placeholder="411001"
                value={draft.pincode}
                onChange={(event) => update("pincode", event.target.value)}
              />
            </Field>
          </FormSection>

          {/* Subscription */}

          <FormSection title="Subscription" withSeparator={false}>
            <Field label="Subscription Plan">
              <Select
                value={draft.plan}
                onValueChange={(value) =>
                  update("plan", asChoice<SubscriptionPlan>(value, "BASIC"))
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

            <Field label="Subscription Status">
              <Select
                value={draft.subscriptionStatus}
                onValueChange={(value) =>
                  update(
                    "subscriptionStatus",
                    asChoice<SubscriptionStatus>(value, "TRIAL"),
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
          </FormSection>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={!isValid}>
            Create Tenant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}