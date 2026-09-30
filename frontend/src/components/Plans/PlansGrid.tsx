import { CreditCard } from "lucide-react";

import { PlanCard } from "./PlanCard";

import type { Plan } from "./types";

interface PlansGridProps {
  plans: Plan[];
  getTenantCount: (plan: Plan) => number;
  onView: (plan: Plan) => void;
  onEdit: (plan: Plan) => void;
  onActivate: (planId: string) => void;
  onSuspend: (planId: string) => void;
  onSetPopular: (planId: string) => void;
}

export function PlansGrid({
  plans,
  getTenantCount,
  onView,
  onEdit,
  onActivate,
  onSuspend,
  onSetPopular,
}: PlansGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm">
          <CreditCard className="mb-2 h-8 w-8 text-slate-300" />

          <p className="font-medium text-slate-700">No plans available</p>
        </div>
      ) : (
        plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            tenantCount={getTenantCount(plan)}
            onView={onView}
            onEdit={onEdit}
            onActivate={onActivate}
            onSuspend={onSuspend}
            onSetPopular={onSetPopular}
          />
        ))
      )}
    </div>
  );
}
