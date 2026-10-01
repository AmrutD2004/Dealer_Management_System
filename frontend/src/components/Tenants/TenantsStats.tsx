import { useMemo } from "react";

import { Building2, CheckCircle2, CirclePause, ShieldCheck } from "lucide-react";


import { StatCard } from "./StatCard";



export function TenantsStats() {

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
      />

      <StatCard
       
      />

      <StatCard
      
      />

      <StatCard
       
      />
    </div>
  );
}
