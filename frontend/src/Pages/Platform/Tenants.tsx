import DashboardLayout from "@/components/Layout/DashboardLayout";

import { toast } from "@/components/ui/toast";

import {
  TenantDeleteDialog,
  TenantEditDialog,
  TenantViewDialog,
  TenantsFilters,
  TenantsHeader,
  TenantsPagination,
  TenantsTable,
} from "@/components/Tenants";

import { useTenants } from "@/hooks/use-tenants";

import type { Tenant } from "@/components/Tenants/types";

export default function Tenants() {
  const {
    tenants,

    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    planFilter,
    onPlanFilterChange,
    subscriptionFilter,
    onSubscriptionFilterChange,
    onResetFilters,

    paginatedTenants,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    onPageChange,

    isViewOpen,
    onViewOpenChange,

    isEditOpen,
    onEditOpenChange,

    isDeleteOpen,
    onDeleteOpenChange,

    selectedTenant,

    onViewTenant,
    onEditTenant,
    onEditFromView,
    onRequestDeleteTenant,

    onUpdateTenant,
    onActivateTenant,
    onSuspendTenant,
    onDeleteTenant,
  } = useTenants();

  /* Row mutations report back through a toast so the change is
     visible even when the row disappears from the current page. */

  const handleActivate = (tenantId: string) => {
    onActivateTenant(tenantId);

    const tenant = tenants.find((item) => item.id === tenantId);

    toast.add({
      type: "success",
      description: `${tenant?.tenantName ?? "Tenant"} has been activated.`,
    });
  };

  const handleSuspend = (tenantId: string) => {
    onSuspendTenant(tenantId);

    const tenant = tenants.find((item) => item.id === tenantId);

    toast.add({
      type: "success",
      description: `${tenant?.tenantName ?? "Tenant"} has been suspended.`,
    });
  };

  const handleDelete = (tenant: Tenant) => {
    onDeleteTenant(tenant);

    toast.add({
      type: "success",
      description: `${tenant.tenantName} has been deleted.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <TenantsHeader />

          <TenantsFilters
            search={search}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
            planFilter={planFilter}
            onPlanFilterChange={onPlanFilterChange}
            subscriptionFilter={subscriptionFilter}
            onSubscriptionFilterChange={onSubscriptionFilterChange}
            onReset={onResetFilters}
          />

          <TenantsTable
            tenants={paginatedTenants}
            totalCount={totalCount}
            onView={onViewTenant}
            onEdit={onEditTenant}
            onActivate={handleActivate}
            onSuspend={handleSuspend}
            onDelete={onRequestDeleteTenant}
            footer={
              <TenantsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
              />
            }
          />
        </div>

        <TenantViewDialog
          open={isViewOpen}
          onOpenChange={onViewOpenChange}
          tenant={selectedTenant}
          onEdit={onEditFromView}
        />

        <TenantEditDialog
          open={isEditOpen}
          onOpenChange={onEditOpenChange}
          tenant={selectedTenant}
          onSave={onUpdateTenant}
        />

        <TenantDeleteDialog
          open={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          tenant={selectedTenant}
          onConfirm={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
