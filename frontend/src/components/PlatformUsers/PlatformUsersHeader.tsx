import { ShieldCheck, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PlatformUsersHeaderProps {
  onCreateUser: () => void;
}

export function PlatformUsersHeader({ onCreateUser }: PlatformUsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="mt-20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-slate-700" />

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Platform Users
          </h1>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Manage the admin team that has access to the DMS platform, and
          control who is a super admin or a support admin.
        </p>
      </div>

      <Button onClick={onCreateUser} className="mt-20 gap-2">
        <UserPlus className="h-4 w-4" />
        Add Platform User
      </Button>
    </div>
  );
}
