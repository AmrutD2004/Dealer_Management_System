import DashboardLayout from "@/components/Layout/DashboardLayout";

import { toast } from "@/components/ui/toast";

import {
  PlatformUserCreateDialog,
  PlatformUsersFilters,
  PlatformUsersHeader,
  PlatformUsersStats,
  PlatformUsersTable,
  getRoleLabel,
} from "@/components/PlatformUsers";

import { usePlatformUsers } from "@/hooks/use-platform-users";

export default function PlatformUsers() {
  const {
    platformUsers,

    search,
    onSearchChange,

    roleFilter,
    onRoleFilterChange,

    statusFilter,
    onStatusFilterChange,

    onResetFilters,


    isCreateOpen,
    onCreateOpenChange,

    onCreateUser,

    onCreatePlatformUser,
  } = usePlatformUsers();

  /* User actions report through a toast the same way tenant actions do. */

  const handleCreate = (
    draft: Parameters<typeof onCreatePlatformUser>[0],
  ) => {
    onCreatePlatformUser(draft);

    toast.add({
      type: "success",
      description: `${draft.firstName} ${draft.lastName} has been added as ${getRoleLabel(draft.role)}.`,
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

          <PlatformUsersTable />

        </div>

        <PlatformUserCreateDialog
          open={isCreateOpen}
          onOpenChange={onCreateOpenChange}
          onCreate={handleCreate}
        />
      </div>
    </DashboardLayout>
  );
}
