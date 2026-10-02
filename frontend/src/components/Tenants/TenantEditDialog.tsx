import { useState } from "react";

import { Loader2 } from "lucide-react";

import {
  TENANT_PLANS,
  TENANT_SUBSCRIPTION_STATUSES,
  getPlanLabel,
  getSubscriptionStatusLabel,
  toPlanType,
  toSubscriptionStatusType,
} from "./helpers";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

import { updateTenant } from "@/api/endpoint";
import { getApiErrorMessage } from "@/lib/utils";

import type { tenantType, tenantUpdateType } from "@/Types/tenantTypes";

interface TenantEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: tenantType | null;
  onSaved: () => void;
}

/*
 * The form works on a flat draft of the API's own field names. The
 * server rejects the update unless every key is present, so mapping
 * happens once here rather than being spread across the inputs.
 */

type TenantDraft = Omit<tenantUpdateType, "tenant_sub_plan" | "tenant_sub_status"> & {
  tenant_sub_plan: string;
  tenant_sub_status: string;
};

const toDraft = (tenant: tenantType): TenantDraft => ({
  tenant_code: tenant.tenantCode,
  tenant_name: tenant.tenantName,
  tenant_email: tenant.email,
  tenant_phone: tenant.phone ?? "",
  tenant_gst_number: tenant.gstNumber ?? "",
  tenant_address: tenant.address ?? "",
  tenant_register_city: tenant.city ?? "",
  tenant_register_state: tenant.state ?? "",
  tenant_register_country: tenant.country ?? "",
  tenant_register_pincode: tenant.pincode ?? "",
  tenant_sub_plan: tenant.subscriptionPlan,
  tenant_sub_status: tenant.subscriptionStatus,
});

const toPayload = (draft: TenantDraft): tenantUpdateType => ({
  ...draft,
  tenant_sub_plan: toPlanType(draft.tenant_sub_plan),
  tenant_sub_status: toSubscriptionStatusType(draft.tenant_sub_status),
});

export function TenantEditDialog({
  open,
  onOpenChange,
  tenant,
  onSaved,
}: TenantEditDialogProps) {
  const [draft, setDraft] = useState<TenantDraft | null>(null);
  const [loading, setLoading] = useState(false);

  /* Reseed from the selected row each time the dialog opens. */

  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);

    if (open && tenant) {
      setDraft(toDraft(tenant));
      setLoading(false);
    }
  }

  /* The select reports a nullable value; the draft always holds a string
     so the payload mapping never has to deal with null. */

  const update = (key: keyof TenantDraft, value: string | null) => {
    setDraft((previous) =>
      previous ? { ...previous, [key]: value ?? "" } : previous,
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!draft || !tenant) {
      return;
    }

    setLoading(true);

    try {
      const data = await updateTenant(tenant.id, toPayload(draft));

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
        description: getApiErrorMessage(err, "Failed to update tenant"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        {draft && tenant && (
          <>
            <DialogHeader>
              <DialogTitle>Edit Tenant</DialogTitle>

              <DialogDescription>
                Update tenant information and subscription for{" "}
                {tenant.tenantCode}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6 py-4">
                {/* Organization */}

                <div>
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">
                    Tenant Information
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Tenant Name" className="sm:col-span-2">
                      <Input
                        name="tenant_name"
                        value={draft.tenant_name}
                        onChange={(event) =>
                          update("tenant_name", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Tenant Code">
                      <Input
                        name="tenant_code"
                        value={draft.tenant_code}
                        onChange={(event) =>
                          update("tenant_code", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Email">
                      <Input
                        name="tenant_email"
                        type="email"
                        value={draft.tenant_email}
                        onChange={(event) =>
                          update("tenant_email", event.target.value)
                        }
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
                        name="tenant_phone"
                        value={draft.tenant_phone}
                        onChange={(event) =>
                          update("tenant_phone", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="GST Number">
                      <Input
                        name="tenant_gst_number"
                        value={draft.tenant_gst_number}
                        onChange={(event) =>
                          update("tenant_gst_number", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Address" className="sm:col-span-2">
                      <Textarea
                        name="tenant_address"
                        value={draft.tenant_address}
                        onChange={(event) =>
                          update("tenant_address", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="City">
                      <Input
                        name="tenant_register_city"
                        value={draft.tenant_register_city}
                        onChange={(event) =>
                          update("tenant_register_city", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="State">
                      <Input
                        name="tenant_register_state"
                        value={draft.tenant_register_state}
                        onChange={(event) =>
                          update("tenant_register_state", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Country">
                      <Input
                        name="tenant_register_country"
                        value={draft.tenant_register_country}
                        onChange={(event) =>
                          update("tenant_register_country", event.target.value)
                        }
                      />
                    </Field>

                    <Field label="Pincode">
                      <Input
                        name="tenant_register_pincode"
                        value={draft.tenant_register_pincode}
                        onChange={(event) =>
                          update("tenant_register_pincode", event.target.value)
                        }
                      />
                    </Field>
                  </div>
                </div>

                {/* Subscription

                    Account status is deliberately absent: the update
                    endpoint has no isActive field, so a toggle here would
                    silently do nothing. Deactivation is a separate action. */}

                <div>
                  <h3 className="mb-4 text-sm font-semibold text-slate-900">
                    Subscription
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Subscription Plan">
                      <Select
                        name="tenant_sub_plan"
                        value={draft.tenant_sub_plan}
                        onValueChange={(value) =>
                          update("tenant_sub_plan", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>

                        <SelectContent>
                          {TENANT_PLANS.map((plan) => (
                            <SelectItem key={plan} value={plan}>
                              {getPlanLabel(plan)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label="Subscription Status">
                      <Select
                        name="tenant_sub_status"
                        value={draft.tenant_sub_status}
                        onValueChange={(value) =>
                          update("tenant_sub_status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                          {TENANT_SUBSCRIPTION_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getSubscriptionStatusLabel(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading || !draft.tenant_name || !draft.tenant_code}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}