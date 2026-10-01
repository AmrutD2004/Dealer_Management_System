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
  

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <DashboardHeader />

          <TenantsStats  />

          <DashboardQuickActions
           
          />

          <RecentTenants />
        </div>

        <TenantViewDialog
        
        />
      </div>
    </DashboardLayout>
  );
}