export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "CANCELLED";

export type SubscriptionPlan = "BASIC" | "PRO" | "PREMIUM";

/* The first branch seeded alongside a brand new tenant. */

export interface Branch {
  branchCode: string;
  branchName: string;

  email: string;
  phone: string;

  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

/* The first admin user seeded for a brand new tenant. */

export interface TenantAdmin {
  employeeCode: string;

  firstName: string;
  middleName: string;
  lastName: string;

  email: string;
  mobileNo: string;
  password: string;
}

export interface Tenant {
  id: string;
  tenantCode: string;
  tenantName: string;

  email: string;
  phone: string;
  gstNumber: string;

  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;

  isActive: boolean;

  /*
   * Only present on tenants created through the create page;
   * the seeded mock records predate these sections.
   */

  branch?: Branch;
  admin?: TenantAdmin;

  createdAt: string;
  updatedAt: string;
}

export type TenantDraft = Pick<
  Tenant,
  | "tenantCode"
  | "tenantName"
  | "email"
  | "phone"
  | "gstNumber"
  | "address"
  | "city"
  | "state"
  | "country"
  | "pincode"
  | "plan"
  | "subscriptionStatus"
  | "isActive"
> & {
  branch: Branch;
  admin: TenantAdmin;
};