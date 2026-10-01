import { useCallback, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { usePlatformUsersStore } from "@/components/PlatformUsers";

import type {
  PlatformUser,
  PlatformUserDraft,
  PlatformUserRole,
} from "@/components/PlatformUsers/types";

const ITEMS_PER_PAGE = 5;

const getFullName = (user: PlatformUser): string =>
  `${user.firstName} ${user.middleName ? `${user.middleName} ` : ""}${user.lastName}`.trim();

const countSuperAdmins = (users: PlatformUser[]): number =>
  users.filter((user) => user.role === "SUPER_ADMIN" && user.status === "ACTIVE").length;

/*
 * Only known values are accepted so a hand-typed query string cannot
 * put the page in an odd state.
 */

const readParam = (value: string | null, allowed: string[]): string =>
  value && allowed.includes(value) ? value : "ALL";

export function usePlatformUsers() {
  /*
   * The collection itself lives in PlatformUsersProvider so that it
   * survives navigating between the platform pages.
   */

  const {
    platformUsers,

    onCreatePlatformUser,
    onUpdatePlatformUser,
    onAssignRole,
    onActivatePlatformUser,
    onDeactivatePlatformUser,
    onSuspendPlatformUser,
    onDeletePlatformUser,
  } = usePlatformUsersStore();

  const [searchParams, setSearchParams] = useSearchParams();

  /* =======================================================
     FILTER STATE

     The dropdown filters live in the query string so a dashboard
     shortcut such as /platform-users?role=SUPER_ADMIN lands on an
     already filtered list. The free text search stays local so that
     typing is never gated on a router navigation.
  ======================================================= */

  const [search, setSearch] = useState("");

  const roleFilter = readParam(searchParams.get("role"), [
    "SUPER_ADMIN",
    "SUPPORT_ADMIN",
  ]);

  const statusFilter = readParam(searchParams.get("status"), [
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [page, setPage] = useState(1);

  /* =======================================================
     DIALOG STATE
  ======================================================= */

  const [isViewOpen, setIsViewOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  /* =======================================================
     FILTER USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return platformUsers.filter((user) => {
      const matchesSearch =
        searchValue === "" ||
        getFullName(user).toLowerCase().includes(searchValue) ||
        user.userCode.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.phone.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [platformUsers, search, roleFilter, statusFilter]);

  /* =======================================================
     PAGINATION

     currentPage is derived rather than stored so that a filter
     which shrinks the result set can never leave the pager
     pointing past the last page.
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  /* =======================================================
     FILTER HANDLERS

     Every filter change jumps back to page 1.
  ======================================================= */

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const applyFilter = useCallback(
    (key: string, value: string | null) => {
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

  const handleRoleFilterChange = useCallback(
    (value: string | null) => applyFilter("role", value),
    [applyFilter],
  );

  const handleStatusFilterChange = useCallback(
    (value: string | null) => applyFilter("status", value),
    [applyFilter],
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setPage(1);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  /* =======================================================
     OPEN DIALOGS
  ======================================================= */

  const handleViewUser = useCallback((user: PlatformUser) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  }, []);

  const handleEditUser = useCallback((user: PlatformUser) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  }, []);

  const handleOpenAssignRole = useCallback((user: PlatformUser) => {
    setSelectedUser(user);
    setIsRoleOpen(true);
  }, []);

  /*
   * The role dialog can be opened from the view dialog, so the same
   * user is handed over and the view is closed behind it.
   */

  const handleAssignRoleFromView = useCallback((user: PlatformUser) => {
    setIsViewOpen(false);
    setSelectedUser(user);
    setIsRoleOpen(true);
  }, []);

  const handleEditFromView = useCallback((user: PlatformUser) => {
    setIsViewOpen(false);
    setSelectedUser(user);
    setIsEditOpen(true);
  }, []);

  const handleCreateUser = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  /*
   * Delete is confirmed in a dialog first, so the row action only
   * has to arm it; the actual removal happens in handleDeleteUser.
   */

  const handleRequestDeleteUser = useCallback((user: PlatformUser) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteUser = useCallback(
    (user: PlatformUser) => {
      onDeletePlatformUser(user.id);

      /* Drop the row-level dialog state if it was the one that fired. */

      setIsViewOpen(false);
      setIsEditOpen(false);
      setIsRoleOpen(false);
      setIsDeleteOpen(false);
      setSelectedUser(null);
    },
    [onDeletePlatformUser],
  );

  /* =======================================================
     MUTATIONS

     Each mutation also refreshes selectedUser so an open view dialog
     never shows a stale copy of the row it is describing.
  ======================================================= */

  const handleCreate = useCallback(
    (draft: PlatformUserDraft) => {
      onCreatePlatformUser(draft);

      setIsCreateOpen(false);
    },
    [onCreatePlatformUser],
  );

  const handleUpdate = useCallback(
    (user: PlatformUser) => {
      onUpdatePlatformUser(user);

      setSelectedUser((previous) =>
        previous?.id === user.id ? user : previous,
      );
    },
    [onUpdatePlatformUser],
  );

  const handleRoleAssign = useCallback(
    (userId: string, role: PlatformUserRole) => {
      onAssignRole(userId, role);

      setSelectedUser((previous) =>
        previous?.id === userId ? { ...previous, role } : previous,
      );

      setIsRoleOpen(false);
    },
    [onAssignRole],
  );

  const handleActivate = useCallback(
    (userId: string) => {
      onActivatePlatformUser(userId);

      setSelectedUser((previous) =>
        previous?.id === userId ? { ...previous, status: "ACTIVE" } : previous,
      );
    },
    [onActivatePlatformUser],
  );

  const handleDeactivate = useCallback(
    (userId: string) => {
      onDeactivatePlatformUser(userId);

      setSelectedUser((previous) =>
        previous?.id === userId ? { ...previous, status: "INACTIVE" } : previous,
      );
    },
    [onDeactivatePlatformUser],
  );

  const handleSuspend = useCallback(
    (userId: string) => {
      onSuspendPlatformUser(userId);

      setSelectedUser((previous) =>
        previous?.id === userId
          ? { ...previous, status: "SUSPENDED" }
          : previous,
      );
    },
    [onSuspendPlatformUser],
  );

  const superAdminCount = useMemo(
    () => countSuperAdmins(platformUsers),
    [platformUsers],
  );

  return {
    platformUsers,
    paginatedUsers,

    /* Filters */
    search,
    onSearchChange: handleSearchChange,

    roleFilter,
    onRoleFilterChange: handleRoleFilterChange,

    statusFilter,
    onStatusFilterChange: handleStatusFilterChange,

    onResetFilters: resetFilters,

    /* Pagination */
    currentPage,
    totalPages,
    totalCount: filteredUsers.length,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange: setPage,

    /* Dialogs */
    isViewOpen,
    onViewOpenChange: setIsViewOpen,

    isCreateOpen,
    onCreateOpenChange: setIsCreateOpen,

    isEditOpen,
    onEditOpenChange: setIsEditOpen,

    isRoleOpen,
    onRoleOpenChange: setIsRoleOpen,

    isDeleteOpen,
    onDeleteOpenChange: setIsDeleteOpen,

    selectedUser,

    /* Row actions */
    onCreateUser: handleCreateUser,
    onViewUser: handleViewUser,
    onEditUser: handleEditUser,
    onEditFromView: handleEditFromView,
    onOpenAssignRole: handleOpenAssignRole,
    onAssignRoleFromView: handleAssignRoleFromView,
    onRequestDeleteUser: handleRequestDeleteUser,

    /* Mutations */
    onCreatePlatformUser: handleCreate,
    onUpdatePlatformUser: handleUpdate,
    onAssignRole: handleRoleAssign,
    onActivateUser: handleActivate,
    onDeactivateUser: handleDeactivate,
    onSuspendUser: handleSuspend,
    onDeleteUser: handleDeleteUser,

    superAdminCount,
  };
}
