import { useMemo } from "react";

import {
  Building2,
  CheckCircle2,
  IndianRupee,
  Layers,
} from "lucide-react";

import { StatCard } from "@/components/Tenants/StatCard";

import type { Tenant } from "@/components/Tenants/types";

import { formatCurrency } from "./helpers";

import type { Plan } from "./types";

interface PlansStatsProps {
  plans: Plan[];
  tenants: Tenant[];
}

export function PlansStats({ plans, tenants }: PlansStatsProps) {
  const stats = useMemo(() => {
    /* Only live subscriptions are counted as revenue. */

    const priceByCode = new Map(plans.map((plan) => [plan.code, plan.price]));

    const subscribedTenants = tenants.filter(
      (tenant) => priceByCode.has(tenant.plan),
    );

    const monthlyRevenue = subscribedTenants.reduce((total, tenant) => {
      if (tenant.subscriptionStatus !== "ACTIVE") {
        return total;
      }

      return total + (priceByCode.get(tenant.plan) ?? 0);
    }, 0);

    return {
      total: plans.length,

      active: plans.filter((plan) => plan.isActive).length,

      subscribed: subscribedTenants.length,

      monthlyRevenue: formatCurrency(monthlyRevenue),
    };
  }, [plans, tenants]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Plans"
        value={stats.total}
        icon={<Layers className="h-5 w-5 text-slate-600" />}
        iconClass="bg-slate-100"
      />

      <StatCard
        title="Active Plans"
        value={stats.active}
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        iconClass="bg-green-50"
      />

      <StatCard
        title="Subscribed Tenants"
        value={stats.subscribed}
        icon={<Building2 className="h-5 w-5 text-blue-600" />}
        iconClass="bg-blue-50"
      />

      <StatCard
        title="Monthly Revenue"
        value={stats.monthlyRevenue}
        icon={<IndianRupee className="h-5 w-5 text-slate-600" />}
        iconClass="bg-slate-100"
      />
    </div>
  );
}
