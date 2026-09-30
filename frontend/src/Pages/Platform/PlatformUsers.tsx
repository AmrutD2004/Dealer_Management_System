import DashboardLayout from "@/components/Layout/DashboardLayout";

import { toast } from "@/components/ui/toast";

import {
  PlatformUserCreateDialog,
  PlatformUserDeleteDialog,
  PlatformUserEditDialog,
  PlatformUserRoleDialog,
  PlatformUserViewDialog,
  PlatformUsersFilters,
  PlatformUsersHeader,
  PlatformUsersPagination,
  PlatformUsersStats,
  PlatformUsersTable,
  getFullName,
  getRoleLabel,
} from "@/components/PlatformUsers";

import { usePlatformUsers } from "@/hooks/use-platform-users";

import type { PlatformUserRole } from "@/components/PlatformUsers/types";

export default function PlatformUsers() {
  const {
    platformUsers,
    paginatedUsers,

    search,
    onSearchChange,

    roleFilter,
    onRoleFilterChange,

    statusFilter,
    onStatusFilterChange,

    onResetFilters,

    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    onPageChange,

    isViewOpen,
    onViewOpenChange,

    isCreateOpen,
    onCreateOpenChange,

    isEditOpen,
    onEditOpenChange,

    isRoleOpen,
    onRoleOpenChange,

    isDeleteOpen,
    onDeleteOpenChange,

    selectedUser,

    onCreateUser,
    onViewUser,
    onEditUser,
    onEditFromView,
    onOpenAssignRole,
    onAssignRoleFromView,
    onRequestDeleteUser,

    onCreatePlatformUser,
    onUpdatePlatformUser,
    onAssignRole: handleRoleAssign,
    onActivateUser,
    onDeactivateUser,
    onSuspendUser,
    onDeleteUser,

    superAdminCount,
  } = usePlatformUsers();

  /* User actions report through a toast the same way tenant actions do. */

  const findUser = (userId: string) =>
    platformUsers.find((user) => user.id === userId);

  const handleCreate = (
    draft: Parameters<typeof onCreatePlatformUser>[0],
  ) => {
    onCreatePlatformUser(draft);

    toast.add({
      type: "success",
      description: `${draft.firstName} ${draft.lastName} has been added as ${getRoleLabel(draft.role)}.`,
    });
  };

  const handleUpdate = (user: Parameters<typeof onUpdatePlatformUser>[0]) => {
    onUpdatePlatformUser(user);

    toast.add({
      type: "success",
      description: `${getFullName(user)} has been updated.`,
    });
  };

  const handleAssignRole = (
    userId: string,
    role: PlatformUserRole,
  ) => {
    handleRoleAssign(userId, role);

    const user = findUser(userId);

    toast.add({
      type: "success",
      description: user
        ? `${getFullName(user)} is now a ${getRoleLabel(role)}.`
        : `Role updated to ${getRoleLabel(role)}.`,
    });
  };

  const handleActivate = (userId: string) => {
    onActivateUser(userId);

    toast.add({
      type: "success",
      description: `${findUser(userId)?.firstName ?? "User"} can now sign in to the platform.`,
    });
  };

  const handleDeactivate = (userId: string) => {
    onDeactivateUser(userId);

    toast.add({
      type: "success",
      description: `Access revoked for ${findUser(userId)?.firstName ?? "user"}.`,
    });
  };

  const handleSuspend = (userId: string) => {
    onSuspendUser(userId);

    toast.add({
      type: "success",
      description: `${findUser(userId)?.firstName ?? "User"} has been suspended.`,
    });
  };

  const handleDelete = (user: Parameters<typeof onDeleteUser>[0]) => {
    onDeleteUser(user);

    toast.add({
      type: "success",
      description: `${getFullName(user)} has been removed from the platform.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <PlatformUsersHeader onCreateUser={onCreateUser} />

          <PlatformUsersStats platformUsers={platformUsers} />

          <PlatformUsersFilters
            search={search}
            onSearchChange={onSearchChange}
            roleFilter={roleFilter}
            onRoleFilterChange={onRoleFilterChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
            onResetFilters={onResetFilters}
          />

          <PlatformUsersTable
            platformUsers={paginatedUsers}
            onView={onViewUser}
            onEdit={onEditUser}
            onAssignRole={onOpenAssignRole}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onSuspend={handleSuspend}
            onDelete={onRequestDeleteUser}
          />

          <div className="rounded-xl border border-slate-200 bg-white">
            <PlatformUsersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>

        <PlatformUserViewDialog
          open={isViewOpen}
          onOpenChange={onViewOpenChange}
          user={selectedUser}
          onEdit={onEditFromView}
          onAssignRole={onAssignRoleFromView}
        />

        <PlatformUserCreateDialog
          open={isCreateOpen}
          onOpenChange={onCreateOpenChange}
          onCreate={handleCreate}
        />

        <PlatformUserEditDialog
          open={isEditOpen}
          onOpenChange={onEditOpenChange}
          user={selectedUser}
          onSave={handleUpdate}
        />

        <PlatformUserRoleDialog
          open={isRoleOpen}
          onOpenChange={onRoleOpenChange}
          user={selectedUser}
          superAdminCount={superAdminCount}
          onAssign={handleAssignRole}
        />

        <PlatformUserDeleteDialog
          open={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          user={selectedUser}
          onConfirm={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
