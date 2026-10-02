import type {
  tenantPlanType,
  tenantSubscriptionStatusType,
} from "@/Types/tenantTypes";

/* Both lists are closed sets on the server, so they drive the selects
   directly and match the casing the API expects back. */

export const TENANT_PLANS: tenantPlanType[] = ["Basic", "Pro", "Premium"];

export const TENANT_SUBSCRIPTION_STATUSES: tenantSubscriptionStatusType[] = [
  "TRIAL",
  "ACTIVE",
  "SUSPENDED",
  "EXPIRED",
  "CANCELLED",
];

export const getPlanLabel = (plan: string): string => {
  switch (plan) {
    case "Basic":
      return "Basic";

    case "Pro":
      return "Pro";

    case "Premium":
      return "Premium";

    default:
      return plan || "-";
  }
};

export const getPlanClass = (plan: string): string => {
  switch (plan) {
    case "Basic":
      return "border-slate-200 bg-slate-50 text-slate-600";

    case "Pro":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "Premium":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export const getSubscriptionStatusLabel = (status: string): string => {
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
      return status || "-";
  }
};

export const getSubscriptionStatusClass = (status: string): string => {
  switch (status) {
    case "TRIAL":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "ACTIVE":
      return "border-green-200 bg-green-50 text-green-700";

    case "SUSPENDED":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";

    case "EXPIRED":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

export const getActiveStatusLabel = (isActive: boolean): string =>
  isActive ? "Active" : "Deactivated";

export const getActiveStatusClass = (isActive: boolean): string =>
  isActive
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-red-200 bg-red-50 text-red-700";

/*
 * Narrowing the loosely typed API string onto the enums the update
 * payload declares. An unrecognised value falls back to the first
 * option rather than sending something the server would reject.
 */

export const toPlanType = (value: string): tenantPlanType =>
  TENANT_PLANS.find((plan) => plan === value) ?? "Basic";

export const toSubscriptionStatusType = (
  value: string,
): tenantSubscriptionStatusType =>
  TENANT_SUBSCRIPTION_STATUSES.find((status) => status === value) ?? "TRIAL";