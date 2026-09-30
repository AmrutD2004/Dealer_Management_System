import { createContext, useContext } from "react";

import type { Plan } from "./types";

export interface PlansContextValue {
  plans: Plan[];
  onUpdatePlan: (plan: Plan) => void;
  onActivatePlan: (planId: string) => void;
  onSuspendPlan: (planId: string) => void;
  onSetPopularPlan: (planId: string) => void;
}

export const PlansContext = createContext<PlansContextValue | null>(null);

export function usePlansStore() {
  const context = useContext(PlansContext);

  if (!context) {
    throw new Error("usePlansStore must be used within a PlansProvider");
  }

  return context;
}
