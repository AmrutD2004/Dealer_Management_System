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




import {
  featuresToText,
  isPlanValid,
  parseLimit,
  parsePrice,
  textToFeatures,
} from "./helpers";

import type { BillingCycle, Plan } from "./types";

const asChoice = <T extends string>(value: string, fallback: T): T =>
  (value as T) ?? fallback;

interface PlanEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
  onSave: (plan: Plan) => void;
}

/*
 * The limit and feature inputs are kept as strings while editing so
 * that clearing a field or typing a multi digit number does not get
 * immediately rewritten by a number round trip.
 */

interface PlanEditDraft {
  name: string;
  description: string;
  price: string;
  billingCycle: BillingCycle;
  maxBranches: string;
  maxUsers: string;
  maxVehicles: string;
  storageGb: string;
  features: string;
  isActive: boolean;
}

const limitToInput = (value: number | null): string =>
  value === null ? "" : String(value);

const toDraft = (plan: Plan): PlanEditDraft => ({
  name: plan.name,
  description: plan.description,
  price: String(plan.price),
  billingCycle: plan.billingCycle,
  maxBranches: limitToInput(plan.maxBranches),
  maxUsers: limitToInput(plan.maxUsers),
  maxVehicles: limitToInput(plan.maxVehicles),
  storageGb: limitToInput(plan.storageGb),
  features: featuresToText(plan.features),
  isActive: plan.isActive,
});

export function PlanEditDialog({
  open,
  onOpenChange,
  plan,
  onSave,
}: PlanEditDialogProps) {
  const [draft, setDraft] = useState<PlanEditDraft | null>(null);

  /*
   * Work on a copy so cancelling never mutates the card, and re-seed
   * the draft every time the dialog opens.
   */

  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);

    setDraft(open && plan ? toDraft(plan) : null);
  }

  const update = <K extends keyof PlanEditDraft>(
    key: K,
    value: PlanEditDraft[K],
  ) => {
    setDraft((previous) =>
      previous ? { ...previous, [key]: value } : previous,
    );
  };

  const handleSave = () => {
    if (!draft || !plan) {
      return;
    }

    const next: Plan = {
      ...plan,

      name: draft.name.trim(),
      description: draft.description.trim(),
      price: parsePrice(draft.price),
      billingCycle: draft.billingCycle,

      features: textToFeatures(draft.features),

      maxBranches: parseLimit(draft.maxBranches),
      maxUsers: parseLimit(draft.maxUsers),
      maxVehicles: parseLimit(draft.maxVehicles),
      storageGb: parseLimit(draft.storageGb),

      isActive: draft.isActive,
    };

    if (!isPlanValid(next)) {
      return;
    }

    onSave(next);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        {draft && plan && (
          <>
            <DialogHeader>
              <DialogTitle>Edit Plan</DialogTitle>

              <DialogDescription>
                {plan.code} plan &mdash; update its pricing, limits and
                features. Leave a limit blank for unlimited.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Details */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Plan Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Plan Name">
                    <Input
                      value={draft.name}
                      onChange={(event) =>
                        update("name", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Price">
                    <Input
                      type="number"
                      min={0}
                      value={draft.price}
                      onChange={(event) =>
                        update("price", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Description" className="sm:col-span-2">
                    <Textarea
                      value={draft.description}
                      onChange={(event) =>
                        update("description", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Billing Cycle">
                    <Select
                      value={draft.billingCycle}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>

                        <SelectItem value="QUARTERLY">
                          Quarterly
                        </SelectItem>

                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Availability">
                    <Select
                      value={draft.isActive ? "ACTIVE" : "INACTIVE"}
                      onValueChange={(value) =>
                        update("isActive", value === "ACTIVE")
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
                </div>
              </div>

              {/* Limits */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Limits
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Branches">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Unlimited"
                      value={draft.maxBranches}
                      onChange={(event) =>
                        update("maxBranches", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Users">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Unlimited"
                      value={draft.maxUsers}
                      onChange={(event) =>
                        update("maxUsers", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Vehicles">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Unlimited"
                      value={draft.maxVehicles}
                      onChange={(event) =>
                        update("maxVehicles", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Storage (GB)">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Unlimited"
                      value={draft.storageGb}
                      onChange={(event) =>
                        update("storageGb", event.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>

              {/* Features */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Features
                </h3>

                <Field label="One feature per line">
                  <Textarea
                    rows={6}
                    value={draft.features}
                    onChange={(event) =>
                      update("features", event.target.value)
                    }
                  />
                </Field>
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
