import type { ReactNode } from "react";

import {
  Building2,
  Car,
  Check,
  CheckCircle2,
  CirclePause,
  Eye,
  HardDrive,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  formatCurrency,
  formatLimit,
  getBillingCycleSuffix,
  getPlanStatusClass,
  getPlanStatusLabel,
} from "./helpers";

import type { Plan, PlanLimit } from "./types";

interface LimitRowProps {
  icon: ReactNode;
  label: string;
  value: PlanLimit;
  suffix?: string;
}

function LimitRow({ icon, label, value, suffix }: LimitRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-slate-500">
        {icon}
        {label}
      </span>

      <span className="font-medium text-slate-800">
        {formatLimit(value, suffix)}
      </span>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  tenantCount: number;
  onView: (plan: Plan) => void;
  onEdit: (plan: Plan) => void;
  onActivate: (planId: string) => void;
  onSuspend: (planId: string) => void;
  onSetPopular: (planId: string) => void;
}

export function PlanCard({
  plan,
  tenantCount,
  onView,
  onEdit,
  onActivate,
  onSuspend,
  onSetPopular,
}: PlanCardProps) {
  return (
    <Card
      className={
        plan.isPopular
          ? "border-slate-900 shadow-md"
          : "border-slate-200 shadow-sm"
      }
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h2>

              {plan.isPopular && (
                <Badge variant="outline" className="border-slate-900 text-slate-900">
                  <Sparkles />
                  Most Popular
                </Badge>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Actions for ${plan.name}`}
                />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(plan)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEdit(plan)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Plan
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {!plan.isPopular && (
                <DropdownMenuItem onClick={() => onSetPopular(plan.id)}>
                  <Star className="mr-2 h-4 w-4" />
                  Mark as Popular
                </DropdownMenuItem>
              )}

              {plan.isActive ? (
                <DropdownMenuItem
                  onClick={() => onSuspend(plan.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <CirclePause className="mr-2 h-4 w-4" />
                  Suspend Plan
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onActivate(plan.id)}>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                  Activate Plan
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Price */}

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight text-slate-900">
            {formatCurrency(plan.price)}
          </span>

          <span className="text-sm text-slate-500">
            {getBillingCycleSuffix(plan.billingCycle)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={getPlanStatusClass(plan.isActive)}
          >
            {getPlanStatusLabel(plan.isActive)}
          </Badge>

          <span className="text-sm text-slate-500">
            {tenantCount} tenant{tenantCount !== 1 ? "s" : ""} on this plan
          </span>
        </div>

        {/* Limits */}

        <div className="mt-6 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <LimitRow
            icon={<Building2 className="h-4 w-4 text-slate-500" />}
            label="Branches"
            value={plan.maxBranches}
          />

          <LimitRow
            icon={<Users className="h-4 w-4 text-slate-500" />}
            label="Users"
            value={plan.maxUsers}
          />

          <LimitRow
            icon={<Car className="h-4 w-4 text-slate-500" />}
            label="Vehicles"
            value={plan.maxVehicles}
          />

          <LimitRow
            icon={<HardDrive className="h-4 w-4 text-slate-500" />}
            label="Storage"
            value={plan.storageGb}
            suffix=" GB"
          />
        </div>

        {/* Features */}

        <ul className="mt-6 space-y-2.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

              <span className="text-slate-600">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Actions */}

        <div className="mt-6 flex gap-2">
          <Button className="flex-1" onClick={() => onEdit(plan)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Plan
          </Button>

          <Button variant="outline" onClick={() => onView(plan)}>
            <Eye className="mr-2 h-4 w-4" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
