import { createContext, useContext } from "react";

import type { PlatformUser, PlatformUserDraft } from "./types";

export interface PlatformUsersContextValue {
  platformUsers: PlatformUser[];
  onCreatePlatformUser: (draft: PlatformUserDraft) => void;
  onUpdatePlatformUser: (user: PlatformUser) => void;
  onAssignRole: (userId: string, role: PlatformUser["role"]) => void;
  onActivatePlatformUser: (userId: string) => void;
  onDeactivatePlatformUser: (userId: string) => void;
  onSuspendPlatformUser: (userId: string) => void;
  onDeletePlatformUser: (userId: string) => void;
}

export const PlatformUsersContext =
  createContext<PlatformUsersContextValue | null>(null);

export function usePlatformUsersStore() {
  const context = useContext(PlatformUsersContext);

  if (!context) {
    throw new Error(
      "usePlatformUsersStore must be used within a PlatformUsersProvider",
    );
  }

  return context;
}
