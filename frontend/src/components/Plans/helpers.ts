import type { BillingCycle, Plan, PlanLimit } from "./types";

export const getBillingCycleLabel = (cycle: BillingCycle): string => {
  switch (cycle) {
    case "MONTHLY":
      return "Monthly";

    case "QUARTERLY":
      return "Quarterly";

    case "YEARLY":
      return "Yearly";

    default:
      return cycle;
  }
};

/* Short suffix shown next to the price on a card. */
export const getBillingCycleSuffix = (cycle: BillingCycle): string => {
  switch (cycle) {
    case "MONTHLY":
      return "/month";

    case "QUARTERLY":
      return "/quarter";

    case "YEARLY":
      return "/year";

    default:
      return "";
  }
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

/* A null limit is the encoding for "unlimited". */
export const formatLimit = (value: PlanLimit, suffix = ""): string =>
  value === null ? "Unlimited" : `${value.toLocaleString("en-IN")}${suffix}`;

export const getPlanStatusClass = (isActive: boolean): string =>
  isActive
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-slate-200 bg-slate-100 text-slate-600";

export const getPlanStatusLabel = (isActive: boolean): string =>
  isActive ? "Active" : "Inactive";

/*
 * Features are edited as a textarea, one per line, so the two
 * representations are converted at the boundary.
 */

export const featuresToText = (features: string[]): string =>
  features.join("\n");

export const textToFeatures = (text: string): string[] =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/* A blank input means "no limit" rather than zero. */
export const parseLimit = (value: string): PlanLimit => {
  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : null;
};

export const parsePrice = (value: string): number => {
  const parsed = Number(value.trim());

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export const isPlanValid = (plan: Plan): boolean =>
  Boolean(plan.name.trim()) && plan.price >= 0;
