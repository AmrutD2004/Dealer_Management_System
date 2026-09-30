import { useMemo } from "react";

import { Crown, ShieldCheck, UserCheck, Users } from "lucide-react";

import { StatCard } from "@/components/Tenants/StatCard";

import type { PlatformUser } from "./types";

interface PlatformUsersStatsProps {
  platformUsers: PlatformUser[];
}

export function PlatformUsersStats({ platformUsers }: PlatformUsersStatsProps) {
  const stats = useMemo(() => {
    return {
      total: platformUsers.length,

      superAdmins: platformUsers.filter(
        (user) => user.role === "SUPER_ADMIN",
      ).length,

      supportAdmins: platformUsers.filter(
        (user) => user.role === "SUPPORT_ADMIN",
      ).length,

      active: platformUsers.filter((user) => user.status === "ACTIVE").length,

      blocked: platformUsers.filter((user) => user.status !== "ACTIVE").length,
    };
  }, [platformUsers]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Platform Users"
        value={stats.total}
        icon={<Users className="h-5 w-5 text-slate-600" />}
        iconClass="bg-slate-100"
      />

      <StatCard
        title="Super Admins"
        value={stats.superAdmins}
        icon={<Crown className="h-5 w-5 text-purple-600" />}
        iconClass="bg-purple-50"
      />

      <StatCard
        title="Support Admins"
        value={stats.supportAdmins}
        icon={<ShieldCheck className="h-5 w-5 text-blue-600" />}
        iconClass="bg-blue-50"
      />

      <StatCard
        title="Access Revoked"
        value={stats.blocked}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        iconClass="bg-green-50"
      />
    </div>
  );
}
