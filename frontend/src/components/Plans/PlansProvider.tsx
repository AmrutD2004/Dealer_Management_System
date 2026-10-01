import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";



import { initialPlans } from "./data";
import { PlansContext } from "./plans-context";

import type { Plan } from "./types";


const getToday = (): string => new Date().toISOString().split("T")[0];


/*
 * Client side only, mirroring TenantsProvider. Nothing here talks to
 * an API, so the plans reset to their seed values on reload until a
 * backend endpoint is wired in.
 */

export function PlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  const handleUpdatePlan = useCallback((plan: Plan) => {
    setPlans((previous) =>
      previous.map((item) =>
        item.id === plan.id ? { ...plan, updatedAt: getToday() } : item,
      ),
    );
  }, []);

  const setPlanActive = useCallback((planId: string, isActive: boolean) => {
    setPlans((previous) =>
      previous.map((plan) =>
        plan.id === planId
          ? { ...plan, isActive, updatedAt: getToday() }
          : plan,
      ),
    );
  }, []);

  const handleActivatePlan = useCallback(
    (planId: string) => setPlanActive(planId, true),
    [setPlanActive],
  );

  const handleSuspendPlan = useCallback(
    (planId: string) => setPlanActive(planId, false),
    [setPlanActive],
  );

  /*
   * Only one tier can carry the "popular" highlight, so picking a new
   * one clears the flag everywhere else.
   */

  const handleSetPopularPlan = useCallback((planId: string) => {
    setPlans((previous) =>
      previous.map((plan) => ({
        ...plan,
        isPopular: plan.id === planId,
        updatedAt: plan.id === planId ? getToday() : plan.updatedAt,
      })),
    );
  }, []);

  const value = useMemo(
    () => ({
      plans,

      onUpdatePlan: handleUpdatePlan,
      onActivatePlan: handleActivatePlan,
      onSuspendPlan: handleSuspendPlan,
      onSetPopularPlan: handleSetPopularPlan,
    }),
    [
      plans,
      handleUpdatePlan,
      handleActivatePlan,
      handleSuspendPlan,
      handleSetPopularPlan,
    ],
  );

  return (
    <PlansContext.Provider value={value}>{children}</PlansContext.Provider>
  );
}
