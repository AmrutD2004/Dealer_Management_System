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

import {
  getActiveStatusClass,
  getActiveStatusLabel,
  getPlanLabel,
  getSubscriptionStatusClass,
  getSubscriptionStatusLabel,
} from "./helpers";

import type { Tenant } from "./types";

interface TenantViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  onEdit: (tenant: Tenant) => void;
}

export function TenantViewDialog({
  open,
  onOpenChange,
  tenant,
  onEdit,
}: TenantViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        {tenant && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <Building2 className="h-6 w-6 text-slate-600" />
                </div>

                <div>
                  <DialogTitle>{tenant.tenantName}</DialogTitle>

                  <DialogDescription>{tenant.tenantCode}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Status */}

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={getActiveStatusClass(tenant.isActive)}
                >
                  {getActiveStatusLabel(tenant.isActive)}
                </Badge>

                <Badge
                  variant="outline"
                  className={getSubscriptionStatusClass(
                    tenant.subscriptionStatus,
                  )}
                >
                  {getSubscriptionStatusLabel(tenant.subscriptionStatus)}
                </Badge>

                <Badge variant="outline">{getPlanLabel(tenant.plan)}</Badge>
              </div>

              <Separator />

              {/* Tenant Information */}

              <div>
                <h3 className="mb-4 text-sm font-semibold">
                  Tenant Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Tenant Name"
                    value={tenant.tenantName}
                  />

                  <InfoItem label="Tenant Code" value={tenant.tenantCode} />

                  <InfoItem label="Email" value={tenant.email} />

                  <InfoItem label="Phone" value={tenant.phone} />

                  <InfoItem label="GST Number" value={tenant.gstNumber} />

                  <InfoItem label="Created" value={tenant.createdAt} />
                </div>
              </div>

              <Separator />

              {/* Address */}

              <div>
                <h3 className="mb-4 text-sm font-semibold">Address</h3>

                <p className="text-sm leading-6 text-slate-600">
                  {tenant.address || "-"}

                  <br />

                  {[tenant.city, tenant.state]
                    .filter(Boolean)
                    .join(", ") || "-"}

                  <br />

                  {tenant.country || "-"}

                  {tenant.pincode ? ` - ${tenant.pincode}` : ""}
                </p>
              </div>

              <Separator />

              {/* Subscription */}

              <div>
                <h3 className="mb-4 text-sm font-semibold">Subscription</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem label="Plan" value={getPlanLabel(tenant.plan)} />

                  <InfoItem
                    label="Status"
                    value={getSubscriptionStatusLabel(
                      tenant.subscriptionStatus,
                    )}
                  />

                  <InfoItem label="Created At" value={tenant.createdAt} />

                  <InfoItem label="Updated At" value={tenant.updatedAt} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(tenant);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Tenant
              </Button>

              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
