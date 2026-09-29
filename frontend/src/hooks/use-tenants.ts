import { useCallback, useMemo, useState } from "react";

import { initialTenants } from "@/components/Tenants/data";
import { getToday } from "@/components/Tenants/helpers";

import type { Tenant, TenantDraft } from "@/components/Tenants/types";

const ITEMS_PER_PAGE = 5;

export function useTenants() {
  /* =======================================================
     TENANT DATA
  ======================================================= */

  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [planFilter, setPlanFilter] = useState("ALL");

  const [subscriptionFilter, setSubscriptionFilter] = useState("ALL");

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [page, setPage] = useState(1);

  /* =======================================================
     DIALOG STATE
  ======================================================= */

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  /* =======================================================
     FILTER TENANTS
  ======================================================= */

  const filteredTenants = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tenants.filter((tenant) => {
      const matchesSearch =
        searchValue === "" ||
        tenant.tenantName.toLowerCase().includes(searchValue) ||
        tenant.tenantCode.toLowerCase().includes(searchValue) ||
        tenant.email.toLowerCase().includes(searchValue) ||
        tenant.phone.toLowerCase().includes(searchValue) ||
        tenant.gstNumber.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        tenant.isActive === (statusFilter === "ACTIVE");

      const matchesPlan = planFilter === "ALL" || tenant.plan === planFilter;

      const matchesSubscription =
        subscriptionFilter === "ALL" ||
        tenant.subscriptionStatus === subscriptionFilter;

      return (
        matchesSearch && matchesStatus && matchesPlan && matchesSubscription
      );
    });
  }, [tenants, search, statusFilter, planFilter, subscriptionFilter]);

  /* =======================================================
     PAGINATION

     currentPage is derived rather than stored so that a filter
     which shrinks the result set can never leave the pager
     pointing past the last page.
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTenants.length / ITEMS_PER_PAGE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedTenants = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredTenants.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTenants, currentPage]);

  /* =======================================================
     FILTER HANDLERS

     Every filter change jumps back to page 1.
  ======================================================= */

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handlePlanFilterChange = useCallback((value: string) => {
    setPlanFilter(value);
    setPage(1);
  }, []);

  const handleSubscriptionFilterChange = useCallback((value: string) => {
    setSubscriptionFilter(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("ALL");
    setPlanFilter("ALL");
    setSubscriptionFilter("ALL");
    setPage(1);
  }, []);

  /* =======================================================
     CREATE TENANT
  ======================================================= */

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

        createdAt: today,

        updatedAt: today,
      };

      setTenants((previous) => [tenant, ...previous]);

      setPage(1);
    },
    [tenants.length],
  );

  /* =======================================================
     UPDATE TENANT
  ======================================================= */

  const handleUpdateTenant = useCallback((tenant: Tenant) => {
    setTenants((previous) =>
      previous.map((item) => (item.id === tenant.id ? tenant : item)),
    );
  }, []);

  /* =======================================================
     ACTIVATE / SUSPEND TENANT
  ======================================================= */

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

  /* =======================================================
     OPEN VIEW / EDIT
  ======================================================= */

  const handleViewTenant = useCallback((tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsViewOpen(true);
  }, []);

  const handleEditTenant = useCallback((tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsEditOpen(true);
  }, []);

  /*
   * "Edit Tenant" from inside the view dialog closes the view
   * and hands the same tenant over to the edit dialog.
   */

  const handleEditFromView = useCallback(
    (tenant: Tenant) => {
      setIsViewOpen(false);
      setSelectedTenant(tenant);
      setIsEditOpen(true);
    },
    [],
  );

  return {
    tenants,

    /* Filters */
    search,
    onSearchChange: handleSearchChange,

    statusFilter,
    onStatusFilterChange: handleStatusFilterChange,

    planFilter,
    onPlanFilterChange: handlePlanFilterChange,

    subscriptionFilter,
    onSubscriptionFilterChange: handleSubscriptionFilterChange,

    onResetFilters: resetFilters,

    /* Pagination */
    paginatedTenants,
    currentPage,
    totalPages,
    totalCount: filteredTenants.length,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange: setPage,

    /* Dialogs */
    isCreateOpen,
    onCreateOpenChange: setIsCreateOpen,

    isViewOpen,
    onViewOpenChange: setIsViewOpen,

    isEditOpen,
    onEditOpenChange: setIsEditOpen,

    selectedTenant,

    /* Row actions */
    onViewTenant: handleViewTenant,
    onEditTenant: handleEditTenant,
    onEditFromView: handleEditFromView,

    /* Mutations */
    onCreateTenant: handleCreateTenant,
    onUpdateTenant: handleUpdateTenant,
    onActivateTenant: handleActivateTenant,
    onSuspendTenant: handleSuspendTenant,
  };
}