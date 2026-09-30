import type { ReactNode } from "react";

import {
  Building2,
  Car,
  Check,
  CreditCard,
  HardDrive,
  Pencil,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { InfoItem } from "@/components/Tenants/InfoItem";

import {
  formatCurrency,
  formatLimit,
  getBillingCycleLabel,
  getPlanStatusClass,
  getPlanStatusLabel,
} from "./helpers";

import type { Plan, PlanLimit } from "./types";

interface LimitItemProps {
  icon: ReactNode;
  label: string;
  value: PlanLimit;
  suffix?: string;
}

function LimitItem({ icon, label, value, suffix }: LimitItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {formatLimit(value, suffix)}
      </p>
    </div>
  );
}

interface PlanViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
  tenantCount: number;
  onEdit?: (plan: Plan) => void;
}

export function PlanViewDialog({
  open,
  onOpenChange,
  plan,
  tenantCount,
  onEdit,
}: PlanViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        {plan && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <CreditCard className="h-6 w-6 text-slate-600" />
                </div>

                <div>
                  <DialogTitle>{plan.name}</DialogTitle>

                  <DialogDescription>{plan.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Status */}

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={getPlanStatusClass(plan.isActive)}
                >
                  {getPlanStatusLabel(plan.isActive)}
                </Badge>

                {plan.isPopular && (
                  <Badge variant="outline" className="border-slate-900 text-slate-900">
                    Most Popular
                  </Badge>
                )}

                <Badge variant="outline">{plan.code}</Badge>
              </div>

              <Separator />

              {/* Pricing */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Pricing
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem label="Price" value={formatCurrency(plan.price)} />

                  <InfoItem
                    label="Billing Cycle"
                    value={getBillingCycleLabel(plan.billingCycle)}
                  />

                  <InfoItem
                    label="Subscribed Tenants"
                    value={String(tenantCount)}
                  />

                  <InfoItem label="Last Updated" value={plan.updatedAt} />
                </div>
              </div>

              <Separator />

              {/* Limits */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Limits
                </h3>

                <div className="grid gap-3 sm:grid-cols-4">
                  <LimitItem
                    icon={<Building2 className="h-4 w-4" />}
                    label="Branches"
                    value={plan.maxBranches}
                  />

                  <LimitItem
                    icon={<Users className="h-4 w-4" />}
                    label="Users"
                    value={plan.maxUsers}
                  />

                  <LimitItem
                    icon={<Car className="h-4 w-4" />}
                    label="Vehicles"
                    value={plan.maxVehicles}
                  />

                  <LimitItem
                    icon={<HardDrive className="h-4 w-4" />}
                    label="Storage"
                    value={plan.storageGb}
                    suffix=" GB"
                  />
                </div>
              </div>

              <Separator />

              {/* Features */}

              <div>
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                  Features
                </h3>

                {plan.features.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No features listed for this plan.
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                        <span className="text-sm text-slate-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <DialogFooter>
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(plan);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Plan
                </Button>
              )}

              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
