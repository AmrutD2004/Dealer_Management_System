import { useEffect, useState } from "react";

import DashboardLayout from "@/components/Layout/DashboardLayout";

import {
  DashboardHeader,
  DashboardQuickActions,
  RecentTenants,
} from "@/components/Dashboard";

import { TenantViewDialog, TenantsStats } from "@/components/Tenants";

import { getPlatformUsersList, getTenantList } from "@/api/endpoint";
import { toast } from "@/components/ui/toast";

import type { tenantType } from "@/Types/tenantTypes";

const RECENT_TENANTS_LIMIT = 5;

export default function PlatformDashboard() {
  const [selectedTenant, setSelectedTenant] = useState<tenantType | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);

  const [recentTenants, setRecentTenants] = useState<tenantType[]>([]);

  const [isLoadingTenants, setIsLoadingTenants] = useState(false);

  const [totalTenants, setTotalTenants] = useState(0);

  const [activeTenants, setActiveTenants] = useState(0);

  const [totalPlatformUsers, setTotalPlatformUsers] = useState(0);

  const [isLoadingPlatformUsers, setIsLoadingPlatformUsers] = useState(false);

  /* The dashboard route sits outside protectedRoute, so the tenant list
     is fetched here rather than read off PlatformUserContext. */

  useEffect(() => {
    let isMounted = true;

    const fetchRecentTenants = async () => {
      setIsLoadingTenants(true);

      try {
        const data = await getTenantList(0, RECENT_TENANTS_LIMIT, "recent");

        if (isMounted && data?.success) {
          setRecentTenants(data?.data ?? []);

          /* This endpoint already returns platform-wide aggregates, so the
             KPI counts ride along with the recent tenants list. */

          setTotalTenants(data?.count ?? 0);

          setActiveTenants(data?.activeCount ?? 0);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to load tenants";

          toast.add({
            type: "error",
            description: message,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingTenants(false);
        }
      }
    };

    fetchRecentTenants();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPlatformUserCount = async () => {
      setIsLoadingPlatformUsers(true);

      try {
        /* Only the aggregate count is needed, so the smallest page is
           requested to keep the payload tiny. */

        const data = await getPlatformUsersList(0, 1);

        if (isMounted && data?.success) {
          setTotalPlatformUsers(data?.count ?? 0);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Failed to load platform users";

          toast.add({
            type: "error",
            description: message,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingPlatformUsers(false);
        }
      }
    };

    fetchPlatformUserCount();

    return () => {
      isMounted = false;
    };
  }, []);

  const isLoadingStats = isLoadingTenants || isLoadingPlatformUsers;

  const handleViewTenant = (tenant: tenantType) => {
    setSelectedTenant(tenant);
    setIsViewOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <DashboardHeader />


          <TenantsStats
            totalTenants={totalTenants}
            activeTenants={activeTenants}
            totalPlatformUsers={totalPlatformUsers}
            isLoading={isLoadingStats}
          />

          <DashboardQuickActions
           
          />

          
        </div>

        

          <RecentTenants
            tenants={recentTenants}
            isLoading={isLoadingTenants}
            onView={handleViewTenant}
          />
        </div>

        <TenantViewDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          tenantId={selectedTenant?.id ?? null}
        />
    </DashboardLayout>
  );
}