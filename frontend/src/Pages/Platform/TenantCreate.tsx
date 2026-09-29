import { ArrowLeft, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import {
  TenantCreateForm,
  useTenantsStore,
} from "@/components/Tenants";

import type { TenantDraft } from "@/components/Tenants/types";

export default function TenantCreate() {
  const navigate = useNavigate();

  const { onCreateTenant } = useTenantsStore();

  const handleCancel = () => navigate("/tenants");

  const handleSubmit = (draft: TenantDraft) => {
    onCreateTenant(draft);

    toast.add({
      type: "success",
      description: `${draft.tenantName.trim()} has been created.`,
    });

    navigate("/tenants");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[900px] space-y-6">
          {/* Header */}

          <div className="mt-20 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-slate-700" />

                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Create Tenant
                </h1>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Create a new organization on the DMS platform.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleCancel}
              className="mt-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />

              Back
            </Button>
          </div>

          {/* Form */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <TenantCreateForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
