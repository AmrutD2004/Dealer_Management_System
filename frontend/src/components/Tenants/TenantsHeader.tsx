import { Building2, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function TenantsHeader() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="mt-20">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-slate-700" />

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Tenant Management
          </h1>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Manage all organizations registered on the DMS platform.
        </p>
      </div>

      <Button
        onClick={() => navigate("/tenants/create" )}
        className="gap-2 mt-20"
      >
        <Plus className="h-4 w-4" />
        Create Tenant
      </Button>
    </div>
  );
}
