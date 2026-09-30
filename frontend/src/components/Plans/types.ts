import type { SubscriptionPlan } from "@/components/Tenants/types";

export type BillingCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";

/*
 * A null limit means unlimited. Using null rather than 0 keeps
 * "unlimited" distinguishable from a genuine limit of zero.
 */

export type PlanLimit = number | null;

/*
 * A full, editable plan record.
 *
 * Tenant.plan only stores the plan code, so the set of tiers is
 * closed at BASIC / PRO / PREMIUM. A plan therefore cannot be
 * created or deleted here, only re-priced and toggled.
 */

export interface Plan {
  id: string;

  code: SubscriptionPlan;

  name: string;
  description: string;

  price: number;
  billingCycle: BillingCycle;

  /* One entry per line in the edit form's textarea. */
  features: string[];

  maxBranches: PlanLimit;
  maxUsers: PlanLimit;
  maxVehicles: PlanLimit;

  /* Storage quota in gigabytes. */
  storageGb: PlanLimit;

  /* Whether new tenants can be assigned to this plan. */
  isActive: boolean;

  /* Highlighted on the pricing grid as the recommended tier. */
  isPopular: boolean;

  createdAt: string;
  updatedAt: string;
}
