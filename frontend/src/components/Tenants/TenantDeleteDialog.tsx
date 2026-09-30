import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Tenant } from "./types";

interface TenantDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  onConfirm: (tenant: Tenant) => void;
}

export function TenantDeleteDialog({
  open,
  onOpenChange,
  tenant,
  onConfirm,
}: TenantDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        {tenant && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                <div>
                  <DialogTitle>Delete tenant</DialogTitle>

                  <DialogDescription>
                    This removes {tenant.tenantName} ({tenant.tenantCode}) and
                    all of its data from the platform.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              This action cannot be undone.
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  onOpenChange(false);
                  onConfirm(tenant);
                }}
              >
                Delete Tenant
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
