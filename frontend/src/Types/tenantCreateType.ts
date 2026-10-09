import type { PermissionListType } from "./permissionType"

export interface tenantCreateType {
    tenantName: string,
    email: string,
    phone: string,
    gstNumber: string,
    address: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
    subscriptionPlan: string,
    subscriptionStatus: string
}

export interface branchCreateType {
    branchName: string,
    email: string,
    phone: string,
    address1: string,
    address2: string | null,
    locality: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
}

export interface userCreateType {
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    mobileNo: string,
    passwordHash: string
}

export interface tenantType {
    id: number,
    tenantCode: string,
    tenantName: string
    email: string,
    phone: string,
    gstNumber: string,
    address: string,
    city: string,
    state: string,
    country: string,
    pincode: string
    subscriptionPlan: string,
    subscriptionStatus: string,
    isActive: boolean,
    createdBy: number,
    createdAt: string,
    updatedAt: string
}

/* Mirrors the Prisma enum, which is title cased and therefore has to be
   sent verbatim or the update is rejected. Do not uppercase these. */

export type tenantPlanType = "Basic" | "Pro" | "Premium";

export type tenantSubscriptionStatusType =
    "TRIAL"
    | "ACTIVE"
    | "SUSPENDED"
    | "EXPIRED"
    | "CANCELLED";

/* PUT /api/tenant/update/:id rejects the request unless every one of these
   is present, so a partial save is not possible. */

export interface tenantUpdateType {
    tenant_code: string,
    tenant_name: string,
    tenant_email: string,
    tenant_phone: string,
    tenant_gst_number: string,
    tenant_address: string,
    tenant_register_city: string,
    tenant_register_state: string,
    tenant_register_country: string,
    tenant_register_pincode: string,
    tenant_sub_plan: tenantPlanType,
    tenant_sub_status: tenantSubscriptionStatusType,
}

/*
 * GET /api/tenant/get/:id joins the creating admin. Only the fields the
 * view dialog renders are declared here, so the joined passwordHash
 * cannot reach the UI even by accident.
 */

export interface tenantCreatorType {
    id: number,
    email: string,
    role: string,
}

export interface tenantDetailType extends tenantType {
    createdByUser: tenantCreatorType | null,
}


export interface branchListType {
    id:number,
    tenantId : number,
    branchCode : number,
    branchName: string,
    email: string,
    phone: string,
    address1: string,
    address2: string | null,
    locality: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
    isActive : boolean,
    createdAt : string,
    updatedAt : string
}

export interface designationListType {
    id: number,
    tenantId: number,
    code: string,
    name: string,
    description: string | null,
    isActive: boolean,
    isMechanic: boolean,
    createdAt: string,
    updatedAt: string
}

export interface roleListType {
    id: number,
    tenantId: number,
    roleCode: string,
    roleName: string,
    roleDescription: string | null,
    isSystemRole: boolean,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

/* Backend role create/update require all three fields, matching the
   `roleCode`, `roleName`, `roleDescription` body keys. */

export interface roleCreateType {
    roleCode: string,
    roleName: string,
    roleDescription: string
}

/* Mirrors the rolePermissionMapping record returned by
   GET /api/tenant/role/permission/get/all with its joined role and
   permission. */

export interface rolePermissionMappingType {
    id: number,
    roleId: number,
    permissionId: number,
    createdAt: string,
    updatedAt: string,
    role: roleListType,
    permission: PermissionListType
}

/* Backend update expects `roleId` and `permissionId` in the body. */

export interface rolePermissionMappingUpdateType {
    roleId: number,
    permissionId: number
}

/* Record returned by GET /api/tenant/employee/get/all with the joined
   tenant, branch, role and designation. */

export interface employeeListType {
    id: number,
    tenantId: number,
    branchId: number,
    roleId: number,
    designationId: number,
    employeeCode: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    email: string,
    mobileNo: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
    tenant: { tenantName: string } | null,
    branch: { branchName: string } | null,
    role: { roleName: string } | null,
    designation: { name: string } | null
}

/* Backend create requires every field including `passwordHash`; the
   update endpoint accepts an optional `passwordHash` (blank keeps the
   existing password). Dropdown ids are kept as strings to match the
   Select component value type. */

export interface employeeCreateType {
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    mobileNo: string,
    passwordHash: string,
    branchId: string,
    roleId: string,
    designationId: string
}