import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function StatCard() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500"></p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              
            </p>
          </div>

          <div className={`rounded-lg p-3 `}></div>
        </div>
      </CardContent>
    </Card>
  );
}
