import DashboardLayout from '@/components/layout/PlatformLayout/DashboardLayout'
import {TenantCreateForm} from '@/components/PlatformUsers/TenantCreateForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateTenant = () => {
    const navigate = useNavigate();
  const handleCancel = () => navigate("/platform/tenant");



  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}

          <div className="flex items-start justify-between gap-4 px-7 py-5">
            <div>
              <div className="flex items-center gap-2">
                <Building2 />

                <h1 className="text-2xl font-semibold tracking-tight ">
                  Create Tenant
                </h1>
              </div>

              <p className="mt-1 text-sm ">
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

          <div className="rounded-2xl border px-6 shadow-sm">
            <TenantCreateForm
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateTenant
