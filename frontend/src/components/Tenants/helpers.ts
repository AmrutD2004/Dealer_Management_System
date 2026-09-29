import type {
  SubscriptionPlan,
  SubscriptionStatus,
  TenantDraft,
} from "./types";

export const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

export const getPlanLabel = (plan: SubscriptionPlan): string => {
  switch (plan) {
    case "BASIC":
      return "Basic";

    case "PRO":
      return "Pro";

    case "PREMIUM":
      return "Premium";

    default:
      return plan;
  }
};

export const getSubscriptionStatusLabel = (
  status: SubscriptionStatus,
): string => {
  switch (status) {
    case "TRIAL":
      return "Trial";

    case "ACTIVE":
      return "Active";

    case "SUSPENDED":
      return "Suspended";

    case "EXPIRED":
      return "Expired";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
};

export const getSubscriptionStatusClass = (
  status: SubscriptionStatus,
): string => {
  switch (status) {
    case "ACTIVE":
      return "border-green-200 bg-green-50 text-green-700";

    case "TRIAL":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "SUSPENDED":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "EXPIRED":
      return "border-red-200 bg-red-50 text-red-700";

    case "CANCELLED":
      return "border-gray-200 bg-gray-100 text-gray-600";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export const getActiveStatusClass = (isActive: boolean): string => {
  return isActive
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-slate-200 bg-slate-100 text-slate-600";
};

export const getActiveStatusLabel = (isActive: boolean): string => {
  return isActive ? "Active" : "Inactive";
};

/*
 * Base UI selects can emit a null value, so every value coming
 * from a <Select> is normalised through this guard before it is
 * narrowed to a union member.
 */

export const asChoice = <T extends string>(
  value: string | null,
  fallback: T,
): T => {
  return (value ?? fallback) as T;
};

export const emptyTenantForm: TenantDraft = {
  tenantCode: "",
  tenantName: "",
  email: "",
  phone: "",
  gstNumber: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  plan: "BASIC",
  subscriptionStatus: "TRIAL",
  isActive: true,
};