import { Building2, CheckCircle2, Users } from "lucide-react";

import { StatCard } from "./StatCard";

interface TenantsStatsProps {
  totalTenants: number;
  activeTenants: number;
  totalPlatformUsers: number;
  isLoading?: boolean;
}

export function TenantsStats({
  totalTenants,
  activeTenants,
  totalPlatformUsers,
  isLoading = false,
}: TenantsStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Tenants"
        value={totalTenants}
        icon={<Building2 className="h-5 w-5 text-slate-600" />}
        iconClass="bg-slate-100"
        isLoading={isLoading}
      />

      <StatCard
        title="Active Tenants"
        value={activeTenants}
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        iconClass="bg-green-50"
        isLoading={isLoading}
      />

      <StatCard
        title="Total Platform Users"
        value={totalPlatformUsers}
        icon={<Users className="h-5 w-5 text-blue-600" />}
        iconClass="bg-blue-50"
        isLoading={isLoading}
      />
    </div>
  );
}