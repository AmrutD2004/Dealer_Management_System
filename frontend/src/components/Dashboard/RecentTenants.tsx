import { ArrowRight, Building2, Eye } from "lucide-react";
import { Link } from "react-router-dom";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { SubscriptionPlan, SubscriptionStatus } from "@/components/Tenants/types";

const getActiveStatusClass = (isActive: boolean): string =>
  isActive
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-red-200 bg-red-50 text-red-700";

const getActiveStatusLabel = (isActive: boolean): string =>
  isActive ? "Active" : "Inactive";

const getPlanLabel = (plan: SubscriptionPlan): string => {
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

const getSubscriptionStatusClass = (status: SubscriptionStatus): string => {
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
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
};

const getSubscriptionStatusLabel = (status: SubscriptionStatus): string => {
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

import type { Tenant } from "@/components/Tenants/types";

const MAX_ROWS = 5;

interface RecentTenantsProps {
  tenants: Tenant[];
  onView: (tenant: Tenant) => void;
}

export function RecentTenants({ tenants, onView }: RecentTenantsProps) {
  const recentTenants = [...tenants]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_ROWS);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base">Recently Added Tenants</CardTitle>

        <p className="text-sm text-slate-500">

          The most recently registered organizations

          The {MAX_ROWS} most recently registered organizations
        </p>

        <CardAction>
          <Button
            variant="outline"
            size="sm"

            render={<Link to="/tenants" />}

            className="gap-2"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">
        {recentTenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Building2 className="mb-2 h-8 w-8 text-slate-300" />

            <p className="font-medium text-slate-700">No tenants yet</p>

            <p className="text-sm text-slate-500">
              Create the first organization to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentTenants.map((tenant) => (
              <li
                key={tenant.id}
                className="flex flex-wrap items-center gap-4 px-6 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Building2 className="h-5 w-5 text-slate-600" />
                </div>

                <div className="min-w-[180px] flex-1">
                  <p className="font-medium text-slate-900">
                    {tenant.tenantName}
                  </p>

                  <p className="text-xs text-slate-500">{tenant.tenantCode}</p>
                </div>

                <span className="text-sm text-slate-600">
                  {getPlanLabel(tenant.plan)}
                </span>

                <Badge
                  variant="outline"
                  className={getSubscriptionStatusClass(
                    tenant.subscriptionStatus,
                  )}
                >
                  {getSubscriptionStatusLabel(tenant.subscriptionStatus)}
                </Badge>

                <Badge
                  variant="outline"
                  className={getActiveStatusClass(tenant.isActive)}
                >
                  {getActiveStatusLabel(tenant.isActive)}
                </Badge>

                <span className="text-sm text-slate-500">{tenant.createdAt}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View ${tenant.tenantName}`}
                  onClick={() => onView(tenant)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}