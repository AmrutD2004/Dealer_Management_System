import { Building2, Plus, ShieldCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface QuickAction {
  title: string;
  description: string;
  to: string;
  value?: number;
  icon: ReactNode;
  iconClass: string;
}

interface DashboardQuickActionsProps {
  total: number;
  trial: number;
  inactive: number;
}

export function DashboardQuickActions({
  total,
  trial,
  inactive,
}: DashboardQuickActionsProps) {
  const actions: QuickAction[] = [
    {
      title: "Create Tenant",
      description: "Onboard a new organization with its first branch and admin.",
      to: "/tenants/create",
      icon: <Plus className="h-5 w-5 text-white" />,
      iconClass: "bg-slate-700",
    },
    {
      title: "Tenant Management",
      description: "Search, edit, suspend or delete every tenant on the platform.",
      to: "/tenants",
      value: total,
      icon: <Building2 className="h-5 w-5 text-slate-600" />,
      iconClass: "bg-slate-100",
    },
    {
      title: "Trial Tenants",
      description: "Tenants still on a trial subscription and needing follow up.",
      to: "/tenants?subscription=TRIAL",
      value: trial,
      icon: <ShieldCheck className="h-5 w-5 text-blue-600" />,
      iconClass: "bg-blue-50",
    },
    {
      title: "Inactive Tenants",
      description: "Suspended tenants that are not currently using the platform.",
      to: "/tenants?status=SUSPENDED",
      value: inactive,
      icon: <UserX className="h-5 w-5 text-red-600" />,
      iconClass: "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {actions.map((action) => (
        <Card
          key={action.title}
          className="border-slate-200 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <CardContent className="p-5">
            <Link
              to={action.to}
              className="flex items-start gap-4 focus:outline-none"
            >
              <div className={`rounded-lg p-3 ${action.iconClass}`}>
                {action.icon}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900">{action.title}</p>

                  {action.value !== undefined && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {action.value}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {action.description}
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}