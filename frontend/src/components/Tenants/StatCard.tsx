import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  iconClass: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  iconClass,
  isLoading = false,
}: StatCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {isLoading ? (
                <Skeleton className="h-8 w-16 bg-slate-200" />
              ) : (
                value
              )}
            </p>
          </div>

          <div className={`rounded-lg p-3 ${iconClass}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}