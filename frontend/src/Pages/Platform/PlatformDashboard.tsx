import { useMemo, useState } from "react";

import DashboardLayout from "@/components/Layout/DashboardLayout";

import {
  DashboardHeader,
  DashboardQuickActions,
  RecentTenants,
} from "@/components/Dashboard";

import {
  TenantViewDialog,
  TenantsStats,
  useTenantsStore,
} from "@/components/Tenants";

import type { Tenant } from "@/components/Tenants/types";

export default function PlatformDashboard() {
  const { tenants } = useTenantsStore();

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);

  const counts = useMemo(
    () => ({
      trial: tenants.filter((tenant) => tenant.subscriptionStatus === "TRIAL")
        .length,

      inactive: tenants.filter((tenant) => !tenant.isActive).length,
    }),
    [tenants],
  );

  const handleViewTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsViewOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <DashboardHeader />


          <TenantsStats  />

          <DashboardQuickActions
           
          />

          
        </div>

        

          <RecentTenants tenants={tenants} onView={handleViewTenant} />
        </div>
    </DashboardLayout>
  );
}