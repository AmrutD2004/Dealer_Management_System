import { useState } from "react";

import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

import { deactivateTenant } from "@/api/endpoint";
import { getApiErrorMessage } from "@/lib/utils";

import type { tenantType } from "@/Types/tenantTypes";

interface TenantDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: tenantType | null;
  onDeleted: () => void;
}

export function TenantDeleteDialog({
  open,
  onOpenChange,
  tenant,
  onDeleted,
}: TenantDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!tenant) {
      return;
    }

    setLoading(true);

    try {
      const data = await deactivateTenant(tenant.id);

      if (data?.success) {
        toast.add({ type: "success", description: data?.message });

        onDeleted();
        onOpenChange(false);
      } else {
        toast.add({ type: "error", description: data?.message });
      }
    } catch (err) {
      toast.add({
        type: "error",
        description: getApiErrorMessage(err, "Failed to deactivate tenant"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <DialogTitle>Deactivate tenant</DialogTitle>

              <DialogDescription>
                This revokes platform access for {tenant?.tenantName} (
                {tenant?.tenantCode}). The record and its data are retained.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          This action cannot be undone from the platform.
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || !tenant}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            Deactivate Tenant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}