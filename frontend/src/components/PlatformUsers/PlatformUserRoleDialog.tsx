import { useState } from "react";

import { AlertTriangle, Crown, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { asChoice } from "@/components/Tenants/helpers";

import { cn } from "@/lib/utils";

import { PLATFORM_USER_ROLES, getFullName, getRoleLabel } from "./helpers";

import type { PlatformUser, PlatformUserRole } from "./types";

const roleDetails: Record<
  PlatformUserRole,
  { icon: typeof Crown; title: string; description: string }
> = {
  SUPER_ADMIN: {
    icon: Crown,
    title: "Super Admin",
    description:
      "Full control of the platform, including creating tenants, managing subscription plans and managing other platform users.",
  },
  SUPPORT_ADMIN: {
    icon: ShieldCheck,
    title: "Support Admin",
    description:
      "Assists tenants with day to day support. Can view and manage tenants but cannot manage other platform users or platform settings.",
  },
};

interface PlatformUserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: PlatformUser | null;

  /* Used to block demoting the final super admin. */
  superAdminCount: number;

  onAssign: (userId: string, role: PlatformUserRole) => void;
  loading?: boolean;
}

export function PlatformUserRoleDialog({
  open,
  onOpenChange,
  user,
  superAdminCount,
  onAssign,
  loading = false,
}: PlatformUserRoleDialogProps) {
  const [selectedRole, setSelectedRole] =
    useState<PlatformUserRole>("SUPPORT_ADMIN");

  /* Re-seed on open so the dialog always starts from the current role. */

  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);

    setSelectedRole(user ? user.role : "SUPPORT_ADMIN");
  }

  const isLastSuperAdmin =
    user?.role === "SUPER_ADMIN" &&
    superAdminCount <= 1 &&
    selectedRole !== "SUPER_ADMIN";

  const isUnchanged = user?.role === selectedRole;

  const handleAssign = () => {
    if (!user || isUnchanged || isLastSuperAdmin || loading) {
      return;
    }

    onAssign(user.id, selectedRole);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px]">
        {user && (
          <>
            <DialogHeader>
              <DialogTitle>Assign Role</DialogTitle>

              <DialogDescription>
                Choose what {getFullName(user)} ({user.userCode}) is allowed to
                do on the DMS platform.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {PLATFORM_USER_ROLES.map((role) => {
                const details = roleDetails[asChoice<PlatformUserRole>(role, "SUPPORT_ADMIN")];

                const Icon = details.icon;

                const isSelected = selectedRole === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition",
                      isSelected
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        isSelected ? "bg-slate-900" : "bg-slate-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isSelected ? "text-white" : "text-slate-600",
                        )}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {details.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {details.description}
                      </p>
                    </div>
                  </button>
                );
              })}

              {isLastSuperAdmin && (
                <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />

                  <p className="text-sm text-orange-700">
                    {getRoleLabel(user.role)} is the only super admin on the
                    platform. Promote another user to super admin before
                    changing this role.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleAssign}
                disabled={isUnchanged || isLastSuperAdmin || loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                Assign Role
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
