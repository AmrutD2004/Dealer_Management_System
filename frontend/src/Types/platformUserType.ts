import type { PlatformUserRole } from "@/components/PlatformUsers/types";

export interface platformuserCreateType {
    email: string,
    passwordHash: string
}

export interface platformNewuserCreateType {
    email: string,
    passwordHash: string,
    role : string
}

export interface platformuserLoginType {
    email: string,
    passwordHash: string
}

/*
 * Shape returned by the read endpoints. `passwordHash` is deliberately
 * absent: the backend projects it away, so it never reaches the client.
 * Timestamps arrive as ISO strings over JSON, not Date instances.
 */

export interface platformUserInfo {
    id: number,
    email: string,
    role: PlatformUserRole,
    createdAt: string,
    updatedAt: string
}

/*
 * Password is optional on update: leave it blank to keep the existing
 * credential instead of forcing a reset on every role change.
 */

export interface platformUserUpdateType {
    email: string,
    passwordHash?: string,
    role: PlatformUserRole
}