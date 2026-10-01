import { ArrowRight, Building2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

export function RecentTenants() {
  const navigate = useNavigate()
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-base">Recently Added Tenants</CardTitle>

        <p className="text-sm text-slate-500">
          The most recently registered organizations
        </p>

        <CardAction>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/tenants")}
            className="gap-2"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-0">

      </CardContent>
    </Card>
  );
}