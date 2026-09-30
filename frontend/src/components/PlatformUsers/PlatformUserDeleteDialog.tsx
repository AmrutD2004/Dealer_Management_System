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

import { getFullName, getRoleLabel } from "./helpers";

import type { PlatformUser } from "./types";

interface PlatformUserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: PlatformUser | null;
  onConfirm: (user: PlatformUser) => void;
}

export function PlatformUserDeleteDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: PlatformUserDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        {user && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                <div>
                  <DialogTitle>Remove platform user</DialogTitle>

                  <DialogDescription>
                    This removes {getFullName(user)} ({user.userCode}) and their{" "}
                    {getRoleLabel(user.role)} access from the platform.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              This action cannot be undone. Revoking access instead keeps the
              audit history intact.
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
                  onConfirm(user);
                }}
              >
                Remove User
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
