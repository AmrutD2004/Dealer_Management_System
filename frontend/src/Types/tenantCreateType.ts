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