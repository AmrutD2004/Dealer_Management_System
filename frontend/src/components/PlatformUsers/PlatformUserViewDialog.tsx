import { Pencil, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

import { InfoItem } from "@/components/Tenants/InfoItem";

import {
  formatLastLogin,
  getFullName,
  getInitials,
  getRoleClass,
  getRoleLabel,
  getStatusClass,
  getStatusLabel,
} from "./helpers";

import type { PlatformUser } from "./types";

interface PlatformUserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: PlatformUser | null;
  onEdit: (user: PlatformUser) => void;
  onAssignRole: (user: PlatformUser) => void;
}

export function PlatformUserViewDialog({
  open,
  onOpenChange,
  user,
  onEdit,
  onAssignRole,
}: PlatformUserViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        {user && (
          <>
            <DialogHeader>
              <DialogTitle>Platform User</DialogTitle>

              <DialogDescription>
                Profile, granted role and platform access for this user.
              </DialogDescription>
            </DialogHeader>

            {/* Identity */}

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-slate-200 text-base font-semibold text-slate-700">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900">
                  {getFullName(user)}
                </p>

                <p className="text-sm text-slate-500">{user.userCode}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getRoleClass(user.role)}
                  >
                    {getRoleLabel(user.role)}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={getStatusClass(user.status)}
                  >
                    {getStatusLabel(user.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact */}

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Contact Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem label="Email" value={user.email} />

                <InfoItem label="Phone" value={user.phone} />
              </div>
            </div>

            <Separator />

            {/* Access */}

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Access & Activity
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Granted Role"
                  value={getRoleLabel(user.role)}
                />

                <InfoItem
                  label="Access Status"
                  value={getStatusLabel(user.status)}
                />

                <InfoItem
                  label="Last Sign In"
                  value={formatLastLogin(user.lastLoginAt)}
                />

                <InfoItem label="Created On" value={user.createdAt} />

                <InfoItem label="Last Updated" value={user.updatedAt} />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onAssignRole(user);
                }}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Assign Role
              </Button>

              <Button
                onClick={() => {
                  onOpenChange(false);
                  onEdit(user);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit User
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
