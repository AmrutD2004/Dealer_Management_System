import { Building2, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { InfoItem } from "./InfoItem";

import type { Tenant, SubscriptionPlan, SubscriptionStatus } from "./types";

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



export function TenantViewDialog() {
  return (
    <Dialog >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        
      </DialogContent>
    </Dialog>
  );
}
