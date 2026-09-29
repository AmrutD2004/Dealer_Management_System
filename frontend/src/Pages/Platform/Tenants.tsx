import DashboardLayout from "@/components/Layout/DashboardLayout";

import {
  TenantCreateDialog,
  TenantEditDialog,
  TenantViewDialog,
  TenantsFilters,
  TenantsHeader,
  TenantsPagination,
  TenantsStats,
  TenantsTable,
} from "@/components/Tenants";

import { useTenants } from "@/hooks/use-tenants";

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

    isCreateOpen,
    onCreateOpenChange,

    isViewOpen,
    onViewOpenChange,

    isEditOpen,
    onEditOpenChange,

    selectedTenant,

    onViewTenant,
    onEditTenant,
    onEditFromView,

    onCreateTenant,
    onUpdateTenant,
    onActivateTenant,
    onSuspendTenant,
  } = useTenants();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <TenantsHeader onCreate={() => onCreateOpenChange(true)} />

          <TenantsStats tenants={tenants} />

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
            onActivate={onActivateTenant}
            onSuspend={onSuspendTenant}
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

        <TenantCreateDialog
          open={isCreateOpen}
          onOpenChange={onCreateOpenChange}
          onSubmit={onCreateTenant}
        />

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
      </div>
    </DashboardLayout>
  );
}
