import { useCallback } from "react";

import DashboardLayout from "@/components/Layout/DashboardLayout";

import { toast } from "@/components/ui/toast";

import {
  PlanEditDialog,
  PlansGrid,
  PlansHeader,
  PlansStats,
  PlanViewDialog,
} from "@/components/Plans";

import { useTenantsStore } from "@/components/Tenants";

import { usePlans } from "@/hooks/use-plans";

import type { Plan } from "@/components/Plans/types";

export default function Plans() {
  const { tenants } = useTenantsStore();

  const {
    plans,

    isViewOpen,
    onViewOpenChange,

    isEditOpen,
    onEditOpenChange,

    selectedPlan,

    onViewPlan,
    onEditPlan,
    onEditFromView,

    onActivatePlan,
    onSuspendPlan,
    onSetPopularPlan,
    onUpdatePlan,
  } = usePlans();

  /* Each card shows how many tenants are currently on that tier. */

  const getTenantCount = useCallback(
    (plan: Plan) => tenants.filter((tenant) => tenant.plan === plan.code).length,
    [tenants],
  );

  const findPlan = (planId: string) => plans.find((plan) => plan.id === planId);

  /* Plan actions report through a toast the same way tenant actions do. */

  const handleActivate = (planId: string) => {
    onActivatePlan(planId);

    toast.add({
      type: "success",
      description: `${findPlan(planId)?.name ?? "Plan"} is now available to tenants.`,
    });
  };

  const handleSuspend = (planId: string) => {
    onSuspendPlan(planId);

    toast.add({
      type: "success",
      description: `${findPlan(planId)?.name ?? "Plan"} has been suspended.`,
    });
  };

  const handleSetPopular = (planId: string) => {
    onSetPopularPlan(planId);

    toast.add({
      type: "success",
      description: `${findPlan(planId)?.name ?? "Plan"} is now the recommended plan.`,
    });
  };

  const handleUpdate = (plan: Plan) => {
    onUpdatePlan(plan);

    toast.add({
      type: "success",
      description: `${plan.name} has been updated.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <PlansHeader />

          <PlansStats plans={plans} tenants={tenants} />

          <PlansGrid
            plans={plans}
            getTenantCount={getTenantCount}
            onView={onViewPlan}
            onEdit={onEditPlan}
            onActivate={handleActivate}
            onSuspend={handleSuspend}
            onSetPopular={handleSetPopular}
          />
        </div>

        <PlanViewDialog
          open={isViewOpen}
          onOpenChange={onViewOpenChange}
          plan={selectedPlan}
          tenantCount={selectedPlan ? getTenantCount(selectedPlan) : 0}
          onEdit={onEditFromView}
        />

        <PlanEditDialog
          open={isEditOpen}
          onOpenChange={onEditOpenChange}
          plan={selectedPlan}
          onSave={handleUpdate}
        />
      </div>
    </DashboardLayout>
  );
}
