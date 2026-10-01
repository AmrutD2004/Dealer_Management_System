import dayjs from "dayjs";

import { InfoItem } from "@/components/Tenants/InfoItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { getRoleClass, getRoleLabel } from "./helpers";

import type { platformUserInfo } from "@/Types/platformUserType";

interface PlatformUserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: platformUserInfo | null;
}

export function PlatformUserViewDialog({
  open,
  onOpenChange,
  user,
}: PlatformUserViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Platform User Details</DialogTitle>

          <DialogDescription>
            Read-only view of the platform administrator record.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="grid gap-6 py-2 sm:grid-cols-2">
            <InfoItem label="User ID" value={String(user.id)} />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Role
              </p>

              <Badge
                variant="outline"
                className={`mt-1 ${getRoleClass(user.role)}`}
              >
                {getRoleLabel(user.role)}
              </Badge>
            </div>

            <div className="sm:col-span-2">
              <InfoItem label="Email" value={user.email} />
            </div>

            <InfoItem
              label="Created"
              value={dayjs(user.createdAt).format("DD MMM YYYY")}
            />

            <InfoItem
              label="Last Updated"
              value={dayjs(user.updatedAt).format("DD MMM YYYY")}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}