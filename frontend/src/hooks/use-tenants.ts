import { useCallback, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { useTenantsStore } from "@/components/Tenants";

import type { Tenant } from "@/components/Tenants/types";

const ITEMS_PER_PAGE = 5;

/*
 * Dashboard shortcuts deep-link into a pre-filtered list, e.g.
 * /tenants?status=SUSPENDED. Only known values are accepted so a
 * hand-typed query string cannot put the page in an odd state.
 */

const readParam = (value: string | null, allowed: string[]): string =>
  value && allowed.includes(value) ? value : "ALL";

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
    onDeleteTenant,
  } = useTenantsStore();

  const [searchParams, setSearchParams] = useSearchParams();

  /* =======================================================
     FILTER STATE

     The dropdown filters live in the query string so that
     dashboard shortcuts such as /tenants?status=SUSPENDED land on
     an already filtered list. The free text search stays local so
     that typing is never gated on a router navigation.
  ======================================================= */

  const [search, setSearch] = useState("");

  const statusFilter = readParam(searchParams.get("status"), [
    "ACTIVE",
    "SUSPENDED",
  ]);

  const planFilter = readParam(searchParams.get("plan"), [
    "BASIC",
    "PRO",
    "PREMIUM",
  ]);

  const subscriptionFilter = readParam(searchParams.get("subscription"), [
    "TRIAL",
    "ACTIVE",
    "SUSPENDED",
    "EXPIRED",
    "CANCELLED",
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [page, setPage] = useState(1);

  /* =======================================================
     DIALOG STATE
  ======================================================= */

  const [isViewOpen, setIsViewOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const applyFilter = useCallback(
    (key: string, value: string) => {
      setPage(1);

      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);

          /* The default is dropped so the URL stays readable. */

          if (!value || value === "ALL") {
            next.delete(key);
          } else {
            next.set(key, value);
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => applyFilter("status", value),
    [applyFilter],
  );

  const handlePlanFilterChange = useCallback(
    (value: string) => applyFilter("plan", value),
    [applyFilter],
  );

  const handleSubscriptionFilterChange = useCallback(
    (value: string) => applyFilter("subscription", value),
    [applyFilter],
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setPage(1);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

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

  /*
   * Delete is confirmed in a dialog first, so the row action only
   * has to arm it; the actual removal happens in handleDeleteTenant.
   */

  const handleRequestDeleteTenant = useCallback((tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteTenant = useCallback(
    (tenant: Tenant) => {
      onDeleteTenant(tenant.id);

      /* Drop the row-level dialog state if it was the one that fired. */

      setIsViewOpen(false);
      setIsEditOpen(false);
      setIsDeleteOpen(false);
      setSelectedTenant(null);
    },
    [onDeleteTenant],
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

    isDeleteOpen,
    onDeleteOpenChange: setIsDeleteOpen,

    selectedTenant,

    /* Row actions */
    onViewTenant: handleViewTenant,
    onEditTenant: handleEditTenant,
    onEditFromView: handleEditFromView,
    onRequestDeleteTenant: handleRequestDeleteTenant,

    /* Mutations */
    onCreateTenant,
    onUpdateTenant,
    onActivateTenant,
    onSuspendTenant,
    onDeleteTenant: handleDeleteTenant,
  };
}
