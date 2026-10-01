import { CreditCard } from "lucide-react";

export function PlansHeader() {
  return (
    <div className="mt-20">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-slate-700" />

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Subscription Plans
        </h1>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        Configure the plans available to tenants on the DMS platform.
      </p>
    </div>
  );
}
