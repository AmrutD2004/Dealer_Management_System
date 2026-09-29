export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "CANCELLED";

export type SubscriptionPlan = "BASIC" | "PRO" | "PREMIUM";

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
>;