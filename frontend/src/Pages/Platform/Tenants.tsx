import DashboardLayout from "@/components/Layout/DashboardLayout";

import {
  TenantDeleteDialog,
  TenantEditDialog,
  TenantViewDialog,
  TenantsFilters,
  TenantsHeader,
  TenantsTable,
} from "@/components/Tenants";


export default function Tenants() {

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <TenantsHeader />

          <TenantsFilters
            
          />

          <TenantsTable
            
          />
        </div>

        <TenantViewDialog />

        {/* <TenantEditDialog /> */}
      </div>
    </DashboardLayout>
  );
}
