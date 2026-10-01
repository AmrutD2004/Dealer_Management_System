/*
 * Mirrors the backend PlatformUserRole enum. The platform team is
 * deliberately closed to these two values, so a user can only ever
 * be a super admin or a support admin.
 */

export type PlatformUserRole = "SUPER_ADMIN" | "SUPPORT_ADMIN";

/*
 * Access state is kept separate from the role. Removing a role is a
 * privilege decision, revoking access is an operational one, so an
 * inactive or suspended user keeps the role they were granted.
 */

export type PlatformUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface PlatformUser {
  id: string;

  /* Human readable identifier, e.g. PU-001. */
  userCode: string;

  firstName: string;
  middleName: string;
  lastName: string;

  email: string;
  phone: string;

  role: PlatformUserRole;
  status: PlatformUserStatus;

  /* ISO timestamp, or null while the user has never signed in. */
  lastLoginAt: string | null;

  createdAt: string;
  updatedAt: string;
}

/*
 * The create form additionally collects a one-time password, which is
 * never stored on the record itself.
 */

export type PlatformUserDraft = Pick<
  PlatformUser,
  "firstName" | "middleName" | "lastName" | "email" | "phone" | "role" | "status"
> & {
  password: string;
};
