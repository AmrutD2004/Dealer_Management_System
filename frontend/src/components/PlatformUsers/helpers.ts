import { getToday } from "@/components/Tenants/helpers";

import type {
  PlatformUser,
  PlatformUserDraft,
  PlatformUserRole,
  PlatformUserStatus,
} from "./types";

export { getToday };

/* The platform team is a closed set, so both maps are total. */

export const PLATFORM_USER_ROLES: PlatformUserRole[] = [
  "SUPER_ADMIN",
  "SUPPORT_ADMIN",
];

export const PLATFORM_USER_STATUSES: PlatformUserStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
];

export const getRoleLabel = (role: PlatformUserRole): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";

    case "SUPPORT_ADMIN":
      return "Support Admin";

    default:
      return role;
  }
};

export const getRoleClass = (role: PlatformUserRole): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "SUPPORT_ADMIN":
      return "border-blue-200 bg-blue-50 text-blue-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export const getStatusLabel = (status: PlatformUserStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "Active";

    case "INACTIVE":
      return "Inactive";

    case "SUSPENDED":
      return "Suspended";

    default:
      return status;
  }
};

export const getStatusClass = (status: PlatformUserStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "border-green-200 bg-green-50 text-green-700";

    case "INACTIVE":
      return "border-slate-200 bg-slate-100 text-slate-600";

    case "SUSPENDED":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

/*
 * A suspended user is not active, which is what every
 * active / inactive toggle in the UI keys off.
 */

export const isUserActive = (status: PlatformUserStatus): boolean =>
  status === "ACTIVE";

export const getFullName = (user: PlatformUser): string =>
  [user.firstName, user.middleName, user.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

export const getInitials = (user: PlatformUser): string => {
  const parts = getFullName(user).split(" ").filter(Boolean);

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

  return (first + last).toUpperCase() || "PU";
};

export const formatLastLogin = (lastLoginAt: string | null): string => {
  if (!lastLoginAt) {
    return "Never signed in";
  }

  return new Date(lastLoginAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const emptyPlatformUserForm: PlatformUserDraft = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "SUPPORT_ADMIN",
  status: "ACTIVE",
  password: "",
};

/*
 * Create is blocked until the user is identifiable, reachable and
 * has been given an initial password.
 */

export const isPlatformUserDraftValid = (draft: PlatformUserDraft): boolean =>
  Boolean(
    draft.firstName.trim() &&
      draft.lastName.trim() &&
      draft.email.trim() &&
      draft.phone.trim() &&
      draft.password.trim(),
  );

/*
 * Guards the self-service path: the last remaining super admin
 * cannot demote themselves out of the role.
 */

export const countSuperAdmins = (users: PlatformUser[]): number =>
  users.filter((user) => user.role === "SUPER_ADMIN").length;
