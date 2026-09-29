import { useMemo } from "react";

import { Building2, CheckCircle2, CirclePause, ShieldCheck } from "lucide-react";

import type { Tenant } from "./types";

import { StatCard } from "./StatCard";

interface TenantsStatsProps {
  tenants: Tenant[];
}

export function TenantsStats({ tenants }: TenantsStatsProps) {
  const stats = useMemo(() => {
    return {
      total: tenants.length,

      active: tenants.filter((tenant) => tenant.isActive).length,

      inactive: tenants.filter((tenant) => !tenant.isActive).length,

      trial: tenants.filter(
        (tenant) => tenant.subscriptionStatus === "TRIAL",
      ).length,
    };
  }, [tenants]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Tenants"
        value={stats.total}
        icon={<Building2 className="h-5 w-5 text-slate-600" />}
        iconClass="bg-slate-100"
      />

      <StatCard
        title="Active Tenants"
        value={stats.active}
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        iconClass="bg-green-50"
      />

      <StatCard
        title="Inactive Tenants"
        value={stats.inactive}
        icon={<CirclePause className="h-5 w-5 text-red-600" />}
        iconClass="bg-red-50"
      />

      <StatCard
        title="Trial Tenants"
        value={stats.trial}
        icon={<ShieldCheck className="h-5 w-5 text-blue-600" />}
        iconClass="bg-blue-50"
      />
    </div>
  );
}
