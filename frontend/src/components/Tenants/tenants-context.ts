import { createContext, useContext } from "react";

import type { Tenant, TenantDraft } from "./types";

export interface TenantsContextValue {
  tenants: Tenant[];
  onCreateTenant: (draft: TenantDraft) => void;
  onUpdateTenant: (tenant: Tenant) => void;
  onActivateTenant: (tenantId: string) => void;
  onSuspendTenant: (tenantId: string) => void;
}

export const TenantsContext = createContext<TenantsContextValue | null>(null);

export function useTenantsStore() {
  const context = useContext(TenantsContext);

  if (!context) {
    throw new Error("useTenantsStore must be used within a TenantsProvider");
  }

  return context;
}
