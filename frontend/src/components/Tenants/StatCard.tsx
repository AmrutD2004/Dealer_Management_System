import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  iconClass: string;
}

export function StatCard({ title, value, icon, iconClass }: StatCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {value}
            </p>
          </div>

          <div className={`rounded-lg p-3 ${iconClass}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
