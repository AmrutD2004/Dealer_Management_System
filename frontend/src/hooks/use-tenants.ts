import { useCallback, useMemo, useState } from "react";

import { useTenantsStore } from "@/components/Tenants";

import type { Tenant } from "@/components/Tenants/types";

const ITEMS_PER_PAGE = 5;

export function useTenants() {
  /*
   * The collection itself lives in TenantsProvider so that it
   * survives navigating to /tenants/create and back.
   */

  const {
    tenants,

    onCreateTenant,
    onUpdateTenant,
    onActivateTenant,
    onSuspendTenant,
  } = useTenantsStore();

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
    onCreateTenant,
    onUpdateTenant,
    onActivateTenant,
    onSuspendTenant,
  };
}
