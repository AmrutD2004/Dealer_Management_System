import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { initialPlatformUsers } from "./data";
import { getToday } from "./helpers";
import { PlatformUsersContext } from "./platform-users-context";

import type { PlatformUser, PlatformUserDraft } from "./types";

/*
 * Client side only, mirroring TenantsProvider and PlansProvider.
 * Nothing here talks to an API, so the platform users reset to their
 * seed values on reload until a backend endpoint is wired in.
 *
 * The collection is owned above the router so it survives navigating
 * between the platform pages.
 */

export function PlatformUsersProvider({ children }: { children: ReactNode }) {
  const [platformUsers, setPlatformUsers] =
    useState<PlatformUser[]>(initialPlatformUsers);

  const handleCreatePlatformUser = useCallback((draft: PlatformUserDraft) => {
    const today = getToday();

    const user: PlatformUser = {
      id: crypto.randomUUID(),

      userCode: `PU-${String(platformUsers.length + 1).padStart(3, "0")}`,

      firstName: draft.firstName.trim(),

      middleName: draft.middleName.trim(),

      lastName: draft.lastName.trim(),

      email: draft.email.trim(),

      phone: draft.phone.trim(),

      role: draft.role,

      status: draft.status,

      lastLoginAt: null,

      createdAt: today,

      updatedAt: today,
    };

    setPlatformUsers((previous) => [user, ...previous]);
  }, [platformUsers.length]);

  const handleUpdatePlatformUser = useCallback((user: PlatformUser) => {
    setPlatformUsers((previous) =>
      previous.map((item) =>
        item.id === user.id ? { ...user, updatedAt: getToday() } : item,
      ),
    );
  }, []);

  /*
   * Granting a role is its own action so it can be audited and, later,
   * authorised separately from an ordinary profile edit.
   */

  const handleAssignRole = useCallback(
    (userId: string, role: PlatformUser["role"]) => {
      setPlatformUsers((previous) =>
        previous.map((user) =>
          user.id === userId ? { ...user, role, updatedAt: getToday() } : user,
        ),
      );
    },
    [],
  );

  const setUserStatus = useCallback(
    (userId: string, status: PlatformUser["status"]) => {
      setPlatformUsers((previous) =>
        previous.map((user) =>
          user.id === userId ? { ...user, status, updatedAt: getToday() } : user,
        ),
      );
    },
    [],
  );

  const handleActivatePlatformUser = useCallback(
    (userId: string) => setUserStatus(userId, "ACTIVE"),
    [setUserStatus],
  );

  const handleDeactivatePlatformUser = useCallback(
    (userId: string) => setUserStatus(userId, "INACTIVE"),
    [setUserStatus],
  );

  const handleSuspendPlatformUser = useCallback(
    (userId: string) => setUserStatus(userId, "SUSPENDED"),
    [setUserStatus],
  );

  const handleDeletePlatformUser = useCallback((userId: string) => {
    setPlatformUsers((previous) =>
      previous.filter((user) => user.id !== userId),
    );
  }, []);

  const value = useMemo(
    () => ({
      platformUsers,

      onCreatePlatformUser: handleCreatePlatformUser,
      onUpdatePlatformUser: handleUpdatePlatformUser,
      onAssignRole: handleAssignRole,
      onActivatePlatformUser: handleActivatePlatformUser,
      onDeactivatePlatformUser: handleDeactivatePlatformUser,
      onSuspendPlatformUser: handleSuspendPlatformUser,
      onDeletePlatformUser: handleDeletePlatformUser,
    }),
    [
      platformUsers,
      handleCreatePlatformUser,
      handleUpdatePlatformUser,
      handleAssignRole,
      handleActivatePlatformUser,
      handleDeactivatePlatformUser,
      handleSuspendPlatformUser,
      handleDeletePlatformUser,
    ],
  );

  return (
    <PlatformUsersContext.Provider value={value}>
      {children}
    </PlatformUsersContext.Provider>
  );
}
