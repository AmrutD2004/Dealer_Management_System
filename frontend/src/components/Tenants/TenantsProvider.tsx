import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { initialTenants } from "./data";
import { TenantsContext } from "./tenants-context";

import type { Tenant, TenantDraft } from "./types";

const getToday = (): string => new Date().toISOString().split("T")[0];

/*
 * The tenant list is owned above the router so it survives the
 * unmount that happens when /tenants swaps to /tenants/create.
 */

export function TenantsProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);

  const handleCreateTenant = useCallback(
    (draft: TenantDraft) => {
      const nextNumber = tenants.length + 1;

      const today = getToday();

      const tenant: Tenant = {
        id: crypto.randomUUID(),

        tenantCode:
          draft.tenantCode.trim() || `TEN-${String(nextNumber).padStart(3, "0")}`,

        tenantName: draft.tenantName.trim(),

        email: draft.email.trim(),

        phone: draft.phone.trim(),

        gstNumber: draft.gstNumber.trim(),

        address: draft.address.trim(),

        city: draft.city.trim(),

        state: draft.state.trim(),

        country: draft.country.trim() || "India",

        pincode: draft.pincode.trim(),

        plan: draft.plan,

        subscriptionStatus: draft.subscriptionStatus,

        isActive: draft.isActive,

        branch: {
          branchCode: draft.branch.branchCode.trim(),

          branchName: draft.branch.branchName.trim(),

          email: draft.branch.email.trim(),

          phone: draft.branch.phone.trim(),

          address: draft.branch.address.trim(),

          locality: draft.branch.locality.trim(),

          city: draft.branch.city.trim(),

          state: draft.branch.state.trim(),

          country: draft.branch.country.trim() || "India",

          pincode: draft.branch.pincode.trim(),
        },

        admin: {
          employeeCode: draft.admin.employeeCode.trim(),

          firstName: draft.admin.firstName.trim(),

          middleName: draft.admin.middleName.trim(),

          lastName: draft.admin.lastName.trim(),

          email: draft.admin.email.trim(),

          mobileNo: draft.admin.mobileNo.trim(),

          password: draft.admin.password,
        },

        createdAt: today,

        updatedAt: today,
      };

      setTenants((previous) => [tenant, ...previous]);
    },
    [tenants.length],
  );

  const handleUpdateTenant = useCallback((tenant: Tenant) => {
    setTenants((previous) =>
      previous.map((item) => (item.id === tenant.id ? tenant : item)),
    );
  }, []);

  const setTenantActive = useCallback((tenantId: string, isActive: boolean) => {
    setTenants((previous) =>
      previous.map((tenant) =>
        tenant.id === tenantId ? { ...tenant, isActive } : tenant,
      ),
    );
  }, []);

  const handleActivateTenant = useCallback(
    (tenantId: string) => setTenantActive(tenantId, true),
    [setTenantActive],
  );

  const handleSuspendTenant = useCallback(
    (tenantId: string) => setTenantActive(tenantId, false),
    [setTenantActive],
  );

  const handleDeleteTenant = useCallback((tenantId: string) => {
    setTenants((previous) =>
      previous.filter((tenant) => tenant.id !== tenantId),
    );
  }, []);

  const value = useMemo(
    () => ({
      tenants,

      onCreateTenant: handleCreateTenant,
      onUpdateTenant: handleUpdateTenant,
      onActivateTenant: handleActivateTenant,
      onSuspendTenant: handleSuspendTenant,
      onDeleteTenant: handleDeleteTenant,
    }),
    [
      tenants,
      handleCreateTenant,
      handleUpdateTenant,
      handleActivateTenant,
      handleSuspendTenant,
      handleDeleteTenant,
    ],
  );

  return (
    <TenantsContext.Provider value={value}>
      {children}
    </TenantsContext.Provider>
  );
}
