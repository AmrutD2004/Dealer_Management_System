import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { InfoItem } from "./InfoItem";
import {
  getActiveStatusClass,
  getActiveStatusLabel,
  getPlanClass,
  getPlanLabel,
  getSubscriptionStatusClass,
  getSubscriptionStatusLabel,
} from "./helpers";

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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

import { getTenantById } from "@/api/endpoint";
import { getApiErrorMessage } from "@/lib/utils";

import type { tenantDetailType } from "@/Types/tenantTypes";

interface TenantViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /* Only the id is trusted from the row; the body is refetched so the
     dialog always shows the current server state. */
  tenantId: number | null;
}

export function TenantViewDialog({
  open,
  onOpenChange,
  tenantId,
}: TenantViewDialogProps) {
  const [tenant, setTenant] = useState<tenantDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || tenantId === null) {
      return;
    }

    let isMounted = true;

    const fetchTenant = async () => {
      setIsLoading(true);

      try {
        const data = await getTenantById(tenantId);

        if (!isMounted) {
          return;
        }

        if (data?.success) {
          setTenant(data?.data ?? null);
        } else {
          setTenant(null);

          toast.add({
            type: "error",
            description: data?.message ?? "Failed to load tenant",
          });
        }
      } catch (err) {
        if (isMounted) {
          setTenant(null);

          toast.add({
            type: "error",
            description: getApiErrorMessage(err, "Failed to load tenant"),
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTenant();

    return () => {
      isMounted = false;
    };
  }, [open, tenantId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Tenant Details</DialogTitle>

          <DialogDescription>
            Read-only view of the tenant record held on the platform.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-6 py-2 sm:grid-cols-2">
            {[0, 1, 2, 3, 4, 5].map((placeholder) => (
              <div key={placeholder} className="space-y-2">
                <Skeleton className="h-3 w-20 bg-slate-200" />

                <Skeleton className="h-4 w-32 bg-slate-200" />
              </div>
            ))}
          </div>
        ) : tenant ? (
          <div className="grid gap-6 py-2 sm:grid-cols-2">
            <InfoItem label="Tenant ID" value={String(tenant.id)} />

            <InfoItem label="Tenant Code" value={tenant.tenantCode} />

            <div className="sm:col-span-2">
              <InfoItem label="Tenant Name" value={tenant.tenantName} />
            </div>

            <InfoItem label="Email" value={tenant.email} />

            <InfoItem label="Phone" value={tenant.phone} />

            <InfoItem label="GST Number" value={tenant.gstNumber} />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Subscription Plan
              </p>

              <Badge
                variant="outline"
                className={`mt-1 ${getPlanClass(tenant.subscriptionPlan)}`}
              >
                {getPlanLabel(tenant.subscriptionPlan)}
              </Badge>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Subscription Status
              </p>

              <Badge
                variant="outline"
                className={`mt-1 ${getSubscriptionStatusClass(tenant.subscriptionStatus)}`}
              >
                {getSubscriptionStatusLabel(tenant.subscriptionStatus)}
              </Badge>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Account Status
              </p>

              <Badge
                variant="outline"
                className={`mt-1 ${getActiveStatusClass(tenant.isActive)}`}
              >
                {getActiveStatusLabel(tenant.isActive)}
              </Badge>
            </div>

            <div className="sm:col-span-2">
              <InfoItem label="Address" value={tenant.address} />
            </div>

            <InfoItem label="City" value={tenant.city} />

            <InfoItem label="State" value={tenant.state} />

            <InfoItem label="Country" value={tenant.country} />

            <InfoItem label="Pincode" value={tenant.pincode} />

            <InfoItem
              label="Created"
              value={dayjs(tenant.createdAt).format("DD MMM YYYY")}
            />

            <InfoItem
              label="Last Updated"
              value={dayjs(tenant.updatedAt).format("DD MMM YYYY")}
            />

            {/* The endpoint joins the creating admin; only these fields are
                declared on the type, so nothing else can be surfaced. */}

            <InfoItem
              label="Created By"
              value={tenant.createdByUser?.email ?? "-"}
            />
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-slate-500">
            Tenant details are unavailable.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}