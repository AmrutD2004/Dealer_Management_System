import { useCallback, useState } from "react";

import { usePlansStore } from "@/components/Plans";

import type { Plan } from "@/components/Plans/types";

export function usePlans() {
  /*
   * The plan collection lives in PlansProvider alongside the tenant
   * collection so that both survive navigating between pages.
   */

  const {
    plans,

    onUpdatePlan,
    onActivatePlan,
    onSuspendPlan,
    onSetPopularPlan,
  } = usePlansStore();

  /* =======================================================
     DIALOG STATE
  ======================================================= */

  const [isViewOpen, setIsViewOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  /* =======================================================
     OPEN VIEW / EDIT
  ======================================================= */

  const handleViewPlan = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setIsViewOpen(true);
  }, []);

  const handleEditPlan = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditOpen(true);
  }, []);

  /*
   * "Edit Plan" from inside the view dialog closes the view and
   * hands the same plan over to the edit dialog.
   */

  const handleEditFromView = useCallback((plan: Plan) => {
    setIsViewOpen(false);
    setSelectedPlan(plan);
    setIsEditOpen(true);
  }, []);

  /* =======================================================
     ROW ACTIONS
  ======================================================= */

  const handleActivate = useCallback(
    (planId: string) => {
      onActivatePlan(planId);

      setSelectedPlan((previous) =>
        previous?.id === planId ? { ...previous, isActive: true } : previous,
      );
    },
    [onActivatePlan],
  );

  const handleSuspend = useCallback(
    (planId: string) => {
      onSuspendPlan(planId);

      setSelectedPlan((previous) =>
        previous?.id === planId ? { ...previous, isActive: false } : previous,
      );
    },
    [onSuspendPlan],
  );

  /*
   * Only one plan can be popular, so a stale selectedPlan would still
   * claim the highlight in the view dialog.
   */

  const handleSetPopular = useCallback(
    (planId: string) => {
      onSetPopularPlan(planId);

      setSelectedPlan((previous) =>
        previous ? { ...previous, isPopular: previous.id === planId } : previous,
      );
    },
    [onSetPopularPlan],
  );

  const handleUpdatePlan = useCallback(
    (plan: Plan) => {
      onUpdatePlan(plan);

      setSelectedPlan((previous) =>
        previous?.id === plan.id ? plan : previous,
      );
    },
    [onUpdatePlan],
  );

  return {
    plans,

    isViewOpen,
    onViewOpenChange: setIsViewOpen,

    isEditOpen,
    onEditOpenChange: setIsEditOpen,

    selectedPlan,

    onViewPlan: handleViewPlan,
    onEditPlan: handleEditPlan,
    onEditFromView: handleEditFromView,

    onActivatePlan: handleActivate,
    onSuspendPlan: handleSuspend,
    onSetPopularPlan: handleSetPopular,

    onUpdatePlan: handleUpdatePlan,
  };
}
